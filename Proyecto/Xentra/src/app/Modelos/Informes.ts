export interface  informe
{
  ventasDiarias: { fecha: string; totalMonto: number }[];
  totalMonto: number;
  totalRestante: number;
  totalRegistros: number;
  estadosCount: { estado: string; cantidad: number }[]
}
