import { Component } from '@angular/core';
import { BaseDatosService } from './servicios/base-datos.service';
import { UserAuthService } from './servicios/user-auth.service';
import { NavController, Platform } from '@ionic/angular';
import { PushNotificationService } from './servicios/push-notification.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public bd : BaseDatosService, private navCtrl: NavController, private auth : UserAuthService, private notifiaciones : PushNotificationService, private plataform : Platform) {

    this.plataform.ready().then(() => {
      if(this.plataform.is('android')){
        this.notifiaciones.addListeners()
        this.notifiaciones.registerNotifications()
        this.notifiaciones.getDeliveredNotifications()
      }
    })

  }

  Salir() {
    navigator.vibrate(500)
    this.auth.LogOut()
    this.bd.LogOut()
    this.navCtrl.navigateRoot(['/login'])
  }

  AprobarClientes() {
    this.navCtrl.navigateRoot(['/aprobacion-clientes'])
  }

  FilaClientes() {
    this.navCtrl.navigateRoot(['/fila-clientes'])
  }

  SolicitarMesa() {
    this.navCtrl.navigateRoot(['/solicitar-mesa'])
  }

  HomePage(){
    this.navCtrl.navigateRoot(['/home'])
  }

  MostrarChat()
  {
    this.navCtrl.navigateRoot(['/chat'])
  }

  MostrarMesaCliente()
  {
    this.navCtrl.navigateRoot(['/mesa-cliente'])
  }

  MostrarPedidosMozo()
  {
    this.navCtrl.navigateRoot(['/listado-pedidos-mozo'])
  }

}



