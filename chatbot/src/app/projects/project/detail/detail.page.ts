import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../project.model';
import { ProjectsService } from '../../projects.service';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {
  projectId: string;
  project: Project;
  isLoading = false;
  private projectSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute, 
    private router: Router, 
    private projectsService:ProjectsService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) {
    /*this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.projectSelected = this.router.getCurrentNavigation().extras.state.project;
        console.log(this.projectSelected);
      }
    });*/
   }

  ngOnInit() {
    //console.log(this.route.snapshot.parent.params['projectId']);
    //this.route.parent.params.subscribe(params => console.log(params));
    //console.log(this.route.snapshot.url);
    //-----------------------------
    //console.log(this.router.url.split('/')[2]);
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('projectId')) {
        this.navCtrl.navigateBack('/projects');
      return;
      } else {
        this.isLoading = true;
        this.projectId = paramMap.get('projectId');
        this.projectSub = this.projectsService
          .getProject(this.projectId)
          .subscribe(project => {
            this.project = project;
            this.isLoading = false;
          }, error => {
            //console.log(error);
            this.alertCtrl.create({
              header: 'An Error Occured', 
              message: 'Project could not be fetched, please try again later.', 
              buttons: [{text: 'Okay', handler: () => {
                this.router.navigateByUrl('/projects');
              }}]
            }).then(alertEl => {
              alertEl.present();
            });
          });
      }
    });

    /*this.isLoading = true;
    if (!this.router.url.split('/')[2]) {
      this.navCtrl.navigateBack('/projects');
      return;
    }
    this.projectId = this.router.url.split('/')[2];
    //this.isLoading = true;
    this.projectSub = this.projectsService
      .getProject(this.projectId)
      .subscribe(project => {
        this.project = project;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An Error Occured', 
          message: 'Project could not be fetched, please try again later.', 
          buttons: [{text: 'Okay', handler: () => {
            this.router.navigateByUrl('/projects');
          }}]
        }).then(alertEl => alertEl.present());
      });*/
  }

  ionViewWillEnter() {}

  onEditProject() {
    const prjt = {...this.project}
    this.modalCtrl
      .create({component: EditProjectComponent, componentProps: { selectedProject: prjt }})
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          console.log('Editted !');
        }
      });
  }

  ngOnDestroy() {
    if (this.projectSub) {
      this.projectSub.unsubscribe();
    }
  }

}
