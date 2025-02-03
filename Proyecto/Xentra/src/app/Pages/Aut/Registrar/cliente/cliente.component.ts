import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClienteRegistrar} from '@modelos/Cliente';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {Router} from '@angular/router';
import {NotificacionServicio} from '@servicios/NotificacionServicio';

@Component({
  selector: 'app-registrar-cliente',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteRegistrarComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder,
              private autenticacion: ServicioAutenticacion,
              private router: Router,
              private notificar: NotificacionServicio) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      Nombre: ['', Validators.required],
      Cedula: ['', Validators.required],
      Telefono: ['', Validators.required],
      Direccion: ['', Validators.required],
      Imagen: [null, Validators.required]
    });

  }


  async onSubmit() {
    if (this.registroForm.valid) {
      const r = await this.autenticacion.RegistrarCliente(this.registroForm.value);
      if (r.data && r.error === null) {
        await this.router.navigate([""]);
        this.notificar.quitar();
      } else if (r.data && r.error) {
        this.notificar.Advertencia(`Cliente registrado. AUNQUE : ${r.error}`);
        await this.router.navigate([""]);
      } else if (r.error && r.data == null) {
        if (r.error?.toString().toLowerCase() === "User already registered".toLowerCase()) {
          this.notificar.Error("Este correo ya esta en uso...");
        } else {
          this.notificar.Error(`Error al registrar este cliente : ${r.error}`);
        }
      }
    } else {
      this.registroForm.markAllAsTouched();
    }
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.registroForm.get('Imagen')?.setValue(file);
    }
  }

  protected readonly FormDataEvent = FormDataEvent;
}
