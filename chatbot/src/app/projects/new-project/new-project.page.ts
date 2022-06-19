import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProjectsService } from '../projects.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.page.html',
  styleUrls: ['./new-project.page.scss'],
})
export class NewProjectPage implements OnInit {

  constructor(private projectsService: ProjectsService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onCreateProject() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const title = form.value.title;
    const description = form.value.description;

    this.loadingCtrl.create({
      message: 'Creating project...'
    }).then(loadingEl => {
      loadingEl.present();
      this.projectsService.addProject(title,description).subscribe(() => {
        loadingEl.dismiss();
        form.reset();
        this.router.navigateByUrl('/');
      });
    });
  }

}
