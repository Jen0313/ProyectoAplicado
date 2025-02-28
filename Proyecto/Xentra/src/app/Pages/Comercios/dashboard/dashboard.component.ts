import {Component, effect, inject, OnInit} from '@angular/core';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {Comercio} from '@modelos/Comercio';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {SolicitudAdmin} from '@modelos/Solicitud';
import {ComercioServicio} from '@servicios/ComercioServicio';
import {EstadoSolicitud} from '@constantes/EstadoSolicitud';
import {informe} from '@modelos/Informes';
import {NotificacionServicio} from '@servicios/NotificacionServicio';
import {RouterLink} from '@angular/router';
import {Chart, ChartConfiguration} from 'chart.js';

@Component({
  selector: 'app-dashboard-comercio',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComercioComponent implements OnInit {
  private authServ = inject(ServicioAutenticacion);
  private comercioServ = inject(ComercioServicio);
  private notificar = inject(NotificacionServicio);
  comercio = this.authServ.usuarioActual;
  SolicitudesPendientes: SolicitudAdmin[] = [];
  datosInforme: informe = {
    ventasDiarias: [],
    totalMonto: 0,
    totalRestante: 0,
    totalRegistros: 0,
    estadosCount: []
  };
  totalArticulos: number = 0;
  graficoVentas: any;
  graficoCredito: any;

  constructor() {
    effect(async () => {
      await this.cargarTodosDatos();

    });
  }

  async ngOnInit() {
    await this.cargarTodosDatos();

  }

  private async cargarTodosDatos() {
    await this.ObtenerSolicitudesPendientes();
    this.datosInforme = await this.comercioServ.ObtenerReporte();

    const resultArticulos = await this.comercioServ.ObtenerProductosComercio(this.comercio()?.id?.toString() ?? "");
    if (resultArticulos.error) {
      this.notificar.Error("Error al obtener los articulos publicados por el comercio...")
    }
    this.totalArticulos = resultArticulos.articulos.length;
    this.cargarGraficos();
  }

  private cargarGraficos() {

    const configGraficoVentas: ChartConfiguration = {
      data: {
        labels: this.datosInforme.ventasDiarias.map(x => x.fecha),
        datasets: [{
          label: 'Ventas ',
          data: this.datosInforme.ventasDiarias.map(x => x.totalMonto),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]

      },
      options: undefined,
      plugins: [],
      type: "line"
    }
    const configDistribuccionCredito: ChartConfiguration = {
      data: {
        labels: ['Total Acreditado', "Restante"],
        datasets: [{
          label: `Valor`,
          data: [this.datosInforme.totalMonto, this.datosInforme.totalRestante],
          fill: false,
          tension: 0.1
        }]

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2,
      },
      plugins: [],
      type: "doughnut"
    }
    this.graficoCredito = new Chart("creditoChart", configDistribuccionCredito);
    this.graficoVentas = new Chart("ventasChart", configGraficoVentas);

  }

  private async ObtenerSolicitudesPendientes() {
    const result = await this.comercioServ.ObtenerSolicitudesComercio();
    if (result) {
      this.SolicitudesPendientes = result.solicitudes.filter(x => x.Estado === EstadoSolicitud.Pendiente);
    }
  }

  async gestionarSolicitud(id: number, aceptar: boolean = true) {
    let nuevoEstado = aceptar ? EstadoSolicitud.Aprobada : EstadoSolicitud.Denegada;
    const result = await this.comercioServ.CambiarEstadoSolicitud(id.toString(), nuevoEstado);
    if (!result) {
      this.notificar.Error(`Error al ${nuevoEstado} la solicitud`);
    } else {
      this.notificar.Ok(`Solicitud ${nuevoEstado}`);
      await this.ObtenerSolicitudesPendientes();
    }
  }
}
