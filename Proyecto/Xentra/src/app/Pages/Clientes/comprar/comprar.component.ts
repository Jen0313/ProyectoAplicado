import {Component, inject, OnInit} from '@angular/core';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {SolicitudCliente} from '@modelos/Solicitud';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {RouterLink} from '@angular/router';
import {EstadoAcreditado} from '@constantes/EstadoAcreditado';
import {CardCreditoComponent} from '@reutilizables/card-credito/card-credito.component';

@Component({
  selector: 'app-comprar',
  imports: [
    RouterLink,
    CardCreditoComponent,
  ],
  templateUrl: './comprar.component.html',
  styleUrl: './comprar.component.css'
})
export class ComprarComponent implements OnInit {
  private clienteServ = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio);
  Comercios: SolicitudCliente[] = [];

  async ngOnInit() {
    const result = await this.clienteServ.ObtenerCredito();
    this.Comercios = result.data;
    if (result.error) {
      this.notificar.Error("Error al obtener los comercios...")
    }
  }

  protected readonly EstadoAcreditado = EstadoAcreditado;
}
