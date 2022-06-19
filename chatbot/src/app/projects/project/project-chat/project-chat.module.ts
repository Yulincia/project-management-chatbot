import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectChatPageRoutingModule } from './project-chat-routing.module';

import { ProjectChatPage } from './project-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectChatPageRoutingModule
  ],
  declarations: [ProjectChatPage]
})
export class ProjectChatPageModule {}
