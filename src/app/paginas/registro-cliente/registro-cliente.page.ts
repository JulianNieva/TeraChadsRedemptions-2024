import { Component } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Cliente } from 'src/app/clases/cliente';
import { FotoUsuario } from 'src/app/interfaces/foto-usuario';
import { BaseDatosService } from 'src/app/servicios/base-datos.service';
import { FotoService } from 'src/app/servicios/foto.service';
import { QrService } from 'src/app/servicios/qr.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.page.html',
  styleUrls: ['./registro-cliente.page.scss'],
})
export class RegistroClientePage  {

  public forms : FormGroup
  private clientesBd = new Array<Cliente>;
  seSubioEnCelu: boolean = false;
  urlImagenesCel: string = "";

  /// FALTA HACER FUNCIONAR FIREBASE STORAGE, FOTO SERVICE, QUER SERVICE

  constructor(private fb : FormBuilder,private toastController : ToastController, private bd : BaseDatosService, 
    public cam : FotoService, private storage : Storage, public qr : QrService) {
    this.bd.TraerClientes().subscribe((clientes)=>{
      this.clientesBd = clientes as Array<Cliente>
    })
    this.forms = this.fb.group({
      nombre : ['',[
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
      ]],
      apellido : ['',[
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
      ]],
      dni : ['',[
        Validators.required,
        Validators.min(5000000),
        Validators.max(99000000),
      ]],
      clave : ['',[
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
      ]],
      correo : ['',[
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]],
    })

   }
  async presentToast(position: 'top', message = "", color = "danger"){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
      color : color,
    });

    await toast.present();
  }



  fotoTomada = false;
  barraCarga = false;
  nombre:string = "";
  apellido:string = "";
  dni:number = 0;
  cuil:number = 0;
  clave:string = "";
  correo:string = "";

  Registrar(){

    setTimeout(() => {
      if(!this.forms.invalid){
          let existe = false;
          for(let user of this.clientesBd){
              if(user.dni === this.dni){
                  existe = true;
                  break;
              }
          }
            if(!existe){
              let cliente  = new Cliente;
              cliente.nombre = this.nombre;
              cliente.apellido = this.apellido;
              cliente.dni = this.dni;
              cliente.clave = this.clave;
              cliente.correo = this.correo;
              cliente.perfil = "Cliente"

             // this.SubirUnaImagen(cliente)

              /*this.bd.AltaEmpleado(empleado)
              navigator.vibrate(500);
              this.presentToast("top","Empleado registrado con exito!!","success");*/
              
            }else{
              navigator.vibrate(1000);
              this.presentToast("top","ERROR!, Cliente ya existente!!");
            }
      }else{
        navigator.vibrate(1000);
        this.presentToast("top","ERROR!, Faltan datos!!");
      }
    }, 1000);
  }

  ScanQr() {
    this.qr.StartScan()
  }

  TomarFoto(){
    this.cam.agregarNuevaGaleria('empleado')
    this.fotoTomada = true;
  }

  public async showActionSheet(photo: FotoUsuario, position: number) {
    const actionSheet = await this.toastController.create({

      header: 'Fotos',
      buttons: [{
        text: 'Borrar',
        role: 'destructive',
        icon: 'trash',

        handler: () => {

          this.cam.deletePicture(photo, position);
          this.fotoTomada = false;
        }
      }, {

        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',

        handler: () => {
          // Nothing to do, action sheet is automatically closed
          }
      }]
    });
    await actionSheet.present();
  }


  // SubirUnaImagen(emp:Empleado,index = 0)
  // {
  //     const file =  this.cam.fotos[index]
  //     const imgRef = ref(this.storage,`imagenes/usuarios/${file.rutaArchivo}`);

  //     try{
  //       uploadString(imgRef,file.fotoCap,'data_url').then((rt:any)=>{

  //         this.seSubioEnCelu = false;

  //         this.TraerImagen(rt.metadata.name,emp)

  //       }).catch((error)=>{
  //         console.log(error)
  //       });
  //      }
  //      catch{
  //       this.urlImagenesCel =`imagenes/usuarios/file:/data/user/0/io.ionic.starter/files/` //funciona
  //       uploadString(imgRef,file.fotoCap,'base64').then((rt:any)=>{
  //         this.seSubioEnCelu = true;

  //         this.TraerImagen(rt.metadata.name,emp)

  //       }).catch((error)=>{
  //         console.log(error)
  //       });
  //      }
  // }

  // TraerImagen(img:any,emp:Empleado){
  
  //     let imgRef = ref(this.storage,'imagenes/usuarios/'+img);

  //     if(this.seSubioEnCelu){
  //       imgRef = ref(this.storage,this.urlImagenesCel+img);
  //     }
  
  //     getDownloadURL(imgRef).then((url:any) => {
  
  //       console.log(url)
  
  //       let imagen : any = {
  //         path:url,
  //         name:img,
  //         dniUser:emp.dni
  //       }
  
  //       emp.foto = imagen;

  //       this.bd.AltaEmpleado(emp)
  //       this.presentToast("top","Empleado registrado con exito!!","success");
  //       navigator.vibrate(500);
  //   }).catch((error)=>{
  //     this.presentToast("top","ERROR!, Fallo al obtener imagen !!" + JSON.stringify(error));
  //   })
  // }

}
