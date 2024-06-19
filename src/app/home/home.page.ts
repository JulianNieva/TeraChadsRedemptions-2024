import { Component, OnDestroy } from '@angular/core';
import { Usuario } from '../clases/usuario';
import { Administrador } from '../clases/administrador';
import { Empleado } from '../clases/empleado';
import { BaseDatosService } from '../servicios/base-datos.service';
import { Cliente } from '../clases/cliente';

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
    enFila:false
  }

  constructor(public bd : BaseDatosService) {
      this.TraerUsuario()
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
        })
      break;
    }
   }

   // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
   ngOnDestroy(){
    
  }


}
