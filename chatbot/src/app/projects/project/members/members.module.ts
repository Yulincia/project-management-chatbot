import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MembersPageRoutingModule } from './members-routing.module';

import { MembersPage } from './members.page';
import { MemberComponent } from './member/member.component';
import { AddMemberComponent } from './add-member/add-member.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MembersPageRoutingModule
  ],
  declarations: [MembersPage, MemberComponent, AddMemberComponent],
  entryComponents: [MemberComponent, AddMemberComponent]
})
export class MembersPageModule {}
