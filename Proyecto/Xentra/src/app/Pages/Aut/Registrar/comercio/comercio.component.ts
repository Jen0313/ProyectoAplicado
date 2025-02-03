import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ComercioRegistrar} from '@modelos/Comercio';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {Router} from '@angular/router';
import {NotificacionServicio} from '@servicios/NotificacionServicio';

@Component({
  selector: 'app-registrar-comercio',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './comercio.component.html',
  styleUrl: './comercio.component.css'
})
export class ComercioRegistrarComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder,
              private autenticacion: ServicioAutenticacion,
              private router: Router,
              private notificar: NotificacionServicio) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      Nombre: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Telefonos: this.fb.array([]),
      Dueno: ['', Validators.required],
      Imagenes: [null, Validators.required]
    });
    this.agregarTelefono();
  }

  get telefonos(): FormArray {
    return this.registroForm.get('Telefonos') as FormArray;
  }


  agregarTelefono(): void {
    this.telefonos.push(this.fb.group({
      telefono: ['', Validators.required]
    }));
  }

  quitarTelefono(index: number): void {
    this.telefonos.removeAt(index);
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const files = Array.from(target.files);
      this.registroForm.patchValue({
        Imagenes: files
      });
      this.registroForm.get('Imagenes')?.markAsTouched();
    }
  }

  async registrar() {
    if (this.registroForm.valid) {
      const formValue = this.registroForm.value;
      const comercio: ComercioRegistrar = {
        ...formValue,
        Telefonos: formValue.Telefonos.map((t: { telefono: string }) => t.telefono)
      };
      const r = await this.autenticacion.RegistrarComercio(comercio);

      if (r.data && r.error === null) {
        await this.router.navigate([""]);
      } else if (r.data && r.error) {
        this.notificar.Advertencia(`Comercio registrado. AUNQUE : ${r.error}`);
        await this.router.navigate([""]);
      } else if (r.error && r.data == null) {
        if (r.error?.toString().toLowerCase() === "User already registered".toLowerCase()) {
          this.notificar.Error("Este correo ya esta en uso...");
        } else {
          this.notificar.Error(`Error al registrar este comercion : ${r.error}`);
        }
      }
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}
