import {inject, Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '@environment/environment';
import {Comercio} from '@modelos/Comercio';
import {EstadoSolicitud} from '@constantes/EstadoSolicitud';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {SolicitudCliente} from '@modelos/Solicitud';
import {Articulo} from '@modelos/Articulo';


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

  async RealizarCompra(Articulos: { articulo: Articulo, cantidad: number }[], restante: number) {

    const monto = Articulos.map(x => x.articulo.Precio * x.cantidad).reduce((p, c) => p + c);
    // intenta crear la transaccion
    const transaccionId = await this.CrearTransaccion(monto);
    if (transaccionId === null) {
      return false;
    }
    // crea los detalles de la factura
    const resultadoDetalles = await this.crearDetallesFactura(transaccionId, Articulos);
    // si hay algun error en crear los detalle sde la facura, se elimina la factura
    if (!resultadoDetalles) {
      // Eliminar la trasaccion creada
      await this.EliminarTransactionErronea(transaccionId)

      return false;
    }
    // reducir el monto de la transaccion al monto disponible del acreditado
    return await this.ReducirMontoCredito((restante - monto));
  }

// REDUCE EL MONTO DE LA TRANSACCION AL CREDITO DEL ACREDITADO
  private async ReducirMontoCredito(total: number) {
    const clienteId = this.AutServicio.usuarioActual()?.id;
    let resultActualizar = await this.supabase
      .from('Acreditados')
      .update({'Restante': total})
      .eq("clientId", clienteId)
      .select();
    return resultActualizar.error === null;
  };

  // crea el registro de la transaccion
  private async CrearTransaccion(Monto: number) {
    const clienteId = this.AutServicio.usuarioActual()?.id;
    if (clienteId === null) {
      return null;
    }

    let resultadoAcreditado = await this.supabase
      .from('Acreditados')
      .select('id')
      .eq("clientId", clienteId);
    if (resultadoAcreditado.data === null) {
      return null;
    }
    const result = resultadoAcreditado as { data: { id: string }[], error: any };

    const acreditadoId = result.data[0].id;
    const {data, error} = await this.supabase
      .from('Transacciones')
      .insert([
        {
          "AcreditadoId": acreditadoId,
          "Monto": Monto
        },
      ]).select('id') as { data: { id: string }[], error: any };

    return data[0].id;

  }

// Crea los detalles de la transaccion / Factura
  private async crearDetallesFactura(transacionId: string, Articulos: { articulo: Articulo, cantidad: number }[]) {

    const datosIngresar = Articulos.map(art => {
      return {
        TransactionId: transacionId,
        ArticuloId: art.articulo.id,
        Cantidad: art.cantidad,
        Precio: art.articulo.Precio
      };
    });

    const {data, error} = await this.supabase
      .from('DetalleTransacion')
      .insert(datosIngresar)
      .select();

    return error === null;
  }

// Elimina LA TRANSACCION EN CASO DE ALGUN ERROR
  private async EliminarTransactionErronea(id: string) {
    const r = await this.supabase
      .from('Transacciones')
      .delete()
      .eq("id", id);

    return r.error === null;
  }


}
