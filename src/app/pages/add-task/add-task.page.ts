import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { Task } from '../../core/models/task.model';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-add-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: false,
})
export class AddTaskPage implements OnInit {
  taskTitle = '';
  selectedCategoryId: number | undefined;
  categories: Category[] = [];
  tasks: Task[] = [];


  constructor(private storage: Storage, private router: Router) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    const cats = await (this.storage as any).get('categories');
    this.categories = cats || [];

    const savedTasks = await (this.storage as any).get('tasks');
    this.tasks = savedTasks || [];
  }


  async saveTask() {
    if (!this.taskTitle.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: this.taskTitle,
      done: false,
      categoryId: this.selectedCategoryId,
    };

    this.tasks.push(task);
    await (this.storage as any).set('tasks', this.tasks);

    this.router.navigate(['/home']);
  }
}
