export class Usuario 
{
    uid : string
    correo : string
    clave : string
    perfil : string

    constructor(uid : string = "", correo : string = "", clave : string = "", perfil : string = "") { 
        this.uid = uid
        this.correo = correo
        this.clave = clave
        this.perfil = perfil
    }

    toFireStore() {
        return JSON.parse(JSON.stringify(this))
    }

}