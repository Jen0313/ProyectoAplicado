import {Component, Input} from '@angular/core';
import {Pedido} from '@modelos/Pedido';

@Component({
  selector: 'app-imprimir',
  imports: [],
  templateUrl: './imprimir.component.html',
  styleUrl: './imprimir.component.css'
})
export class ImprimirComponent {

  @Input({required:true}) pedido!: Pedido ;
  imprimirPedido(): void {
    // Crear una ventana emergente para la impresión
    const ventanaImpresion = window.open('', '_blank');
    if (!ventanaImpresion) {
      alert('Por favor permita las ventanas emergentes para imprimir');
      return;
    }

    // Formatear la fecha
    const fecha = new Date(this.pedido.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-ES') + ' ' + fecha.toLocaleTimeString('es-ES');

    // Crear el contenido HTML para imprimir
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pedido #${this.pedido.id} - ${this.pedido.comercio}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .section { margin-bottom: 15px; }
          .divider { border-top: 1px dashed #ccc; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; text-align: right; margin-top: 15px; }
          .footer { text-align: center; font-size: 0.9em; margin-top: 30px; color: #666; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
        <img src="${this.pedido.comercio}"/>
          <h2>${this.pedido.comercio}</h2>
          <h3>Comprobante de Pedido #${this.pedido.id}</h3>
          <p>Fecha: ${fechaFormateada}</p>
          <p>Estado: ${this.pedido.estado}</p>
        </div>

        <div class="section">
          <h4>Datos del Cliente:</h4>
          <p>Nombre: ${this.pedido.cliente.Nombre}</p>
          <p>Cédula: ${this.pedido.cliente.Cedula}</p>
          <p>Teléfono: ${this.pedido.cliente.Telefono}</p>
          <p>Dirección: ${this.pedido.cliente.Direccion}</p>
        </div>

        <div class="divider"></div>

        <div class="section">
          <h4>Artículos:</h4>
          <table>
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${this.pedido.articulos.map(art => `
                <tr>
                  <td>${art.nombre}</td>
                  <td>${this.formatCurrency(art.precio)}</td>
                  <td>${art.cantidad}</td>
                  <td>${this.formatCurrency(art.subtotal)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            <p>Total: ${this.formatCurrency(this.pedido.monto)}</p>
          </div>
        </div>

        <div class="divider"></div>

        <div class="footer">
          <p>¡Gracias por su compra!</p>
          <p>Este documento sirve como comprobante de this.pedido.</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();return false;">Imprimir</button>
        </div>
      </body>
      </html>
    `;

    ventanaImpresion.document.write(html);
    ventanaImpresion.document.close();
    ventanaImpresion.print();
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'DOP'
    }).format(value);
  }

}
