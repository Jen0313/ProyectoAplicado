import {Injectable, signal, WritableSignal} from '@angular/core';


@Injectable({providedIn: 'root'})
export class NotificacionServicio {
  private _notificacion: WritableSignal<{
    mensaje: string | null,
    tipo: "info" | "success" | "warning" | "danger"
  }> = signal({mensaje: null, tipo: "info"});
  Notificacion = this._notificacion.asReadonly();


  Error(mensaje: string) {
    this._notificacion.set({mensaje: mensaje, tipo: "danger"})
    setTimeout(() => {
      this.quitar()
    }, 5000);
  }


  Ok(mensaje: string) {
    this._notificacion.set({mensaje: mensaje, tipo: "success"});
    setTimeout(() => {
      this.quitar()
    }, 5000);
  }

  Advertencia(mensaje: string) {
    this._notificacion.set({mensaje: mensaje, tipo: "warning"});
    setTimeout(() => {
      this.quitar()
    }, 5000);
  }

  quitar() {
    this._notificacion.set({mensaje: null, tipo: "info"});

  }
}
