import {Component, inject, OnInit} from '@angular/core';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {PedidoServicio} from '@servicios/PedidoServicio';
import {Pedido} from '@modelos/Pedido';
import {CurrencyPipe, DatePipe, NgClass, NgOptimizedImage, TitleCasePipe} from '@angular/common';
import {EstadoPedido} from '@constantes/EstadoPedido';
import {ImprimirComponent} from '@reutilizables/imprimir/imprimir.component';
import {RouterLink} from '@angular/router';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';

@Component({
  selector: 'app-pedidos',
  imports: [
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    NgClass,
    NgOptimizedImage,
    ImprimirComponent,
    RouterLink
  ],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComercioComponent implements OnInit {
  private pedidoServ = inject(PedidoServicio);
  private notificar = inject(NotificacionServicio);
  comercioId = inject(ServicioAutenticacion).usuarioActual()?.id;
  pedidos: Pedido[] = [];

  async ngOnInit() {
    await this.CargarPedidos();
  }

  async CargarPedidos() {
    const result = await this.pedidoServ.ObtenerPedidosComercio();
    if (result) {
      this.pedidos = result;
    } else {
      this.notificar.Error("Error al cargar los pedidos");
    }
  }

  articulosLimite: number = 2;
  mostrarTodos: boolean = false;

  toggleMostrarTodos(): void {
    this.mostrarTodos = !this.mostrarTodos;
  }

  async cambiarEstado(estado: string, pedido: Pedido) {
    let result: boolean;

    if (estado === EstadoPedido.Cancelado) {
      result = await this.pedidoServ.CancelarPedido(pedido);
    } else {
      result = await this.pedidoServ.CambiarEstadoPedido(pedido.id, estado);
    }

    if (result) {
      this.notificar.Ok("Estado cambiado ✅");
      await this.CargarPedidos();
    } else {
      this.notificar.Error("Error al cambiar el estado");
    }
  }


  protected readonly EstadoPedido = EstadoPedido;

  contactarWhatsApp(pedido: Pedido) {
    const fecha = new Date(pedido.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-ES');
    let telefono = pedido.cliente.Telefono.replace(/\D/g, '');
    let resumenArticulos = '';

    pedido.articulos.forEach((art) => {
      resumenArticulos += `${art.cantidad} - ${art.nombre}\n`;
    })


    // Mensaje para el cliente
    const mensaje =
      `Hola ${pedido.cliente.Nombre}, soy de ${pedido.comercio}. ` +
      `Respecto a su pedido #${pedido.id} del ${fechaFormateada}:\n\n` +
      `${resumenArticulos}\n` +
      `Estado actual: ${pedido.estado}\n` +
      `Total: ${pedido.monto} DOP\n\n` +
      `¿Puedo ayudarle en algo más?`;

    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Crear y abrir el enlace de WhatsApp
    const urlWhatsApp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, '_blank');
  }

}
