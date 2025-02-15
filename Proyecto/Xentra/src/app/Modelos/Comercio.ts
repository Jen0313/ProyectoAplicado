import {Roles} from '@constantes/Roles';

export class Comercio {
  id!: number;
  Nombre!: string;
  Ubicacion!: string;
  Telefonos!: string[];
  Dueno!: string;
  Imagenes!: string[];
  Rol = Roles.Comercio;

}

export interface ComercioRegistrar {
  email: string,
  password: string,
  Nombre: string
  Ubicacion: string
  Telefonos: string[]
  Dueno: string
  Imagenes: File[]
}
