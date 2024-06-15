import { Usuario } from "./usuario"

export class Duenio extends Usuario 
{
    nombre : string
    apellido : string
    dni : number
    cuil : number
    imagen : string

    
    constructor(uid : string = "", correo : string = "", clave : string = "", perfil : string = "",
         nombre : string = "", apellido : string = "", dni : number = 0, cuil : number = 0, imagen : string = "") {
        super(uid, correo, perfil, clave)
        this.nombre = nombre
        this.apellido = apellido
        this.dni = dni
        this.cuil = cuil
        this.imagen = imagen
    }

    override toFireStore() {
        return JSON.parse(JSON.stringify(this))
    }
}