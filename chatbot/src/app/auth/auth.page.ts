import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private loadingCtrl:LoadingController,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string, nom?: string, prenom?: string, tel?: string, poste?: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({keyboardClose: true, message: 'Logging in...'})
      .then(loadingEl => {
        loadingEl.present();
        //let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          this.authService.login(email, password).then(resData => {
            //console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/projects');
          }, errRes => {
            //console.log(errRes);
            loadingEl.dismiss();
            let message = errRes.message;
            /*const code = errRes.error.error.message;
            let message = 'Could not sign up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email adress already exists!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-mail could not be found.'
            } else if (code === 'INVALID_PASSWORD') {
              message = 'Password incorrect.'
            }*/
            this.showAlert(message);
          });
        } else {
          this.authService.signup(email, password, nom, prenom, tel, poste).then(resData => {
            //console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/projects');
          }, errRes => {
            loadingEl.dismiss();
            let message = errRes.message;
            /*const code = errRes.error.error.message;
            let message = 'Could not sign up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email adress already exists!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-mail could not be found.'
            } else if (code === 'INVALID_PASSWORD') {
              message = 'Password incorrect.'
            }*/
            this.showAlert(message);
          });
        }
        
      });
  }

  onSubmit(form: NgForm) {
    //console.log(form);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const nom = form.value.nom;
    if (!this.isLogin) {
      const prenom = form.value.prenom;
      const tel = form.value.tel;
      const poste = form.value.poste;
      this.authenticate(email, password, nom, prenom, tel, poste)
    } else {
      this.authenticate(email, password);
    }
    form.reset();
  }

  onSwitch() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

}
