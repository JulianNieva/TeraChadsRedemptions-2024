import { Component, OnInit } from '@angular/core';
import { QrService } from 'src/app/servicios/qr.service';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { Pedido } from 'src/app/clases/pedido';
import { NavController } from '@ionic/angular';
import { Mesa } from 'src/app/clases/mesa';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';
import { Cliente } from 'src/app/clases/cliente';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {

  mostrarCuenta = true;
  mostrarPropina = false;
  pedido:Pedido = new Pedido()
  propinaCargada:boolean = false;

  constructor(public qr : QrService,private bdSrv:BaseDatosService,private navCtrl:NavController,private pushSrv:PushNotificationService) {
    const pedidoString = localStorage.getItem("pedido");
    const pedido = pedidoString ? JSON.parse(pedidoString) : null;
    if(pedido != null)
      {
        this.pedido = pedido
        this.bdSrv.TraerUnPedidoPorMesa(this.pedido.mesa).subscribe((res:any) => {
          console.log(res)
          if(res.length != 0)
          {
            res.forEach((pe : Pedido) => {
              if(pe.estado !== "finalizado") {
                this.pedido = pe
                this.propinaCargada = this.pedido.porcentajePropina != 0;
              }
              else{
                this.bdSrv.TraerUnaMesaPorNumero(this.pedido.mesa).then((m:Mesa)=>{
                  let mesa = m
                  mesa.cliente_uid= "";
                  this.bdSrv.ModificarMesa(mesa)
                  this.bdSrv.ModificarClienteMesa(this.pedido.uidCliente,0)
                  console.log("Se fue")
                  let user = this.bdSrv.Getlog();
                  user.mesa_asignada = 0;
                  this.bdSrv.ActualizarLog(user as Cliente)
                  this.pushSrv.MensajePagoRealizado(user.token_mensajes).subscribe((res) => console.log(res))
                  localStorage.removeItem("pedido")
                  this.navCtrl.navigateRoot(['/home'])
                }) 
              }
          });
          }
        })
      }
  }

  ngOnInit() {}

  AgruparProductos(pedido: any[]): any[] {
    const productosAgrupados:any = [];

    pedido.forEach((producto) => {
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

  AgregarPropina(porcentajePropina:number)
  {
    const propinaTotal = (this.pedido.total * porcentajePropina) / 100;
    this.bdSrv.CargarPropinaPedido(this.pedido,porcentajePropina,propinaTotal)
    this.pedido.porcentajePropina = porcentajePropina
    this.pedido.propina = propinaTotal
    localStorage.setItem("pedido",JSON.stringify(this.pedido))
    this.mostrarPropina = false;
    this.mostrarCuenta = true;  
  }

  AlternarVista()
  {
    this.mostrarCuenta = false;
    this.mostrarPropina = true;
  }

  async ScanPropina(){
    this.qr.StartScan().then((res) => {
      try {
        console.log(this.qr.scanResult == "accederPropina")
        if(this.qr.scanResult == "accederPropina" && !this.propinaCargada)
        {
          this.AlternarVista()
          this.propinaCargada = true;
        }
        else if(this.qr.scanResult == "pago" && this.propinaCargada){
          this.Pagar()
        }
        else{

        }
      } 
      catch(error) {
        console.log(error)
      }
    })
  }

  Pagar()
  {
    this.bdSrv.ModificarEstadoPedido(this.pedido,"pendiente-pago")
    this.pedido.estado = "pendiente-pago"
  }

  // async presentToast(position : 'top' | 'middle', message = "", color = "danger"){
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: 2000,
  //     position: position,
  //     color : color,
  //   });

  //   await toast.present()
  // }

}
