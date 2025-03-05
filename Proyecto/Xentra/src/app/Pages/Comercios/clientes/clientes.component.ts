import {Component, inject, OnInit} from '@angular/core';
import {ComercioServicio} from '@servicios/ComercioServicio';
import {ClienteComercio} from '@modelos/Cliente';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {CurrencyPipe, JsonPipe} from '@angular/common';
import {EstadoAcreditado} from '@constantes/EstadoAcreditado';

@Component({
  selector: 'app-clientes',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComercioComponent implements OnInit {

  private comercioServ = inject(ComercioServicio);
  private notificar = inject(NotificacionServicio);
  Clientes: ClienteComercio[] = [];

  async ngOnInit() {
    const result = await this.comercioServ.ObtenerClientesComercio();
    this.Clientes = result.clientes ?? [];
    if (result.error) {
      this.notificar.Error("Error al obtener los clientes");
    }
  }

  protected readonly EstadoAcreditado = EstadoAcreditado;
}
