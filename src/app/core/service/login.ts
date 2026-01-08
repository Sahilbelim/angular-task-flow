import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Login {
  constructor() { }
  
  user = signal<any>(null);
  isLoggedIn = signal<boolean>(false);

  login(user: any) {
    
    this.user.set(user);
    sessionStorage.setItem('user', JSON.stringify(user));

    this.isLoggedIn.set(true);
  }
  logout() {
    this.user.set(null);
    sessionStorage.removeItem('user');

  }
  checkLoginStatus() {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.user.set(user);
      this.isLoggedIn.set(true);
    } else {
      this.user.set(null);
      this.isLoggedIn.set(false);
    } 
  }
}