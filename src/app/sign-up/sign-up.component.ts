import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  showRegisterForm:boolean = true;
  constructor(public auth:AuthService) { }

  ngOnInit(): void {
  }
  switchForms(){
    this.showRegisterForm = !this.showRegisterForm;
  }
}
