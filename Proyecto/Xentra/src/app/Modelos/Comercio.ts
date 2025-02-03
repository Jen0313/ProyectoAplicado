export interface Comercio {
  id: number
  Nombre: string
  Ubicacion: string
  Telefonos: string[]
  Dueno: string,
  Imagenes: string[]
}
export interface ComercioRegistrar {
  email:string,
  password:string,
  Nombre: string
  Ubicacion: string
  Telefonos: string[]
  Dueno: string
  Imagenes: File[]
}
