  import { Component, OnInit } from '@angular/core';
  import { Storage } from '@ionic/storage-angular';

  @Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false,
  })
  export class AppComponent implements OnInit {
    static storageReady = false;
  
    constructor(
      private storage: Storage
    ) {}
  
    async ngOnInit() {
      await this.storage.create();
      AppComponent.storageReady = true;
    }
  }