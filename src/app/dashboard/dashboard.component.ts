import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private afs: AngularFirestore, private auth: AuthService, private fb: FormBuilder) { }
  userInfo;
  dataRecieved:boolean = true;
  imgREGEXP = '^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|png)$';
  defaultIMG: string = '../../assets/DefaultUser.svg';
  ngOnInit(): void {
    this.getUserData();
  }
  getUserData() {
    let ID = JSON.parse(localStorage.getItem('user')).uid;
    this.auth.getCollection(ID).then(document => {
      this.userInfo = document.data();
      console.log(this.userInfo);
      
      if (this.userInfo.displayName == null) {
        this.userInfo.displayName = "Unknown";
      }
    })
  }
  updateData = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
    imgURL: ['', [Validators.required, Validators.pattern(this.imgREGEXP)]]
  });
  submit(form) {
    if (form.status == 'VALID') {
      let username = form.value.username;
      let url = form.value.imgURL;
      this.auth.updateUserProfile(username, url);
      this.dataRecieved = false;
      setTimeout(()=>{
        this.getUserData();
        this.dataRecieved = true;
      },1000);
    }
  }
  get username() { return this.updateData.get('username') }
  get imgURL() { return this.updateData.get('imgURL') }
}
