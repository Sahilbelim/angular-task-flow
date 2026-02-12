
import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  FormGroup
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from '../../../core/service/mocapi/api/api';
import { ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm: FormGroup;

  showPassword = false;
  showConfirmPassword = false;
  loading = false;

  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(32),
            Validators.pattern(/[A-Z]/),
            Validators.pattern(/[a-z]/),
            Validators.pattern(/\d/),
            Validators.pattern(/[@$!%*?&#]/),
          ],
        ],
        confrimpassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /* =========================
     🔐 CONFIRM PASSWORD
  ========================= */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confrimpassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  /* =========================
     🟢 SUBMIT
  ========================= */
  submit() {
    // if (this.registerForm.invalid) {
    //   this.registerForm.markAllAsTouched();
    //   this.toastr.warning('Please fix form errors');
    //   return;
    // }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      // this.toastr.warning('Please fix form errors');

      setTimeout(() => {
        this.scrollToFirstError();
      });

      return;
    }
    const form = this.registerForm.getRawValue();

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      parentId: null,
      bio: 'bio',
      permissions: {
        createTask: true,
        editTask: true,
        deleteTask: true,
        createUser: true,
      },
      createdAt: new Date().toISOString(),
    };

    this.loading = true;              // 🔒 lock
    this.registerForm.disable();      // 🔒 disable all inputs

    this.api.register(payload).subscribe({
      next: () => {
        this.toastr.success('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err: Error) => {
        this.toastr.error(err.message || 'Registration failed');
        this.loading = false;
        this.registerForm.enable();   // 🔓 unlock on error
      },
      complete: () => {
        this.loading = false;
        this.registerForm.enable();   // 🔓 unlock on error
      },
    });
  }

  private scrollToFirstError() {

    if (this.registerForm.get('name')?.invalid) {
      this.scrollTo(this.nameInput);
      return;
    }

    if (this.registerForm.get('email')?.invalid) {
      this.scrollTo(this.emailInput);
      return;
    }

    if (this.registerForm.get('password')?.invalid) {
      this.scrollTo(this.passwordInput);
      return;
    }

    if (
      this.registerForm.get('confrimpassword')?.invalid ||
      this.registerForm.hasError('passwordMismatch')
    ) {
      this.scrollTo(this.confirmPasswordInput);
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


  /* =========================
     🔍 PASSWORD UI HELPERS
  ========================= */
  get password() {
    return this.registerForm.get('password');
  }

  get hasUppercase() {
    return /[A-Z]/.test(this.password?.value || '');
  }

  get hasLowercase() {
    return /[a-z]/.test(this.password?.value || '');
  }

  get hasNumber() {
    return /\d/.test(this.password?.value || '');
  }

  get hasSpecialChar() {
    return /[@$!%*?&#]/.test(this.password?.value || '');
  }

  get hasMinLength() {
    return (this.password?.value || '').length >= 8;
  }

  get hasMaxLength() {
    return (this.password?.value || '').length <= 32;
  }
}
