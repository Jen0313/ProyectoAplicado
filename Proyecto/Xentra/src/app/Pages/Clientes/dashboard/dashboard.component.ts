import {Component, effect, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {ComercioServicio} from '@servicios/ComercioServicio';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {Comercio} from '@modelos/Comercio';
import {Cliente} from '@modelos/Cliente';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {SolicitudCliente} from '@modelos/Solicitud';
import {PedidoServicio} from '@servicios/PedidoServicio';
import {Pedido} from '@modelos/Pedido';
import {EstadoSolicitud} from '@constantes/EstadoSolicitud';
import {CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-dashboard-cliente',
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardClienteComponent implements OnInit {
  private authServ = inject(ServicioAutenticacion);
  private clienteServ = inject(ClientesServicio);
  private pedidoServ = inject(PedidoServicio);
  private notificar = inject(NotificacionServicio);
  cliente = this.authServ.usuarioActual;
  credito: SolicitudCliente[] = [];
  pedidos: Pedido[] = [];
  totalRestante = 0;
  solicitudesPendiente = 0;

  constructor() {
    effect(async () => {
      await this.ObtenerCredito();
      await this.ComprasRealizadas();
      await this.ObtenerSolicitudesPendientes();
    });
  }

  async ngOnInit() {
    await this.ObtenerCredito();
    await this.ComprasRealizadas();
    await this.ObtenerSolicitudesPendientes();


  }

  private async ObtenerCredito() {
    const result = await this.clienteServ.ObtenerCredito();
    if (result) {
      this.credito = result.data;
      this.totalRestante = this.credito.map(x => x.Restante).reduce((pr, cur) => pr + cur);
    } else {
      this.notificar.Advertencia("Algo salió mal al obtener su credito.")
    }
  }

  private async ComprasRealizadas() {
    const result = await this.pedidoServ.ObtenerPedidosCliente();
    if (result) {
      this.pedidos = result;
    } else {
      this.notificar.Advertencia("Algo salió mal al obtener tus compras.");
    }
  }

  private async ObtenerSolicitudesPendientes() {
    const result = await this.clienteServ.ObtenerSolicitdes();
    if (result) {
      this.solicitudesPendiente = result.solicitudes.filter(x => x.Estado === EstadoSolicitud.Pendiente).length;
    } else {
      this.notificar.Advertencia("Upps, algo salio mal al cargar tus solicitudes")
    }

  }

  protected readonly RouterLink = RouterLink;
}
