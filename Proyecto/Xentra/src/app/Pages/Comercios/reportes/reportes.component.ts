import {Component, inject, OnInit} from '@angular/core';
import {ComercioServicio} from '@servicios/ComercioServicio';

@Component({
  selector: 'app-reportes',
  imports: [],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {

  private comercioServ = inject(ComercioServicio);

  async ngOnInit() {
    const result = await this.comercioServ.ObtenerReporte();
    console.info(result);
  }
}
