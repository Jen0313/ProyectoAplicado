export interface SolicitudAdmin {
  id: number
  fecha: string
  ClienteId: number
  ComercioId: number
  Monto: number
  Estado: string
  Clientes: {
    Nombre: string
    Direccion: string
  }
}

export interface SolicitudCliente {
  id: number
  fecha: string
  clienteId: number
  comercioId: number
  Monto: number
  Estado: string
  Restante: number
  Comercios: {
    Nombre: string;
  }
}
