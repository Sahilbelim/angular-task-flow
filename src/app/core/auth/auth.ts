import { Injectable, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '../../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class Auth {

 
  user = signal<User | null>(null);
  isLoggedIn = signal<boolean>(false);

 
  loading = signal<boolean>(true);

  constructor() {
    auth.onAuthStateChanged((user: User | null) => {
      this.user.set(user);
      this.isLoggedIn.set(!!user);

    
      this.loading.set(false);
    });
  }

  async register(email: string, password: string) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res.user;
  }

  async login(email: string, password: string) {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  }

  async logout() {
    await signOut(auth);
    this.user.set(null);
    this.isLoggedIn.set(false);
  }
}
