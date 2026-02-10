import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../mocapi/auth';
import { Task } from '../../models/task.model';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewTaskService {
  private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  // =========================
  // 🔄 LOAD TASKS (SCOPED)
  // =========================
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/user`);
  }
 
  getUsersByIds(ids: string[]): Observable<any[]> {
    return this.http
      .get<any[]>('https://696dca5ad7bacd2dd7148b1a.mockapi.io/task/user')
      .pipe(
        map(users => users.filter(u => ids.includes(u.id)))
      );
  }

  getTasks() {
    const user = this.auth.user();
    if (!user) throw new Error('Not authenticated');

    return this.http.get<Task[]>(`${this.API}/tasks`).pipe(
      map(tasks => {
        const visibleTasks = tasks.filter(task => {
          const createdByMe = task.createdBy === user.id;
          const assignedToMe = task.assignedUsers?.includes(user.id);

          const myParentTask =
            !!user.parentId && task.createdBy === user.parentId;

          const myChildTask =
            task.parentId === user.id;

          return (
            createdByMe ||
            assignedToMe ||
            myParentTask ||
            myChildTask
          );
        });

        // ✅ REMOVE DUPLICATES SAFELY
        const uniqueMap = new Map<string, Task>();

        visibleTasks.forEach(task => {
          if (task.id) {
            uniqueMap.set(task.id, task);
          }
        });

        return Array.from(uniqueMap.values());
      })
    );
  }
 createTask(task: Partial<Task>) {
    if (!this.auth.hasPermission('createTask')) {
      throw new Error('Permission denied');
    }

    const user = this.auth.user();

    const payload: Task = {
      ...task,
      createdBy: user.id,
      parentId: user.parentId ?? user.id,
      assignedUsers: task.assignedUsers ?? [],
      createdAt: new Date().toISOString(),

      // ✅ NEW: order_id (timestamp-based, newest first)
      order_id: Date.now()
    } as Task;

    return this.http.post(`${this.API}/tasks`, payload);
  }

  // =========================
  // ✏️ UPDATE
  // =========================
  updateTask(id: string, task: Partial<Task>) {
    if (!this.auth.hasPermission('editTask')) {
      throw new Error('Permission denied');
    }
    console.log('Updating task ID:', id, 'with data:', task);
    return this.http.put(`${this.API}/tasks/${id}`, task);
  }

  // =========================
  // 🗑 DELETE
  // =========================
  deleteTask(id: string) {
    if (!this.auth.hasPermission('deleteTask')) {
      throw new Error('Permission denied');
    }

    return this.http.delete(`${this.API}/tasks/${id}`);
  }
}
