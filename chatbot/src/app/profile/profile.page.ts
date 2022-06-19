import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { tap, take, map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  user: User;
  sub: Subscription;
  isLoading = false;
  constructor(private authService: AuthService, private afs: AngularFirestore) { }

  ngOnInit() {
    //this.authService.userId.subscribe(userId => {})
    this.isLoading = true;
    /*this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        return this.afs.doc<User>('Projects/'+userId).valueChanges();
      }),
      map(user => {
        //this.user = new User(user.uid, user.email, user.nom, user.prenom, user.tel, user.poste);
        console.log('user : '+ user + ' this user : ' +this.user)
      })
    ).subscribe()*/
    this.sub = this.authService.userProfile.subscribe(user => {
      this.user = user;
      console.log(this.user);
      this.isLoading = false;
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
