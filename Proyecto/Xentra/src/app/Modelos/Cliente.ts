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
