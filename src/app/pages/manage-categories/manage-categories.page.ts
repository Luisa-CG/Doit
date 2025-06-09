import { Component } from '@angular/core';
import { Category } from 'src/app/core/models/category.model';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.page.html',
  styleUrls: ['./manage-categories.page.scss'],
  standalone: false,
})
export class ManageCategoriesPage {
  categories: Category[] = [];
  newCategoryName = '';
  newCategoryColor = '#2196F3'; // color por defecto

  constructor(private storage: Storage) { }

  async ionViewWillEnter() {
    const saved = await (this.storage as any).get('categories');
    this.categories = saved || [];
  }

  async addCategory() {
    if (!this.newCategoryName.trim()) return;

    const newCat: Category = {
      id: Date.now(),
      name: this.newCategoryName.trim(),
      color: this.newCategoryColor,
    };

    this.categories.push(newCat);
    this.newCategoryName = '';
    this.newCategoryColor = '#2196F3';
    await (this.storage as any).set('categories', this.categories);
  }

  async deleteCategory(id: number) {
    this.categories = this.categories.filter(c => c.id !== id);
    await (this.storage as any).set('categories', this.categories);
  }
}
