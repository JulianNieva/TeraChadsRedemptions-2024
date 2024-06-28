import { Component, OnInit } from '@angular/core';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-listado-pedidos-mozo',
  templateUrl: './listado-pedidos-mozo.page.html',
  styleUrls: ['./listado-pedidos-mozo.page.scss'],
})
export class ListadoPedidosMozoPage implements OnInit {

  listadoPedidosEnRevision:any = [];
  listadoPedidosAEntregar:any = [];
  listadoPedidosACobrar:any = [];
  listadoPedidosEnPreparacion:any = [];

  usuario:any;
  loading:boolean = false;

  mostrarPedidosEnRevision:boolean = true;
  mostrarPedidosAEntregar:boolean = false;
  mostrarPedidosACobrar:boolean = false;
  mostrarPedidosEnPreparacion:boolean = false;

  constructor(private bdSrv:BaseDatosService,private pushSrv:PushNotificationService) {
    this.loading = true;
    this.usuario = this.bdSrv.Getlog();

    if(this.usuario !== null)
    {
      //Traigo los pedidos que recien se agregaron
      this.bdSrv.TraerPedidosConEstado("revision").subscribe((pedidos) => {
        if(pedidos)
        {
          this.loading = false;
          console.info(pedidos)
          this.listadoPedidosEnRevision = pedidos
        }
      })

      //Traigo los pedidos que estan en preparacion
      this.bdSrv.TraerPedidosConEstado("preparacion").subscribe((pedidos) => {
        if(pedidos)
        {
          console.info(pedidos)
          this.listadoPedidosEnPreparacion = pedidos
        }
      })

      //traigo los pedidos que estan cocinados
      this.bdSrv.TraerPedidosConEstado('cocinado').subscribe((pedidos) => {
        //Lo que hago es filtrar los pedidos que tengan estado de cocinado
        if(pedidos)
          {
            console.info(pedidos)
            this.listadoPedidosAEntregar = pedidos
          }
      });

      //Pedidos en espera a cobrar
      this.bdSrv.TraerPedidosConEstado('esperando').subscribe((pedidos) => {
        this.listadoPedidosACobrar = pedidos;
      });
    }
  }

  ngOnInit() { }

  AceptarPedido(pedido:any)
  {
    console.info(pedido)
    this.bdSrv.ModificarEstadoPedido(pedido, 'preparacion').then((res) => {
      if(pedido.soloCocinero)
        this.pushSrv.NuevoPedidoCocineros(`[Mesa ${pedido.mesa}] Tienes un pedido nuevo`,"Hay un pedido nuevo!").subscribe((res) =>{ console.log(res)})
      if(pedido.soloBartender)
        this.pushSrv.NuevoPedidoBartender(`[Mesa ${pedido.mesa}] Tienes un pedido nuevo`,"Tienes un pedido nuevo!").subscribe((res) => {console.log(res)})
    })
      //Push a cocineroYBartenders
  }

  RechazarPedido(pedido:any)
  {
    this.loading = true;
    console.log(pedido)
    this.bdSrv.EliminarPedido(pedido).then((res) => {
      this.loading = false;
    })
  }

  // PedidoEntregado(pedido:any)
  // {
  //   this.bdSrv.ModificarEstadoPedido(pedido, 'entregado')
  // }

  MostrarPedidosEnRevision()
  {
    this.mostrarPedidosEnRevision = true;
    this.mostrarPedidosACobrar = false;
    this.mostrarPedidosAEntregar = false;
    this.mostrarPedidosEnPreparacion = false;
  }

  MostrarPedidosCocinados()
  {
    this.mostrarPedidosEnRevision = false;
    this.mostrarPedidosACobrar = false;
    this.mostrarPedidosAEntregar = true;
    this.mostrarPedidosEnPreparacion = false;
  }

  MostrarPedidosACobrar()
  {
    this.mostrarPedidosEnRevision = false;
    this.mostrarPedidosACobrar = true;
    this.mostrarPedidosAEntregar = false;
    this.mostrarPedidosEnPreparacion = false;
  }

  MostrarPedidosEnPreparacion()
  {
    this.mostrarPedidosEnRevision = false;
    this.mostrarPedidosACobrar = false;
    this.mostrarPedidosAEntregar = false;
    this.mostrarPedidosEnPreparacion = true;
  }

  AgruparProductos(pedidos:any){
    const productosAgrupados:any = [];

    pedidos.forEach((producto:any) => {
      const productoExistente = productosAgrupados.find((p:any) => p.nombre === producto.nombre);

      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        productosAgrupados.push({
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
        });
      }
    });

    return productosAgrupados;
  }
}