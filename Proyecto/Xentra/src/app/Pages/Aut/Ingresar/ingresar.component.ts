import {Component, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ingresar',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './ingresar.component.html',
  styleUrl: './ingresar.component.css'
})
export class IngresarComponent {
  formulario = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private autenticacion: ServicioAutenticacion, private notificar: NotificacionServicio, private router: Router) {
    this.autenticacion.CerrarSeccion();
  }

  async Ingresar() {
    if (this.formulario.valid) {
      const usuario = this.formulario.value;
      const result = await this.autenticacion.IniciarSeccion(usuario.email!, usuario.password!);

      if (result.error) {
        if (result.error.code === "invalid_credentials") {
          this.notificar.Error("Correo o contraseña invalido.");
        } else {
          this.notificar.Error(result.error.message);
        }
      } else {
        await this.router.navigate(['']);
        this.notificar.quitar();
      }
    } else {
      this.formulario.markAllAsTouched();

    }
  }
}
