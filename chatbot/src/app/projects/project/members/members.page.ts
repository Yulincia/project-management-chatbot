import { Component, OnInit, OnDestroy } from '@angular/core';
import { MembersService } from './members.service';
import { Member } from './member.model';
import { ModalController, IonItemSliding, NavController, LoadingController } from '@ionic/angular';
import { MemberComponent } from './member/member.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit, OnDestroy {

  loadedMembers: Member[];
  isLoading = false;
  projectId: string;
  private membersSub: Subscription;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private loadingCtrl: LoadingController, private membersService: MembersService, private modalCtrl: ModalController) { }

  ngOnInit() {
    //this.loadedMembers = this.membersService.members;
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('projectId')) {
        this.navCtrl.navigateBack('/projects');
        return;
      }
      this.projectId = paramMap.get('projectId');
      this.membersSub = this.membersService.members.subscribe(members => {
        this.loadedMembers = members;
        this.isLoading = false;
      })
    })
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.membersService.fetchMembers(this.projectId).subscribe(() => {
      this.isLoading = false;
    });
  }

  onSelectMember(member: Member) {
    this.modalCtrl
      .create({component: MemberComponent, componentProps: { selectedMember: member }})
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

  onAddMember() {
    this.modalCtrl
      .create({component: AddMemberComponent, componentProps: { projectId: this.projectId }})
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

  onDeleteMember(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    console.log('Deleting Member : ' + id);
    this.loadingCtrl.create({
      message:  'Deleting member...'
    }).then(loadingEl => {
      loadingEl.present();
      this.membersService.deleteMember(this.projectId, id).then(() => {
        loadingEl.dismiss();
      })
    })
  }

  ngOnDestroy() {
    if (this.membersSub) {
      this.membersSub.unsubscribe();
    }
  }

}
