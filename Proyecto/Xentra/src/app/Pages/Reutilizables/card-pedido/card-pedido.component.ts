import {Component, Input, OnInit} from '@angular/core';
import {Pedido} from '@modelos/Pedido';
import {CurrencyPipe, DatePipe, NgClass, TitleCasePipe} from '@angular/common';
import {EstadoPedido} from '@constantes/EstadoPedido';
import {ImprimirComponent} from '@reutilizables/imprimir/imprimir.component';

@Component({
  selector: 'card-pedido',
  imports: [
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    NgClass,
    ImprimirComponent
  ],
  templateUrl: './card-pedido.component.html',
  styleUrl: './card-pedido.component.css'
})
export class CardPedidoComponent implements OnInit {
  @Input({required: true}) pedido!: Pedido;

  protected readonly EstadoPedido = EstadoPedido;
  articulosLimite: number = 1;
  mostrarTodos: boolean = false;
  articulosMostrados: any[] = [];
  hayMasArticulos: boolean = false;

  ngOnInit() {
    this.actualizarArticulosMostrados();
  }

  toggleMostrarTodos() {
    this.mostrarTodos = !this.mostrarTodos;
    this.actualizarArticulosMostrados();
  }

  actualizarArticulosMostrados() {
    if (this.mostrarTodos) {
      this.articulosMostrados = this.pedido.articulos;
    } else {
      this.articulosMostrados = this.pedido.articulos.slice(0, this.articulosLimite);
    }
    this.hayMasArticulos = this.pedido.articulos.length > this.articulosLimite;
  }
}
