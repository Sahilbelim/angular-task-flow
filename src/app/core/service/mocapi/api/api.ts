
// // import { Injectable, signal } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import {
// //   BehaviorSubject,
// //   Observable,
// //   switchMap,
// //   tap,
// //   throwError,
// //   map,
// //   take,
// // } from 'rxjs';
// // import { Router } from '@angular/router';
// // import { CommonApiService } from './common-api.service';

// // @Injectable({ providedIn: 'root' })
// // export class ApiService {

// //   private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

// //   /* =====================================================
// //     🔐 AUTH STATE (SIGNAL)
// //   ===================================================== */
// //   user = signal<any | null>(this.getStoredUser());

// //   /* =====================================================
// //     📦 GLOBAL CACHES (STORES)
// //   ===================================================== */
// //   private usersSubject = new BehaviorSubject<any[]>([]);
// //   private tasksSubject = new BehaviorSubject<any[]>([]);

// //   users$ = this.usersSubject.asObservable();
// //   tasks$ = this.tasksSubject.asObservable();

// //   private usersLoaded = false;
// //   private tasksLoaded = false;
// //   private currentUserLoaded = false;

// //   // ui state
// //   private overlayOpenSubject = new BehaviorSubject<boolean>(false);
// //   overlayOpen$ = this.overlayOpenSubject.asObservable();
// //   constructor(
// //     private http: HttpClient,
// //     private router: Router,
// //     private api: CommonApiService
// //   ) { }

// //   private currentUserSubject = new BehaviorSubject<any | null>(null);
// //   currentUser$ = this.currentUserSubject.asObservable();

// //   private countriesSubject = new BehaviorSubject<string[]>([]);
// //   countries$ = this.countriesSubject.asObservable();

// //   private countriesLoaded = false;



// //   setOverlay(open: boolean) {
// //     this.overlayOpenSubject.next(open);
// //   }

// //   getUser() {
// //     return this.currentUserSubject.value;
// //   }

// //   /* =========================
// //   🔐 GET USER FROM BACKEND
// // ========================= */


// //   getCurrentUser() {
// //     if (this.currentUserLoaded) {
// //       return; // ✅ already fetched once → do nothing
// //     }

// //     const stored = this.getStoredUser();
// //     if (!stored?.id) return;

// //     this.currentUserLoaded = true;

// //     return this.http.get<any>(`${this.API}/user/${stored.id}`).pipe(
// //       tap(user => {
// //         this.setUser(user);
// //         this.currentUserSubject.next(user);
// //       })
// //     );
// //   }


// //   /* =========================
// //     🔐 LOAD USER FROM STORAGE
// //   ========================= */
// //   loadUserFromStorage() {
// //     const user = this.getStoredUser();
// //     if (user) {
// //       this.currentUserSubject.next(user);
// //       this.user.set(user);
// //     }
// //   }



// //   /* =====================================================
// //     🔐 AUTH / SESSION
// //   ===================================================== */

// //   isLoggedIn(): boolean {
// //     return !!this.user();
// //   }

// //   currentUser() {
// //     return this.user();
// //   }

// //   hasPermission(key: string): boolean {
// //     const u = this.user();
// //     if (!u) return false;

// //     // parent (admin) has full access
// //     if (!u.parentId) return true;

// //     return !!u.permissions?.[key];
// //   }


// //   register(payload: any) {
// //     return this.http.get<any[]>(`${this.API}/user`).pipe(
// //       switchMap(users => {
// //         const exists = users.some(
// //           u => u.email?.toLowerCase() === payload.email.toLowerCase()
// //         );

// //         if (exists) {
// //           return throwError(() => new Error('Email already registered'));
// //         }

// //         return this.http.post<any>(`${this.API}/user`, {
// //           ...payload,
// //           createdAt: new Date().toISOString()
// //         });
// //       }),
// //       tap(user => {
// //         // ✅ auto login after register
// //         this.setUser(user);
// //       })
// //     );
// //   }


// //   login(email: string, password: string) {
// //     return this.http.get<any[]>(`${this.API}/user`, {
// //       params: { email }
// //     }).pipe(
// //       switchMap(users => {
// //         if (!users.length) {
// //           return throwError(() => new Error('User not found'));
// //         }

// //         const user = users[0];

// //         if (user.password !== password) {
// //           return throwError(() => new Error('Invalid password'));
// //         }

// //         this.setUser(user);
// //         return [user]; // ✅ no second API call
// //       })
// //     );
// //   }

// //   logout() {
// //     localStorage.removeItem('user');
// //     this.user.set(null);
// //     this.currentUserSubject.next(null);
// //     // clear caches
// //     this.usersSubject.next([]);
// //     this.tasksSubject.next([]);
// //     this.usersLoaded = false;
// //     this.tasksLoaded = false;

// //     this.router.navigate(['/login']);
// //   }

// //   /* =====================================================
// //     👤 USERS (CACHED)
// //   ===================================================== */


// //   private loadUsersOnce() {
// //     if (this.usersLoaded) return;

// //     const me = this.user();
// //     if (!me) return;

// //     this.http.get<any[]>(`${this.API}/user`).pipe(
// //       map(users => {
// //         // 🔴 ROOT USER (parentId === null)
// //         if (!me.parentId) {
// //           return users.filter(u =>
// //             u.id === me.id ||        // me
// //             u.parentId === me.id     // my children ONLY
// //           );
// //         }

// //         // 🟢 CHILD USER
// //         return users.filter(u =>
// //           u.id === me.id ||                // me
// //           u.parentId === me.parentId ||    // my siblings
// //           u.parentId === me.id             // my children
// //         );
// //       })
// //     ).subscribe(users => {
// //       this.usersSubject.next(users);
// //       this.usersLoaded = true;
// //     });
// //   }

// //   getUsers$(): Observable<any[]> {
// //     this.loadUsersOnce();
// //     return this.users$;
// //   }

// //   createUser(payload: any) {
// //     if (!this.hasPermission('createUser')) {
// //       return throwError(() => new Error('Permission denied'));
// //     }

// //     const me = this.user();

// //     const user = {
// //       ...payload,
// //       parentId: me.id,
// //       createdAt: new Date().toISOString()
// //     };

// //     return this.http.post<any>(`${this.API}/user`, user).pipe(
// //       tap(newUser => {
// //         this.usersSubject.next([...this.usersSubject.value, newUser]);
// //       })
// //     );
// //   }
// //   updateUser(id: string, payload: any) {
// //     return this.http.put<any>(`${this.API}/user/${id}`, payload).pipe(
// //       tap(updated => {

// //         // 1️⃣ Update users list
// //         this.usersSubject.next(
// //           this.usersSubject.value.map(u => u.id === id ? updated : u)
// //         );

// //         // 2️⃣ If updated user is CURRENT user → sync session
// //         if (this.user()?.id === id) {

// //           // 🔥 update signal + localStorage
// //           this.setUser(updated);

// //           // 🔥 update observable user
// //           this.currentUserSubject.next(updated);

// //           // 🔥 RESET permission-based caches
// //           this.usersLoaded = false;
// //           this.tasksLoaded = false;
// //           this.currentUserLoaded = false;

// //           // 🔥 reload users/tasks with new permissions
// //           this.loadUsersOnce();
// //           this.loadTasksOnce();
// //         }
// //       })
// //     );
// //   }

// //   deleteUser(id: string) {
// //     return this.http.delete(`${this.API}/user/${id}`).pipe(
// //       tap(() => {
// //         this.usersSubject.next(
// //           this.usersSubject.value.filter(u => u.id !== id)
// //         );
// //       })
// //     );
// //   }

// //   /* =====================================================
// //     ✅ TASKS (CACHED + DASHBOARD READY)
// //   ===================================================== */

// //   private loadTasksOnce() {
// //     if (this.tasksLoaded) return;

// //     const me = this.user();
// //     if (!me) return;

// //     this.http.get<any[]>(`${this.API}/tasks`).pipe(
// //       map(tasks =>
// //         tasks.filter(t =>
// //           t.createdBy === me.id ||
// //           t.assignedUsers?.includes(me.id) ||
// //           t.createdBy === me.parentId ||
// //           t.parentId === me.id
// //         )
// //       )
// //     ).subscribe(tasks => {
// //       this.tasksSubject.next(tasks);
// //       this.tasksLoaded = true;
// //     });
// //   }

// //   getTasks$(): Observable<any[]> {
// //     this.loadTasksOnce();
// //     return this.tasks$;
// //   }


// //   createTask(payload: any) {
// //     if (!this.hasPermission('createTask')) {
// //       return throwError(() => new Error('Permission denied'));
// //     }

// //     const me = this.user();

// //     const task = {
// //       ...payload,
// //       createdBy: me.id,
// //       parentId: me.parentId ?? me.id,
// //       createdAt: new Date().toISOString(),
// //       order_id: Date.now()
// //     };

// //     return this.http.post<any>(`${this.API}/tasks`, task).pipe(
// //       tap(newTask => {
// //         this.tasksSubject.next([...this.tasksSubject.value, newTask]);
// //       })
// //     );
// //   }

// //   updateTask(id: string, payload: any) {
// //     return this.http.put<any>(`${this.API}/tasks/${id}`, payload).pipe(
// //       tap(updated => {
// //         this.tasksSubject.next(
// //           this.tasksSubject.value.map(t => t.id === id ? updated : t)
// //         );
// //       })
// //     );
// //   }

// //   deleteTask(id: string) {
// //     return this.http.delete(`${this.API}/tasks/${id}`).pipe(
// //       tap(() => {
// //         this.tasksSubject.next(
// //           this.tasksSubject.value.filter(t => t.id !== id)
// //         );
// //       })
// //     );
// //   }

// //   /* =====================================================
// //     🔐 PROFILE / CHANGE PASSWORD
// //   ===================================================== */

// //   updateProfile(userId: string, payload: {
// //     name?: string;
// //     bio?: string;
// //     phone?: string;
// //     address?: string;
// //   }) {
// //     return this.http.put<any>(`${this.API}/user/${userId}`, payload).pipe(
// //       tap(updated => {
// //         if (this.user()?.id === userId) {
// //           this.setUser(updated);
// //         }
// //       })
// //     );
// //   }

// //   changePassword(
// //     userId: string,
// //     currentPassword: string,
// //     newPassword: string
// //   ) {

// //     return this.http.get<any>(`${this.API}/user/${userId}`).pipe(
// //       switchMap(user => {
// //         if (user.password !== currentPassword) {
// //           return throwError(() => new Error('Current password is incorrect'));
// //         }

// //         return this.http.put<any>(`${this.API}/user/${userId}`, {
// //           password: newPassword
// //         });
// //       }),
// //       tap(updated => {
// //         if (this.user()?.id === userId) {
// //           this.setUser(updated);
// //         }
// //       })
// //     );
// //   }

// //   /* =====================================================
// //     🧠 INTERNAL HELPERS
// //   ===================================================== */


// //   private getStoredUser() {
// //     const raw = localStorage.getItem('user');
// //     return raw ? JSON.parse(raw) : null;
// //   }

// //   get tasksSnapshot(): any[] {
// //     return this.tasksSubject.value;
// //   }

// //   updateTaskOptimistic(id: string, changes: Partial<any>) {
// //     // update UI immediately
// //     this.tasksSubject.next(
// //       this.tasksSnapshot.map(t =>
// //         t.id === id ? { ...t, ...changes } : t
// //       )
// //     );

// //     // backend sync
// //     return this.http.put(`${this.API}/tasks/${id}`, changes);
// //   }

// //   createTaskOptimistic(payload: any) {
// //     if (!this.hasPermission('createTask')) {
// //       return throwError(() => new Error('Permission denied'));
// //     }

// //     const me = this.user();
// //     const tempId = 'tmp-' + Date.now();

// //     const optimistic = {
// //       ...payload,
// //       id: tempId,
// //       createdBy: me.id,
// //       parentId: me.parentId ?? me.id,
// //       createdAt: new Date().toISOString(),
// //       order_id: Date.now()
// //     };

// //     // UI first
// //     this.tasksSubject.next([...this.tasksSnapshot, optimistic]);

// //     // backend
// //     return this.http.post<any>(`${this.API}/tasks`, optimistic).pipe(
// //       tap(real => {
// //         this.tasksSubject.next(
// //           this.tasksSnapshot.map(t => t.id === tempId ? real : t)
// //         );
// //       })
// //     );
// //   }

// //   deleteTaskOptimistic(id: string) {
// //     // UI first
// //     this.tasksSubject.next(
// //       this.tasksSnapshot.filter(t => t.id !== id)
// //     );

// //     return this.http.delete(`${this.API}/tasks/${id}`);
// //   }

// //   batchUpdateTasks(
// //     patches: { id: string; changes: Partial<any> }[]
// //   ) {
// //     // UI already updated → backend only
// //     return Promise.all(
// //       patches.map(p =>
// //         this.http.put(`${this.API}/tasks/${p.id}`, p.changes).toPromise()
// //       )
// //     );
// //   }

// //   private setUser(user: any) {
// //     const withMeta = {
// //       ...user,
// //       _lastSync: Date.now()
// //     };

// //     localStorage.setItem('user', JSON.stringify(withMeta));
// //     this.user.set(withMeta);
// //   }

// //   /* =====================
// //   🔍 USER ↔ TASK CHECK
// // ===================== */
// //   hasAssignedTasks$(userId: string | number) {
// //     return this.tasks$.pipe(          // observable of tasks
// //       map(tasks =>
// //         tasks.some(task =>
// //           Array.isArray(task.assignedUsers) &&
// //           task.assignedUsers.map(String).includes(String(userId))
// //         )
// //       ),
// //       take(1)
// //     );
// //   }


// //   /* =====================
// //     🎯 TASK FILTER (REDIRECT)
// //   ===================== */
// //   private taskFilterUserSubject = new BehaviorSubject<string | null>(null);
// //   taskFilterUser$ = this.taskFilterUserSubject.asObservable();

// //   setTaskFilterUser(userId: string | null) {
// //     this.taskFilterUserSubject.next(userId);
// //   }


// //   private loadCountriesOnce() {
// //     if (this.countriesLoaded) return;

// //     this.countriesLoaded = true;

// //     this.http
// //       .get<any[]>('https://restcountries.com/v3.1/all?fields=name')
// //       .pipe(
// //         map(res =>
// //           res
// //             .map(c => c.name?.common)
// //             .filter(Boolean)
// //             .sort((a, b) => a.localeCompare(b))
// //         )
// //       )
// //       .subscribe({
// //         next: (countries) => {
// //           this.countriesSubject.next(countries);
// //         },
// //         error: () => {
// //           this.countriesLoaded = false; // retry possible
// //         }
// //       });
// //   }

// //   getCountries$() {
// //     this.loadCountriesOnce();
// //     return this.countries$;
// //   }
// //   ensureTasksLoaded$(): Observable<any[]> {
// //     if (this.tasksLoaded) {
// //       return this.tasks$.pipe(take(1));
// //     }

// //     return this.http.get<any[]>(`${this.API}/tasks`).pipe(
// //       tap(tasks => {
// //         this.tasksSubject.next(tasks);
// //         this.tasksLoaded = true;
// //       })
// //     );
// //   }


// //   isPageReload(): boolean {
// //     return performance
// //       .getEntriesByType('navigation')
// //       .some((nav: any) => nav.type === 'reload');
// //   }


// // }

// import { Injectable, signal } from '@angular/core';
// import {
//   BehaviorSubject,
//   Observable,
//   switchMap,
//   tap,
//   throwError,
//   map,
//   take,
// } from 'rxjs';
// import { Router } from '@angular/router';
// import { CommonApiService } from './common-api.service';

// @Injectable({ providedIn: 'root' })
// export class ApiService {

//   user = signal<any | null>(this.getStoredUser());

//   private usersSubject = new BehaviorSubject<any[]>([]);
//   private tasksSubject = new BehaviorSubject<any[]>([]);

//   users$ = this.usersSubject.asObservable();
//   tasks$ = this.tasksSubject.asObservable();

//   private usersLoaded = false;
//   private tasksLoaded = false;
//   private currentUserLoaded = false;

//   private overlayOpenSubject = new BehaviorSubject<boolean>(false);
//   overlayOpen$ = this.overlayOpenSubject.asObservable();

//   private currentUserSubject = new BehaviorSubject<any | null>(null);
//   currentUser$ = this.currentUserSubject.asObservable();

//   private countriesSubject = new BehaviorSubject<string[]>([]);
//   countries$ = this.countriesSubject.asObservable();
//   private countriesLoaded = false;

//   constructor(
//     private router: Router,
//     private api: CommonApiService
//   ) { }

//   setOverlay(open: boolean) {
//     this.overlayOpenSubject.next(open);
//   }

//   getUser() {
//     return this.currentUserSubject.value;
//   }

//   /* ================= CURRENT USER ================= */

//   getCurrentUser() {
//     if (this.currentUserLoaded) return;

//     const stored = this.getStoredUser();
//     if (!stored?.id) return;

//     this.currentUserLoaded = true;

//     return this.api.getUserById(stored.id).pipe(
//       tap(user => {
//         this.setUser(user);
//         this.currentUserSubject.next(user);
//       })
//     );
//   }

//   loadUserFromStorage() {
//     const user = this.getStoredUser();
//     if (user) {
//       this.currentUserSubject.next(user);
//       this.user.set(user);
//     }
//   }

//   isLoggedIn(): boolean {
//     return !!this.user();
//   }

//   currentUser() {
//     return this.user();
//   }

//   hasPermission(key: string): boolean {
//     const u = this.user();
//     if (!u) return false;
//     if (!u.parentId) return true;
//     return !!u.permissions?.[key];
//   }

//   /* ================= AUTH ================= */

//   register(payload: any) {
//     return this.api.getUsers().pipe(
//       switchMap(users => {
//         const exists = users.some(
//           u => u.email?.toLowerCase() === payload.email.toLowerCase()
//         );

//         if (exists) {
//           return throwError(() => new Error('Email already registered'));
//         }

//         return this.api.createUser({
//           ...payload,
//           createdAt: new Date().toISOString()
//         });
//       }),
//       tap(user => this.setUser(user))
//     );
//   }

//   login(email: string, password: string) {
//     return this.api.getUsers({ email }).pipe(
//       switchMap(users => {
//         if (!users.length) return throwError(() => new Error('User not found'));

//         const user = users[0];
//         if (user.password !== password)
//           return throwError(() => new Error('Invalid password'));

//         this.setUser(user);
//         return [user];
//       })
//     );
//   }

//   logout() {
//     localStorage.removeItem('user');
//     this.user.set(null);
//     this.currentUserSubject.next(null);
//     this.usersSubject.next([]);
//     this.tasksSubject.next([]);
//     this.usersLoaded = false;
//     this.tasksLoaded = false;
//     this.router.navigate(['/login']);
//   }

//   /* ================= USERS ================= */

//   private loadUsersOnce() {
//     if (this.usersLoaded) return;
//     const me = this.user();
//     if (!me) return;

//     this.api.getUsers().pipe(
//       map(users => {
//         if (!me.parentId) {
//           return users.filter(u => u.id === me.id || u.parentId === me.id);
//         }
//         return users.filter(u =>
//           u.id === me.id ||
//           u.parentId === me.parentId ||
//           u.parentId === me.id
//         );
//       })
//     ).subscribe(users => {
//       this.usersSubject.next(users);
//       this.usersLoaded = true;
//     });

//     // this.api.get('user').subscribe(users => {
//     //   console.log('Fetched users:', users);
//     // });
//   }

//   getUsers$(): Observable<any[]> {
//     this.loadUsersOnce();
//     return this.users$;
//   }

//   createUser(payload: any) {
//     if (!this.hasPermission('createUser'))
//       return throwError(() => new Error('Permission denied'));

//     const me = this.user();

//     return this.api.createUser({
//       ...payload,
//       parentId: me.id,
//       createdAt: new Date().toISOString()
//     }).pipe(
//       tap(newUser => {
//         this.usersSubject.next([...this.usersSubject.value, newUser]);
//       })
//     );
//   }

//   updateUser(id: string, payload: any) {
//     return this.api.updateUser(id, payload).pipe(
//       tap(updated => {
//         this.usersSubject.next(
//           this.usersSubject.value.map(u => u.id === id ? updated : u)
//         );

//         if (this.user()?.id === id) {
//           this.setUser(updated);
//           this.currentUserSubject.next(updated);
//           this.usersLoaded = false;
//           this.tasksLoaded = false;
//           this.currentUserLoaded = false;
//           this.loadUsersOnce();
//           this.loadTasksOnce();
//         }
//       })
//     );
//   }

//   deleteUser(id: string) {
//     return this.api.deleteUser(id).pipe(
//       tap(() => {
//         this.usersSubject.next(
//           this.usersSubject.value.filter(u => u.id !== id)
//         );
//       })
//     );
//   }

//   /* ================= TASKS ================= */

//   private loadTasksOnce() {
//     if (this.tasksLoaded) return;

//     const me = this.user();
//     if (!me) return;

//     this.api.getTasks().pipe(
//       map(tasks =>
//         tasks.filter(t =>
//           t.createdBy === me.id ||
//           t.assignedUsers?.includes(me.id) ||
//           t.createdBy === me.parentId ||
//           t.parentId === me.id
//         )
//       )
//     ).subscribe(tasks => {
//       this.tasksSubject.next(tasks);
//       this.tasksLoaded = true;
//     });
//   }

//   getTasks$(): Observable<any[]> {
//     this.loadTasksOnce();
//     return this.tasks$;
//   }

//   createTask(payload: any) {
//     if (!this.hasPermission('createTask'))
//       return throwError(() => new Error('Permission denied'));

//     const me = this.user();

//     return this.api.createTask({
//       ...payload,
//       createdBy: me.id,
//       parentId: me.parentId ?? me.id,
//       createdAt: new Date().toISOString(),
//       order_id: Date.now()
//     }).pipe(
//       tap(newTask => {
//         this.tasksSubject.next([...this.tasksSubject.value, newTask]);
//       })
//     );
//   }

//   updateTask(id: string, payload: any) {
//     return this.api.updateTask(id, payload).pipe(
//       tap(updated => {
//         this.tasksSubject.next(
//           this.tasksSubject.value.map(t => t.id === id ? updated : t)
//         );
//       })
//     );
//   }

//   deleteTask(id: string) {
//     return this.api.deleteTask(id).pipe(
//       tap(() => {
//         this.tasksSubject.next(
//           this.tasksSubject.value.filter(t => t.id !== id)
//         );
//       })
//     );
//   }

//   /* ================= HELPERS ================= */

//   private getStoredUser() {
//     const raw = localStorage.getItem('user');
//     return raw ? JSON.parse(raw) : null;
//   }

//   private setUser(user: any) {
//     const withMeta = { ...user, _lastSync: Date.now() };
//     localStorage.setItem('user', JSON.stringify(withMeta));
//     this.user.set(withMeta);
//   }

//   updateProfile(userId: string, payload: any) {
//     return this.api.updateUser(userId, payload).pipe(
//       tap(updated => {
//         if (this.user()?.id === userId) {
//           this.setUser(updated);
//         }
//       })
//     );
//   }

//   changePassword(userId: string, currentPassword: string, newPassword: string) {
//     return this.api.getUserById(userId).pipe(
//       switchMap(user => {
//         if (user.password !== currentPassword) {
//           return throwError(() => new Error('Current password is incorrect'));
//         }
//         return this.api.updateUser(userId, { password: newPassword });
//       }),
//       tap(updated => {
//         if (this.user()?.id === userId) {
//           this.setUser(updated);
//         }
//       })
//     );
//   }
//   private taskFilterUserSubject = new BehaviorSubject<string | null>(null);
//   taskFilterUser$ = this.taskFilterUserSubject.asObservable();

//   setTaskFilterUser(userId: string | null) {
//     this.taskFilterUserSubject.next(userId);
//   }
//   private loadCountriesOnce() {
//     if (this.countriesLoaded) return;

//     this.countriesLoaded = true;

//     this.api.getCountries().pipe(
//       map(res =>
//         res
//           .map((c: any) => c.name?.common)
//           .filter(Boolean)
//           .sort((a: string, b: string) => a.localeCompare(b))
//       )
//     ).subscribe({
//       next: (countries) => this.countriesSubject.next(countries),
//       error: () => this.countriesLoaded = false
//     });
//   }

//   getCountries$() {
//     this.loadCountriesOnce();
//     return this.countries$;
//   }
//   get tasksSnapshot(): any[] {
//     return this.tasksSubject.value;
//   }

//   updateTaskOptimistic(id: string, changes: Partial<any>) {
//     this.tasksSubject.next(
//       this.tasksSnapshot.map(t =>
//         t.id === id ? { ...t, ...changes } : t
//       )
//     );

//     return this.api.updateTask(id, changes);
//   }

//   createTaskOptimistic(payload: any) {
//     if (!this.hasPermission('createTask')) {
//       return throwError(() => new Error('Permission denied'));
//     }

//     const me = this.user();
//     const tempId = 'tmp-' + Date.now();

//     const optimistic = {
//       ...payload,
//       id: tempId,
//       createdBy: me.id,
//       parentId: me.parentId ?? me.id,
//       createdAt: new Date().toISOString(),
//       order_id: Date.now()
//     };

//     this.tasksSubject.next([...this.tasksSnapshot, optimistic]);

//     return this.api.createTask(optimistic).pipe(
//       tap(real => {
//         this.tasksSubject.next(
//           this.tasksSnapshot.map(t => t.id === tempId ? real : t)
//         );
//       })
//     );
//   }

//   deleteTaskOptimistic(id: string) {
//     this.tasksSubject.next(this.tasksSnapshot.filter(t => t.id !== id));
//     return this.api.deleteTask(id);
//   }
//   batchUpdateTasks(patches: { id: string; changes: Partial<any> }[]) {
//     return Promise.all(
//       patches.map(p =>
//         this.api.updateTask(p.id, p.changes).toPromise()
//       )
//     );
//   }
//   ensureTasksLoaded$(): Observable<any[]> {
//     if (this.tasksLoaded) {
//       return this.tasks$.pipe(take(1));
//     }

//     return this.api.getTasks().pipe(
//       tap(tasks => {
//         this.tasksSubject.next(tasks);
//         this.tasksLoaded = true;
//       })
//     );
//   }

// }

// import { Injectable, signal } from '@angular/core';
// import { BehaviorSubject, Observable, map, tap, take, switchMap } from 'rxjs';
// import { Router } from '@angular/router';
// import { CommonApiService } from './common-api.service';

// @Injectable({ providedIn: 'root' })
// export class ApiService {

//   /* =====================================================
//      🔐 AUTH SESSION (GLOBAL)
//   ===================================================== */

//   private appReadySubject = new BehaviorSubject<boolean>(false);
//   appReady$ = this.appReadySubject.asObservable();
//   private bootStarted = false;


//   private stored = this.getStoredUser();
//   user = signal<any | null>(this.stored);

//   setSession(user: any) {
//     const withMeta = { ...user, _lastSync: Date.now() };
//     localStorage.setItem('user', JSON.stringify(withMeta));
//     this.user.set(withMeta);
//     this.currentUserSubject.next(withMeta);

//     // refresh shared data when login changes
//     // this.resetCaches();
//     // this.loadUsersOnce();
//     // this.loadTasksOnce();
//     this.resetCaches();
//     this.refreshAll();

//   }

//   logout() {
//     localStorage.removeItem('user');
//     this.user.set(null);
//     this.currentUserSubject.next(null);
//     this.resetCaches();
//     this.router.navigate(['/login']);
//   }

//   isLoggedIn(): boolean {
//     return !!this.user();
//   }

//   currentUser() {
//     return this.user();
//   }

//   private getStoredUser() {
//     const raw = localStorage.getItem('user');
//     return raw ? JSON.parse(raw) : null;
//   }

//   /* =====================================================
//      👤 PROFILE STORE
//   ===================================================== */

//   private currentUserSubject = new BehaviorSubject<any | null>(this.stored);
//   currentUser$ = this.currentUserSubject.asObservable();

//   refreshProfile() {
//     const u = this.user();
//     if (!u?.id) return;

//     this.api.get<any>('user', { id: u.id }).subscribe(user => {
//       this.setSession(user);
//     });
//   }

//   /* =====================================================
//      📦 USERS CACHE (GLOBAL SHARED)
//   ===================================================== */

//   private usersSubject = new BehaviorSubject<any[]>([]);
//   users$ = this.usersSubject.asObservable();
//   private usersLoaded = false;

//   private loadUsersOnce() {
//     if (this.usersLoaded || !this.user()) return;

//     this.api.get<any[]>('user').pipe(
//       map(users => this.filterUsersByHierarchy(users))
//     ).subscribe(users => {
//       this.usersSubject.next(users);
//       this.usersLoaded = true;
//     });
//   }

//   getUsers$(): Observable<any[]> {
//     this.loadUsersOnce();
//     return this.users$;
//   }

//   refreshUsers() {
//     this.usersLoaded = false;
//     this.loadUsersOnce();
//   }

//   private filterUsersByHierarchy(users: any[]) {
//     const me = this.user();
//     if (!me) return [];

//     if (!me.parentId) {
//       return users.filter(u => u.id === me.id || u.parentId === me.id);
//     }

//     return users.filter(u =>
//       u.id === me.id ||
//       u.parentId === me.parentId ||
//       u.parentId === me.id
//     );
//   }

//   /* =====================================================
//      ✅ TASKS CACHE (GLOBAL SHARED)
//   ===================================================== */

//   private tasksSubject = new BehaviorSubject<any[]>([]);
//   tasks$ = this.tasksSubject.asObservable();
//   private tasksLoaded = false;

//   private loadTasksOnce() {
//     if (this.tasksLoaded || !this.user()) return;

//     this.api.get<any[]>('tasks').pipe(
//       map(tasks => this.filterTasksByAccess(tasks))
//     ).subscribe(tasks => {
//       this.tasksSubject.next(tasks);
//       this.tasksLoaded = true;
//     });
//   }

//   getTasks$(): Observable<any[]> {
//     this.loadTasksOnce();
//     return this.tasks$;
//   }

//   refreshTasks() {
//     this.tasksLoaded = false;
//     this.loadTasksOnce();
//   }

//   private filterTasksByAccess(tasks: any[]) {
//     const me = this.user();
//     if (!me) return [];

//     return tasks.filter(t =>
//       t.createdBy === me.id ||
//       t.assignedUsers?.includes(me.id) ||
//       t.createdBy === me.parentId ||
//       t.parentId === me.id
//     );
//   }

//   /* =====================================================
//      🌍 COUNTRIES CACHE
//   ===================================================== */

//   private countriesSubject = new BehaviorSubject<string[]>([]);
//   countries$ = this.countriesSubject.asObservable();
//   private countriesLoaded = false;

//   getCountries$(): Observable<string[]> {
//     if (!this.countriesLoaded) {
//       this.countriesLoaded = true;

//       this.api.external<any[]>(
//         'https://restcountries.com/v3.1/all?fields=name'
//       ).pipe(
//         map(res =>
//           res
//             .map(c => c.name?.common)
//             .filter(Boolean)
//             .sort((a: string, b: string) => a.localeCompare(b))
//         )
//       ).subscribe({
//         next: c => this.countriesSubject.next(c),
//         error: () => this.countriesLoaded = false
//       });
//     }

//     return this.countries$;
//   }

//   /* =====================================================
//      🎯 UI STATE
//   ===================================================== */

//   private overlayOpenSubject = new BehaviorSubject<boolean>(false);
//   overlayOpen$ = this.overlayOpenSubject.asObservable();

//   setOverlay(open: boolean) {
//     this.overlayOpenSubject.next(open);
//   }

//   /* =====================================================
//      🧠 INTERNAL HELPERS
//   ===================================================== */

//   private resetCaches() {
//     this.usersLoaded = false;
//     this.tasksLoaded = false;
//     this.usersSubject.next([]);
//     this.tasksSubject.next([]);
//   }

//   constructor(
//     private router: Router,
//     private api: CommonApiService
//   ) { }

//   /* ================= PERMISSIONS ================= */


//   isAdmin(): boolean {
//     const u = this.user();
//     if (!u) return false;
//     return !u.parentId;
//   }

//   // can(permission: string): boolean {
//   //   const u = this.user();
//   //   if (!u) return false;

//   //   // root admin has all permissions
//   //   if (!u.parentId) return true;

//   //   return !!u.permissions?.[permission];
//   // }

 
//   hasPermission(key: string): boolean {
//     const u = this.user();
//     if (!u) return false;

//     // root admin
//     if (!u.parentId) return true;

//     return !!u.permissions?.[key];
//   }


//   /* =====================================================
//    🧭 UI STATE (GLOBAL APP STATE)
// ===================================================== */

//   /* ---------- TASK FILTER (users → tasks redirect) ---------- */
//   private taskFilterUserSubject = new BehaviorSubject<string | null>(null);
//   taskFilterUser$ = this.taskFilterUserSubject.asObservable();

//   setTaskFilterUser(userId: string | null) {
//     this.taskFilterUserSubject.next(userId);
//   }

//   clearTaskFilter() {
//     this.taskFilterUserSubject.next(null);
//   }

//   /* ---------- OVERLAY / MODAL STATE ---------- */
//   // private overlaySubject = new BehaviorSubject<boolean>(false);
//   // overlay$ = this.overlaySubject.asObservable();

//   // setOverlay(open: boolean) {
//   //   this.overlaySubject.next(open);
//   // }


//   /* =====================================================
//      ✏️ TASK MUTATIONS (STORE DRIVEN)
//   ===================================================== */

//   private tasksSnapshot(): any[] {
//     return this.tasksSubject.value;
//   }

//   /* CREATE */
//   createTask(task: any) {
//     const me = this.user();
//     if (!me) return;

//     const payload = {
//       ...task,
//       createdBy: me.id,
//       parentId: me.parentId ?? me.id,
//       createdAt: new Date().toISOString(),
//       order_id: Date.now()
//     };

//     // optimistic UI
//     const tempId = 'tmp-' + Date.now();
//     const optimistic = { ...payload, id: tempId };

//     this.tasksSubject.next([...this.tasksSnapshot(), optimistic]);

//     return this.api.post<any>('tasks', payload).pipe(
//       tap(real => {
//         this.tasksSubject.next(
//           this.tasksSnapshot().map(t => t.id === tempId ? real : t)
//         );
//       })
//     );
//   }

//   /* UPDATE */
//   updateTask(id: string, changes: any) {

//     // optimistic
//     this.tasksSubject.next(
//       this.tasksSnapshot().map(t =>
//         t.id === id ? { ...t, ...changes } : t
//       )
//     );

//     return this.api.put<any>('tasks', id, changes);
//   }

//   /* DELETE */
//   deleteTask(id: string) {

//     // optimistic
//     this.tasksSubject.next(
//       this.tasksSnapshot().filter(t => t.id !== id)
//     );

//     return this.api.delete('tasks', id);
//   }

//   /* DRAG ORDER */
//   batchUpdateTasks(patches: { id: string; changes: any }[]) {
//     patches.forEach(p => {
//       this.tasksSubject.next(
//         this.tasksSnapshot().map(t =>
//           t.id === p.id ? { ...t, ...p.changes } : t
//         )
//       );
//     });

//     return Promise.all(
//       patches.map(p => this.api.put('tasks', p.id, p.changes).toPromise())
//     );
//   }


//   /* =====================================================
//    👤 PROFILE UPDATE (STORE SYNC)
// ===================================================== */

//   updateProfile(userId: string, payload: any) {

//     return this.api.put<any>('user', userId, payload).pipe(
//       tap(updated => {
//         // update global session
//         if (this.user()?.id === userId) {
//           this.setSession(updated);
//         }

//         // update users cache
//         this.usersSubject.next(
//           this.usersSubject.value.map(u =>
//             u.id === userId ? updated : u
//           )
//         );
//       })
//     );
//   }
//   /* =====================================================
//      🔐 CHANGE PASSWORD (SESSION SAFE)
//   ===================================================== */

//   changePassword(userId: string, currentPassword: string, newPassword: string) {

//     return this.api.get<any>('user', { id: userId }).pipe(
//       switchMap(user => {

//         if (user.password !== currentPassword) {
//           throw new Error('Current password is incorrect');
//         }

//         return this.api.put<any>('user', userId, { password: newPassword });
//       }),
//       tap(updated => {
//         // 🔥 VERY IMPORTANT → refresh global session
//         if (this.user()?.id === userId) {
//           this.setSession(updated);
//         }
//       })
//     );
//   }


//   loadUserFromStorage() {
//     const raw = localStorage.getItem('user');

//     if (!raw) {
//       this.appReadySubject.next(true);
//       return;
//     }

//     const parsed = JSON.parse(raw);
//     this.user.set(parsed);
//     this.currentUserSubject.next(parsed);
//   }
//   initializeApp(): Observable<boolean> {

//     // prevent multiple boots
//     if (this.bootStarted) return this.appReady$;
//     this.bootStarted = true;

//     this.loadUserFromStorage();

//     const u = this.user();

//     // no login → ready instantly
//     if (!u?.id) {
//       this.appReadySubject.next(true);
//       return this.appReady$;
//     }

//     // verify session with backend
//     this.api.get<any>('user', { id: u.id }).subscribe({
//       next: (user) => {
//         this.setSession(user); // refresh session
//         this.appReadySubject.next(true);
//       },
//       error: () => {
//         this.logout(); // invalid session
//         this.appReadySubject.next(true);
//       }
//     });

//     return this.appReady$;
//   }

//   /* =====================================================
//    🔄 GLOBAL REFRESH (SINGLE SOURCE OF TRUTH)
// ===================================================== */

//   refreshAll() {

//     const me = this.user();
//     if (!me?.id) return;

//     // reset flags so reload actually happens
//     this.usersLoaded = false;
//     this.tasksLoaded = false;

//     // load users
//     this.api.get<any[]>('user').pipe(
//       map(users => this.filterUsersByHierarchy(users))
//     ).subscribe(users => {
//       this.usersSubject.next(users);
//       this.usersLoaded = true;
//     });

//     // load tasks
//     this.api.get<any[]>('tasks').pipe(
//       map(tasks => this.filterTasksByAccess(tasks))
//     ).subscribe(tasks => {
//       this.tasksSubject.next(tasks);
//       this.tasksLoaded = true;
//     });
//   }

// }

import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, of, forkJoin, map, catchError, tap } from 'rxjs';
import { CommonApiService } from './common-api.service';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private router: Router, private http: CommonApiService) { }

  /* =====================================================
     🔐 SESSION
  ===================================================== */

  private userSignal = signal<any | null>(this.getStoredUser());
  private currentUserSubject = new BehaviorSubject<any | null>(this.userSignal());

  currentUser$ = this.currentUserSubject.asObservable();

  /* =====================================================
   LOAD CONTROL FLAGS (VERY IMPORTANT)
===================================================== */
  private usersLoaded: boolean = false;
  private tasksLoaded: boolean = false;
  private usersSubject = new BehaviorSubject<any[]>([]);
  private tasksSubject = new BehaviorSubject<any[]>([]);

  /* =========================
   🔥 HYDRATION STATE
========================= */
  private initialDataResolved = false;
  private initialResolvedSubject = new BehaviorSubject<boolean>(false);
  initialDataResolved$ = this.initialResolvedSubject.asObservable();


  currentUser() {
    return this.userSignal();
  }

  // setSession(user: any) {
  //   localStorage.setItem('user', JSON.stringify(user));
  //   this.userSignal.set(user);
  //   this.currentUserSubject.next(user);
  // }

  // setSession(user: any) {
  //   localStorage.setItem('user', JSON.stringify(user));
  //   this.userSignal.set(user);
  //   this.currentUserSubject.next(user);

  //   // reload filtered data after login switch
  //   this.initializeApp().subscribe();
  // }

  // setSession(user: any) {
  //   localStorage.setItem('user', JSON.stringify(user));
  //   this.userSignal.set(user);
  //   this.currentUserSubject.next(user);

  //   // reset caches for new permissions
  //   this.usersLoaded = false;
  //   this.tasksLoaded = false;

  //   this.loadUsersOnce();
  //   this.loadTasksOnce();
  // }

  setSession(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSignal.set(user);
    this.currentUserSubject.next(user);

    // reset caches when user changes
    this.usersLoaded = false;
    this.tasksLoaded = false;

    this.initialDataResolved = false;
    this.initialResolvedSubject.next(false);


    this.loadUsersOnce();
    this.loadTasksOnce();
  }

  // logout() {
  //   localStorage.removeItem('user');
  //   this.userSignal.set(null);
  //   this.currentUserSubject.next(null);
  //   this.usersSubject.next([]);
  //   this.tasksSubject.next([]);
  //   this.router.navigate(['/login']);
  // }

  private getStoredUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  /* =====================================================
     👥 USERS STORE
  ===================================================== */

  // private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();

  setUsers(users: any[]) {
    this.usersSubject.next(users);
  }

  addUser(user: any) {
    this.usersSubject.next([...this.usersSubject.value, user]);
  }

  updateUser(id: string, changes: any) {
    this.usersSubject.next(
      this.usersSubject.value.map(u => u.id === id ? { ...u, ...changes } : u)
    );
  }

  deleteUser(id: string) {
    this.usersSubject.next(
      this.usersSubject.value.filter(u => u.id !== id)
    );
  }

  /* =====================================================
     📋 TASKS STORE
  ===================================================== */

  // private tasksSubject = new BehaviorSubject<any[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  setTasks(tasks: any[]) {
    this.tasksSubject.next(tasks);
  }

  addTask(task: any) {
    this.tasksSubject.next([...this.tasksSubject.value, task]);
  }

  updateTask(id: string, changes: any) {
    this.tasksSubject.next(
      this.tasksSubject.value.map(t => t.id === id ? { ...t, ...changes } : t)
    );
  }

  deleteTask(id: string) {
    this.tasksSubject.next(
      this.tasksSubject.value.filter(t => t.id !== id)
    );
  }

  reorderTasks(tasks: any[]) {
    this.tasksSubject.next([...tasks]);
  }

  /* =====================================================
     🔐 PERMISSIONS
  ===================================================== */

  hasPermission(key: string): boolean {
    const u = this.userSignal();
    if (!u) return false;
    if (!u.parentId) return true;
    return !!u.permissions?.[key];
  }

  /* =====================================================
     🎯 UI STATE
  ===================================================== */

  private overlaySubject = new BehaviorSubject<boolean>(false);
  overlayOpen$ = this.overlaySubject.asObservable();

  setOverlay(open: boolean) {
    this.overlaySubject.next(open);
  }
  /* =====================================================
   🔎 TASK FILTER (UI STATE)
===================================================== */

  private taskFilterUserSubject = new BehaviorSubject<string | null>(null);


  taskFilterUser$ = this.taskFilterUserSubject.asObservable();


  consumeTaskFilter(): string | null {
    const value = this.taskFilterUserSubject.value;
    this.taskFilterUserSubject.next(null); // auto clear after read
    return value;
  }
  setTaskFilterUser(userId: string | null) {
    this.taskFilterUserSubject.next(userId);
  }

  clearTaskFilter() {
    this.taskFilterUserSubject.next(null);
  }
  /* =====================================================
     🚀 APP INITIALIZER (GLOBAL DATA LOADER)
  ===================================================== */

  // initializeApp(): Observable<boolean> {

  //   const storedUser = this.getStoredUser();

  //   // No login → app ready immediately
  //   if (!storedUser) {
  //     this.currentUserSubject.next(null);
  //     return of(true);
  //   }

  //   // restore session
  //   this.setSession(storedUser);

  //   // load master data once
  //   return forkJoin({
  //     users: this.http.get('user'),
  //     tasks: this.http.get('tasks')
  //   }).pipe(

  //     tap(({ users, tasks }: any) => {
  //       this.setUsers(users || []);
  //       this.setTasks(tasks || []);
  //     }),

  //     map(() => true),

  //     catchError(() => {
  //       // backend failed → logout safely
  //       this.logout();
  //       return of(true);
  //     })
  //   );
  // }

  /* =====================================================
   🚀 APP INITIALIZER (HIERARCHY SAFE)
===================================================== */

  // initializeApp(): Observable<boolean> {

  //   const storedUser = this.getStoredUser();

  //   // no login
  //   if (!storedUser) {
  //     this.currentUserSubject.next(null);
  //     return of(true);
  //   }

  //   // restore session
  //   this.setSession(storedUser);

  //   // fetch backend once
  //   return forkJoin({
  //     users: this.http.get('user'),
  //     tasks: this.http.get('tasks')
  //   }).pipe(

  //     tap(({ users, tasks }: any) => {

  //       // 🔥 FILTER BEFORE ENTERING STORE
  //       const safeUsers = this.filterUsersByHierarchy(users || []);
  //       const safeTasks = this.filterTasksByHierarchy(tasks || []);

  //       this.setUsers(safeUsers);
  //       this.setTasks(safeTasks);
  //     }),

  //     map(() => true),

  //     catchError(() => {
  //       this.logout();
  //       return of(true);
  //     })
  //   );
  // }

  /* =====================================================
   🚀 BOOTSTRAP APP (SAFE LOAD)
===================================================== */

  // initializeApp(): Observable<boolean> {

  //   const stored = this.getStoredUser();

  //   if (!stored) {
  //     this.currentUserSubject.next(null);
  //     return of(true);
  //   }

  //   // restore session
  //   this.setSession(stored);

  //   // load filtered data
  //   this.loadUsersOnce();
  //   this.loadTasksOnce();

  //   return of(true);
  // }

  /* =====================================================
   🚀 APP INITIALIZER (HIERARCHY SAFE)
===================================================== */

  initializeApp(): Observable<boolean> {

    const storedUser = this.getStoredUser();

    // no session
    if (!storedUser) {
      this.currentUserSubject.next(null);
      return of(true);
    }

    // restore login
    this.setSession(storedUser);

    // load filtered data
    this.loadUsersOnce();
    this.loadTasksOnce();

    return of(true);
  }

  private usersLoading = false;
  private tasksLoading = false;


  // private loadUsersOnce() {

  //   if (this.usersLoaded) return;

  //   const me = this.userSignal();
  //   if (!me) return;

  //   this.http.get<any[]>('user')
  //     .pipe(
  //       map(users => {

  //         // ROOT ADMIN
  //         if (!me.parentId) {
  //           return users.filter(u =>
  //             u.id === me.id ||
  //             u.parentId === me.id
  //           );
  //         }

  //         // CHILD USER
  //         return users.filter(u =>
  //           u.id === me.id ||
  //           u.parentId === me.parentId ||
  //           u.parentId === me.id
  //         );
  //       })
  //     )
  //     .subscribe(users => {
  //       this.usersSubject.next(users);
  //       this.usersLoaded = true;
  //     });
  // }
  private loadUsersOnce() {

    // already loaded → do nothing
    if (this.usersLoaded) return;

    // already loading → do nothing
    if (this.usersLoading) return;

    const me = this.userSignal();
    if (!me) return;

    this.usersLoading = true;   // 🔥 lock request

    this.http.get<any[]>('user')
      .pipe(
        map(users => {

          if (!me.parentId) {
            return users.filter(u =>
              u.id === me.id ||
              u.parentId === me.id
            );
          }

          return users.filter(u =>
            u.id === me.id ||
            u.parentId === me.parentId ||
            u.parentId === me.id
          );
        })
      )
      .subscribe({
        // next: users => {
        //   this.usersSubject.next(users);
        //   this.usersLoaded = true;
        //   this.usersLoading = false;  // 🔥 unlock
        // },
        next: users => {
          this.usersSubject.next(users);
          this.usersLoaded = true;
          this.usersLoading = false;

          this.markInitialResolved(); // ⭐ added
        },

        error: () => {
          this.usersLoading = false;  // 🔥 unlock on error
        }
      });
  }

  private markInitialResolved() {
    if (this.usersLoaded && this.tasksLoaded && !this.initialDataResolved) {
      this.initialDataResolved = true;
      this.initialResolvedSubject.next(true);
    }
  }


  /* =====================================================
   📋 LOAD TASKS ONCE (HIERARCHY SAFE)
===================================================== */

// private loadTasksOnce() {

//   if (this.tasksLoaded) return;

//   const me = this.userSignal();
//   if (!me) return;

//   this.http.get<any[]>('tasks')
//     .pipe(
//       map(tasks =>
//         tasks.filter(t =>
//           t.createdBy === me.id ||
//           t.assignedUsers?.includes(me.id) ||
//           t.createdBy === me.parentId ||
//           t.parentId === me.id
//         )
//       )
//     )
//     .subscribe(tasks => {
//       this.tasksSubject.next(tasks);
//       this.tasksLoaded = true;
//     });
// }

  // private loadTasksOnce() {

  //   if (this.tasksLoaded) return;

  //   const me = this.userSignal();
  //   if (!me) return;

  //   this.http.get<any[]>('tasks')
  //     .pipe(
  //       map(tasks =>
  //         tasks.filter(t =>
  //           t.createdBy === me.id ||
  //           t.assignedUsers?.includes(me.id) ||
  //           t.createdBy === me.parentId ||
  //           t.parentId === me.id
  //         )
  //       )
  //     )
  //     .subscribe(tasks => {
  //       this.tasksSubject.next(tasks);
  //       this.tasksLoaded = true;
  //     });
  // }

  private loadTasksOnce() {

    if (this.tasksLoaded) return;
    if (this.tasksLoading) return;

    const me = this.userSignal();
    if (!me) return;

    this.tasksLoading = true;   // 🔥 lock

    this.http.get<any[]>('tasks')
      .pipe(
        map(tasks =>
          tasks.filter(t =>
            t.createdBy === me.id ||
            t.assignedUsers?.includes(me.id) ||
            t.createdBy === me.parentId ||
            t.parentId === me.id
          )
        )
      )
      .subscribe({
        // next: tasks => {
        //   this.tasksSubject.next(tasks);
        //   this.tasksLoaded = true;
        //   this.tasksLoading = false; // 🔥 unlock
        // },
        next: tasks => {
          this.tasksSubject.next(tasks);
          this.tasksLoaded = true;
          this.tasksLoading = false;

          this.markInitialResolved(); // ⭐ added
        },

        error: () => {
          this.tasksLoading = false;
        }
      });
  }

  
  getUsers$(): Observable<any[]> {
    this.loadUsersOnce();
    return this.users$;
  }

  getTasks$(): Observable<any[]> {
    this.loadTasksOnce();
    return this.tasks$;
  }


  // logout() {
  //   localStorage.removeItem('user');
  //   this.userSignal.set(null);
  //   this.currentUserSubject.next(null);

  //   this.usersLoaded = false;
  //   this.tasksLoaded = false;

  //   this.usersSubject.next([]);
  //   this.tasksSubject.next([]);

  //   this.router.navigate(['/login']);
  // }

  logout() {
    localStorage.removeItem('user');
    this.userSignal.set(null);
    this.currentUserSubject.next(null);

    this.usersLoaded = false;
    this.tasksLoaded = false;
    this.initialDataResolved = false;
    this.initialResolvedSubject.next(false);

    this.usersSubject.next([]);
    this.tasksSubject.next([]);

    this.router.navigate(['/login']);
  }


  /* =====================================================
   🧠 HIERARCHY FILTERS
===================================================== */

  private filterUsersByHierarchy(users: any[]) {

    const me = this.userSignal();
    if (!me) return [];

    // ADMIN (root)
    if (!me.parentId) {
      return users.filter(u =>
        u.id === me.id ||        // self
        u.parentId === me.id     // direct children
      );
    }

    // CHILD USER
    return users.filter(u =>
      u.id === me.id ||                 // self
      u.parentId === me.parentId ||     // siblings
      u.parentId === me.id              // own children
    );
  }


  private filterTasksByHierarchy(tasks: any[]) {

    const me = this.userSignal();
    if (!me) return [];

    return tasks.filter(t =>
      t.createdBy === me.id ||                    // created by me
      t.assignedUsers?.includes(me.id) ||         // assigned to me
      t.createdBy === me.parentId ||              // created by parent
      t.parentId === me.id                        // my team tasks
    );
  }
  updateCurrentUser(user: any) {

    // update storage
    localStorage.setItem('user', JSON.stringify(user));

    // update reactive session
    this.userSignal.set(user);
    this.currentUserSubject.next(user);

    // 🚫 DO NOT reload users/tasks
    // 🚫 DO NOT reset hydration
  }


}
