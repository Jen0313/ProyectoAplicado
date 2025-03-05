import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {SolicitudCliente} from '@modelos/Solicitud';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {EstadoSolicitud} from '@constantes/EstadoSolicitud';

@Component({
  selector: 'app-solicitudes',
  imports: [
    DatePipe,
    RouterLink,
    TitleCasePipe
  ],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesClienteComponent implements OnInit {
  private router = inject(Router);
  private clienteServicio = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio)

  Solicitudes: SolicitudCliente[] = [];

  async ngOnInit() {
    await this.CargarSolicitudes();
  }

  async CargarSolicitudes() {
    const result = await this.clienteServicio.ObtenerSolicitdes();
    this.Solicitudes = result.solicitudes;
    if (result.error) {
      this.notificar.Error("Error al obtener tus solicitudes");
    }
  }

  async cancelarSolicitud(id: number) {
    if (confirm("¿Estás seguro de que deseas cancelar esta solicitud?")) {
      const result = await this.clienteServicio.CancelarSolicitud(id);
      if (result) {
        this.notificar.Ok("Solicitud CANCELADA");
        await this.CargarSolicitudes();
      } else {
        this.notificar.Advertencia("Algo salió mal al CANCELAR la solicitud.");

      }
    }
  }

  protected readonly EstadoSolicitud = EstadoSolicitud;
}
