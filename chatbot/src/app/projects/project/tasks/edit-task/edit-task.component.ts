import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Task } from '../task.model';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {
  @Input() selectedTask: Task;
  projectId: string;

  constructor(private modalCtrl: ModalController, private tasksService: TasksService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    //console.log(this.selectedTask)
    console.log(this.projectId);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const title = form.value.title;
    const description = form.value.description;
    const status = form.value.status;
    const priority = form.value.priority;

    this.loadingCtrl.create({
      message: 'Updating task...'
    }).then(loadingEl => {
      loadingEl.present();
      this.tasksService.updateTask(this.projectId, this.selectedTask.id, title, description, status, priority).subscribe(() => {
        loadingEl.dismiss();
        this.modalCtrl.dismiss({edittedTask: {
          id: this.selectedTask.id,
          title: title,
          description: description,
          status: status,
          priority: priority
        }}, 'confirm');
      });
    });

    /*this.modalCtrl.dismiss({edittedTask: {
      id: this.selectedTask.id,
      title: title,
      description: description,
      status: status,
      priority: priority
    }}, 'confirm');*/
  }
  onTaskEdit() {}

}
