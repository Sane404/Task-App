import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TaskApp';
  defaultIMGPath = '../Task-App/assets/DefaultUser.svg';
  constructor(public auth:AuthService){}
  get User(){
    let user = JSON.parse(localStorage.getItem('user'));
    return user;
  }
}
