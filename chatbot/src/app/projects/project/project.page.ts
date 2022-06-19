import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '../project.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ProjectsService } from '../projects.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit, OnDestroy {
  projectId: string;
  projectSelected: Project;
  private projectsSub: Subscription;

  constructor(private alertCtrl: AlertController, private route: ActivatedRoute, private navCtrl: NavController, private projectsService: ProjectsService, private router: Router) { }

  ngOnInit() {
    /*this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('projectId')){
        this.navCtrl.navigateBack('/projects');
        return;
      }*/
      /*this.project = this.projectsService.projects.find(
        p => p.id === paramMap.get('projectId')
      );*/

      //this.projectSelected = this.projectsService.getProject(paramMap.get('projectId'));
      /*this.projectsSub = this.projectsService.getProject(paramMap.get('projectId')).subscribe(project => {
        this.projectSelected = project;
      }, error => {
        this.alertCtrl.create({
          header: 'An Error Occured', 
          message: 'Project could not be fetched, please try again later.', 
          buttons: [{text: 'Okay', handler: () => {
            this.router.navigateByUrl('/projects');
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      });*/

      //console.log(this.projectSelected);
      //console.log(this.route.snapshot.params['projectId']);
      /*let navigationExtras: NavigationExtras = {state: {project: this.projectSelected}};
      this.projectId = paramMap.get('projectId');
      this.router.navigate(['projects',this.projectId,'detail'], navigationExtras);*/
    //});
  }

  ngOnDestroy() {
    /*if (this.projectsSub) {
      this.projectsSub.unsubscribe();
    }*/
  }

}
