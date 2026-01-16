// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Task } from '../models/task.model';

// @Injectable({ providedIn: 'root' })
// export class NewTaskService {
//   private API = 'http://localhost:5000/api/tasks';

//   constructor(private http: HttpClient) { }

//   private getHeaders() {
//     const token = localStorage.getItem('token');
//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//   }

//   getTasks() {
//     return this.http.get<Task[]>(this.API, this.getHeaders());
//   }

//   createTask(data: Task) {
//     return this.http.post(this.API, data, this.getHeaders());
//   }

//   updateTask(id: string, data: Partial<Task>) {
//     return this.http.put(`${this.API}/${id}`, data, this.getHeaders());
//   }

//   deleteTask(id: string) {
//     return this.http.delete(`${this.API}/${id}`, this.getHeaders());
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NewTaskService {
  private API = "http://localhost:5000/api/tasks";

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // ✅ CREATE
  createTask(task: any) {
    return this.http.post(this.API, task, this.getAuthHeaders());
  }

  // ✅ READ ALL
  getTasks() {
    return this.http.get<any[]>(this.API, this.getAuthHeaders());
  }

  // ✅ UPDATE
  updateTask(id: string, task: any) {
    return this.http.put(`${this.API}/${id}`, task, this.getAuthHeaders());
  }

  // ✅ DELETE
  deleteTask(id: string) {
    return this.http.delete(`${this.API}/${id}`, this.getAuthHeaders());
  }
}
