//export interface Cliente {
//   id: number
//   Nombre: string
//   Cedula: string
//   Telefono: string
//   Direccion: string
//   UsuarioId: string
//   Imagen: string
// }

import {Roles} from '@constantes/Roles';

export class Cliente {
  id !: number;
  Nombre!: string;
  Cedula!: string;
  Telefono!: string;
  Direccion!: string;
  UsuarioId!: string;
  Imagen!: string;
  Rol = Roles.Cliente;
}

export interface ClienteRegistrar {
  email: string,
  password: string,
  Nombre: string
  Cedula: string
  Telefono: string
  Direccion: string
  Imagen: File
}


// export interface Cliente {
//   id: number;
//   Cedula: string;
//   Imagen: string;
//   Nombre: string;
//   Telefono: string;
//   Direccion: string;
//   UsuarioId: string;
// }

export interface ClienteComercio {
  id: number;
  fecha: string;
  clientId: number;
  comercioId: number;
  Monto: number;
  Restante: number;
  Estado: string;
  Clientes: Cliente;
}
