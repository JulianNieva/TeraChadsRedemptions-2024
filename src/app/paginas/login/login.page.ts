import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { UserAuthService } from 'src/app/servicios/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  constructor(private toastController:ToastController,private authService:UserAuthService,private navCtrl:NavController) { } 

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  async presentToast(position:"top", message = "", color = "danger"){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
      color : color,
    });

    await toast.present();
  }

  imgUsuarioSelecionado = "../../assets/imagenes/icon.png";
  barraCarga = false;

  correo = "";
  clave = "";


  logIn(){
    //Juli (ALFA) lo completa
  }


  resetAvatar(){
    this.Default();
  }
  
  Propietario(){
    this.correo = "propietario@gmail.com";
    this.clave = "propietario123";
    this.imgUsuarioSelecionado = "../../assets/imagenes/propietario.png";
  }

  Supervisor(){
    this.correo = "supervisor@gmail.com";
    this.clave = "supervisor123";
    this.imgUsuarioSelecionado = "../../assets/imagenes/supervisor.png";
  }

  Empleado(){
    this.correo = "empleado@gmail.com";
    this.clave = "empleado123";
    this.imgUsuarioSelecionado = "../../assets/imagenes/empleado.png";
  }

  Cliente(){
    this.correo = "cliente@gmail.com";
    this.clave = "cliente123";
    this.imgUsuarioSelecionado = "../../assets/imagenes/cliente.png";
  }

  Anonimo(){
    this.correo = "anonimo@gmail.com";
    this.clave = "anonimo123";
    this.imgUsuarioSelecionado = "../../assets/imagenes/anonimo.png";
  }

  Default(){
    this.correo = "";
    this.clave = "";
    this.imgUsuarioSelecionado = "../../assets/imagenes/icon.png";
  }

  BarraCarga(){
    if(this.barraCarga)
    {
      this.barraCarga = false;
    }else{
      this.barraCarga = true;
    }
  }

}
