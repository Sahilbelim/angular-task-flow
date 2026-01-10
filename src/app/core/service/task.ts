import { Injectable, signal } from '@angular/core';
import {
  collection,
  addDoc,
  getFirestore,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { firebaseApp } from '../../../environments/firebase.config';
import { Auth } from '../auth/auth';

export interface Task {
  id?: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: number;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {

  private db = getFirestore(firebaseApp);
  tasks = signal<Task[]>([]);

  constructor(private auth: Auth) {
    // this.loadTasks();
  }
 
  loadTasks(userId: string) {
    const q = query(
      collection(this.db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];

      this.tasks.set(data);
      console.log(data)
    });
    
  }

  // 🔹 CREATE
  async addTask(task: Omit<Task, 'id'>) {
    // const user = await this.auth.user();
    console.log('UID:', this.auth.user()?.uid);
    await addDoc(collection(this.db, 'tasks'), task);
  }

  // 🔹 DELETE
  async deleteTask(id: any) {
    await deleteDoc(doc(this.db, 'tasks', id));
  }
  // 🔹 UPDATE
  async updateTask(id: string, data: Partial<Task>) {
    const ref = doc(this.db, 'tasks', id);
    await updateDoc(ref, data);
  }

}
