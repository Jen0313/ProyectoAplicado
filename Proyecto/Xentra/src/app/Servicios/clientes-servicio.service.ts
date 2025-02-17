import {inject, Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '@environment/environment';
import {Comercio} from '@modelos/Comercio';
import {EstadoSolicitud} from '@constantes/EstadoSolicitud';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {Roles} from '@constantes/Roles';
import {Cliente} from '@modelos/Cliente';
import {SolicitudAdmin, SolicitudCliente} from '@modelos/Solicitud';


@Injectable({providedIn: 'root'})
export class ClientesServicio {
  private supabase: SupabaseClient;
  private AutServicio = inject(ServicioAutenticacion);

  constructor() {
    this.supabase = createClient(environment.SupabaseUrl, environment.SupabaseKey);
  }

  async ObtenerTodosComercios() {
    let {data: Comercios, error} = await this.supabase
      .from('Comercios')
      .select('*') as { data: Comercio[], error: any };
    return {Comercios, error};
  }

  async ObtenerComercioPorId(id: string) {
    let {data: Comercios, error} = await this.supabase
      .from('Comercios')
      .select('*')
      .eq("id", id)
      .limit(1) as { data: Comercio[], error: any };
    return {data: Comercios?.[0], error: error};
  }


  async Solicitar(ComercioId: string, monto: number) {
    const clienteId = this.AutServicio.usuarioActual()?.id;
    if (clienteId !== null) {
      const result = await this.supabase
        .from("Solicitudes")
        .insert({
          "ClienteId": clienteId,
          "ComercioId": ComercioId,
          "Monto": monto.toString(),
          "Estado": EstadoSolicitud.Pendiente
        });
      console.error(result.error);
      return result.error === null;
    }
    return false;

  }

  async ObtenerSolicitdes() {
    const clienteId = this.AutServicio.usuarioActual()?.id;
    let {data: Solicitudes, error} = await this.supabase
      .from("Solicitudes")
      .select("*,Comercios(Nombre)")
      .eq("ClienteId", clienteId) as { data: SolicitudCliente[], error: any };
    return {solicitudes: Solicitudes, error};
  }

  async ObtenerCredito() {

    const clienteId = this.AutServicio.usuarioActual()?.id;
    let {data: Acreditados, error} = await this.supabase
      .from('Acreditados')
      .select('*,Comercios(Nombre)')
      .eq("clientId", clienteId) as { data: SolicitudCliente[], error: any };
    return {data: Acreditados, error};

  }

  async ObtenerCreditoComercio(comercioId: string) {

    const clienteId = this.AutServicio.usuarioActual()?.id;
    let {data: Acreditados, error} = await this.supabase
      .from('Acreditados')
      .select('*,Comercios(Nombre)')
      .eq("comercioId", comercioId)
      .eq("clientId", clienteId) as { data: SolicitudCliente[], error: any };
    return {credito: Acreditados[0], error};

  }


}
