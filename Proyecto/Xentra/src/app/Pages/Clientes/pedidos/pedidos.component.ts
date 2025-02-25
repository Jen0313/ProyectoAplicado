import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {Transaccion} from '@modelos/Transaccion';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-pedidos',
  imports: [
    DatePipe
  ],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosClienteComponent implements OnInit {
  private router = inject(Router);
  private clienteServicio = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio);
  private pedidos: Transaccion[] = [];

  async ngOnInit() {
    const result = await this.clienteServicio.ObtenerComprasUsuario();
    if (result) {
      //this.pedidos = result;
    }
  }
}
