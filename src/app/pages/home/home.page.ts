import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Task } from '../../core/models/task.model';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../../core/models/category.model';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';
import { TaskService } from 'src/app/core/services/task.service';

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
  selectedCategoryId?: string | null;
  newTask = '';
  newCategoryName = '';
  private storageReady = false;

  showSpecialFeature = false;

  constructor(private storage: Storage, private remoteConfig: AngularFireRemoteConfig, private taskService: TaskService,     private cd: ChangeDetectorRef) { }

  ionViewWillEnter(): void {
    this.taskService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.cd.markForCheck();
    });

    this.taskService.getLocalDoneMap().then(doneMap => {
      this.taskService.getTasks().subscribe(tasks => {
        this.tasks = tasks.map(t => ({
          ...t,
          done: doneMap[t.id] ?? false
        }));
        this.cd.markForCheck();
      });
    });

    this.remoteConfig.fetchAndActivate()
      .then(() => this.remoteConfig.getBoolean('show_special_feature'))
      .then(flag => {
        this.showSpecialFeature = flag;
        this.cd.markForCheck();
      });
  }

  async ngOnInit() {
    // Obtener categorías desde Firebase
    this.taskService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    // Obtener tareas desde Firebase y combinar con estado "done" local
    const doneMap = await this.taskService.getLocalDoneMap();

    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.map(t => ({
        ...t,
        done: doneMap[t.id] ?? false
      }));
      this.updateFilteredTasks();
    });

    // Remote Config: obtener bandera de funcionalidad especial
    await this.remoteConfig.fetchAndActivate();
    this.showSpecialFeature = await this.remoteConfig.getBoolean('show_special_feature');
  }

  async toggleDone(task: Task) {
    task.done = !task.done;
    await this.taskService.saveLocalDone(task.id, task.done);
  }

  async deleteTask(id: string) {
    await this.taskService.deleteTask(id);
  }

  selectCategory(value: string | number | undefined) {
    this.selectedCategoryId = typeof value === 'string' ? value : undefined;
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

  getCategoryName(id: string): string {
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.name : 'Sin categoría';
  }

  getCategoryColor(id?: string | null): string {
    const cat = this.categories.find(c => c.id === id);
    return cat?.color || '#cccccc';
  }

  trackByTask(index: number, task: Task) {
    return task.id;
  }

  trackByCategory(index: number, cat: Category) {
    return cat.id;
  }
}
