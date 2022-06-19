import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from './project.model';
import { ProjectsService } from './projects.service';
import { IonItemSliding, ModalController, LoadingController } from '@ionic/angular';
import { EditProjectComponent } from './project/detail/edit-project/edit-project.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit, OnDestroy {

  loadedProjects : Project[];
  isLoading = false;
  private projectsSub: Subscription;

  constructor(private projectsService: ProjectsService, private modalCtrl: ModalController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    //this.loadedProjects = this.projectsService.projects;
    this.isLoading = true;
    this.projectsSub = this.projectsService.projects.subscribe(projects => {
      this.loadedProjects = projects;
      console.log(this.loadedProjects)
      this.isLoading = false;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.projectsService.fetchProjects().subscribe(() => {
      console.log('fetching')
      this.isLoading = false;
    });
  }

  onDeleteProject(id: string, slidingItem?: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl.create({
      message: 'Deleting project...'
    }).then(loadingEl => {
      loadingEl.present();
      //console.log('presented');
      this.projectsService.deleteProject(id).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  onEditProject(project: Project, slidingItem: IonItemSliding) {
    const projectSelected = project;
    console.log('Editting Project : ' + projectSelected.id);
    this.modalCtrl
      .create({component: EditProjectComponent, componentProps: { selectedProject: projectSelected }})
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

  ngOnDestroy() {
    if (this.projectsSub) {
      this.projectsSub.unsubscribe();
    }
  }

}
