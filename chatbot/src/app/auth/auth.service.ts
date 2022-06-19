import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, from, of, Observable } from 'rxjs';
import { User } from './user.model';
import { map, tap, switchMap, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?:	boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User>(null);
  private user: Observable<User>;

  constructor(
    private http: HttpClient, 
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
    ) {}

  initAuthListener() {
    return this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            // console.log('user '+user.uid);
            this._user.next(user);
            this.user = this.afs.doc<User>(`users/${user.uid}`).valueChanges();
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            this._user.next(null);
            this.router.navigateByUrl('/auth');
            return of(null);
          }
        })
    );
  }

  get userProfile() {
    return this.user.pipe(
      //take(1),
      map(user => {
        //console.log(user);
        return new User(user.uid, user.email, user.nom, user.prenom, user.tel, user.poste, user.projects);
      })
    )
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        console.log(user.uid);
        return user.uid;
      } else {
        return null;
      }
    }));
  }

  signup(email: string, password: string, nom: string, prenom: string, tel: string, poste: string) {
    /*return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
      {email: email, password: password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)));*/
    //return this.afAuth.createUserWithEmailAndPassword(email, password);
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(result => {
      this._user.next(result.user);
      return this.setUserData(result.user, nom, prenom, tel, poste);
    });
  }

  private setUserData(user: firebase.User, nom: string, prenom: string, tel: string, poste: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      nom: nom,
      prenom: prenom,
      tel: tel,
      poste: poste,
      projects: []
    }
    return userRef.set(JSON.parse(JSON.stringify(userData)))
  }

  login(email: string, password: string) {
    /*return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
      {email: email, password: password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)));*/
    return this.afAuth.signInWithEmailAndPassword(email, password).then(result => {
      this._user.next(result.user);
    });
  }

  logout() {
    /*if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});*/
    this._user.next(null);
    this.afAuth.signOut();
    this.router.navigateByUrl('/auth');
  }

  /*private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const data = JSON.stringify({userId: userId, token: token, tokenExpirationDate: tokenExpirationDate, email: email});
    Plugins.Storage.set({key: 'authData', value: data});
  }*/
}
