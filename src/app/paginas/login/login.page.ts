import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Cliente } from 'src/app/clases/cliente';
import { Usuario } from 'src/app/clases/usuario';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { UserAuthService } from 'src/app/servicios/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  constructor(private toastController:ToastController,private authService:UserAuthService,private navCtrl:NavController,private ruta : Router,private bd : BaseDatosService) { } 

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  imgUsuarioSelecionado = "../../assets/imagenes/icon.png";
  barraCarga = false;

  correo = "";
  clave = "";


  logIn(){ 
    this.barraCarga = true;
    setTimeout(() => {
      if(this.correo != "" || this.clave != "")
      {
        //Faltaria almacenar la info del usuario logueado en el servicio una vez que se inicio sesión
        //para acceder a su rol y datos
        this.authService.SignIn(this.correo,this.clave).then(() => {

          // By JERO: Toma el correo y trae el usuario de la BD, Si es Cliente Verifica que este "Aprobado" sino tira un Error por eso el uso de Try,Catch
          // Si no es un cliente y si es un cliente aprobado llama al metodo LogIn del servicio BD y setea la variable public log = true, userLogUid = "uid del usuario" y userType = "tipo de usuario"
          this.bd.TraerUsuariosPorCorreo(this.correo).then((user : Usuario) => {
            console.log(user)
    
            if(user.perfil === "Cliente") {
              this.bd.TraerClientePorUid(user.uid).then((cliente : Cliente) => {
                if(cliente.aprobado) {
                  this.bd.LogIn(user)
                  this.presentToast("top","Sesión iniciada con éxito!","success").then(() => {
                    setTimeout(() => {
                      this.barraCarga = false;
                      this.navCtrl.navigateRoot(['/home'])
                      navigator.vibrate(500)
                    },2000)
                  })
                }else{
                  this.presentToast("top","ERROR! Usuario no Aprobado!","danger")
                  this.barraCarga = false;
                  navigator.vibrate(1000)
                }
              })
            } else {
              this.bd.LogIn(user)
              this.presentToast("top","Sesión iniciada con éxito!","success").then(() => {
                setTimeout(() => {
                  this.barraCarga = false;
                  this.navCtrl.navigateRoot(['/home'])
                  navigator.vibrate(500)
                },2000)
              })
            }
          })
        }).catch((err:any) => {
          this.presentToast("top",this.authService.ObtenerMensajeError(err.code),"danger")
          this.barraCarga = false;
          navigator.vibrate(1000)
        })
      }
      else{
        this.barraCarga = false;
        this.presentToast("top","¡Asegurese de completar todos los campos!","danger")
        navigator.vibrate(1000)
      }
    }, 1000);
  }

  Registrar() {
    this.ruta.navigateByUrl("registro-cliente")
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

  Metre(){
    this.correo = "metre@gmail.com";
    this.clave = "metre123";
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

  async presentToast(position:"top", message = "", color = "danger"){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
      color : color,
    });

    await toast.present();
  }

}
