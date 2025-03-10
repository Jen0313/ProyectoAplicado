import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {Transaccion} from '@modelos/Transaccion';
import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';
import {Pedido} from '@modelos/Pedido';
import {EstadoPedido} from '@constantes/EstadoPedido';
import {CardPedidoComponent} from '@reutilizables/card-pedido/card-pedido.component';
import {PedidoServicio} from '@servicios/PedidoServicio';

@Component({
  selector: 'app-pedidos',
  imports: [
    DatePipe,
    TitleCasePipe,
    CurrencyPipe,
    CardPedidoComponent,
    RouterLink
  ],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosClienteComponent implements OnInit {
  private router = inject(Router);
  private pedidosServ = inject(PedidoServicio);
  private notificar = inject(NotificacionServicio);
  pedidos: Pedido[] = [];

  async ngOnInit() {
    await this.cargarPedidos();
  }
  async cargarPedidos(){

    const result = await this.pedidosServ.ObtenerPedidosCliente();
    if (result) {
      this.pedidos = result;
    } else {
      this.notificar.Error("Error al cargar tus pedidos :/");
    }
  }

  protected readonly EstadoPedido = EstadoPedido;

  async CancelarPedido(pedido : Pedido) {
    const result = await this.pedidosServ.CancelarPedido(pedido);
    if (result) {
      this.notificar.Ok("Pedido Cancelado!");
      await this.cargarPedidos();
    } else {
      this.notificar.Error("Error al cancelar el pedido");
    }
  }
}
