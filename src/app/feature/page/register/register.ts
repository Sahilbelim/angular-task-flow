import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  errorMessage: string = '';
  successMessage: string = '';
  showPassword = false;
  showConfirmPassword = false;

  userForm;

  constructor(private authService: Auth, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {

    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
      Validators.minLength(8),
      Validators.pattern(/[A-Z]/),
      Validators.pattern(/[a-z]/),
      Validators.pattern(/\d/),
      Validators.pattern(/[@$!%*?&#]/),]],
      confrimpassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  async signin() {
    //
    if (this.userForm.invalid) {
      // this.toastr.warning("Please fill in all fields correctly");
      this.userForm.markAllAsTouched();
      return;
    }
    if (this.userForm.value.password !== this.userForm.value.confrimpassword) {
      this.toastr.warning("Passwords do not match");
      return;
    }
    try {

      await this.authService.register(this.userForm.value.email!, this.userForm.value.password!);
      console.log('Registration successful');
      this.successMessage = "Registration successfull";
      this.toastr.success("Registration successfull")
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Registration failed:', error.code);
      if (error.code = 'auth/email-already-in-use') {
        this.toastr.error('Email already in Exists', 'Registration Failed');
        this.errorMessage = "Email already in Exists";
      }
      else {
        this.toastr.error('Something went wrong. Try again.', 'Error');
      }
      // console.log(error.messsage);
    }
  }


  get passwordValue(): string {
    return this.userForm.get('password')?.value || '';
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.passwordValue);
  }

  get hasLowercase(): boolean {
    return /[a-z]/.test(this.passwordValue);
  }

  get hasNumber(): boolean {
    return /\d/.test(this.passwordValue);
  }

  get hasSpecialChar(): boolean {
    return /[@$!%*?&#]/.test(this.passwordValue);
  }

  get hasMinLength(): boolean {
    return this.passwordValue.length >= 8;
  }

}
