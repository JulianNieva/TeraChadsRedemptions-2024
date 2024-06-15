import { Usuario } from "./usuario";

export class Cliente extends Usuario 
{
    nombre : string
    apellido : string
    dni : number
    imagen : string
    aprobado : boolean
    enFila : boolean
    
    constructor(uid : string = "", correo : string = "", clave : string = "", perfil : string = "", 
        nombre : string = "", apellido : string = "", dni : number = 0, imagen : string = "", aprobado : boolean = false, enFila = false) {
        super(uid, correo, clave, perfil)
        this.nombre = nombre
        this.apellido = apellido
        this.dni = dni
        this.imagen = imagen
        this.aprobado = aprobado
        this.enFila = enFila
    }

    override toFireStore() {
        return JSON.parse(JSON.stringify(this))
    }
}