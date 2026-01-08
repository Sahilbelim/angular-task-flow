import { Component } from '@angular/core';
import { Auth } from '../../../core/auth/auth';
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private authService: Auth) {}

  email: string = '';
  password: string = '';

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      console.log('Login successful');
      alert("Login successfull")
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async signin() {
    try {
      await this.authService.register(this.email, this.password);
      console.log('Registration successful');
      alert("Registration successfull")
    } catch (error) {
      console.error('Registration failed:', error);
    } 
  }

  async logout() {
    try {
      await this.authService.logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

}