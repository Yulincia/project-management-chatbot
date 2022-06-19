import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsPage } from './projects.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectsPage,
  },
  {
    path: 'new-project',
    loadChildren: () => import('./new-project/new-project.module').then( m => m.NewProjectPageModule)
  },
  {
    path: ':projectId',
    loadChildren: () => import('./project/project.module').then( m => m.ProjectPageModule)
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsPageRoutingModule {}
