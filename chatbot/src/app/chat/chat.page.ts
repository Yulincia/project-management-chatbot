import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ChatService } from './chat.service';
import { Message } from './message.model';
import { Socket } from 'ngx-socket-io';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/project.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  userId: any;
  loadedMessages: Message[] = [];
  loadedProjects: Project[] = [];
  connected = false;
  messageText: any;
  isLoading = false;

  constructor(private projectsService: ProjectsService, private socket: Socket, private authService: AuthService, private chatService: ChatService) { }

  ngOnInit() {
    this.socket.connect();
    this.sub1 = this.authService.userId.subscribe(uid => {
      if (uid) {
        this.userId = uid;
        this.connected = true;
        //console.log("Connected & uid = " + this.userId);
      } else {
        this.userId = null;
        this.connected = false;
      }
    })
    //this.isLoading = true;
    /*this.sub2 = this.chatService.messages.subscribe(messages => {
      this.loadedMessages = messages;
      this.isLoading = false;
      //console.log(this.loadedMessages)
    })*/
    this.sub3 = this.projectsService.projects.subscribe(projects => {
      this.loadedProjects = projects
    })
    this.socket.fromEvent('answer').subscribe(data => {
      //console.log(data)
      let intent_entity_reply = JSON.parse(data['message'])
      //this.chatService.sendMessage(data['userId'], intent_entity_reply.reply, new Date());
      //this.loadedMessages.push({message: intent_entity_reply.reply, userId: data['userId'], date: new Date()})

      //////////////////////////////////
      /*if (this.loadedMessages.length > 2 && (intent_entity_reply.reply != this.loadedMessages[this.loadedMessages.length -2]['message'])){
        this.loadedMessages.push({message: intent_entity_reply.reply, userId: data['userId'], date: new Date()})
      }*/

      if ((intent_entity_reply.reply != this.loadedMessages[this.loadedMessages.length - 1]['message'])) {
        if (this.loadedMessages.length > 2 && (intent_entity_reply.reply != this.loadedMessages[this.loadedMessages.length - 2]['message'])) {
          this.loadedMessages.push({ message: intent_entity_reply.reply, userId: data['userId'], date: new Date() })
          if ((intent_entity_reply.intent == 'listTasks') || (intent_entity_reply.intent == 'listProjects')
            && (intent_entity_reply.intent != this.loadedMessages[this.loadedMessages.length - 2]['message'])) {
            this.loadedMessages.push({ message: intent_entity_reply.intent, userId: data['userId'], date: new Date() })
          }
        }
        if (this.loadedMessages.length < 2) { this.loadedMessages.push({ message: intent_entity_reply.reply, userId: data['userId'], date: new Date() }) }

        /*if ((intent_entity_reply.intent == 'listTasks') || (intent_entity_reply.intent == 'listProjects') 
          &&( intent_entity_reply.intent != this.loadedMessages[this.loadedMessages.length -2]['message']))
        {
          this.loadedMessages.push({message: intent_entity_reply.intent, userId: data['userId'], date: new Date()})
        }*/
      }

      //////////////////////////////////
    })
    /*this.socket.fromEvent('message').subscribe(message => {
      this.loadedMessages.push(message['message']);
    })*/
  }

  ionViewWillEnter() {
    //this.isLoading = true;
    //console.log(this.loadedMessages)
    /*this.chatService.fetchMessages().subscribe(() => {
      this.isLoading = false;
    });*/
    this.projectsService.fetchProjects().subscribe(() => {
      console.log('fetching')
      this.isLoading = false;
    }, err => {
      console.log(err)
    });
  }

  sendMessage() {
    //console.log("messageText: "+this.messageText)
    if (this.messageText) {
      //this.chatService.sendMessage(this.userId, this.messageText, new Date());
      this.loadedMessages.push({ message: this.messageText, userId: this.userId, date: new Date() })
      //this.socket.emit('send-message', {message: this.messageText, userId: this.userId, date: new Date()});
      this.socket.emit('publish', { topic: 'Chat/question', payload: this.messageText });
      this.messageText = '';
    }
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
    if (this.sub3) {
      this.sub3.unsubscribe();
    }
  }

}
