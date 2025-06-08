import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Task } from '../core/models/task.model';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../core/models/category.model';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  tasks: Task[] = [];
  categories: Category[] = [];
  filtered: Task[] = [];
  selectedCategoryId: number | null = null;
  newTask = '';
  newCategoryName = '';
  private storageReady = false;

  showSpecialFeature = false;

  constructor(private storage: Storage, private remoteConfig: AngularFireRemoteConfig) { }

  async ngOnInit() {

    await (this.storage as any).create();
    this.storageReady = true;

    const savedTasks = await (this.storage as any).get('tasks');
    const savedCategories = await (this.storage as any).get('categories');

    if (savedTasks) {
      this.tasks = savedTasks;
    }

    if (savedCategories) {
      this.categories = savedCategories;
    }

    this.updateFilteredTasks();

    // Remote Config
    await this.remoteConfig.fetchAndActivate();
    const flag = await this.remoteConfig.getBoolean('show_special_feature');
    this.showSpecialFeature = flag;
  }

  async addTask() {
    if (this.newTask.trim()) {
      const task: Task = {
        id: Date.now(),
        title: this.newTask,
        done: false,
        categoryId: this.selectedCategoryId || null,
      };
      this.tasks.push(task);
      this.newTask = '';
      await this.saveTasks();
    }
  }

  async deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
    this.updateFilteredTasks();
  }

  async saveTasks() {
    if (this.storageReady) {
      await (this.storage as any).set('tasks', this.tasks);
    }
  }

  async saveCategories() {
    if (this.storageReady) {
      await (this.storage as any).set('categories', this.categories);
    }
  }  

  addCategory() {
    if (this.newCategoryName.trim()) {
      const newCat: Category = {
        id: Date.now(),
        name: this.newCategoryName.trim(),
      };
      this.categories.push(newCat);
      this.newCategoryName = '';
      this.saveCategories();
    }
  }

  deleteCategory(id: number) {
    this.categories = this.categories.filter(cat => cat.id !== id);
    this.tasks = this.tasks.map(t => {
      if (t.categoryId === id) t.categoryId = null;
      return t;
    });
    this.saveCategories();
    this.saveTasks();
  }

  selectCategory(id: number) {
    this.selectedCategoryId = id;
    this.updateFilteredTasks();
  }

  clearCategoryFilter() {
    this.selectedCategoryId = null;
    this.updateFilteredTasks();
  }

  updateFilteredTasks() {
    if (!this.selectedCategoryId) {
      this.filtered = this.tasks;
    } else {
      this.filtered = this.tasks.filter(t => t.categoryId === this.selectedCategoryId);
    }
  }

  filteredTasks(): Task[] {
    if (!this.selectedCategoryId) return this.tasks;
    return this.tasks.filter(t => t.categoryId === this.selectedCategoryId);
  }
  
  getCategoryName(id: number): string {
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.name : 'Sin categoría';
  }

  trackByTask(index: number, task: Task) {
    return task.id;
  }

  trackByCategory(index: number, cat: Category) {
    return cat.id;
  }
  
}
