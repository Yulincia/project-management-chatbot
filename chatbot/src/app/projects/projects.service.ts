import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

interface ProjectData {
  description: string;
  title: string;
  userId: string;
  members?: string[]
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  /*private _projects: Project[] = [
    new Project("p1","Projet 1","Desciption projet 1",'abc'),
    new Project("p2","Projet 2","Desciption projet 2",'abc'),
    new Project("p3","Projet 3","Desciption projet 3",'abc')
  ];*/
  /*private _projects = new BehaviorSubject<Project[]>([
    new Project("p1","Projet 1","Desciption projet 1",'abc'),
    new Project("p2","Projet 2","Desciption projet 2",'abc'),
    new Project("p3","Projet 3","Desciption projet 3",'abc')
  ]);*/
  private _projects = new BehaviorSubject<Project[]>([]);
  //private _url = 'https://gestion-projets-56c05.firebaseio.com/projects.json';

  constructor(private authService: AuthService, private http: HttpClient, private db: AngularFirestore) { }

  fetchProjects() {
    // return this.db.collection<ProjectData>('Projects').snapshotChanges().pipe(
    //   map(resData => {
    //       const projects = [];
    //       /*for (const key in resData) {
    //         if (resData.hasOwnProperty(key)) {
    //           projects.push(new Project(key, resData[key].title, resData[key].description, resData[key].userId));
    //         }
    //       }*/
    //       resData.map(doc => {
    //         projects.push({
    //           id: doc.payload.doc.id,
    //           title: doc.payload.doc.data().title,
    //           description: doc.payload.doc.data().description,
    //           userId: doc.payload.doc.data().userId
    //         })
    //       })
    //       return projects;
    //   }),
    //   tap(projects => {
    //     this._projects.next(projects);
    //   }));


    // console.log(firebase.auth().currentUser)
    return this.authService.userProfile.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          throw new Error('No user id found!');
        } else {
          // const projects = [];
          let projectIds = user.projects;
          // console.log(projectIds)
          if (projectIds.length > 0) {
            // const projects = [];
            // console.log(this.db.collection('Projects', ref => ref.where(ref.id,'in',projectIds)));
            return this.db.collection<ProjectData>('Projects', ref => ref/*.where("userId","==",user.uid)*/.where(firebase.firestore.FieldPath.documentId(),'in',projectIds))
              .snapshotChanges().pipe(
                map(resData => {
                  //console.log(resData);
                  const projects = [];
                  resData.map(doc => {
                    projects.push({
                      id: doc.payload.doc.id,
                      title: doc.payload.doc.data().title,
                      description: doc.payload.doc.data().description,
                      userId: doc.payload.doc.data().userId
                    })
                  })
                  console.log('projects'+projects)
                  return projects;
                })/*,
                tap(projects => {
                  this._projects.next(projects)
                })*/
              )
          } else {
            const projects = [];
            this._projects.next(projects);
            return projects;
          }
        }
      }),
      tap(projects => {
        // console.log('projects ' + projects);
        this._projects.next(projects)
      })
    )
  }

  get projects() {
    //return [...this._projects];
    return this._projects.asObservable();
  }


  getProject(id :string){
    //return {...this._projects.find(p => p.id === id)};

    /*return this.projects.pipe(take(1), map(projects => {
      return {...projects.find(p => p.id === id)};
    }));*/

    return this.db.doc<ProjectData>('Projects/'+id).valueChanges().pipe(
      //take(1),
      map(resData => {
        //if (resData) {
          return new Project(id, resData.title, resData.description, resData.userId, resData.members);
        //} else {
        //  return null;
        //}
      })
    );

    /*return this.http.get<ProjectData>(`https://gestion-projets-56c05.firebaseio.com/projects/${id}.json`)
      .pipe(
        map(resData => {
          return new Project(id, resData.title, resData.description, resData.userId);
        })
      );*/
  }

  addProject(title: string, description: string) {
    let newProject: Project;
    return this.authService.userId.pipe(take(1), switchMap(async userId => {
      if (!userId) {
        throw new Error('No user id found!');
      } else {
        newProject = new Project(Math.random().toString(), title, description, userId);
        return await this.db.collection('Projects').add({...newProject,members: firebase.firestore.FieldValue.arrayUnion(userId), id: null}).then(async docRef => {
          await this.db.doc(`users/${userId}`).update({
            projects: firebase.firestore.FieldValue.arrayUnion(docRef.id)
          })
        });
      }
    })/*,
    switchMap(() => {
      return this.projects;
    }),
    take(1),
    tap(projects => {
      this._projects.next(projects.concat(newProject));
    })*/
    );
    /*let generatedId: string;
    let newProject: Project;
    return this.authService.userId.pipe(take(1), switchMap(userId => {
      if (!userId) {
        throw new Error('No user id found!');
      } else {
        newProject = new Project(Math.random().toString(), title, description, userId);
        return this.http
          .post<{name: string}>(this._url,{...newProject, id: null})
      }
    }),
    switchMap(resData => {
      generatedId = resData.name;
      return this.projects;
    }),
    take(1),
    tap(projects => {
      newProject.id = generatedId;
      this._projects.next(projects.concat(newProject));
    })
    );*/
    
    

    //this._projects.push(newProject);

    /*this.projects.pipe(take(1)).subscribe(projects => {
      this._projects.next(projects.concat(newProject));
    });*/
    
    /*return this.projects.pipe(take(1), delay(1000), tap(projects => {
      this._projects.next(projects.concat(newProject));
    }));*/
  }
  
  updateProject(projectId: string, title: string, description: string) {
    /*return this.projects.pipe(take(1), delay(1000), tap(projects => {
      const updatedProjectIndex = projects.findIndex(project => project.id === projectId);
      const updatedProjects = [...projects];
      const oldProject = updatedProjects[updatedProjectIndex];
      updatedProjects[updatedProjectIndex] = new Project(oldProject.id, title, description, oldProject.userId);
      this._projects.next(updatedProjects);
    }));*/
    let updatedProjects: Project[];
    return this.projects.pipe(
      take(1), 
      switchMap(projects => {
        if (!projects || projects.length <= 0) {
          return this.fetchProjects();
        } else {
          return of(projects);
        }
      }),
      switchMap(projects => {
        const updatedProjectIndex = projects.findIndex(project => project.id === projectId);
        updatedProjects = [...projects];
        const oldProject = updatedProjects[updatedProjectIndex];
        updatedProjects[updatedProjectIndex] = new Project(oldProject.id, title, description, oldProject.userId);
        /*return this.http.put(
          `https://gestion-projets-56c05.firebaseio.com/projects/${projectId}.json`,
          {...updatedProjects[updatedProjectIndex], id: null}
          );*/
        return this.db.doc<ProjectData>('Projects/'+projectId).set({title: title, description: description, userId: oldProject.userId});
      }),
      tap(resData => {
      console.log(resData);
      //this._projects.next(updatedProjects);
      }));
  }

  deleteProject(projectId: string) {
    /*return this.projects.pipe(take(1), delay(1000), tap(projects => {
      this._projects.next(projects.filter(p => p.id !== projectId));
    }));*/

    /*return this.http.delete(`https://gestion-projets-56c05.firebaseio.com/projects/${projectId}.json`)
      .pipe(
        switchMap(() => {
          return this.projects;
        }),
        take(1),
        tap(projects => {
          this._projects.next(projects.filter(p => p.id !== projectId));
        })
      );*/
  return this.authService.userId.pipe(take(1), switchMap(async userId => {
    if (!userId) {
      throw new Error('No user id found!');
    } else {
      (await this.db.collection(`Projects/${projectId}/Tasks`).ref.get()).forEach(doc => {
        doc.ref.delete();
      });
      return this.db.doc<ProjectData>('Projects/'+projectId).delete().then(async docRef => {
        await this.db.doc(`users/${userId}`).update({
          projects: firebase.firestore.FieldValue.arrayRemove(projectId)
        })
      });
    }
  }))
}

}
