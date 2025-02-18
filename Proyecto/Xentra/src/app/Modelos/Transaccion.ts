export interface Transaccion {
  id: number;
  fecha: string;
  AcreditadoId: number;
  Monto: number;
  Acreditados?: { Comercios: { Nombre: string } };
}
