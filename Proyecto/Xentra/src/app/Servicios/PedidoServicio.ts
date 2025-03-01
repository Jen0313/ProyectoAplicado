import {inject, Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {ServicioAutenticacion} from '@servicios/ServicioAutenticacion';
import {environment} from '@environment/environment';
import {Pedido, PedidoSolicitud} from '@modelos/Pedido';
import {EstadoPedido} from '@constantes/EstadoPedido';
import {Articulo} from '@modelos/Articulo';
import {SolicitudCliente} from '@modelos/Solicitud';


@Injectable({providedIn: 'root'})
export class PedidoServicio {
  private supabase: SupabaseClient;
  private authServ = inject(ServicioAutenticacion);

  constructor() {
    this.supabase = createClient(environment.SupabaseUrl, environment.SupabaseKey)
  }

  private async ObtenerAcreditadoId() {
    const clienteId = this.authServ.usuarioActual()?.id;
    let resultadoAcreditado = await this.supabase
      .from('Acreditados')
      .select('id')
      .eq("clientId", clienteId);
    if (resultadoAcreditado.data === null) {
      return null;
    }

    const result = resultadoAcreditado as { data: { id: string }[], error: any }
    return result.data[0].id;
  }

  async ObtenerPedidosCliente() {
    const acreditadoId = await this.ObtenerAcreditadoId();
    if (acreditadoId === null) {
      return null;
    }
    let {data: r, error} = await this.supabase
      .from('DetalleTransacion')
      .select("*,Articulos(Nombre),Transacciones(*,Acreditados(id,Comercios(id,Nombre),Clientes(*)))")
      .eq("Transacciones.AcreditadoId", acreditadoId) as { data: PedidoSolicitud[], error: any };

    if (error !== null) {
      return null;
    }
    return this.FormatearDatosPedidos(r);
  }

  async ObtenerPedidosComercio() {
    const comercioId = this.authServ.usuarioActual()?.id;

    let {data: r, error} = await this.supabase
      .from('DetalleTransacion')
      .select("*,Articulos(Nombre),Transacciones(*,Acreditados(id,Comercios(id,Nombre),Clientes(*)))")
      .eq("Transacciones.Acreditados.Comercios.id", comercioId) as { data: PedidoSolicitud[], error: any };

    if (error !== null) {
      return null;
    }
    return this.FormatearDatosPedidos(r);
  }

  async CancelarPedido(pedido: Pedido) {
    let {data, error} = await this.supabase
      .from('Acreditados')
      .select('Restante')
      .eq("id", pedido.acreditadoId) as { data: { Restante: number }[], error: any };
    if (error !== null) {
      return false;
    }
    let totalRestanteUsuario = data[0].Restante + pedido.monto;


    let resultActualizar = await this.supabase
      .from('Acreditados')
      .update({'Restante': totalRestanteUsuario})
      .eq("clientId", pedido.cliente.id)
      .select();
    if (resultActualizar) {
      const {error} = await this.supabase
        .from('Transacciones')
        .update({"Estado": EstadoPedido.Cancelado})
        .eq('id', pedido.id)
        .select();
      return error === null;
    } else {
      return false;
    }
  }

  async CambiarEstadoPedido(pedidoId: number, estado: string) {
    const {error} = await this.supabase
      .from('Transacciones')
      .update({"Estado": estado})
      .eq('id', pedidoId)
      .select();
    return error === null;

  }

  private FormatearDatosPedidos(pedidos: PedidoSolicitud[]) {
    const pedidosPorTransaccion: { [key: number]: PedidoSolicitud[] } = {};

    pedidos.forEach(pedido => {
      if (!pedidosPorTransaccion[pedido.TransactionId]) {
        pedidosPorTransaccion[pedido.TransactionId] = [];
      }
      pedidosPorTransaccion[pedido.TransactionId].push(pedido);
    });

    const transaccionesConArticulos: Pedido[] = [];

    Object.entries(pedidosPorTransaccion).forEach(([transactionId, pedidosDeTransaccion]) => {
      const infoTransaccion = pedidosDeTransaccion[0].Transacciones;

      if (infoTransaccion) {
        const articulos = pedidosDeTransaccion.map(pedido => ({
          id: pedido.ArticuloId,
          nombre: pedido.Articulos.Nombre,
          cantidad: pedido.Cantidad,
          precio: pedido.Precio,
          subtotal: pedido.Cantidad * pedido.Precio
        }));

        const clienteInfo = infoTransaccion.Acreditados?.Clientes;
        const comercioNombre = infoTransaccion.Acreditados?.Comercios?.Nombre || 'No cargado...';

        transaccionesConArticulos.push(<Pedido>{
          id: infoTransaccion.id,
          monto: infoTransaccion.Monto,
          fecha: infoTransaccion.fecha,
          estado: infoTransaccion.Estado,
          comercio: comercioNombre,
          acreditadoId: infoTransaccion.AcreditadoId,
          articulos: articulos,
          cliente: clienteInfo ? {
            id: clienteInfo.id,
            Cedula: clienteInfo.Cedula,
            Imagen: clienteInfo.Imagen,
            Nombre: clienteInfo.Nombre,
            Telefono: clienteInfo.Telefono,
            Direccion: clienteInfo.Direccion,
            UsuarioId: clienteInfo.UsuarioId
          } : null
        });
      }
    });

    return transaccionesConArticulos;
  }


  //                                             Realizar compra / pedido ( Usaurio )
  async RealizarCompra(Articulos: { articulo: Articulo, cantidad: number }[], restante: number) {

    const monto = Articulos.map(x => x.articulo.Precio * x.cantidad).reduce((p, c) => p + c);
    // intenta crear la transaccion
    const transaccionId = await this.CrearTransaccion(monto);
    if (transaccionId === null) {
      return false;
    }
    // crea los detalles de la factura
    const resultadoDetalles = await this.crearDetallesFactura(transaccionId, Articulos);
    // si hay algun error en crear los detalle sde la facura, se elimina la factura
    if (!resultadoDetalles) {
      // Eliminar la trasaccion creada
      await this.EliminarTransactionErronea(transaccionId)

      return false;
    }
    // reducir el monto de la transaccion al monto disponible del acreditado
    return await this.ActualizarRestanteCredito((restante - monto));
  }

  // crea el registro de la transaccion
  private async CrearTransaccion(Monto: number) {
    const acreditadoId = await this.ObtenerAcreditadoId();
    if (acreditadoId === null) {
      return null;
    }
    const {data, error} = await this.supabase
      .from('Transacciones')
      .insert([
        {
          "AcreditadoId": acreditadoId,
          "Monto": Monto,
          "Estado": EstadoPedido.Pendiente
        },
      ]).select('id') as { data: { id: string }[], error: any };
    return data[0].id;

  }


  private async crearDetallesFactura(transacionId: string, Articulos: { articulo: Articulo, cantidad: number }[]) {

    const datosIngresar = Articulos.map(art => {
      return {
        TransactionId: transacionId,
        ArticuloId: art.articulo.id,
        Cantidad: art.cantidad,
        Precio: art.articulo.Precio
      };
    });

    const {data, error} = await this.supabase
      .from('DetalleTransacion')
      .insert(datosIngresar)
      .select();

    return error === null;
  }

// Elimina LA TRANSACCION EN CASO DE ALGUN ERROR
  private async EliminarTransactionErronea(id: string) {
    const r = await this.supabase
      .from('Transacciones')
      .delete()
      .eq("id", id);

    return r.error === null;
  }

  //                                             Realizar compra / pedido ( Usaurio )

// Permite actualizar el restante de un cliente, ya sea cuando realiza un pago o compra algo
  async ActualizarRestanteCredito(total: number) {
    const clienteId = this.authServ.usuarioActual()?.id;
    let resultActualizar = await this.supabase
      .from('Acreditados')
      .update({'Restante': total})
      .eq("clientId", clienteId)
      .select();
    return resultActualizar.error === null;
  };

}
