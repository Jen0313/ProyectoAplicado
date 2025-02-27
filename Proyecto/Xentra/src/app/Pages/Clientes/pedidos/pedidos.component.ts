import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {Transaccion} from '@modelos/Transaccion';
import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';
import {Pedido} from '@modelos/Pedido';
import {EstadoPedido} from '@constantes/EstadoPedido';
import {CardPedidoComponent} from '../../Reutilizables/card-pedido/card-pedido.component';

@Component({
  selector: 'app-pedidos',
  imports: [
    DatePipe,
    TitleCasePipe,
    CurrencyPipe,
    CardPedidoComponent
  ],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosClienteComponent implements OnInit {
  private router = inject(Router);
  private clienteServicio = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio);
   pedidos: Pedido[] = [];

  async ngOnInit() {
    const result = await this.clienteServicio.ObtenerComprasUsuario();
    if (result) {
      this.pedidos = result;
    } else {
      this.notificar.Error("Error al cargar tus pedidos :/");
    }
  }

  protected readonly EstadoPedido = EstadoPedido;
}
