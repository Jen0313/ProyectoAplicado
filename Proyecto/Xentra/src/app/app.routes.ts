import {Routes} from '@angular/router';
import {ClienteRegistrarComponent} from './Pages/Aut/Registrar/cliente/cliente.component';
import {IngresarComponent} from './Pages/Aut/Ingresar/ingresar.component';
import {ComercioRegistrarComponent} from './Pages/Aut/Registrar/comercio/comercio.component';
import {roleGuardGuard} from './Guards/role-guard.guard';

export const routes: Routes = [


  {
    path: 'logIn',
    component: IngresarComponent
  },
  {
    path: 'registrar/cliente',
    component: ClienteRegistrarComponent,
  },
  {
    path: 'registrar/comercio',
    component: ComercioRegistrarComponent,
  },


];
