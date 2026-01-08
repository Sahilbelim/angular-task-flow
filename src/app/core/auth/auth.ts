import { Injectable, signal } from '@angular/core';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  user =signal<any>(null);
  isLoggedIn = signal<boolean>(false);
  
  constructor() {
    auth.onAuthStateChanged((user: User | null) => {
      this.user.set(user);
  });
  }
  
  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      this.user.set(userCredential.user);
      this.isLoggedIn.set(true);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.user.set(userCredential.user);
      this.isLoggedIn.set(true);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }
  async logout() {
    try {
      await signOut(auth);
      this.user.set(null);
      this.isLoggedIn.set(false);
    } catch (error) {
      throw error;
    }
  }
  
}
