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
