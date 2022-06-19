import { Component, OnInit } from '@angular/core';
import { Member } from '../member.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.page.html',
  styleUrls: ['./member-detail.page.scss'],
})
export class MemberDetailPage implements OnInit {
  member: Member;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private membersService: MembersService) { }

  ngOnInit() {
    // console.log(this.route.snapshot.params['memberId']);
    // this.route.paramMap.subscribe(paramMap => {
    //   if (!paramMap.has('memberId')){
    //     this.navCtrl.navigateBack('/projects');
    //     return;
    //   }
    //   //this.member = this.membersService.getMember(paramMap.get('memberId'));
    //   console.log(this.member);
    // });
  }

}
