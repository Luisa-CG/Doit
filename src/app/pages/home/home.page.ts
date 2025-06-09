import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';
import { TaskService } from 'src/app/core/services/task.service';
import { Task } from '../../core/models/task.model';
import { Category } from '../../core/models/category.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {
  tasks: Array<Task & { done: boolean }> = [];
  categories: Category[] = [];
  filtered: Array<Task & { done: boolean }> = [];
  selectedCategoryId?: string;
  showSpecialFeature = true;

  constructor(
    private remoteConfig: AngularFireRemoteConfig,
    private taskService: TaskService,
    private cd: ChangeDetectorRef,
    private alertCtrl: AlertController
  ) { }

  /** Se dispara cada vez que la vista va a mostrarse */
  ionViewWillEnter(): void {
    this.loadCategoriesAndTasks();
    this.loadRemoteConfigFlag();
  }

  /** Carga categorías, tareas y aplica filtro */
  private async loadCategoriesAndTasks() {
    // Categorías
    this.taskService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.cd.markForCheck();
    });

    // Tareas + estado “done”
    const doneMap = await this.taskService.getLocalDoneMap();
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.map(t => ({ ...t, done: doneMap[t.id] ?? false }));
      this.applyFilter();
      this.cd.markForCheck();
    });
  }

  private async loadRemoteConfigFlag(): Promise<void> {
    try {
      await this.remoteConfig.fetchAndActivate();

      const rcValue = await this.remoteConfig.getValue('show_special_feature');
      this.showSpecialFeature = rcValue.asBoolean();

    } catch (err) {
      console.error('Remote Config error', err);
      this.showSpecialFeature = true;
    }
    this.cd.markForCheck();
  }

  selectCategory(value: string | number | undefined) {
    this.selectedCategoryId = typeof value === 'string' ? value : undefined;
    this.applyFilter();
  }

  clearCategoryFilter() {
    this.selectedCategoryId = undefined;
    this.applyFilter();
  }

  private applyFilter() {
    if (!this.selectedCategoryId) {
      this.filtered = this.tasks;
    } else {
      this.filtered = this.tasks.filter(t => t.categoryId === this.selectedCategoryId);
    }
  }

  async toggleDone(task: Task & { done: boolean }) {
    task.done = !task.done;
    await this.taskService.saveLocalDone(task.id, task.done);
  }

  onToggleDone(checked: boolean, task: Task & { done: boolean }) {
    task.done = checked;
    this.taskService.saveLocalDone(task.id, checked)
      .then(() => this.cd.markForCheck());
  }

  async confirmDeleteTask(taskId: string) {
    const alert = await this.alertCtrl.create({
      header: '⚠️ Eliminar tarea',
      message: '¿Estás seguro de que quieres eliminar esta tarea?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => this.doDeleteTask(taskId)
        }
      ]
    });
    await alert.present();
  }

  private async doDeleteTask(taskId: string) {
    await this.taskService.deleteTask(taskId);
    this.applyFilter();
    this.cd.markForCheck();
  }

  trackByTask(index: number, task: Task) {
    return task.id;
  }

  trackByCategory(index: number, cat: Category) {
    return cat.id;
  }

  getCategoryColor(id?: string) {
    const cat = this.categories.find(c => c.id === id);
    return cat?.color || '#cccccc';
  }

  getCategoryName(id: string) {
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.name : 'Sin categoría';
  }

  get displayedTasks() {
    return this.showSpecialFeature
      ? this.filtered
      : this.tasks;
  }
}