import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/projects/project.model';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ProjectsService } from 'src/app/projects/projects.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
})
export class EditProjectComponent implements OnInit {

  @Input() selectedProject: Project;

  constructor(private modalCtrl: ModalController, private projectsService: ProjectsService, private loadingCtrl: LoadingController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onEdit() {
    this.modalCtrl.dismiss({message: 'we can pass data here'}, 'confirm');
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const title = form.value.title;
    const description = form.value.description;

    this.loadingCtrl.create({
      message: 'Updating project...'
    }).then(loadingEl => {
      loadingEl.present();
      this.projectsService.updateProject(this.selectedProject.id, title, description).subscribe(() => {
        loadingEl.dismiss();
        this.modalCtrl.dismiss({edittedProject: {
          id: this.selectedProject.id,
          title: title,
          description: description
        }}, 'confirm'); 
      });
    });

    /*this.modalCtrl.dismiss({edittedProject: {
      id: this.selectedProject.id,
      title: title,
      description: description
    }}, 'confirm');*/
  }
  onProjectEdit() {
    console.log('edit');
  }

}
