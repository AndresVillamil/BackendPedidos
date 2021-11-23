import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AutenticacionService} from '../services';


export class EstrategiaAdministrador implements AuthenticationStrategy{
  name: string = 'admin';

constructor(
  @service(AutenticacionService)
  public servicioAutenticacion : AutenticacionService
){

}

  async authenticate(request:Request): Promise<UserProfile | undefined>{
    let token=parseBearerToken(request);//información del token = Datos
    if(token){
      let datos = this.servicioAutenticacion.ValidarTokenJWT(token);
      if(datos){
        let perfil:UserProfile=Object.assign({
          nombre: datos.data.nombre
        });
        return perfil;
      }else{
        throw new HttpErrors[401]("El token enviado no es valido")
      }
    }else{
      throw new HttpErrors[401]("En su solicitud no hay un token")
    }

  }
}
