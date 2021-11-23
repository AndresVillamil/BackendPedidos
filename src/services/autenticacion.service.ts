import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/Llaves';
import {Persona} from '../models';
import {PersonaRepository} from '../repositories';
const jwt = require("jsonwebtoken");
//import generatePassword from ('password-generator'); //una forma de importar
const generador = require("password-generator"); //Segunda forma de importar
const cryptoJS = require("crypto-js");


@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    //Instanciar un objeto
    @repository(PersonaRepository)
    public personaRepository : PersonaRepository
  ) {}

  /*
   * Add service methods here
   */

  GenerarClave(){
    let clave = generador(8, false);
    return clave;
  }

  CifrarClave(clave:string){
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  IdentificarPersona(usuario:string,clave: string){
    try{
      let p = this.personaRepository.findOne({where : {correo: usuario, clave: clave}});
      return p;
    }catch{
      return false;
    }
  }
  GenerarTokenJWT(persona : Persona){
    let token = jwt.sign({
      data: {
        id: persona.id,
        correo: persona.correo,
        nombre: persona.nombres + " " + persona.apellidos
      }
    }, Llaves.claveJWT)
    return token;
  }

  ValidarTokenJWT(token: string){
    try{
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    }catch{
      return false;
    }
  }
}
