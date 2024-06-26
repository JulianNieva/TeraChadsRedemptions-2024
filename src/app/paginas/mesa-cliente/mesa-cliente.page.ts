import { Component, OnInit } from '@angular/core';
import { IonThumbnail, ToastController } from '@ionic/angular';
import { Cliente } from 'src/app/clases/cliente';
import { Mesa } from 'src/app/clases/mesa';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { QrService } from 'src/app/servicios/qr.service';

@Component({
  selector: 'app-mesa-cliente',
  templateUrl: './mesa-cliente.page.html',
  styleUrls: ['./mesa-cliente.page.scss'],
})
export class MesaClientePage {

  cliente : Cliente = new Cliente
  mesa : Mesa = new Mesa
  productos:any
  loading:boolean = false;
  mesaVinculada = false
  listadoProductos = false;
  pedido:any = null;

  constructor(public bd : BaseDatosService, private toastController : ToastController, public qr : QrService) {
    ///Obtengo la mesa del user logeado pero primero traigo el cliente logeado (corregir cuando se maneje el nuevo log)
    this.loading = true
    let cli = this.bd.Getlog()
    if(cli !== null){
      this.cliente = cli as Cliente
      this.bd.TraerUnaMesaPorNumero(this.cliente.mesa_asignada).then((m) => {
        this.mesa = m

        console.info(this.mesa)

        this.bd.TraerUnPedidoPorMesa(this.mesa.numero).subscribe((res) => {
          this.pedido = res;
          console.info(this.pedido)
          this.loading = false
        })

        if(this.mesa.cliente_uid === this.cliente.uid){
          this.presentToast("top","Bienvenido a su mesa","primary")
          this.mesaVinculada = true
        }else{
            this.presentToast("top","Mesa Aun no Vinculada! Escanee su QR","warning")
        }
      })
    }

  }

  async presentToast(position : 'top' | 'middle', message = "", color = "danger"){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
      color : color,
    });

    await toast.present()
  }

  //Consulta al Mozo, Te redirige al chat general para mandar un mensaje
  ConsultarMozo(){
    
  }

  //Ver encuestas
  VerEncuestas(){

  }

  MostrarProductos(){
    this.loading = true;
    this.mesaVinculada = false;
    this.bd.TraerProductos().subscribe((data) => {
      if(data)
        {
          this.loading = false;
          this.productos = data
          this.listadoProductos = true;
          console.info(this.productos)
        }
    })
  }

  PedidoCargado($event:any)
  {
    this.loading = true;
    this.listadoProductos = false;
    this.mesaVinculada = true;
    const pedidoParcial = $event;
    this.bd.TraerUnPedidoPorMesa(pedidoParcial.mesa).subscribe((res) => {
      if(res)
        this.pedido = res;
        console.info(this.pedido)
        this.loading = false;
        this.presentToast("middle","Pedido realizado con éxito!. Compruebe su estado escaneando el QR","primary")
    })
  }

  // Escan del qr para poder ver la carta y realizar el pedido.
  // Una vez realizado poder ver el estado del pedido...
  async ScanMesa(){
    await this.qr.StartScan()
    try{
      let resultado = this.qr.scanResult;
      //this.loading = false;
      if(resultado){
        await this.RevisarPedido(resultado)
        //this.loading = false;
      }
    } catch(error) {
      console.log(error)
    }
  }

  async RevisarPedido(resultado:any)
  {
    if(resultado == this.mesa.numero)
    {
      switch (this.pedido.estado) {
        case "revision":
          this.presentToast("middle","Su pedido está en proceso de revisión","primary")
          break;
        case "preparacion":
          this.presentToast("middle",`Su pedido está siendo preparado. Tiene un tiempo estimado de: ${this.pedido.tiempoPreparacion} minutos`,"primary")
          break;
        case "cocinado":
          this.presentToast("middle",`Su pedido está listo. Espere a recibirlo`,"primary")
        break;
      }
    }
    else{
      this.presentToast("middle","¡No es su mesa asignada!","danger")
    }
  }

}
