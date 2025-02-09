import {inject, Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '@environment/environment';
import {Comercio} from '@modelos/Comercio';
import {EstadoSolicitud} from '@constantes/EstadoSolicitud';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';


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
      .limit(1) as { data: Comercio[], error: any };
    return {data: Comercios?.[0], error: error};
  }


  async Solicitar(ComercioId: string, monto: number) {

    const result = await this.supabase
      .from("Solicitudes")
      .insert({
        "ClienteId" : "",
        "ComercioId" :ComercioId,
        "Monto" : monto.toString(),
        "Estado" : EstadoSolicitud.Pendiente
      });

  }
}
