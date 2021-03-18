import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user;
  constructor(private angularFireAuth: AngularFireAuth, private router: Router, private afs: AngularFirestore) {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    })
  }
  regUser(email, password) {
    this.angularFireAuth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.SetUserData(user.user);
        localStorage.setItem('user', JSON.stringify(user.user));
        this.router.navigate(['tasks']);
      })
      .catch((error) => {
        var errorMessage = error.message;
        window.alert(errorMessage);
      });
  }
  signInUser(email, password) {
    this.angularFireAuth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.SetUserData(user.user);
        localStorage.setItem('user', JSON.stringify(user.user));
        this.router.navigate(['tasks']);
        
      })
      .catch((error) => {
        var errorMessage = error.message;
        window.alert(errorMessage);
      });
  }
  isSignedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null ? true : false;
  }
  signOut() {
    this.angularFireAuth.signOut().then(() => {
      this.router.navigate(['signUp'])
    });
  }
  async updateUserProfile(name,url) {
    var user = await this.angularFireAuth.currentUser;
    user.updateProfile({
      displayName: name,
      photoURL: url
    }).then(()=>{
      this.SetUserData(user);
      localStorage.setItem('user', JSON.stringify(user));
      
    });
  }
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    return userRef.set(userData, {
      merge: true
    })
  }
  updateTasksArray(ID,task){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${ID}`);
    userRef.update({
      tasks: firebase.default.firestore.FieldValue.arrayUnion(task)
    })
  }
  removeTaskFromArray(ID,task){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${ID}`);
    userRef.update({
      tasks: firebase.default.firestore.FieldValue.arrayRemove(task)
    })
  }
  getCollection(ID){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${ID}`);
    return userRef.get().toPromise();
  }
  // test(task,value,ID){
  //   const userRef = <any>this.afs.doc(`users/${ID}`);
  //   return userRef.where("task", "array-contains", task).toPromise();
  // }
}
