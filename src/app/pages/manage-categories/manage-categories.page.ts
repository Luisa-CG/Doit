import { Component } from '@angular/core';
import { Category } from 'src/app/core/models/category.model';
import { Storage } from '@ionic/storage-angular';
import { TaskService } from 'src/app/core/services/task.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.page.html',
  styleUrls: ['./manage-categories.page.scss'],
  standalone: false,
})
export class ManageCategoriesPage {
  categories: Category[] = [];
  newCategoryName = '';
  newCategoryColor = '#2196F3';

  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController
  ) { }

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

  async addCategory() {
    const name = this.newCategoryName.trim();

    if (!name) {
      this.showAlert('El nombre no puede estar vacío.');
      return;
    }

    const exists = this.categories.some(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      this.showAlert('Ya existe una categoría con ese nombre.');
      return;
    }

    await this.taskService.addCategory({
      name,
      color: this.newCategoryColor,
    });

    this.newCategoryName = '';
    this.newCategoryColor = '#2196F3';
  }

  async confirmDeleteCategory(id: string) {
    const alert = await this.alertCtrl.create({
      header: '⚠️ Eliminar categoría',
      message: '¿Seguro que quieres eliminar esta categoría? Las tareas asociadas quedarán sin categoría',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => this.doDeleteCategory(id)
        }
      ]
    });
    await alert.present();
  }

  private async doDeleteCategory(id: string) {
    try {
      await this.taskService.deleteCategory(id);
      this.categories = this.categories.filter(c => c.id !== id);
    } catch (err) {
      console.error('Error eliminando categoría:', err);
      this.showAlert('No se pudo eliminar la categoría. Intenta de nuevo.');
    }
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Atención',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
