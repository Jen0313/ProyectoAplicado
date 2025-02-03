import {Injectable, signal, WritableSignal} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '@environment/environment';
import {Roles} from '@constantes/Roles';
import {Cliente, ClienteRegistrar} from '@modelos/Cliente';
import {ImagenesDefecto} from '@constantes/ImagenesDefecto';
import {Comercio, ComercioRegistrar} from '@modelos/Comercio';


@Injectable({providedIn: 'root'})
export class ServicioAutenticacion {

  private supabase: SupabaseClient;
  private _role: WritableSignal<string | null> = signal(null);
  roleActual = this._role.asReadonly();

  constructor() {
    this.supabase = createClient(environment.SupabaseUrl, environment.SupabaseKey);
    this.VerificarSeccion();
    this.ChequearCambioUsuario();
  }

  async IniciarSeccion(email: string, password: string) {

    const result = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return result;
  }

  async CerrarSeccion() {
    this._role.set(null);
    await this.supabase.auth.signOut();
  }

  async RegistrarCliente(cliente: ClienteRegistrar) {
    const devolver: { data: Cliente | null, error: string | null } = {data: null, error: null};

    // registrar en el authenticador de supabase
    const resultAuth = await this.RegistrarEnAutenticador(cliente.email, cliente.password, true);
    if (resultAuth.error) {
      devolver.error = resultAuth.error.message;
      return devolver;
    }
    // guardar la imagen...
    const resultImagen = await this.GuardarImagenCliente(cliente.Imagen, cliente.Cedula);
    if (resultImagen.error) {
      devolver.error = devolver.error ?? resultImagen.error.message;
    }

    // Crear registro en cliente si ya se registro bien el usuario
    const resultCliente = await this.supabase
      .from("Clientes")
      .insert({
        "Nombre": cliente.Nombre,
        "Cedula": cliente.Cedula,
        "Telefono": cliente.Telefono,
        "Direccion": cliente.Direccion,
        "Imagen": resultImagen.path,
        "UsuarioId": resultAuth.data.user?.id
      })
      .select()
      .limit(1) as { data: Cliente | null, error: any | null };


    devolver.error = devolver.error === null ? resultCliente.error : devolver.error += resultCliente.error;
    devolver.data = resultCliente.data;
    return devolver;

  }

  async RegistrarComercio(comercio: ComercioRegistrar) {
    const devolver: { data: Comercio | null, error: string | null } = {data: null, error: null};

    // registrar en el authenticador de supabase
    const resultAuth = await this.RegistrarEnAutenticador(comercio.email, comercio.password, false);
    if (resultAuth.error) {
      devolver.error = resultAuth.error.message.toLowerCase();
      return devolver;
    }
    // guardar las imagenes...

    const resultImagen = await this.GuardarImagenesComercio(comercio.Imagenes, comercio.Nombre);
    if (resultImagen.error) {
      devolver.error += resultImagen.error;
    }

    // Crear registro en comercios si ya se registro bien el usuario
    const resultComercio = await this.supabase
      .from("Comercios")
      .insert({
        "Nombre": comercio.Nombre,
        "Telefonos": comercio.Telefonos,
        "Ubicacion": comercio.Ubicacion,
        "Imagenes": resultImagen.paths,
        "Dueno": comercio.Dueno,
        "UserId": resultAuth.data.user?.id
      })
      .select()
      .limit(1) as { data: Comercio | null, error: any | null };

    devolver.error += resultComercio.error ?? "";
    devolver.data = resultComercio.data;
    return devolver;
  }

  private async RegistrarEnAutenticador(email: string, password: string, esCliente: boolean) {
    const roleRegistrar = esCliente ? Roles.Cliente : Roles.Comercio;
    const r = await this.supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          role: roleRegistrar
        }
      }
    });
    return r;
  }

  private async GuardarImagenesComercio(imagenes: File[], nombreComercio: string) {
    const devolver: { paths: string[], error: string | null } = {paths: [], error: null};
    const pathbase = `comercios/${nombreComercio}`;

    for (const imagen of imagenes) {
      const index = imagenes.indexOf(imagen);
      const path = pathbase + `/${index}.${imagen.type.substring(imagen.type.indexOf('/') + 1)}`;
      const result = await this.supabase.storage
        .from('Imagenes')
        .upload(path, imagen);
      if (result.error) {
        devolver.error += `${imagen.type} no se a podido guardar.`;
      } else {
        devolver.paths.push(result.data.path);
      }
    }
    if (devolver.paths.length > 1) {
      const rutasPublicas: string[] = [];
      for (const path of devolver.paths) {
        const rutaPublica = this.supabase.storage
          .from('Imagenes')
          .getPublicUrl(path);
        rutasPublicas.push(rutaPublica.data.publicUrl);
      }
      devolver.paths = rutasPublicas;
    } else {
      devolver.error = "Ninguna imagen pudo ser cargada :(";
      devolver.paths = [ImagenesDefecto.Comercio]
    }
    return devolver;
  }

  private async GuardarImagenCliente(imagen: File, NombreImagen: string) {
    const path = `clientes/${NombreImagen}.${imagen.type.substring(imagen.type.indexOf('/') + 1)}`;
    const devolver: { path: string, error: any | null } = {path: "", error: null};
    const result = await this.supabase.storage
      .from('Imagenes')
      .upload(path, imagen);
    if (result.error != null || result.data?.path === null) {
      if (result.error?.name === "EntityTooLarge") {
        devolver.error = "Archivo demasiado Grande";
      } else {
        devolver.error = "Error al cargar la imagen";
      }
      devolver.path = ImagenesDefecto.Cliente;
    } else {
      const rutaPublica = this.supabase.storage
        .from('Imagenes')
        .getPublicUrl(result.data?.path);

      devolver.path = rutaPublica.data.publicUrl;
    }
    return devolver;
  }

  private ChequearCambioUsuario() {
    this.supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = session.user.user_metadata['role'] as string;
        this._role.set(role);
      } else {
        this._role.set(null);
      }
    });
  }

  async VerificarSeccion() {
    const {data: {session}} = await this.supabase.auth.getSession();
    if (session?.user) {
      const role = session.user.user_metadata['role'] as string;
      this._role.set(role);

    } else {
      this._role.set(null);
    }
  }
}
