import {Component, inject, OnInit} from '@angular/core';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {Transaccion} from '@modelos/Transaccion';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-transacciones-cliente',
  imports: [
    DatePipe
  ],
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.css'
})
export class TransaccionesClienteComponent implements OnInit {

  private clenteServ = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio);

  Transacciones: Transaccion[] = [];


  async ngOnInit() {
    const result = await this.clenteServ.ObtenerComprasUsuario();
    if (!result) {
      this.notificar.Error("Error al cargar las compras del cliente");
    } else {
      this.Transacciones = result;
    }

  }
}
