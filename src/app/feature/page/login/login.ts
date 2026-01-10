import { Component } from '@angular/core';
import { Auth } from '../../../core/auth/auth';
import { ReactiveFormsModule,FormBuilder,Validators ,} from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userForm;
  
  constructor(private authService: Auth, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {

    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        // Validators.minLength(8),
        // Validators.pattern(/[A-Z]/),         
        // Validators.pattern(/[a-z]/),     
        // Validators.pattern(/\d/),            
        // Validators.pattern(/[@$!%*?&#]/),  
        // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/)
      ]],
    });
  }
 
  errorMessage: string = '';
  successMessage: string = '';
  async login() {
    if (this.userForm.invalid) {
      this.toastr.warning("Please fill in all fields correctly");
      console.log('Please fill in all fields correctly');
      return;
    }
    try {
      await this.authService.login(this.userForm.value.email!, this.userForm.value.password!);
      console.log('Login successful');
      this.successMessage = "Login successfull";
      this.toastr.success('Login successful', 'Welcome');
      // alert("Login successfull")
      this.router.navigate(['/']);
    } catch (error:any) {
      console.error('Login failed:', error);
      if (error.code == 'auth/invalid-credential')
      {
        error.code = 'Invalid email or password';
        this.toastr.error('Invalid email or password', 'Login Failed');
      }
      else {
        this.toastr.error('Something went wrong. Try again.', 'Error');
      }
    }
  }




}