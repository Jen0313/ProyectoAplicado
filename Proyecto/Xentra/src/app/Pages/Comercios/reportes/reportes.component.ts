import {Component, inject, OnInit} from '@angular/core';
import {ComercioServicio} from '@servicios/ComercioServicio';
import {Chart, ChartConfiguration, registerables} from 'chart.js';
import {CurrencyPipe} from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {

  private comercioServ = inject(ComercioServicio);

  datosGenerales: {
    totalAcreditado: number,
    totalRegistros : number,
    creditoSinUtilizar : number
  } = {
    totalAcreditado: 0,
    totalRegistros: 0,
    creditoSinUtilizar: 0
  };
  graficoVentasDiarias: any;
  graficoEstadoClientes: any;

  async ngOnInit() {
    const result = await this.comercioServ.ObtenerReporte();
    this.datosGenerales ={
      totalAcreditado: result.totalMonto,
      totalRegistros: result.totalRegistros,
      creditoSinUtilizar: result.totalRestante
    }
    const configGraficoVentas: ChartConfiguration = {
      data: {
        labels: result.ventasDiarias.map(x => x.fecha),
        datasets: [{
          label: 'Ventas Diarias',
          data: result.ventasDiarias.map(x => x.totalMonto),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]

      },
      options: undefined,
      plugins: [],
      type: "line"
    }
    const configClientes: ChartConfiguration = {
      data: {
        labels: result.estadosCount.map(x => x.estado),
        datasets: [{
          label: `Clientes ${result.estadosCount.map(x => x.estado)}`,
          data: result.estadosCount.map(x => x.cantidad),
          fill: false,
          borderColor: 'rgb(45, 5, 5)',
          tension: 0.1
        }]

      },
      options: undefined,
      plugins: [],
      type: "doughnut"
    }
    this.graficoVentasDiarias = new Chart("graficoVentas", configGraficoVentas);
    this.graficoEstadoClientes = new Chart("graficoEstadoClientes", configClientes);
  }
}
