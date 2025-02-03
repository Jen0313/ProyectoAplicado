import {Injectable, signal, WritableSignal} from '@angular/core';


@Injectable({providedIn: 'root'})
export class NotificacionServicio {
  private _notificacion: WritableSignal<{
    mensaje: string | null,
    tipo: "info" | "success" | "warning" | "danger"
  }> = signal({mensaje: null, tipo: "info"});
  Notificacion = this._notificacion.asReadonly();


  Error(mensaje: string) {
    this._notificacion.set({mensaje: mensaje, tipo: "danger"});
  }

  Informacion(mensaje: string) {
    this._notificacion.set({mensaje: mensaje, tipo: "info"});
  }

  Ok(mensaje: string) {
    this._notificacion.set({mensaje: mensaje, tipo: "success"});
  }

  Advertencia(mensaje: string) {
    this._notificacion.set({mensaje: mensaje, tipo: "warning"});
  }
  quitar(){
    this._notificacion.set({mensaje: null, tipo: "info"});
  }
}
