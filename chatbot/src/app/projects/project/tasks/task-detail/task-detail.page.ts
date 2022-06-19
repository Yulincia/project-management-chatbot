import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/projects/project.model';
import { Task } from '../task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { TasksService } from '../tasks.service';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {
  isLoading = false;
  projectId: string;
  task: Task;
  private taskSub: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private _location: Location, 
    private navCtrl: NavController, 
    private tasksService: TasksService, 
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    //console.log(this.router.url.split('/')[2]);
    //console.log(this.route.snapshot.params['taskId']);
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('taskId')  || !paramMap.has('projectId')){
        this.navCtrl.navigateBack('/projects');
        return;
      }
      this.isLoading = true;
      this.projectId = paramMap.get('projectId');
      this.taskSub = this.tasksService.getTask(paramMap.get('projectId'), paramMap.get('taskId'))
        .subscribe(task => {
          this.task = task;
          this.isLoading = false;
        }, error => {
          this.alertCtrl.create({
            header: 'An error Occured !',
            message: 'Could no fetch task, try again later.',
            buttons: [{text: 'Okay', handler: () => {
              this.router.navigate(['/projects',paramMap.get('projectId'),'tasks']);
            }}]
          }).then(alertEl => {
            alertEl.present();
          });
        });
    });
  }

  backClicked() {
    this._location.back();
  }

  onEditTask() {
    this.modalCtrl
      .create({component: EditTaskComponent, componentProps: { selectedTask: this.task, projectId : this.projectId }})
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

}
