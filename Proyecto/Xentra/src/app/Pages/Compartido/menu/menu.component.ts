import {Component, inject, Signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  roleActual: Signal<string | null>;

  constructor(private autenticacion: ServicioAutenticacion, private route: ActivatedRoute, private router: Router) {
    this.roleActual = this.autenticacion.roleActual;
  }

  btnSeccion() {
    if (this.roleActual()) {
      this.autenticacion.CerrarSeccion();
    } else {
      this.router.navigate(['logIn']);
    }
  }
}
