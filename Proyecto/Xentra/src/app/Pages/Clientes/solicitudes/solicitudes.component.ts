import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {SolicitudCliente} from '@modelos/Solicitud';
import {DatePipe, TitleCasePipe} from '@angular/common';

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
    const result = await this.clienteServicio.ObtenerSolicitdes();
    this.Solicitudes = result.solicitudes;
    if (result.error) {
      this.notificar.Error("Error al obtener tus solicitudes");
    }
  }

}
