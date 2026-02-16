 
import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from '../../../core/service/mocapi/api/api';
import { ViewChild, ElementRef } from '@angular/core';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
})
export class Login {

  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;


  showPassword = false;
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private commonApi:CommonApiService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    
  }

  // submit() {
    
  //   // if (this.loginForm.invalid) {
  //   //   this.loginForm.markAllAsTouched();
  //   //   this.toastr.warning('Please fill all fields correctly');
  //   //   return;
  //   // }

  //   if (this.loginForm.invalid) {
  //     this.loginForm.markAllAsTouched();
  //     // this.toastr.warning('Please fill all fields correctly');

  //     setTimeout(() => {
  //       this.scrollToFirstError();
  //     });

  //     return;
  //   }

  //   const { email, password } = this.loginForm.getRawValue();

  //   // ✅ Type safety (fixes TS2345)
  //   if (!email || !password) return;

  //   this.loading = true;          // 🔒 lock
  //   this.loginForm.disable();     // 🔒 lock inputs

  //   this.api.login(email, password).subscribe({
  //     next: () => {
  //       // ✅ user already stored in ApiService (signal + localStorage)
  //       this.toastr.success('Login successful');
  //       this.router.navigate(['/dashboard']);
  //     },
  //     error: (err: Error) => {
  //       this.toastr.error(err.message || 'Login failed');
  //       this.loading = false;
  //       this.loginForm.enable();  // 🔓 unlock on error
  //     },
  //     complete: () => {
  //       this.loading = false;
  //       this.loginForm.enable();  // 🔓 unlock on error
  //     }
  //   });
  // }

  submit() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      setTimeout(() => this.scrollToFirstError());
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.loading = true;
    this.loginForm.disable();

    this.commonApi.get<any[]>('user', { email }).subscribe({
      next: users => {

        if (!users.length)
          throw new Error('User not found');

        if (users[0].password !== password)
          throw new Error('Invalid password');

        this.api.setSession(users[0]); // 🔥 store globally only

        this.toastr.success('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: err => this.handleError(err),
      complete: () => this.unlock()
    });
  }
  private unlock() {
    this.loading = false;
    this.loginForm.enable();
  }

  private handleError(err: any) {
    this.unlock();
    this.toastr.error(err.message || 'Login failed');
  }
  private scrollToFirstError() {

    if (this.loginForm.get('email')?.invalid) {
      this.scrollTo(this.emailInput);
      return;
    }

    if (this.loginForm.get('password')?.invalid) {
      this.scrollTo(this.passwordInput);
      return;
    }
  }

  private scrollTo(element: ElementRef) {
    element.nativeElement.focus();

    element.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }

}
