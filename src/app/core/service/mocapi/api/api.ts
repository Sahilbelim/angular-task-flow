import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, of, forkJoin, map, catchError, tap } from 'rxjs';
import { CommonApiService } from './common-api.service';


/* =========================================================
   ROOT STORE SERVICE
   ---------------------------------------------------------
   This service is a global application state manager.

   Works as:
   ✔ Session store (who is logged in)
   ✔ Data store (users + tasks cache)
   ✔ Permission manager
   ✔ App bootstrap loader
   ✔ UI global state manager

   Similar concept:
   Angular Store / NgRx / Redux (lightweight custom version)
   ========================================================= */

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private router: Router, private http: CommonApiService) { }

  /* =====================================================
     🔐 SESSION MANAGEMENT
     Handles login persistence & reactive session state
  ===================================================== */

  /* Signal → instant synchronous state access */
  private userSignal = signal<any | null>(this.getStoredUser());

  /* BehaviorSubject → reactive subscription stream */
  private currentUserSubject = new BehaviorSubject<any | null>(this.userSignal());

  /* Observable exposed to components */
  currentUser$ = this.currentUserSubject.asObservable();



  /* =====================================================
     DATA LOAD CONTROL FLAGS (CACHE SYSTEM)
     Prevents multiple API calls
  ===================================================== */

  private usersLoaded: boolean = false;
  private tasksLoaded: boolean = false;

  private usersSubject = new BehaviorSubject<any[]>([]);
  private tasksSubject = new BehaviorSubject<any[]>([]);



  /* =====================================================
     🔥 HYDRATION STATE
     Tells UI when initial data finished loading
     Used to stop skeleton loaders safely
  ===================================================== */

  private initialDataResolved = false;
  private initialResolvedSubject = new BehaviorSubject<boolean>(false);
  initialDataResolved$ = this.initialResolvedSubject.asObservable();



  /* -----------------------------------------------------
     Synchronous user getter (used by guards & permissions)
     ----------------------------------------------------- */
  currentUser() {
    return this.userSignal();
  }



  /* =====================================================
     SET SESSION (LOGIN SUCCESS)
     Stores login + reloads user dependent data
  ===================================================== */
  setSession(user: any) {

    // Persist login
    localStorage.setItem('user', JSON.stringify(user));

    // Update reactive stores
    this.userSignal.set(user);
    this.currentUserSubject.next(user);

    // Reset caches when switching accounts
    this.usersLoaded = false;
    this.tasksLoaded = false;

    // Reset hydration state
    this.initialDataResolved = false;
    this.initialResolvedSubject.next(false);

    // Reload filtered data for new user
    // this.loadUsersOnce();
    // this.loadTasksOnce();
  }

  /** Hydrate all user dependent data */
  hydrateUserData() {

    const user = this.userSignal();
    if (!user) return;

    this.loadUsersOnce();
    this.loadTasksOnce();
  }



  /* Restore login from browser storage */
  private getStoredUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }



  /* =====================================================
     👥 USERS STORE (GLOBAL USERS STATE)
  ===================================================== */

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
     📋 TASKS STORE (GLOBAL TASK STATE)
  ===================================================== */

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
     🔐 PERMISSION SYSTEM
     Role based access control
  ===================================================== */

  hasPermission(key: string): boolean {
    const u = this.userSignal();

    // Not logged in
    if (!u) return false;

    // Root admin → full access
    if (!u.parentId) return true;

    // Child user → check permission object
    return !!u.permissions?.[key];
  }



  /* =====================================================
     🎯 GLOBAL UI STATE
     Overlay / modal blocker controller
  ===================================================== */

  private overlaySubject = new BehaviorSubject<boolean>(false);
  overlayOpen$ = this.overlaySubject.asObservable();

  setOverlay(open: boolean) {
    this.overlaySubject.next(open);
  }



  /* =====================================================
     🔎 TASK FILTER STATE (Cross-Page Communication)
     Used when clicking user → open tasks filtered
  ===================================================== */

  private taskFilterUserSubject = new BehaviorSubject<string | null>(null);
  taskFilterUser$ = this.taskFilterUserSubject.asObservable();

  consumeTaskFilter(): string | null {
    const value = this.taskFilterUserSubject.value;
    this.taskFilterUserSubject.next(null);
    return value;
  }

  setTaskFilterUser(userId: string | null) {
    this.taskFilterUserSubject.next(userId);
  }

  clearTaskFilter() {
    this.taskFilterUserSubject.next(null);
  }



  /* =====================================================
     🚀 APP INITIALIZATION
     Runs once when app starts
     Restores session + loads data
  ===================================================== */

  initializeApp(): Observable<boolean> {

    const storedUser = this.getStoredUser();

    // not logged in
    if (!storedUser) {
      this.currentUserSubject.next(null);
      this.initialResolvedSubject.next(true);
      return of(true);
    }

    // reset loading state
    this.initialDataResolved = false;
    this.initialResolvedSubject.next(false);

    // 🔥 CRITICAL: validate session with backend
    this.refreshCurrentUserFromServer(storedUser);

    return this.initialDataResolved$;
  }


  /* =====================================================
     ONE TIME LOAD SYSTEM (SMART CACHE)
     Prevent duplicate API calls
  ===================================================== */

  private usersLoading = false;
  private tasksLoading = false;



  /* Load users based on hierarchy */
  private loadUsersOnce() {

    if (this.usersLoaded) return;
    if (this.usersLoading) return;

    const me = this.userSignal();
    if (!me) return;

    this.usersLoading = true;

    this.http.get<any[]>('user')
      .pipe(
        map(users => {

          // ROOT ADMIN
          if (!me.parentId) {
            return users.filter(u =>
              u.id === me.id ||
              u.parentId === me.id
            );
          }

          // CHILD USER
          return users.filter(u =>
            u.id === me.id ||
            u.parentId === me.parentId ||
            u.parentId === me.id
          );
        })
      )
      .subscribe({
        next: users => {
          this.usersSubject.next(users);
          this.usersLoaded = true;
          this.usersLoading = false;
          this.markInitialResolved();
        },
        error: () => {
          this.usersLoading = false;
        }
      });
  }



  private markInitialResolved() {
    if (this.usersLoaded && this.tasksLoaded && !this.initialDataResolved) {
      this.initialDataResolved = true;
      this.initialResolvedSubject.next(true);
    }
  }



  /* Load tasks based on hierarchy */
  private loadTasksOnce() {

    if (this.tasksLoaded) return;
    if (this.tasksLoading) return;

    const me = this.userSignal();
    if (!me) return;

    this.tasksLoading = true;

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
        next: tasks => {
          this.tasksSubject.next(tasks);
          this.tasksLoaded = true;
          this.tasksLoading = false;
          this.markInitialResolved();
        },
        error: () => {
          this.tasksLoading = false;
        }
      });
  }



  /* Public getters (auto load if needed) */
  getUsers$(): Observable<any[]> {
    this.loadUsersOnce();
    return this.users$;
  }

  getTasks$(): Observable<any[]> {
    this.loadTasksOnce();
    return this.tasks$;
  }



  /* =====================================================
     LOGOUT
     Clears entire application state safely
  ===================================================== */

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
     UPDATE CURRENT USER (PROFILE UPDATE)
     Does NOT reload data
  ===================================================== */
  updateCurrentUser(user: any) {

    localStorage.setItem('user', JSON.stringify(user));
    this.userSignal.set(user);
    this.currentUserSubject.next(user);
  }


  private refreshCurrentUserFromServer(user: any) {

    // fetch real user from backend
    this.http.get<any[]>('user', { id: user.id }).subscribe({
      next: users => {

        // session expired / deleted user
        if (!users.length) {
          this.logout();
          return;
        }

        const freshUser = users[0];

        // update everywhere
        localStorage.setItem('user', JSON.stringify(freshUser));
        this.userSignal.set(freshUser);
        this.currentUserSubject.next(freshUser);

        // NOW load dependent data
        this.loadUsersOnce();
        this.loadTasksOnce();
      },

      error: () => this.logout()
    });
  }

}
