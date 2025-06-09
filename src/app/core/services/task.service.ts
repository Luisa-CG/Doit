// src/app/core/services/task.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, docData } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';
import { updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageReady: Promise<void>;

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {
    // inicializa Ionic Storage
    this.storageReady = this.storage.create().then(() => { });
  }

  private async ensureStorage() {
    await this.storageReady;
  }

  /** Devuelve un Observable con las categorías de Firestore */
  getCategories(): Observable<Category[]> {
    const colRef = collection(this.firestore, 'categories');
    return collectionData(colRef, { idField: 'id' }) as Observable<Category[]>;
  }

  /** Devuelve un Observable con las tareas de Firestore */
  getTasks(): Observable<Task[]> {
    const colRef = collection(this.firestore, 'tasks');
    return collectionData(colRef, { idField: 'id' }) as Observable<Task[]>;
  }

  /** Agrega una nueva categoría en Firestore */
  async addCategory(cat: Omit<Category, 'id'>): Promise<string> {
    await this.ensureStorage();
    const colRef = collection(this.firestore, 'categories');
    const ref = await addDoc(colRef, cat);
    return ref.id;
  }

  /** Devuelve un Observable con la categoría indicada */
  getCategoryById(id: string): Observable<Category> {
    const ref = doc(this.firestore, `categories/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Category>;
  }

  /** Actualiza una categoría existente */
  async updateCategory(id: string, data: Partial<Category>): Promise<void> {
    const ref = doc(this.firestore, `categories/${id}`);
    await updateDoc(ref, data);
  }

  /** Elimina una categoría de Firestore */
  async deleteCategory(id: string): Promise<void> {
    await this.ensureStorage();
    const docRef = doc(this.firestore, `categories/${id}`);
    await deleteDoc(docRef);
  }

  /** Agrega una nueva tarea en Firestore */
  async addTask(task: Omit<Task, 'id'>): Promise<string> {
    await this.ensureStorage();
    const colRef = collection(this.firestore, 'tasks');
    const ref = await addDoc(colRef, task);
    return ref.id;
  }

  /** Obtiene una tarea por ID  */
  getTaskById(id: string) {
    const ref = doc(this.firestore, `tasks/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Task>;
  }

  /** Actualiza una tarea existente */
  async updateTask(id: string, data: Partial<Task>): Promise<void> {
    const docRef = doc(this.firestore, `tasks/${id}`);
    await updateDoc(docRef, data);
  }

  /** Elimina una tarea de Firestore y del storage local */
  async deleteTask(id: string): Promise<void> {
    await this.ensureStorage();
    const docRef = doc(this.firestore, `tasks/${id}`);
    await deleteDoc(docRef);
    await this.removeLocalDone(id);
  }

  /** Guarda el estado “done” de una tarea en Ionic Storage */
  async saveLocalDone(id: string, done: boolean): Promise<void> {
    await this.ensureStorage();
    const map = (await this.storage.get(this.doneStatusKey)) || {};
    map[id] = done;
    await this.storage.set(this.doneStatusKey, map);
  }

  /** Elimina el estado “done” de una tarea del storage local */
  async removeLocalDone(id: string): Promise<void> {
    await this.ensureStorage();
    const map = (await this.storage.get(this.doneStatusKey)) || {};
    delete map[id];
    await this.storage.set(this.doneStatusKey, map);
  }

  /** Obtiene el mapa completo de estados “done” desde storage local */
  async getLocalDoneMap(): Promise<Record<string, boolean>> {
    await this.ensureStorage();
    return (await this.storage.get(this.doneStatusKey)) || {};
  }

  /** Clave para el storage local */
  private readonly doneStatusKey = 'task_done_map';
}
