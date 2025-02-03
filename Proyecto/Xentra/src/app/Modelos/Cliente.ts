export interface Cliente {
  id: number
  Nombre: string
  Cedula: string
  Telefono: string
  Direccion: string
  UsuarioId: string
  Imagen: string
}
export interface ClienteRegistrar {
  email : string,
  password : string,
  Nombre: string
  Cedula: string
  Telefono: string
  Direccion: string
  Imagen: File
}
