import {Routes} from '@angular/router';
import {ClienteRegistrarComponent} from './Pages/Aut/Registrar/cliente/cliente.component';
import {IngresarComponent} from './Pages/Aut/Ingresar/ingresar.component';
import {ComercioRegistrarComponent} from './Pages/Aut/Registrar/comercio/comercio.component';
import {roleGuardGuard} from './Guards/role-guard.guard';
import {NoEncontradoComponent} from './Pages/Compartido/no-encontrado/no-encontrado.component';
import {InicioComponent} from './Pages/inicio/inicio.component';
import {SinPermisoComponent} from './Pages/Compartido/sin-permiso/sin-permiso.component';
import {Roles} from '@constantes/Roles';
import {SolicitarCreditoComponent} from './Pages/Clientes/solicitar/solicitar.component';
import {ComerciosComponent} from './Pages/Compartido/comercios/comercios.component';
import {DetalleComercioComponent} from './Pages/Compartido/detalle-comercio/detalle-comercio.component';
import {CreditoComponent} from './Pages/Clientes/credito/credito.component';
import {TransaccionesClienteComponent} from './Pages/Clientes/transacciones/transacciones.component';
import {SolicitudesClienteComponent} from './Pages/Clientes/solicitudes/solicitudes.component';
import {ClientesComercioComponent} from './Pages/Comercios/clientes/clientes.component';
import {TransaccionesComercioComponent} from './Pages/Comercios/transacciones/transacciones.component';
import {SolicitudesComercioComponent} from './Pages/Comercios/solicitudes/solicitudes.component';
import {ReportesComponent} from './Pages/Comercios/reportes/reportes.component';

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
  {
    path: "comercios",
    children: [
      {path: "", component: ComerciosComponent},
      {path: ":id", component: DetalleComercioComponent},
      {
     //   canActivate: [roleGuardGuard([Roles.Cliente])],
        path: "solicitar/:id", component: SolicitarCreditoComponent
      }
    ]
  },
  // CLIENTES
  {
    path: "clientes",
    canActivate: [roleGuardGuard([Roles.Cliente])],
    children: [
      {path: "", redirectTo: 'credito', pathMatch: 'full'},
      {path: "credito", component: CreditoComponent},
      {path: "historialTransacciones", component: TransaccionesClienteComponent},
      {path: "solicitudes", component: SolicitudesClienteComponent},
    ]
  },
  // para los comerciantes
  {
    path: "AdminComercios",
    canActivate: [roleGuardGuard([Roles.Comercio])],
    children: [
      {path: "", redirectTo: 'clientes', pathMatch: 'full'},
      {path: "clientes", component: ClientesComercioComponent},
      {path: "transacciones", component: TransaccionesComercioComponent},
      {path: "solicitudes", component: SolicitudesComercioComponent},
      {path: "reportes", component: ReportesComponent},
    ]
  },
  // no tiene permiso
  {
    path: "SinPermiso",
    component: SinPermisoComponent,
  },
  // Inicio

  {
    path: 'inicio',
    component: InicioComponent,
  },
  {
    path: "",
    redirectTo: "inicio",
    pathMatch: 'full',
  },
  // RUTA no encontrada
  {
    path: "**",
    component: NoEncontradoComponent
  }

];
