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
  public errorMessage; 

  constructor (
    private _userService: UserService
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  	this.user = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this.title = 'Actualizar mis datos';
  }


}
