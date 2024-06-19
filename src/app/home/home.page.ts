import { Component, OnDestroy } from '@angular/core';
import { Usuario } from '../clases/usuario';
import { Administrador } from '../clases/administrador';
import { Empleado } from '../clases/empleado';
import { BaseDatosService } from '../servicios/base-datos.service';
import { Cliente } from '../clases/cliente';
import { QrService } from '../servicios/qr.service';
import { UserAuthService } from '../servicios/user-auth.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  usuario : any = {
    nombre:"",
    apellido:"",
    imagen:{path:""},
    dni:0,
    cuil:0,
    perfil:"",
    tipo:"",
    enFila:false,
  }

  cliente : Cliente = new Cliente

  constructor(public bd : BaseDatosService, public qr : QrService, public auth : UserAuthService, private navCtrl: NavController, private toastController : ToastController) {
      this.TraerUsuario()
   }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {

  }

   TraerUsuario() {
    switch(this.bd.userType){
      case "Propietario":
        this.bd.TraerAdministradoresPorUid(this.bd.userLogUid).then((user : Administrador) => {
          this.usuario = user
        })
      break

      case "Supervisor":
        this.bd.TraerAdministradoresPorUid(this.bd.userLogUid).then((user : Administrador) => {
          this.usuario = user
        })
      break;

      case "Empleado":
        this.bd.TraerEmpleadoPorUid(this.bd.userLogUid).then((user : Empleado) => {
          this.usuario = user
        })
      break;

      case "Cliente":
        this.bd.TraerClientePorUid(this.bd.userLogUid).then((user : Cliente) => {
          this.usuario = user
          this.cliente = user
        })
      break;
    }
   }

   async ScanQrLocal(){

    if(!this.cliente.enFila) {
        // Al no estar en Fila Busca Scanear el QR de Ingreso
        await this.qr.StartScan()
        try {

          let rtobj = JSON.parse(this.qr.scanResult)
    
          if(rtobj.solicitar_mesa){
            this.usuario.enFila = true
            this.cliente.enFila = true
            this.bd.ModificarFilaCliente(this.cliente.uid,true)
          }

        }
        catch(e) {
            this.presentToast("top","QR Invalido!")
        }
    } else {
        // Al estar en Fila busca escanear el QR de una Mesa
        await this.qr.StartScan()
        try {
          this.MesaAsignada(parseInt(this.qr.scanResult))
        }
        catch(e) {
            this.presentToast("top","QR Invalido!")
        }

      }
    }

    MesaAsignada(mesa: number){
    
    this.bd.TraerClientePorUid(this.cliente.uid).then((cli) => {
      this.cliente = cli
      this.usuario = cli
      if(this.cliente.mesa_asignada === mesa) {
        this.presentToast("middle","Mesa Asiganda!","success")
      } else if(this.cliente.mesa_asignada === 0){
        this.presentToast("middle","No Tiene Mesa Asiganda!")
      } else {
        this.presentToast("middle","Mesa Asignada Incorrecta!","warning")
      }
    })

   }

   SalirDeFila(){
    this.usuario.enFila = false
    this.cliente.enFila = false
    this.bd.ModificarFilaCliente(this.cliente.uid,false)
  }

  VerEncuestas(){

  }

  // Salir(){
  //   navigator.vibrate(500)
  //   this.auth.LogOut()
  //   this.bd.LogOut()
  //   this.navCtrl.navigateRoot(['/login'])
  // }


  async presentToast(position : 'top' | 'middle', message = "", color = "danger"){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
      color : color,
    });

    await toast.present();
  }

}
