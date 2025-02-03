import {Component, inject, Inject, Signal} from '@angular/core';
import {NotificacionServicio} from '@servicios/NotificacionServicio';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  notificar = inject(NotificacionServicio);
}
