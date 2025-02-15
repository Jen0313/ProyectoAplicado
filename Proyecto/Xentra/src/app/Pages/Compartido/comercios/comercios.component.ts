import {Component, OnInit} from '@angular/core';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {Comercio} from '@modelos/Comercio';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {TitleCasePipe} from "@angular/common";
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-comercios',
  imports: [
    TitleCasePipe,
    RouterLink
  ],
  templateUrl: './comercios.component.html',
  styleUrl: './comercios.component.css'
})
export class ComerciosComponent implements OnInit {
  Comercios: Comercio[] = [];

  constructor(private ServComercio: ClientesServicio, private notificar: NotificacionServicio) {
  }

  async ngOnInit() {
    const resultado = await this.ServComercio.ObtenerTodosComercios();
    this.Comercios = resultado.Comercios ?? [];
    if (resultado.error) {
      this.notificar.Error(resultado.error.message);
    }
  }

}
