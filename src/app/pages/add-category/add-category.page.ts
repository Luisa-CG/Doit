import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
  standalone: false,
})
export class AddCategoryPage {
  categoryName = '';
  categoryColor = '#2196F3';
  categories: Category[] = [];

  constructor(private storage: Storage, private router: Router) { }

  async ionViewWillEnter() {
    const saved = await (this.storage as any).get('categories');
    this.categories = saved || [];
  }

  async saveCategory() {
    if (!this.categoryName.trim()) return;

    const newCat: Category = {
      id: Date.now(),
      name: this.categoryName.trim(),
      color: this.categoryColor,
    };

    this.categories.push(newCat);
    await (this.storage as any).set('categories', this.categories);
    this.router.navigate(['/manage-categories']);
  }
}
