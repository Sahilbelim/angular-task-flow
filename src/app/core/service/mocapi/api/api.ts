
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  tap,
  throwError,
  map,
} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

  /* =====================================================
     🔐 AUTH STATE (SIGNAL)
  ===================================================== */
  user = signal<any | null>(this.getStoredUser());

  /* =====================================================
     📦 GLOBAL CACHES (STORES)
  ===================================================== */
  private usersSubject = new BehaviorSubject<any[]>([]);
  private tasksSubject = new BehaviorSubject<any[]>([]);

  users$ = this.usersSubject.asObservable();
  tasks$ = this.tasksSubject.asObservable();

  private usersLoaded = false;
  private tasksLoaded = false;
  private currentUserLoaded = false;


  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  /* =========================
     🔐 GET CURRENT USER
  ========================= */
   

  /* =========================
     🔐 SYNC USER FROM STORAGE
  ========================= */
 

  /* =========================
     🔐 QUICK ACCESS (SYNC)
  ========================= */
  getUser() {
    return this.currentUserSubject.value;
  }

  /* =========================
   🔐 GET USER FROM BACKEND
========================= */
 

  getCurrentUser() {
    if (this.currentUserLoaded) {
      return; // ✅ already fetched once → do nothing
    }

    const stored = this.getStoredUser();
    if (!stored?.id) return;

    this.currentUserLoaded = true;

    return this.http.get<any>(`${this.API}/user/${stored.id}`).pipe(
      tap(user => {
        this.setUser(user);
        this.currentUserSubject.next(user);
      })
    );
  }


  /* =========================
     🔐 LOAD USER FROM STORAGE
  ========================= */
  loadUserFromStorage() {
    const user = this.getStoredUser();
    if (user) {
      this.currentUserSubject.next(user);
      this.user.set(user);
    }
  }

  /* =========================
     🔐 REACTIVE USER STREAM
  ========================= */
  // currentUser$ = this.currentUserSubject.asObservable();


  /* =====================================================
     🔐 AUTH / SESSION
  ===================================================== */

  isLoggedIn(): boolean {
    return !!this.user();
  }

  currentUser() {
    return this.user();
  }

  hasPermission(key: string): boolean {
    const u = this.user();
    if (!u) return false;

    // parent (admin) has full access
    if (!u.parentId) return true;

    return !!u.permissions?.[key];
  }
 
  register(payload: any) {
    return this.http.get<any[]>(`${this.API}/user`, {
      params: { email: payload.email }
    }).pipe(
      switchMap(users => {
        if (users.length) {
          return throwError(() => new Error('Email already registered'));
        }

        return this.http.post<any>(`${this.API}/user`, {
          ...payload,
          createdAt: new Date().toISOString()
        });
      }),
      tap(user => {
        // ✅ auto login after register
        this.setUser(user);
      })
    );
  }

 
  login(email: string, password: string) {
    return this.http.get<any[]>(`${this.API}/user`, {
      params: { email }
    }).pipe(
      switchMap(users => {
        if (!users.length) {
          return throwError(() => new Error('User not found'));
        }

        const user = users[0];

        if (user.password !== password) {
          return throwError(() => new Error('Invalid password'));
        }

        this.setUser(user);
        return [user]; // ✅ no second API call
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.user.set(null);

    // clear caches
    this.usersSubject.next([]);
    this.tasksSubject.next([]);
    this.usersLoaded = false;
    this.tasksLoaded = false;

    this.router.navigate(['/login']);
  }

  /* =====================================================
     👤 USERS (CACHED)
  ===================================================== */

  private loadUsersOnce() {
    if (this.usersLoaded) return;

    const me = this.user();
    if (!me) return;

    this.http.get<any[]>(`${this.API}/user`).pipe(
      map(users =>
        users.filter(u =>
          u.id === me.id ||
          u.parentId === me.id ||
          u.parentId === me.parentId
        )
      )
    ).subscribe(users => {
      this.usersSubject.next(users);
      this.usersLoaded = true;
    });
  }

  getUsers$(): Observable<any[]> {
    this.loadUsersOnce();
    return this.users$;
  }

  createUser(payload: any) {
    if (!this.hasPermission('createUser')) {
      return throwError(() => new Error('Permission denied'));
    }

    const me = this.user();

    const user = {
      ...payload,
      parentId: me.id,
      createdAt: new Date().toISOString()
    };

    return this.http.post<any>(`${this.API}/user`, user).pipe(
      tap(newUser => {
        this.usersSubject.next([...this.usersSubject.value, newUser]);
      })
    );
  }

  updateUser(id: string, payload: any) {
    return this.http.put<any>(`${this.API}/user/${id}`, payload).pipe(
      tap(updated => {
        this.usersSubject.next(
          this.usersSubject.value.map(u => u.id === id ? updated : u)
        );

        // 🔥 update session user instantly
        if (this.user()?.id === id) {
          this.setUser(updated);
        }
      })
    );
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.API}/user/${id}`).pipe(
      tap(() => {
        this.usersSubject.next(
          this.usersSubject.value.filter(u => u.id !== id)
        );
      })
    );
  }

  /* =====================================================
     ✅ TASKS (CACHED + DASHBOARD READY)
  ===================================================== */

  private loadTasksOnce() {
    if (this.tasksLoaded) return;

    const me = this.user();
    if (!me) return;

    this.http.get<any[]>(`${this.API}/tasks`).pipe(
      map(tasks =>
        tasks.filter(t =>
          t.createdBy === me.id ||
          t.assignedUsers?.includes(me.id) ||
          t.createdBy === me.parentId ||
          t.parentId === me.id
        )
      )
    ).subscribe(tasks => {
      this.tasksSubject.next(tasks);
      this.tasksLoaded = true;
    });
  }

  getTasks$(): Observable<any[]> {
    this.loadTasksOnce();
    return this.tasks$;
  }

  createTask(payload: any) {
    if (!this.hasPermission('createTask')) {
      return throwError(() => new Error('Permission denied'));
    }

    const me = this.user();

    const task = {
      ...payload,
      createdBy: me.id,
      parentId: me.parentId ?? me.id,
      createdAt: new Date().toISOString(),
      order_id: Date.now()
    };

    return this.http.post<any>(`${this.API}/tasks`, task).pipe(
      tap(newTask => {
        this.tasksSubject.next([...this.tasksSubject.value, newTask]);
      })
    );
  }

  updateTask(id: string, payload: any) {
    return this.http.put<any>(`${this.API}/tasks/${id}`, payload).pipe(
      tap(updated => {
        this.tasksSubject.next(
          this.tasksSubject.value.map(t => t.id === id ? updated : t)
        );
      })
    );
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.API}/tasks/${id}`).pipe(
      tap(() => {
        this.tasksSubject.next(
          this.tasksSubject.value.filter(t => t.id !== id)
        );
      })
    );
  }

  /* =====================================================
     🔐 PROFILE / CHANGE PASSWORD
  ===================================================== */

  updateProfile(userId: string, payload: {
    name?: string;
    bio?: string;
    phone?: string;
    address?: string;
  }) {
    return this.http.put<any>(`${this.API}/user/${userId}`, payload).pipe(
      tap(updated => {
        if (this.user()?.id === userId) {
          this.setUser(updated);
        }
      })
    );
  }

  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    return this.http.get<any>(`${this.API}/user/${userId}`).pipe(
      switchMap(user => {
        if (user.password !== currentPassword) {
          return throwError(() => new Error('Current password is incorrect'));
        }

        return this.http.put<any>(`${this.API}/user/${userId}`, {
          password: newPassword
        });
      }),
      tap(updated => {
        if (this.user()?.id === userId) {
          this.setUser(updated);
        }
      })
    );
  }

  /* =====================================================
     🧠 INTERNAL HELPERS
  ===================================================== */

  
  private getStoredUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  get tasksSnapshot(): any[] {
    return this.tasksSubject.value;
  }

  updateTaskOptimistic(id: string, changes: Partial<any>) {
    // update UI immediately
    this.tasksSubject.next(
      this.tasksSnapshot.map(t =>
        t.id === id ? { ...t, ...changes } : t
      )
    );

    // backend sync
    return this.http.put(`${this.API}/tasks/${id}`, changes);
  }

  createTaskOptimistic(payload: any) {
    if (!this.hasPermission('createTask')) {
      return throwError(() => new Error('Permission denied'));
    }

    const me = this.user();
    const tempId = 'tmp-' + Date.now();

    const optimistic = {
      ...payload,
      id: tempId,
      createdBy: me.id,
      parentId: me.parentId ?? me.id,
      createdAt: new Date().toISOString(),
      order_id: Date.now()
    };

    // UI first
    this.tasksSubject.next([...this.tasksSnapshot, optimistic]);

    // backend
    return this.http.post<any>(`${this.API}/tasks`, optimistic).pipe(
      tap(real => {
        this.tasksSubject.next(
          this.tasksSnapshot.map(t => t.id === tempId ? real : t)
        );
      })
    );
  }

  deleteTaskOptimistic(id: string) {
    // UI first
    this.tasksSubject.next(
      this.tasksSnapshot.filter(t => t.id !== id)
    );

    return this.http.delete(`${this.API}/tasks/${id}`);
  }

  batchUpdateTasks(
    patches: { id: string; changes: Partial<any> }[]
  ) {
    // UI already updated → backend only
    return Promise.all(
      patches.map(p =>
        this.http.put(`${this.API}/tasks/${p.id}`, p.changes).toPromise()
      )
    );
  }

  private setUser(user: any) {
    const withMeta = {
      ...user,
      _lastSync: Date.now()
    };

    localStorage.setItem('user', JSON.stringify(withMeta));
    this.user.set(withMeta);
  }

  /* =====================
   🔍 USER ↔ TASK CHECK
===================== */
  hasAssignedTasks(userId: string): boolean {
    return this.tasksSnapshot.some(task =>
      Array.isArray(task.assignedUsers) &&
      task.assignedUsers.includes(userId)
    );
  }

  /* =====================
     🎯 TASK FILTER (REDIRECT)
  ===================== */
  private taskFilterUserSubject = new BehaviorSubject<string | null>(null);
  taskFilterUser$ = this.taskFilterUserSubject.asObservable();

  setTaskFilterUser(userId: string | null) {
    this.taskFilterUserSubject.next(userId);
  }


}
