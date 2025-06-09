import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'add-task',
    loadChildren: () => import('./pages/add-task/add-task.module').then(m => m.AddTaskPageModule)
  },
  {
    path: 'manage-categories',
    loadChildren: () => import('./pages/manage-categories/manage-categories.module').then(m => m.ManageCategoriesPageModule)
  },
  {
    path: 'add-category',
    loadChildren: () => import('./pages/add-category/add-category.module').then( m => m.AddCategoryPageModule)
  },
  // {
  //   path: 'settings',
  //   loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
