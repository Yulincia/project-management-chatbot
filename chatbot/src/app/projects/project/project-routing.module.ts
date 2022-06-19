import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectPage } from './project.page';
import { TasksPage } from './tasks/tasks.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectPage,
    children: [
      {
        path: 'detail',
        loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
      },
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/tasks.module').then( m => m.TasksPageModule)
      },
      {
        path: 'members',
        loadChildren: () => import('./members/members.module').then( m => m.MembersPageModule)
      },
      {
        path: 'project-chat',
        loadChildren: () => import('./project-chat/project-chat.module').then( m => m.ProjectChatPageModule)
      },
      {
        path: '',
        redirectTo: 'detail',
        pathMatch: "full"
      }
    ]
  },
  {
    path: '',
    redirectTo: 'detail',
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectPageRoutingModule {}
