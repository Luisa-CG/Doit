import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MENU_ITEMS, MenuItem } from 'src/app/config/menu-items.config';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  imports: [IonicModule, RouterModule,  CommonModule],
})
export class SideMenuComponent {
  menuItems: MenuItem[] = MENU_ITEMS;
}
