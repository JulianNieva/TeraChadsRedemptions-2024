import { Usuario } from "./usuario";

export class Empleado extends Usuario 
{
    nombre : string
    apellido : string
    dni : number
    cuil : number
    imagen : string
    tipo : string

    
    constructor(uid : string = "", correo : string = "", clave : string = "", perfil : string = "",
        nombre : string = "", apellido : string = "", dni : number = 0, cuil : number = 0, imagen : string = "", tipo : string = "") {
       super(uid, correo, perfil, clave)
       this.nombre = nombre
       this.apellido = apellido
       this.dni = dni
       this.cuil = cuil
       this.imagen = imagen
       this.tipo = tipo
   }

    override toFireStore() {
        return JSON.parse(JSON.stringify(this))
    }
}