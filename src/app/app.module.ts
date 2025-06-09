import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule }                from '@ionic/storage-angular';

import { AngularFireModule }              from '@angular/fire/compat';
import { AngularFireAuthModule }          from '@angular/fire/compat/auth';
import { AngularFireRemoteConfigModule, SETTINGS, DEFAULTS } from '@angular/fire/compat/remote-config';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import {
  provideFirestore,
  getFirestore,
  enableIndexedDbPersistence
} from '@angular/fire/firestore';

import { AppComponent }      from './app.component';
import { AppRoutingModule }  from './app-routing.module';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { environment }       from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),

    // Firebase “compat” core (Auth + Remote‑Config)
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireRemoteConfigModule,

    // Componente standalone
    SideMenuComponent,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

     // Remote Config: settings y defaults
     { 
      provide: SETTINGS, 
      useValue: { minimumFetchIntervalMillis: 0 } 
    },
    { 
      provide: DEFAULTS, 
      useValue: { show_special_feature: true } 
    },

    // Registramos la app Firebase y Firestore modular
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => {
      const fs = getFirestore();
      enableIndexedDbPersistence(fs)
        .then(() => console.log('✅ Firestore persistence enabled'))
        .catch(err => console.error('❌ Firestore persistence failed:', err));
      return fs;
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
