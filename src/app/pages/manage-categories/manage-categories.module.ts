import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageCategoriesPageRoutingModule } from './manage-categories-routing.module';

import { ManageCategoriesPage } from './manage-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageCategoriesPageRoutingModule
  ],
  declarations: [ManageCategoriesPage]
})
export class ManageCategoriesPageModule {}
