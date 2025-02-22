import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';

@Component({
  selector: 'app-pagar',
  imports: [],
  templateUrl: './pagar.component.html',
  styleUrl: './pagar.component.css'
})
export class PagarComponent implements OnInit {
  private router = inject(Router);
  private clienteServicio = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio);
  private comercioPagarId = 0;
  async ngOnInit() {
    const result = await this.clienteServicio.ObtenerCredito();
    // CARGAR TODOS LOS COMERCIOS EN LOS CAULES TIENE CREDITO EL CLIENTE
  }
}
