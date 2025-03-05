export interface Transaccion {
  id: number;
  fecha: string;
  AcreditadoId: number;
  Monto: number;
  Estado: string;
  Acreditados?: { Comercios: { Nombre: string } };
}

