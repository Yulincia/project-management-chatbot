import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

interface TaskData {
  description: string;
  priority: string;
  status: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  /*private _tasks: Task[] = [
    new Task('t1','Task 1','Description task 1','Terminé','0'),
    new Task('t2','Task 2','Description task 2','En cours','3'),
    new Task('t3','Task 3','Description task 3','Terminé','0'),
    new Task('t4','Task 4','Description task 4','Non entamé','1'),
    new Task('t5','Task 5','Description task 5','En cours','2'),
  ];*/

  /*private _tasks = new BehaviorSubject<Task[]>([
    new Task('t1','Task 1','Description task 1','Terminé','0'),
    new Task('t2','Task 2','Description task 2','En cours','3'),
    new Task('t3','Task 3','Description task 3','Terminé','0'),
    new Task('t4','Task 4','Description task 4','Non entamé','1'),
    new Task('t5','Task 5','Description task 5','En cours','2'),
  ]);*/

  private _tasks = new BehaviorSubject<Task[]>([]);

  constructor(private http: HttpClient, private db: AngularFirestore) { }

  get tasks(){
    //return [...this._tasks];
    return this._tasks.asObservable();
  }
  fetchTasks(projectId: string) {
    /*return this.http.get<{[key: string]: TaskData}>(`https://gestion-projets-56c05.firebaseio.com/projects/${projectId}/tasks.json`)
      .pipe(
        map(resData => {
          const tasks = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              tasks.push(new Task(key, resData[key].title, resData[key].description, resData[key].status, resData[key].priority));
            }
          }
          return tasks;
        }),
        tap(tasks => {
          this._tasks.next(tasks);
        })
      );*/
    return this.db.collection<TaskData>(`Projects/${projectId}/Tasks`).snapshotChanges()
      .pipe(
        map(resData => {
          const tasks = [];
          resData.map(doc => {
            tasks.push({
              id: doc.payload.doc.id,
              title: doc.payload.doc.data().title,
              description: doc.payload.doc.data().description,
              status: doc.payload.doc.data().status,
              priority: doc.payload.doc.data().priority
            })
          })
          return tasks;
        }),
        tap(tasks => {
          this._tasks.next(tasks);
        })
      );
  }

  getTask(projectId: string, taskId :string){
    //return {...this._tasks.find(t => t.id === taskId)};
    /*return this._tasks.pipe(take(1), map(tasks => {
      return {...tasks.find(t => t.id === taskId)};
    }));*/
    /*return this.http.get<TaskData>(`https://gestion-projets-56c05.firebaseio.com/projects/${projectId}/tasks/${taskId}.json`)
      .pipe(
        map(placeData => {
          return new Task(taskId, placeData.title, placeData.description, placeData.status, placeData.priority);
        })
      );*/
      return this.db.doc<TaskData>(`Projects/${projectId}/Tasks/${taskId}`).valueChanges().pipe(
        map(resData => {
          return new Task(taskId, resData.title, resData.description, resData.status, resData.priority);
        })
      );
  }

  addTask(projectId: string, title: string, description: string, status: string, priority: string) {
    const newTask = new Task(Math.random().toString(),title,description,status,priority);

    /*this.tasks.pipe(take(1)).subscribe(tasks => {
      this._tasks.next(tasks.concat(newTask));
    });*/

    /*return this.tasks.pipe(take(1), delay(1000), tap(tasks => {
      this._tasks.next(tasks.concat(newTask));
    }));*/

    /*let generatedId: string;

    return this.http
      .post<{name: string}>(`https://gestion-projets-56c05.firebaseio.com/projects/${projectId}/tasks.json`, {...newTask, id: null})
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.tasks;
        }),
        take(1),
        tap(tasks => {
          newTask.id = generatedId;
          this._tasks.next(tasks.concat(newTask));
        })
      );*/
    return this.db.collection(`Projects/${projectId}/Tasks`).add({...newTask, id: null})
  }

  updateTask(projectId: string, taskId: string, title: string, description: string, status: string, priority: string) {
    /*return this.tasks.pipe(take(1), delay(1000), tap(tasks =>  {
      const updatedTaskIndex = tasks.findIndex(task => task.id === taskId);
      const updatedTasks = [...tasks];
      const oldTask = updatedTasks[updatedTaskIndex];
      updatedTasks[updatedTaskIndex] = new Task(oldTask.id, title, description, status, priority);
      this._tasks.next(updatedTasks);
    }));*/
    let updatedTasks: Task[];
    return this.tasks.pipe(
      take(1),
      switchMap(tasks => {
        if (!tasks || tasks.length <= 0) {
          return this.fetchTasks(projectId);
        } else {
          return of(tasks);
        }
      }),
      switchMap(tasks => {
        const updatedTaskIndex = tasks.findIndex(task => task.id === taskId);
        updatedTasks = [...tasks];
        const oldTask = updatedTasks[updatedTaskIndex];
        updatedTasks[updatedTaskIndex] = new Task(oldTask.id, title, description, status, priority);
        /*return this.http.put(
          `https://gestion-projets-56c05.firebaseio.com/projects/${projectId}/tasks/${taskId}.json`,
          {...updatedTasks[updatedTaskIndex], id: null}
        );*/
        return this.db.doc<TaskData>(`Projects/${projectId}/Tasks/${taskId}`).set({title: title, description: description, status: status, priority: priority});
      }),
      tap(resData => {
        this._tasks.next(updatedTasks);
      })
    );
  }

  deleteTask(projectId: string, taskId: string) {
    /*return this.tasks.pipe(take(1), delay(1000), tap(tasks => {
      this._tasks.next(tasks.filter(t => t.id !== taskId));
    }));*/

    /*return this.http.delete(`https://gestion-projets-56c05.firebaseio.com/projects/${projectId}/tasks/${taskId}.json`)
      .pipe(
        switchMap(() => {
          return this.tasks;
        }),
        take(1),
        tap(tasks => {
          this._tasks.next(tasks.filter(t => t.id !== taskId));
        })
      );*/
    return this.db.doc<TaskData>(`Projects/${projectId}/Tasks/${taskId}`).delete();
  }
}