import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { Message } from './message.model';
import { AuthService } from '../auth/auth.service';
import { take, switchMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _messages = new BehaviorSubject<Message[]>([]);

  constructor(private db: AngularFirestore, private authService: AuthService) { }

  get messages() {
    return this._messages.asObservable();
  }

  fetchMessages() {
    return this.authService.userId.pipe(
      take(1),
      switchMap(uid => {
        if (!uid) {
          throw new Error('No user id found!');
        } else {
          return this.db.collection<Message>(`Messages/${uid}/messages`, ref => ref.orderBy('date',"asc")).valueChanges().pipe(
            map(res => {
              const messages = [];
              res.map(doc => {
                messages.push(new Message(doc.message, doc.userId, doc.date))
              })
              return messages;
            })
          )
        }
      }),
      tap(messages => {
        this._messages.next(messages)
      })
    )
  }

  sendMessage(userId: string, msg: string, date: Date){
    // this.db.collection('Messages').doc(userId).collection('messages').add({
    //   userId: userId,
    //   message: msg, 
    //   date: date.toISOString()
    // })
    this.authService.userId.pipe(
      take(1),
      map(uid => {
        if(!uid) {
          throw new Error('No user id found!');
        } else {
          this.db.collection('Messages').doc(uid).collection('messages').add({
            userId: userId,
            message: msg, 
            date: date//.toISOString()
          })
        }
      })
    ).subscribe()
  }
}
