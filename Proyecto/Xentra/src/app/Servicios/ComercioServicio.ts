import {inject, Injectable} from '@angular/core';
import {createClient, PostgrestSingleResponse, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '@environment/environment';
import {Articulo} from '@modelos/Articulo';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {Roles} from '@constantes/Roles';
import {Comercio} from '@modelos/Comercio';
import {SolicitudAdmin} from '@modelos/Solicitud';
import {EstadoAcreditado} from '@constantes/EstadoAcreditado';
import {EstadoSolicitud} from '@constantes/EstadoSolicitud';
import {ClienteComercio} from '@modelos/Cliente';
import {Transaccion} from '@modelos/Transaccion';

export interface RespuestaSolicitud {
  id: number
  fecha: string
  ClienteId: number
  ComercioId: number
  Monto: number
  Estado: string
}

export interface Acreditado {
  id: number
  fecha: string
  clientId: number
  comercioId: number
  Monto: number
  Restante: number
  Estado: string
}

export interface TransaccionRespuestas {
  Monto: number
  fecha: string
  Acreditados: Acreditado[]
}


@Injectable({providedIn: 'root'})
export class ComercioServicio {
  private supabase: SupabaseClient;
  private authServ = inject(ServicioAutenticacion);

  constructor() {
    this.supabase = createClient(environment.SupabaseUrl, environment.SupabaseKey)
  }

  async ObtenerSolicitudesComercio() {
    const comercioId = this.authServ.usuarioActual()?.Rol === Roles.Comercio ? (this.authServ.usuarioActual() as Comercio).id : null;
    let {data: Solicitudes, error} = await this.supabase
      .from("Solicitudes")
      .select("*, Clientes(Nombre,Direccion)")
      .eq("ComercioId", comercioId) as { data: SolicitudAdmin[], error: any };
    return {solicitudes: Solicitudes, error};
  }
  async ObtenerClientesComercio() {
    const comercioId = this.authServ.usuarioActual()?.Rol === Roles.Comercio ? (this.authServ.usuarioActual() as Comercio).id : null;

    let {data, error} = await this.supabase
      .from('Acreditados')
      .select('*,Clientes(*)')
      .eq("comercioId", comercioId);

    return {clientes: data as ClienteComercio[], error: error};

  }
  async CambiarEstadoSolicitud(idSolicitud: string, estado: string) {
    const {data, error} = await this.supabase
      .from('Solicitudes')
      .update({Estado: estado})
      .eq('id', idSolicitud)
      .select('*') as { data: RespuestaSolicitud[], error: any };
    if (error !== null) {
      return false;
    }
    if (data[0].Estado == EstadoSolicitud.Aprobada) {
      const result = await this.supabase
        .from('Acreditados')
        .insert([
          {
            "clientId": data[0].ClienteId.toString(),
            "comercioId": data[0].ComercioId.toString(),
            "Monto": data[0].Monto.toString(),
            "Restante": data[0].Monto.toString(),
            "Estado": EstadoAcreditado.Activo,
          },
        ])
        .select()
      return result.error === null;
    } else {
      return true;
    }
  }
  async ObtenerProductosComercio(comercioId: string) {
    let {data: Articulos, error} = await this.supabase
      .from('Articulos')
      .select('*')
      .eq("ComercioId", comercioId)
      .eq("Activo", true) as { data: Articulo[], error: any };
    return {articulos: Articulos, error: error};
  }
  async GuardarArticulo(articulo: Articulo) {
    const {data, error} = await this.supabase
      .from('Articulos')
      .insert(
        {
          "ComercioId": articulo.ComercioId,
          "Nombre": articulo.Nombre,
          "Precio": articulo.Precio,
          "Descripcion": articulo.Descripcion,
        }
      )
      .select();
    return error === null;
  }
  async EliminarArticulo(articuloId: number) {
    const {data, error} = await this.supabase
      .from('Articulos')
      .update({"Activo": false})
      .eq('id', articuloId);
    return error;
  }
  async ObtenerReporte() {
    const comercioId = this.authServ.usuarioActual()?.id ?? 0;

    let {data: acreditados, error} = await this.supabase
      .from('Acreditados')
      .select('*')
      .eq("comercioId", comercioId) as { data: Acreditado[], error: any };
    const resultTransacciones = await this.ReporteTransacciones();
    return {
      ventasDiarias: resultTransacciones,
      totalMonto: acreditados.reduce((total, item) => total + item.Monto, 0),
      totalRestante: acreditados.reduce((total, item) => total + item.Restante, 0),
      totalRegistros: acreditados.length,
      estadosCount: Object.entries(
        acreditados.reduce((acc, acreditado) => {
          acc[acreditado.Estado] = (acc[acreditado.Estado] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number })
      ).map(([estado, cantidad]) => ({estado, cantidad}))
    };
  }
  private async ReporteTransacciones() {
    const comercioId = this.authServ.usuarioActual()?.id ?? 0;

    let {data, error} = await this.supabase
      .from('Transacciones')
      .select("Monto,fecha,Acreditados(*)")
      .eq("Acreditados.comercioId", comercioId) as { data: TransaccionRespuestas[], error: any };

    const resultado: Record<string, number> = {};

    data.forEach(transaccion => {
      const fechaCorta = transaccion.fecha.split("T")[0];
      resultado[fechaCorta] = (resultado[fechaCorta] || 0) + transaccion.Monto;
    });

    return Object.entries(resultado).map(([fecha, totalMonto]) => ({fecha, totalMonto}));

  }

}
