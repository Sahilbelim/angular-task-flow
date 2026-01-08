import { Component } from '@angular/core';
import { Auth } from '../../../core/auth/auth';
import { ReactiveFormsModule,FormBuilder,Validators ,} from '@angular/forms';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userForm;
  
  constructor(private authService: Auth, private fb: FormBuilder, private router: Router) {

    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
 
  
  async login() {
    if (this.userForm.invalid) {
      alert("Please fill in all fields correctly");
      return;
    }
    try {
      await this.authService.login(this.userForm.value.email!, this.userForm.value.password!);
      console.log('Login successful');
      alert("Login successfull")
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async signin() {
    try {
      await this.authService.register(this.userForm.value.email!, this.userForm.value.password!);
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