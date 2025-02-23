import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Comercio} from '@modelos/Comercio';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {TitleCasePipe} from "@angular/common";
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {ComercioServicio} from '@servicios/ComercioServicio';

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
  comerciosAcreditados:  number[] = [];

  constructor(private rutaActual: ActivatedRoute,
              private router: Router,
              private clientesComercio: ClientesServicio,
              private notificar: NotificacionServicio,
              private comercioServicio : ComercioServicio
  ) {
    this.id = this.rutaActual.snapshot.params['id'];
  }

  async ngOnInit() {
    if (this.id === null) {
      this.notificar.Advertencia("No encontramo dicho comercio.");
      await this.router.navigate(['comercios']);
    } else {
      const result = await this.clientesComercio.ObtenerComercioPorId(this.id);
      if (result.data) {
        this.comercio = result.data;
      } else {
        this.notificar.Advertencia("Algo fallo al cargar el comercio.");
        await this.router.navigate(['comercios']);
      }
    }
    const resultAcreditado= await this.clientesComercio.ObtenerComerciosCreditoCliente();
    this.comerciosAcreditados =  resultAcreditado.map(x=>x.comercioId);
  }


}
