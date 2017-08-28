import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'user-edit',
  templateUrl: '../views/user-edit.html',
  providers: [UserService]
})
export class UserEditComponent implements OnInit{
  public title: string;
  public user: User;
  public identity; 
  public token; 
  public alertMessage; 

  constructor (
    private _userService: UserService
  ){
    this.title = 'Actualizar mis datos';
    // LocalStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
  }

  ngOnInit(){
    
  }

  onSubmit(){
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.userUpdated) {
          this.alertMessage = 'El usuario no se ha actualizado.';
        }else {
          this.user = response.userUpdated;
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.alertMessage = 'Datos actualizados correctamente.';
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage !== null){
          var body = JSON.parse(error._body);
          this.alertMessage = body.message;
          console.log(errorMessage);
        }
      }
    );
  }

}
