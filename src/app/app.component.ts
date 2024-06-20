import { Component,OnInit } from '@angular/core';
import { BaseDatosService } from './servicios/base-datos.service';
import { UserAuthService } from './servicios/user-auth.service';
import { NavController } from '@ionic/angular';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {



  constructor(public bd : BaseDatosService, private navCtrl: NavController, private auth : UserAuthService) {}

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


}
