import { Injectable } from '@angular/core';
import { Member } from './member.model';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take, switchMap, tap } from 'rxjs/operators';
import { ProjectsService } from '../../projects.service';
import * as firebase from 'firebase/app';
import { User } from 'src/app/auth/user.model';

interface MemberData {
  id: string,
  nom: string, 
  prenom: string,
  tel: string,
  email: string,
  poste: string,
}

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  /*private _members: Member[] = [
    new Member('m1','Nom 1','Prenom 1','0555','nom1@mail.com','Poste 1','https://upload.wikimedia.org/wikipedia/commons/e/ec/SCP_Foundation_%28emblem%29.svg'),
    new Member('m2','Nom 2','Prenom 2','0555','nom2@mail.com','Poste 2','https://upload.wikimedia.org/wikipedia/commons/e/ec/SCP_Foundation_%28emblem%29.svg'),
    new Member('m3','Nom 3','Prenom 3','0555','nom3@mail.com','Poste 3','https://upload.wikimedia.org/wikipedia/commons/e/ec/SCP_Foundation_%28emblem%29.svg'),
    new Member('m4','Nom 4','Prenom 4','0555','nom4@mail.com','Poste 4','https://upload.wikimedia.org/wikipedia/commons/e/ec/SCP_Foundation_%28emblem%29.svg'),
    new Member('m5','Nom 5','Prenom 5','0555','nom5@mail.com','Poste 5','https://upload.wikimedia.org/wikipedia/commons/e/ec/SCP_Foundation_%28emblem%29.svg'),
  ];

  constructor() { }

  get members (){
    return [...this._members];
  }

  getMember(id :string){
    return {...this._members.find(m => m.id === id)};
  }*/

  private _members = new BehaviorSubject<Member[]>([]);

  constructor(private db: AngularFirestore, private projectsService: ProjectsService) {}

  get members() {
    return this._members.asObservable();
  }

  getMember(memberId: string) {
    return this.db.doc<MemberData>(`users/${memberId}`).valueChanges().pipe(
      take(1),
      map(member => {
        return new Member(memberId, member.nom, member.prenom, member.tel, member.email, member.prenom);
      })
    )
  }

  fetchMembers(projectId: string) {
    return this.projectsService.getProject(projectId).pipe(
      take(1),
      switchMap(project => {
        if (!project) {
          throw new Error('Project not found!');
        } else {
          //const members = [];
          let memberIds = project.members;
          console.log(project.members);
          if (memberIds.length > 0) {
            return this.db.collection<User>('users', ref => ref/*.where("projects","array-contains",projectId)*/.where(firebase.firestore.FieldPath.documentId(),'in',memberIds))
            //return this.db.doc<User>(`users/${memberIds[0]}`)
              .snapshotChanges().pipe(
                //take(1),
                map(res => {
                  const members = [];
                  //console.log(res)
                  res.map(doc => {
                    members.push({
                      id: doc.payload.doc.id,
                      email: doc.payload.doc.data().email,
                      nom: doc.payload.doc.data().nom,
                      prenom: doc.payload.doc.data().prenom,
                      tel: doc.payload.doc.data().tel,
                      poste: doc.payload.doc.data().poste,
                    })
                  })
                  //console.log(members)
                  return members;
                }),
                tap(members => {
                  this._members.next(members);
                })
              )
          }
        }
      })
    )
  }

  addMember(projectId: string, email: string) {
    return this.db.collection<User>(`users`, ref => ref.where('email', '==', email)).valueChanges()
      .pipe(
        take(1),
        switchMap(res => {
          console.log(res);
          const users: User[] = [];
          res.map(doc => {
            users.push({
              uid: doc.uid,
              email: doc.email,
              nom: doc.nom,
              prenom: doc.prenom,
              tel: doc.tel,
              poste: doc.poste,
              //projects: doc.projects
            })
              //new User(doc.uid, doc.email, doc.nom, doc.prenom, doc.tel, doc.poste,doc.projects))
          })
          console.log('users : '+ users[0].uid);
          //return users;
          return this.db.doc(`Projects/${projectId}`).update({
            members: firebase.firestore.FieldValue.arrayUnion(users[0].uid)
          }).then(async docRef => {
            console.log(docRef);
            await this.db.doc(`users/${users[0].uid}`).update({
              projects: firebase.firestore.FieldValue.arrayUnion(projectId)
            })
          })
        })
      )
  }

  deleteMember(projectId: string, memberId: string) {
    return this.db.doc(`Projects/${projectId}`).update({
      members: firebase.firestore.FieldValue.arrayRemove(memberId)
    }).then(async docRef => {
      await this.db.doc(`users/${memberId}`).update({
        projects: firebase.firestore.FieldValue.arrayRemove(projectId)
      })
    })
  }
}