import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private API = 'http://localhost:5000/api/admin';

  private refreshUsersSource = new Subject<void>();
  refreshUsers$ = this.refreshUsersSource.asObservable();

  constructor(private http: HttpClient) { }

  triggerRefresh() {
    this.refreshUsersSource.next();
  }
  getAllUsers() {
    return this.http.get<any[]>(`${this.API}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  updatePermissions(userId: string, permissions: any) {
    return this.http.put(
      `${this.API}/users/${userId}/permissions`,
      { permissions },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
}
