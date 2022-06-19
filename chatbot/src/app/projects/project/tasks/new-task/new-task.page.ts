import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TasksService } from '../tasks.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.page.html',
  styleUrls: ['./new-task.page.scss'],
})
export class NewTaskPage implements OnInit {
  projectId: string;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService, 
    private router: Router,
    private navCtrl: NavController,
    private location:Location, 
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('projectId')) {
        this.navCtrl.navigateBack('/projects');
      return;
      }
      this.projectId = paramMap.get('projectId');
      console.log(this.projectId);
    });
  }

  onCreateTask() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const title = form.value.title;
    const description = form.value.description;
    const status = form.value.status;
    const priority = form.value.priority;

    this.loadingCtrl.create({
      message: 'Adding task...'
    }).then(loadingEl =>{
      loadingEl.present();
      this.tasksService.addTask(this.projectId, title, description, status, priority).then(() => {
        loadingEl.dismiss();
        form.reset();
        this.router.navigate(['projects',this.router.url.split('/')[2],'tasks']);
        //this.location.back();
      });
    });
  }
}
