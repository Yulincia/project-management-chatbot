import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireFunctionsModule } from '@angular/fire/functions';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EditTaskComponent } from './projects/project/tasks/edit-task/edit-task.component';
import { AddMemberComponent } from './projects/project/members/add-member/add-member.component';
import { EditProjectComponent } from './projects/project/detail/edit-project/edit-project.component';
import { environment } from '../environments/environment';
//import { IonicMqttModule, MQTTService } from //'ionic-mqtt';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3001', options: {} };

@NgModule({
  declarations: [
    AppComponent, 
    EditTaskComponent,
    EditProjectComponent,
    //AddMemberComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    //AngularFireStorageModule,
    AngularFireAuthModule,
    //AngularFireDatabaseModule,
    //AngularFireFunctionsModule,
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule,
    //IonicMqttModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    StatusBar,
    SplashScreen,
    //MQTTService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
