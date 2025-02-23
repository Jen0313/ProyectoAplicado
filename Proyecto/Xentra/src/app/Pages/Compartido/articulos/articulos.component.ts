import {Component, inject, OnInit, signal} from '@angular/core';
import {ComercioServicio} from '@servicios/ComercioServicio';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {Roles} from '@constantes/Roles';
import {Comercio} from '@modelos/Comercio';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {Articulo} from '@modelos/Articulo';
import {CurrencyPipe} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClientesServicio} from '@servicios/clientes-servicio.service';
import {SolicitudCliente} from '@modelos/Solicitud';
import {CardCreditoComponent} from '../../Reutilizables/card-credito/card-credito.component';


interface CarritoItem {
  articulo: Articulo;
  cantidad: number;
}

@Component({
  selector: 'app-articulos',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardCreditoComponent
  ],
  templateUrl: './articulos.component.html',
  styleUrl: './articulos.component.css'
})
export class ArticulosComponent implements OnInit {

  private comercioServ = inject(ComercioServicio);
  private clienteServ = inject(ClientesServicio);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private notificar = inject(NotificacionServicio);
  authServ = inject(ServicioAutenticacion);
  clienteActual: SolicitudCliente | null = null;
  Articulos: Articulo[] = [];

  carrito = signal<CarritoItem[]>([]);
  formAdd: FormGroup;

  constructor() {
    this.formAdd = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      descripcion: new FormControl("", [Validators.required, Validators.minLength(10)]),
      precio: new FormControl(0, [Validators.required, Validators.min(1)])
    });
  }

  async ngOnInit() {
    const idComercio = this.activeRoute.snapshot.params['id'];
    if (idComercio == null) {
      this.notificar.Advertencia("Debes inciar seccion");
      await this.router.navigate(['login']);
    }
    await this.CargarArticulos();
    if (this.authServ.roleActual() == Roles.Cliente) {
      const result = await this.clienteServ.ObtenerCreditoComercio(idComercio?.toString() ?? "");
      this.clienteActual = result.credito;
      if (result.error) {
        this.notificar.Error("Error al cargar el credito del cliente...")
      }
    }

  }

  async CargarArticulos() {
    const idComercio = this.activeRoute.snapshot.params['id'];
    const resultado = await this.comercioServ.ObtenerProductosComercio(idComercio?.toString() ?? "");
    this.Articulos = resultado.articulos;
    if (resultado.error) {
      this.notificar.Error("Error al cargar los articulos!");
    }
  }

  agregarAlCarrito(articulo: Articulo) {
    const carritoActual = this.carrito();
    const itemExistente = carritoActual.find(item => item.articulo.id === articulo.id);

    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      carritoActual.push({articulo, cantidad: 1});
    }
    this.carrito.set([...carritoActual]);
  }

  eliminarDelCarrito(id: number) {
    this.carrito.set([...this.carrito().filter(item => item.articulo.id !== id)]);
  }

  actualizarCantidad(articuloId: number, nuevaCantidad: number) {
    const carritoActual = this.carrito().map(item => {
      if (item.articulo.id === articuloId) {
        return {...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1};
      }
      return item;
    });
    this.carrito.set(carritoActual);
  }

  calcularTotal(): number {
    return this.carrito().reduce((total, item) => total + item.cantidad * item.articulo.Precio, 0);
  }

  async comprar() {
    const result = await this.clienteServ.RealizarCompra(this.carrito(), this.clienteActual?.Restante ?? 0);
    if (result) {
      this.notificar.Ok("Compra realizada.");
      this.carrito.set([]);
    } else {
      this.notificar.Error("Error al realizar la Comprar");
    }
  }


  // comercios
  async agregarArticulo() {
    if (this.formAdd.invalid) {
      this.formAdd.markAllAsTouched();
      return;
    }
    const datos = this.formAdd.value;
    const registrar: Articulo = {
      id: 0,
      ComercioId: this.activeRoute.snapshot.params['id'] ?? "",
      Nombre: datos.nombre,
      Precio: datos.precio,
      Descripcion: datos.descripcion
    }
    const result = await this.comercioServ.GuardarArticulo(registrar);

    if (!result) {
      this.notificar.Error("Error al guardar al articulo");
    } else {
      this.notificar.Ok("Articulo Guardado correctamente");
      await this.CargarArticulos();
      this.formAdd.reset();

    }

  }


  protected readonly Roles = Roles;


}
