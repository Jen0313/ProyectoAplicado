import {Component} from '@angular/core';
import {MenuComponent} from './Pages/Compartido/menu/menu.component';
import {NotificationComponent} from './Pages/Compartido/notification/notification.component';


@Component({
  selector: 'app-root',
  imports: [NotificationComponent, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
