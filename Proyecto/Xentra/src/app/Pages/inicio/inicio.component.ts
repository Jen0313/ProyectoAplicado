import {Component, effect, inject, OnInit, signal, Signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {Roles} from '@constantes/Roles';
import {DashboardClienteComponent} from '../Clientes/dashboard/dashboard.component';
import {DashboardComercioComponent} from '../Comercios/dashboard/dashboard.component';

@Component({
  selector: 'app-inicio',
  imports: [
    RouterLink,
    DashboardClienteComponent,
    DashboardComercioComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  private authServ = inject(ServicioAutenticacion);
  usuario: Signal<string | null> = signal(null);

  constructor() {
    effect(() => {
      this.usuario = this.authServ.roleActual;
      console.log('Inicio Component Inicio');
    });

  }

  ngOnInit() {
    this.usuario = this.authServ.roleActual;

  }


  protected readonly Roles = Roles;
}
