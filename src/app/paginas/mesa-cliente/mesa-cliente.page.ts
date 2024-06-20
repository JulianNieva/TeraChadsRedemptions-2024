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
  mesaVinculada = false

  constructor(public bd : BaseDatosService, private toastController : ToastController, public qr : QrService) {
    ///Obtengo la mesa del user logeado pero primero traigo el cliente logeado (corregir cuando se maneje el nuevo log)

    let cli = this.bd.Getlog()
    if(cli !== null){
      this.cliente = cli as Cliente
      this.bd.TraerUnaMesaPorNumero(this.cliente.mesa_asignada).then((m) => {
        this.mesa = m

        if(this.mesa.cliente_uid === this.cliente.uid){
            this.presentToast("top","Bienvenido a su mesa","primary")
            this.mesaVinculada = true
        }else{
            this.presentToast("top","Mesa Aun no Vinculada! Escanee su qr","warning")
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
  }

  //Consulta al Mozo, Te redirige al chat general para mandar un mensaje
  ConsultarMozo(){
    
  }

  //Ver encuestas
  VerEncuestas(){

  }


  // Escan del qr para poder ver la carta y realizar el pedido.
  // Una vez realizado poder ver el estado del pedido...
  async ScanMesa(){
    await this.qr.StartScan()
    try{

    } catch {

    }
  }

}
