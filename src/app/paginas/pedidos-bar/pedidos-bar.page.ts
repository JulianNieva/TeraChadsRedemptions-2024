import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ToastController } from '@ionic/angular';
import { Pedido } from 'src/app/clases/pedido';
import { Producto } from 'src/app/clases/producto';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';

@Component({
  selector: 'app-pedidos-bar',
  templateUrl: './pedidos-bar.page.html',
  styleUrls: ['./pedidos-bar.page.scss'],
})
export class PedidosBarPage {

  list: Pedido[] = []
  productos: Producto[] = []
  pedido: Pedido = new Pedido
  listOfAll: Pedido[] = []
  estado_pedidos = "Pedidos Pendientes"
  pedidos_preparacion = true
  pedidos_cocion = false
  pedidos_terminados = false

  constructor(private bd: BaseDatosService, private toastController: ToastController, private pushNotification: PushNotificationService) {
    this.bd.TraerPedidos().subscribe((pedidos: any) => {
      this.listOfAll = pedidos as Array<Pedido>
      this.PedidosPendientes()
    })
  }

  PedidosPendientes() {
    this.list = []
    this.listOfAll.forEach((pedido: Pedido) => {
      if (pedido.estado === "preparacion") {
        this.list.push(pedido)
      }
    })
    this.pedidos_preparacion = true
    this.pedidos_cocion = false
    this.pedidos_terminados = false
    this.estado_pedidos = "Pedidos Pendientes"

    this.DesSelect()
  }

  PedidosTerminados() {
    this.list = []
    this.listOfAll.forEach((pedido: Pedido) => {
      if (pedido.estado === "cocinado") {
        this.list.push(pedido)
      }
    });
    this.pedidos_preparacion = true
    this.pedidos_cocion = false
    this.pedidos_terminados = false
    this.estado_pedidos = "Pedidos Terminados"

    this.DesSelect()
  }

  AgruparProductos(pedido: any[]): any[] {
    const productosAgrupados: any = [];

    pedido.forEach((producto) => {
      if (producto.tipo === "Bebida") {
        const productoExistente = productosAgrupados.find((p: any) => p.nombre === producto.nombre);

        if (productoExistente) {
          productoExistente.cantidad++;
        } else {
          productosAgrupados.push({
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
          });
        }
      }
    });

    return productosAgrupados;
  }

  SelectPed(ped: Pedido) {
    if (this.pedido.uid === ped.uid) {
      this.DesSelect()
    } else {
      this.pedido = ped
    }
  }

  DesSelect() {
    this.pedido = new Pedido
  }

  Listo() {
    if (this.pedido.uid !== " ") {
      if (this.pedido.cocinaOk === true || this.pedido.soloBartender === false) {
        this.pedido.bartenderOk = true;
        this.bd.ModificarEstadoPedido(this.pedido, "cocinado")
        this.bd.ModificarEstadoPedidoCocina(this.pedido)
        this.presentToast("middle", "Pedido en cocion", "primary")
        this.DesSelect()
        this.pushNotification.MesaNotificacionAMozo("[Mesa " + this.pedido.mesa + "] Listo para entregar", "Hay un pedido para entregar").subscribe((res) => {console.log()});
      }
      else {
        this.bd.ModificarEstadoPedidoCocina(this.pedido)
        this.DesSelect()
      }
    } else {
      this.presentToast("middle", "ERROR! Seleccione un pedido!", "warning")
    }
  }

  async presentToast(position: "middle", message = "", color = "danger") {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
      color: color,
    });

    await toast.present();
  }
}
