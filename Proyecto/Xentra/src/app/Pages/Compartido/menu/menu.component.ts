import {Component, effect, OnInit, Signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {Cliente} from '@modelos/Cliente';
import {Comercio} from '@modelos/Comercio';
import {Roles} from '@constantes/Roles';
import {InstantiateExpr} from '@angular/compiler';


@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  // roleActual: Signal<string | null>;
  usuarioActual: Signal<Comercio | Cliente | null>;

  constructor(private autenticacion: ServicioAutenticacion, private route: ActivatedRoute, private router: Router) {
    // this.roleActual = this.autenticacion.roleActual;
    this.usuarioActual = this.autenticacion.usuarioActual;
    if (this.usuarioActual() instanceof Cliente) {
      console.log("cliente");
    } else {
      console.warn("comercio")
    }
  }


  EsCliente() {
    return this.usuarioActual()?.Rol === Roles.Cliente ? (this.usuarioActual() as Cliente) : null;

  }

  EsComercio() {
    return this.usuarioActual()?.Rol === Roles.Comercio ? (this.usuarioActual() as Comercio) : null;
  }


  btnSeccion() {
    if (this.usuarioActual()) {
      this.autenticacion.CerrarSeccion();
    } else {
      this.router.navigate(['logIn']);
    }
  }

  protected readonly Roles = Roles;
  protected readonly Cliente = Cliente;
  protected readonly Comercio = Comercio;
}
