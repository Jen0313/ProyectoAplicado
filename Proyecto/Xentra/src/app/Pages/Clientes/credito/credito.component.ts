import {Component, inject, OnInit} from '@angular/core';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {SolicitudCliente} from '@modelos/Solicitud';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-credito',
  imports: [
    RouterLink
  ],
  templateUrl: './credito.component.html',
  styleUrl: './credito.component.css'
})
export class CreditoComponent implements OnInit {
  private clienteServ = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio);
  creditos: SolicitudCliente[] = [];

  async ngOnInit() {
    const result = await this.clienteServ.ObtenerCredito();
    this.creditos = result.data;
    if (result.error) {
      this.notificar.Error("Error al cargar tu credito!");
    }
  }
}
