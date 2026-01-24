import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService  {
  private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

  // add this property at top of class
  private isRefreshing = false;

  user = signal<any | null>(this.getUser());

  // constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

//   constructor(
//   private http: HttpClient,
//   private toastr: ToastrService,
//   private router: Router
// ) {
//   // 🔁 Refresh permissions when tab/browser regains focus
//   window.addEventListener('focus', () => {
//     const u = this.user();
//     if (!u) return;

//     this.refreshCurrentUser(u.id).subscribe(updatedUser => {
//       this.setUser(updatedUser);
//     });
//   });
// }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    window.addEventListener('focus', () => {
      const u = this.user();
      if (!u || this.isRefreshing) return;

      // ⛔ prevent frequent refresh (5 min)
      if (!this.shouldRefresh(u)) return;

      this.isRefreshing = true;

      this.refreshCurrentUser(u.id).subscribe({
        next: updatedUser => this.setUser(updatedUser),
        complete: () => (this.isRefreshing = false),
        error: () => (this.isRefreshing = false)
      });
    });
  }

  
  /** ---------- REGISTER ---------- */
  // register(payload: any) {
  //   return this.http.post(`${this.API}/user`, payload);
  // }

  private shouldRefresh(user: any): boolean {
    const last = user?._lastSync;
    if (!last) return true;

    const FIVE_MIN = 5 * 60 * 1000;
    return Date.now() - last > FIVE_MIN;
  }

  register(payload: any) {
    // STEP 1: check if email exists
    return this.http.get<any[]>(`${this.API}/user`, {
      params: { email: payload.email }
    }).pipe(
      switchMap(users => {
        if (users.length > 0) {
          // ❌ user already exists
          // this.toastr.error('Email is already registered');
          return throwError(() => new Error('Email is already registered'));
        }


        // ✅ create user
        return this.http.post(`${this.API}/user`, payload);
      })
    );
  }

  /** ---------- LOGIN ---------- */
  // login(email: string, password: string) {
  //   return this.http.get<any[]>(`${this.API}/user?email=${email}`);
  // }

  // login(email: any, password: any) {
  //   return this.http.get<any[]>(`${this.API}/user`, {
  //     params: { email }
  //   }).pipe(
  //     switchMap(users => {
  //       console.log(users);
  //       if (users.length === 0) {
          
  //         return throwError(() => ({ message: 'User not found' }));
  //       }

  //       const user = users[0];
  //       console.log(user);
  //       console.log(user.password,password);

  //       if (user.password !== password) {
  //         return throwError(() => ({ message: 'Invalid password' }));
  //       }

  //       console.log('Login successful');
  //       // ✅ save session
  //       localStorage.setItem('user', JSON.stringify(user));
  //       this.user.set(user);

       
       
   
   

  //       return this.http.get<any[]>(`${this.API}/user?email=${email}`);
  //     })
  //   );
  // }

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

        // ✅ save session once
        this.setUser(user);

        // ✅ return user, NOT another API call
        return [user];
      })
    );
  }

  /* ---------- HELPERS ---------- */
  logout() {
    localStorage.removeItem('user');
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!this.user();
  }

  // hasPermission(key: string) {
  //   const u = this.user();
  //   if (!u) return false;

  //   // parent always has full access
  //   if (!u.parentId) return true;

  //   return !!u.permissions?.[key];
  // }

  hasPermission(key: string): boolean {
    const u = this.user();
    if (!u) return false;

    // parent always full access
    if (!u.parentId) return true;

    return !!u.permissions?.[key];
  }

  private getStoredUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  /** ---------- SESSION ---------- */
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user.set(user);
  }

  getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  // logout() {
  //   localStorage.removeItem('user');
  //   this.user.set(null);
  // }

  // hasPermission(key: string): boolean {
  //   const u = this.user();
  //   return !!u?.permissions?.[key];
  // }

  refreshCurrentUser(userId: string) {

    console.log('refreshing user');
    return this.http.get<any>(`${this.API}/user/${userId}`);
  }


}
