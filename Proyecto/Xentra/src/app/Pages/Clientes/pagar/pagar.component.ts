import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {Comercio} from '@modelos/Comercio';
import {SolicitudCliente} from '@modelos/Solicitud';
import {CardCreditoComponent} from '@reutilizables/card-credito/card-credito.component';
import {NgClass} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-pagar',
  imports: [
    CardCreditoComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './pagar.component.html',
  styleUrl: './pagar.component.css'
})
export class PagarComponent implements OnInit {
  private rutaActual = inject(ActivatedRoute);
  private router = inject(Router);
  private clienteServicio = inject(ClientesServicio);
  private notificar = inject(NotificacionServicio);
  private comercioId = "";
  credito: SolicitudCliente = {
    Comercios: {Nombre: ''},
    Estado: '', Monto: 0, Restante: 0, clienteId: 0, comercioId: 0, fecha: '', id: 0

  };
  procesandoPago: boolean = false;
  pagoExitoso: boolean = false;
  pagoForm = new FormGroup({
    numeroTarjeta: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{16}$/),
      Validators.maxLength(16)
    ]),
    fechaExp: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/([2-9][0-9])$/)
    ]),
    cvv: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{3}$/)
    ]),
    abono: new FormControl(0, [
      Validators.required,
      Validators.min(1),
    ])
  });

  async ngOnInit() {

    this.comercioId = this.rutaActual.snapshot.params['id'];
    if (this.comercioId === null) {
      this.notificar.Advertencia("No encontramos dicho comercio.");
      await this.router.navigate(['comercios']);
    } else {
      await this.obtenerCreditoUsuario();
    }
  }

  private async obtenerCreditoUsuario() {
    this.credito = {
      Comercios: {Nombre: ''},
      Estado: '', Monto: 0, Restante: 0, clienteId: 0, comercioId: 0, fecha: '', id: 0

    };
    const result = await this.clienteServicio.ObtenerCreditoComercio(this.comercioId);
    if (result.credito) {
      this.credito = result.credito;
    } else {
      this.notificar.Advertencia("Algo fallo al cargar el comercio.");
      await this.router.navigate(['comercios']);
    }
  }

  async simularPago() {
    if (this.pagoForm.valid) {
      this.procesandoPago = true;

      const abono = this.pagoForm.get("abono")?.value ?? 0;
      const resultado = await this.clienteServicio.RealizarPago(this.credito.id.toString(), abono, "Pago en linea", (this.credito.Restante + abono))

      if (resultado) {
        this.pagoExitoso = true;
        this.procesandoPago = false;
        this.notificar.Ok("Pago realizado");
        this.pagoForm.reset();
        await this.obtenerCreditoUsuario();
      } else {
        this.pagoExitoso = false;
        this.procesandoPago = false;
        this.notificar.Ok("Algo fallo al realizar el pago");
      }

    }
  }

}
