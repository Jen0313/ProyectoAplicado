import {CanActivateFn, Router} from '@angular/router';
import {effect, inject} from '@angular/core';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';

export function roleGuardGuard(acceso: string[]): CanActivateFn {
  return (route, state): boolean => {

    const role = inject(ServicioAutenticacion).roleActual;
    const router = inject(Router);
    let result = role() !== null ? acceso.includes((role() ?? "")) : false;
    effect(() => {
      result = role() !== null ? acceso.includes((role() ?? "")) : false;
    });

    result = role() !== null ? acceso.includes((role() ?? "")) : false;
    if (!result) {
      router.navigateByUrl("SinPermiso");
    }
    return result;


  }
};
