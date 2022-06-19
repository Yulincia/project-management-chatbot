import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { IonItemSliding, ModalController, LoadingController, NavController } from '@ionic/angular';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit, OnDestroy {
  isLoading = false;
  projectId: string;
  role = 'role2'
  loadedTasks: Task[];
  private tasksSub: Subscription;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private tasksService: TasksService, private modalCtrl: ModalController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('projectId')) {
        this.navCtrl.navigateBack('/projects');
        return;
      }
      this.projectId = paramMap.get('projectId');
      this.tasksSub = this.tasksService.tasks.subscribe(tasks => {
        this.loadedTasks = tasks;
      });
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.tasksService.fetchTasks(this.projectId).subscribe(() => {
      this.isLoading = false;
    });
  }

  onDeleteTask(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl.create({
      message: 'Deleting Task...'
    }).then(loadingEl => {
      loadingEl.present();
      this.tasksService.deleteTask(this.projectId, id).then(() => {
        loadingEl.dismiss();
      });
    });
  }

  onEditTask(task: Task, slidingItem: IonItemSliding) {
    slidingItem.close();
    const taskSelected = {...task};
    console.log('Editting task : ' + taskSelected.id);
    this.modalCtrl
      .create({component: EditTaskComponent, componentProps: { selectedTask: taskSelected, projectId : this.projectId }})
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

  ngOnDestroy() {
    if (this.tasksSub) {
      this.tasksSub.unsubscribe();
    }
  }

}