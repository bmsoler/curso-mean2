import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'MUSIFY';
  public user: User;
  public identity; 
  public token; 
  public errorMessage;

  constructor (
    private _userService: UserService
  ){
  	this.user = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    //console.log(this.identity, this.token); 
  }

  public onSubmit(){

    //Conseguir los datos del usuario
    this._userService.singup(this.user).subscribe(
      response => {
        
        let identity = response.user;
        this.identity = identity;

        if (!this.identity) {
          alert('El usuario no está correctamente identificado');
        }else {

          //Crear elemento en el localstorage para tener al usuario en sesión
          localStorage.setItem('identity', JSON.stringify(identity));

          //Conseguir el token para enviarselo a cada petición http
          this._userService.singup(this.user, 'true').subscribe(
            response => {
              
              let token = response.token;
              this.token = token;

              if (this.token.lenght <= 0) {
                alert('El token no se ha generado correctamente');
              }else {
                //Crear elemento en el localstorage para tener el token disponible en sesión
                localStorage.setItem('token', token);
                //console.log(this.token, this.identity);
              }

            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage !== null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                //console.log(errorMessage);
              }
            }
          );// ###

        }

      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage !== null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(errorMessage);
        }
      }
    );
  }

  public logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }

}
