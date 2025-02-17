import {Component, inject, OnInit} from '@angular/core';
import {Comercio} from '@modelos/Comercio';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {TitleCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-solicitar-credito',
  imports: [
    TitleCasePipe,
    FormsModule
  ],
  templateUrl: './solicitar.component.html',
  styleUrl: './solicitar.component.css'
})
export class SolicitarCreditoComponent implements OnInit {
  private rutaActual = inject(ActivatedRoute);
  private router = inject(Router);
  private clienteServicio = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio);


  id: string | null = null;
  comercio: Comercio | null = null;
  MontoSolicitar = 1000;

  constructor() {
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

  async Solicitar() {
    const result = await this.clienteServicio.Solicitar(this.id ?? "", this.MontoSolicitar);
    if (result) {
      this.notificar.Ok("Solicitud enviada");
      await this.router.navigate(['clientes', "solicitudes"]);
    } else {
      this.notificar.Error("Error al enviar la solicitud..");
    }
  }

}
