import {CanActivateFn, Router} from '@angular/router';
import {effect, inject} from '@angular/core';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';

export const roleGuardGuard: CanActivateFn = (route, state) => {
  let role = inject(ServicioAutenticacion).roleActual;
  const router = inject(Router);
  let result = true;
  effect(() => {
    result = role() !== null;
    if (!result) {
      router.navigateByUrl("logIn");
    }
  });
  if (role() === null) {
    router.navigateByUrl("logIn");
  }
  return result;

};
