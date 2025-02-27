export interface PedidoSolicitud {
  id: number;
  TransactionId: number;
  ArticuloId: number;
  Cantidad: number;
  Precio: number;
  Transacciones: Transacciones;
  Articulos: {
    Nombre: string;
  }
}


interface Transacciones {
  id: number;
  Monto: number;
  fecha: string;
  Estado: string;
  Acreditados: {
    id: number;
    Comercios: {
      id: number;
      Nombre: string;
    }
  };
  AcreditadoId: number;
}


export interface  Pedido {
  id: number;
  monto: number;
  fecha: string;
  estado: string;
  comercio: string;
  acreditadoId: number;
  articulos: {
    id: number;
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
  }[];
}
