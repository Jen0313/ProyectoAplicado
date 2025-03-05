import {Component, inject, OnInit} from '@angular/core';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {Comercio} from '@modelos/Comercio';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {TitleCasePipe} from "@angular/common";
import {RouterLink} from '@angular/router';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {Roles} from '@constantes/Roles';

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
  private ServCliente = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio);
  private auth = inject(ServicioAutenticacion);

  Comercios: Comercio[] = [];
  comerciosAcreditados:  number[] = [];

  async ngOnInit() {
    const resultado = await this.ServCliente.ObtenerTodosComercios();
    this.Comercios = resultado.Comercios ?? [];
    if (resultado.error) {
      this.notificar.Error(resultado.error.message);
    }
    if (this.auth.roleActual() == Roles.Cliente) {
     const result= await this.ServCliente.ObtenerComerciosCreditoCliente();
     this.comerciosAcreditados =  result.map(x=>x.comercioId);
    }


  }

}
