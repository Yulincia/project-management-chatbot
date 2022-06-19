import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent implements OnInit {

  @Input() projectId: string;

  constructor(private alertctrl: AlertController, private modalCtrl:ModalController, private lodaingCtrl: LoadingController, private membersService: MembersService) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    this.lodaingCtrl.create({
      message: 'Adding Member...',
    }).then(loadingEl => {
      loadingEl.present();
      this.membersService.addMember(this.projectId, email).subscribe(() => {
        loadingEl.dismiss();
        this.modalCtrl.dismiss(null, 'submit');
      }, error => {
        loadingEl.dismiss();
        this.alertctrl.create({
          header: 'An error occured',
          message: 'Cannot find user',
          buttons: [{text: 'Okay', handler: () => {
            this.modalCtrl.dismiss(null, 'not-found');
          }}]
        }).then(alertEl => {
          alertEl.present();
        })
      })
    })
  }

  onAddMember() {}

}
