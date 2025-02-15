import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Comercio} from '@modelos/Comercio';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-detalle-comercio',
  imports: [
    TitleCasePipe,
    RouterLink
  ],
  templateUrl: './detalle-comercio.component.html',
  styleUrl: './detalle-comercio.component.css'
})
export class DetalleComercioComponent implements OnInit {
  id: string | null = null;
  comercio: Comercio | null = null;

  constructor(private rutaActual: ActivatedRoute,
              private router: Router,
              private comercioServicio: ClientesServicio,
              private notificar: NotificacionServicio,
  ) {
    this.id = this.rutaActual.snapshot.params['id'];
  }

  async ngOnInit() {
    if (this.id === null) {
      this.notificar.Advertencia("No encontramo dicho comercio.");
      await this.router.navigate(['comercios']);
    } else {
      const result = await this.comercioServicio.ObtenerComercioPorId(this.id);
      if (result.data) {
        this.comercio = result.data;
      } else {
        this.notificar.Advertencia("Algo fallo al cargar el comercio.");
        await this.router.navigate(['comercios']);
      }
    }
  }


}
