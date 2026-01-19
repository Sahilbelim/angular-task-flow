import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../mocapi/auth';
import { User } from '../../models/user.model';
import { map, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

    private refreshUsersSource = new Subject<void>();
    refreshUsers$ = this.refreshUsersSource.asObservable();
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  // =========================
  // 👁 LOAD USERS (SCOPED)
  // =========================

  triggerRefresh() {
    this.refreshUsersSource.next();
  }
  getUsers() {
    const me = this.auth.user();
    if (!me) throw new Error('Not authenticated');

    const rootParentId = me.parentId ?? me.id;

    return this.http.get<User[]>(`${this.API}/user`).pipe(
      map(users =>
        users.filter(u =>
          // self
          u.id === me.id ||

          // siblings
          u.parentId === rootParentId ||

          // children
          u.parentId === me.id
        )
      )
    );
  }

  // =========================
  // ➕ CREATE USER
  // =========================
  createUser(payload: Partial<User>) {
    if (!this.auth.hasPermission('createUser')) {
      throw new Error('Permission denied');
    }

    const me = this.auth.user();

    const user: User = {
      ...payload,
      parentId: me.id,               // 🔑 child of current user
      permissions: payload.permissions ?? {},
      createdAt: new Date().toISOString(),
    } as User;

    return this.http.post(`${this.API}/user`, user);
  }

  // =========================
  // ✏️ UPDATE PERMISSIONS
  // =========================
  updateUserPermissions(id: string, permissions: {
    createTask?: boolean;
    editTask?: boolean;
    deleteTask?: boolean;
    createUser?: boolean;
  }) {
    if (!this.auth.hasPermission('createUser')) {
      throw new Error('Permission denied');
    }

    return this.http.put(`${this.API}/user/${id}`, { permissions });
  }

  // =========================
  // 🗑 DELETE USER
  // =========================
  deleteUser(id: string) {
    if (!this.auth.hasPermission('createUser')) {
      throw new Error('Permission denied');
    }
    console.log('Deleting user with ID:', id);
    return this.http.delete(`${this.API}/user/${id}`);
  }
}
