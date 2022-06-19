import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectChatPage } from './project-chat.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectChatPageRoutingModule {}
