import {Component, OnInit} from '@angular/core';
import {Comercio} from '@modelos/Comercio';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-solicitar-credito',
  imports: [
    TitleCasePipe
  ],
  templateUrl: './solicitar.component.html',
  styleUrl: './solicitar.component.css'
})
export class SolicitarCreditoComponent implements OnInit {
  id: string | null = null;
  comercio: Comercio | null = null;
  MontoSolicitar = 1000;

  constructor(private rutaActual: ActivatedRoute,
              private router: Router,
              private clienteServicio: ClientesServicio,
              private notificar: NotificacionServicio,
  ) {
    this.id = this.rutaActual.snapshot.params['id'];
  }

  async ngOnInit() {
    if (this.id === null) {
      this.notificar.Advertencia("No encontramos dicho comercio.");
      await this.router.navigate(['comercios']);
    } else {
      const result = await this.clienteServicio.ObtenerComercioPorId(this.id);
      if (result.data) {
        this.comercio = result.data;
      } else {
        this.notificar.Advertencia("Algo fallo al cargar el comercio.");
        await this.router.navigate(['comercios']);
      }
    }
  }

  async Solicitar(){

  }

}
