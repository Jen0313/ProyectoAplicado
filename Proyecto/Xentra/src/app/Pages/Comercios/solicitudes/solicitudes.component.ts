import {Component, inject, OnInit} from '@angular/core';
import {ComercioServicio} from '@servicios/ComercioServicio';
import {SolicitudAdmin} from '@modelos/Solicitud';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {EstadoSolicitud} from '@constantes/EstadoSolicitud';

@Component({
  selector: 'app-solicitudes',
  imports: [],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComercioComponent implements OnInit {
  private comercioServ = inject(ComercioServicio);
  private notificar = inject(NotificacionServicio);
  Solicitudes: SolicitudAdmin[] = [];

  async ngOnInit() {

    await this.CargarSolicitudes();
  }

  async CargarSolicitudes() {
    const result = await this.comercioServ.ObtenerSolicitudesComercio();
    this.Solicitudes = result.solicitudes;
    if (result.error) {
      this.notificar.Error("Error al cargar las solicitudes")
    }
  }

  async aceptarSolicitud(id: number) {
    const result = await this.comercioServ.CambiarEstadoSolicitud(id.toString(), EstadoSolicitud.Aprobada);

    if (!result) {
      this.notificar.Error("Error al manejar la solicitud");
    } else {
      this.notificar.Ok("Solicitud Aceptada");
      await this.CargarSolicitudes();
    }
  }

  async rechazarSolicitud(id: number) {
    const result = await this.comercioServ.CambiarEstadoSolicitud(id.toString(), EstadoSolicitud.Aprobada);
    console.info(result);
    if (!result) {
      this.notificar.Error("Error al manejar la solicitud");
    } else {
      this.notificar.Ok("Solicitud Rechazada");
      await this.CargarSolicitudes();
    }
  }

  protected readonly EstadoSolicitud = EstadoSolicitud;
}
