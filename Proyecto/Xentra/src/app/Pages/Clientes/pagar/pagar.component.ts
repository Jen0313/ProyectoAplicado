import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {Comercio} from '@modelos/Comercio';
import {SolicitudCliente} from '@modelos/Solicitud';

@Component({
  selector: 'app-pagar',
  imports: [],
  templateUrl: './pagar.component.html',
  styleUrl: './pagar.component.css'
})
export class PagarComponent implements OnInit {
  private rutaActual = inject(ActivatedRoute);
  private router = inject(Router);
  private clienteServicio = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio);
  credito!: SolicitudCliente;


  async ngOnInit() {

    const id = this.rutaActual.snapshot.params['id'];
    if (id === null) {
      this.notificar.Advertencia("No encontramos dicho comercio.");
      await this.router.navigate(['comercios']);
    } else {
      const result = await this.clienteServicio.ObtenerCreditoComercio(id);
      if (result.credito) {
        this.credito = result.credito;
      } else {
        this.notificar.Advertencia("Algo fallo al cargar el comercio.");
        await this.router.navigate(['comercios']);
      }
    }

  }
}
