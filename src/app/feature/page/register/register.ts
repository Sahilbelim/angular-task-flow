import { Component } from '@angular/core';
import { FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  userForm;

  constructor(private authService: Auth, private fb: FormBuilder, private router: Router) {

    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confrimpassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  async signin() {
    if (this.userForm.invalid) {
      alert("Please fill in all fields correctly");
      return;
    }
    if (this.userForm.value.password !== this.userForm.value.confrimpassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      
      await this.authService.register(this.userForm.value.email!, this.userForm.value.password!);
      console.log('Registration successful');
      alert("Registration successfull")
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }


}
