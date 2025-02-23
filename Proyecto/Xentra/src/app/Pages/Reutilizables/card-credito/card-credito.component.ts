import {Component, Input} from '@angular/core';
import {SolicitudCliente} from '@modelos/Solicitud';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'card-credito',
  imports: [
    RouterLink
  ],
  templateUrl: './card-credito.component.html',
  styleUrl: './card-credito.component.css'
})
export class CardCreditoComponent {
  @Input({required:true}) credito!: SolicitudCliente;

}
