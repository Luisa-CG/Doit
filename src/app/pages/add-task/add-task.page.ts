import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { Task } from '../../core/models/task.model';
import { Storage } from '@ionic/storage-angular';
import { TaskService } from 'src/app/core/services/task.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: false,
})
export class AddTaskPage implements OnInit {
  title = '';
  selectedCategoryId: string | null = null;
  categories: Category[] = [];

  constructor(private taskService: TaskService, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit(): void {
    this.taskService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error obteniendo categorías:', error);
      }
    });
  }

  private async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Atención',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async saveTask() {

    if (!this.title.trim()) {
      return;
    }

    if (!this.selectedCategoryId) {
      await this.showAlert('Debe seleccionar una categoría antes de guardar la tarea.');
      return;
    }

    const task: Omit<Task, 'id'> = {
      title: this.title.trim(),
      categoryId: this.selectedCategoryId
    };

    const newId = await this.taskService.addTask(task);
    await this.taskService.saveLocalDone(newId, false);

    this.router.navigate(['/home']);
  }
}
