import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { Storage } from '@ionic/storage-angular';
import { TaskService } from 'src/app/core/services/task.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
  standalone: false,
})
export class AddCategoryPage {
  newCategoryName = '';
  newCategoryColor? = '#2196F3';
  categories: Category[] = [];
  private editingId?: string;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private alertCtrl: AlertController,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.editingId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.editingId) {
      this.taskService.getCategoryById(this.editingId)
        .subscribe(cat => {
          this.newCategoryName = cat.name;
          this.newCategoryColor = cat.color;
          this.cd.markForCheck();
        });
    }
  }

  get isEditing(): boolean {
    return !!this.editingId;
  }

  async saveCategory() {
    const name = this.newCategoryName.trim();

    if (!name) {
      this.showAlert('El nombre de la categoría no puede estar vacío.');
      return;
    }

    const exists = this.categories.some(
      c => c.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      this.showAlert('Ya existe una categoría con ese nombre.');
      return;
    }

    if (this.isEditing) {
      await this.taskService.updateCategory(this.editingId!, {
        name,
        color: this.newCategoryColor,
      });
    } else {
      await this.taskService.addCategory({
        name,
        color: this.newCategoryColor,
      });
    }

    this.router.navigate(['/manage-categories']);
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
