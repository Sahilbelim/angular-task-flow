
// import { Component } from '@angular/core';
// import {
//   FormBuilder,
//   Validators,
//   ReactiveFormsModule,
//   AbstractControl,
//   ValidationErrors,
//   FormGroup
// } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';

// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { ViewChild, ElementRef } from '@angular/core';
// import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';
// import { switchMap } from 'rxjs';


// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [ReactiveFormsModule, RouterModule],
//   templateUrl: './register.html',
//   styleUrl: './register.css',
// })
// export class Register {

//   registerForm: FormGroup;

//   showPassword = false;
//   showConfirmPassword = false;
//   loading = false;

//   @ViewChild('nameInput') nameInput!: ElementRef;
//   @ViewChild('emailInput') emailInput!: ElementRef;
//   @ViewChild('passwordInput') passwordInput!: ElementRef;
//   @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;

//   constructor(
//     private fb: FormBuilder,
//     private api: ApiService,
//     private toastr: ToastrService,
//     private router: Router,
//    private commonApi:CommonApiService
//   ) {
//     this.registerForm = this.fb.group(
//       {
//         name: ['', Validators.required],
//         email: ['', [Validators.required, Validators.email]],
//         password: [
//           '',
//           [
//             Validators.required,
//             Validators.minLength(8),
//             Validators.maxLength(32),
//             Validators.pattern(/[A-Z]/),
//             Validators.pattern(/[a-z]/),
//             Validators.pattern(/\d/),
//             Validators.pattern(/[@$!%*?&#]/),
//           ],
//         ],
//         confrimpassword: ['', Validators.required],
//       },
//       { validators: this.passwordMatchValidator }
//     );
//   }

//   /* =========================
//      🔐 CONFIRM PASSWORD
//   ========================= */
//   passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
//     const password = control.get('password')?.value;
//     const confirm = control.get('confrimpassword')?.value;
//     return password === confirm ? null : { passwordMismatch: true };
//   }

//   /* =========================
//      🟢 SUBMIT
//   ========================= */
//   // submit() {
//   //   // if (this.registerForm.invalid) {
//   //   //   this.registerForm.markAllAsTouched();
//   //   //   this.toastr.warning('Please fix form errors');
//   //   //   return;
//   //   // }

//   //   if (this.registerForm.invalid) {
//   //     this.registerForm.markAllAsTouched();
//   //     // this.toastr.warning('Please fix form errors');

//   //     setTimeout(() => {
//   //       this.scrollToFirstError();
//   //     });

//   //     return;
//   //   }
//   //   const form = this.registerForm.getRawValue();

//   //   const payload = {
//   //     name: form.name,
//   //     email: form.email,
//   //     password: form.password,
//   //     parentId: null,
//   //     bio: 'bio',
//   //     permissions: {
//   //       createTask: true,
//   //       editTask: true,
//   //       deleteTask: true,
//   //       createUser: true,
//   //     },
//   //     createdAt: new Date().toISOString(),
//   //   };

//   //   this.loading = true;              // 🔒 lock
//   //   this.registerForm.disable();      // 🔒 disable all inputs

//   //   this.api.register(payload).subscribe({
//   //     next: () => {
//   //       this.toastr.success('Registration successful');
//   //       this.router.navigate(['/login']);
//   //     },
//   //     error: (err: Error) => {
//   //       this.toastr.error(err.message || 'Registration failed');
//   //       this.loading = false;
//   //       this.registerForm.enable();   // 🔓 unlock on error
//   //     },
//   //     complete: () => {
//   //       this.loading = false;
//   //       this.registerForm.enable();   // 🔓 unlock on error
//   //     },
//   //   });
//   // }


//   // submit() {

//   //   if (this.registerForm.invalid) {
//   //     this.registerForm.markAllAsTouched();
//   //     setTimeout(() => this.scrollToFirstError());
//   //     return;
//   //   }

//   //   const form = this.registerForm.getRawValue();

//   //   this.loading = true;
//   //   this.registerForm.disable();

//   //   // Step 1: check existing user
//   //   this.commonApi.get<any[]>('user', { email: form.email }).pipe(

//   //     switchMap(users => {
//   //       if (users.length) {
//   //         throw new Error('Email already registered');
//   //       }

//   //       // Step 2: create user
//   //       return this.commonApi.post('user', {
//   //         name: form.name,
//   //         email: form.email,
//   //         password: form.password,
//   //         parentId: null,
//   //         createdAt: new Date().toISOString(),
//   //         permissions: {
//   //           createTask: true,
//   //           editTask: true,
//   //           deleteTask: true,
//   //           createUser: true
//   //         }
//   //       });
//   //     })

//   //   ).subscribe({
//   //     next: (user) => {
//   //       this.api.setSession(user);   // 🔥 ONLY STATE GOES TO ApiService
//   //       this.toastr.success('Registration successful');
//   //       this.router.navigate(['/login']);
//   //     },
//   //     error: (err) => this.handleError(err),
//   //     complete: () => this.unlock()
//   //   });
//   // }

//   submit() {

//     if (this.registerForm.invalid) {
//       this.registerForm.markAllAsTouched();
//       setTimeout(() => this.scrollToFirstError());
//       return;
//     }

//     const form = this.registerForm.getRawValue();

//     this.loading = true;
//     this.registerForm.disable();

//     // Step 1 — load all users (mockapi limitation)
//     this.commonApi.get<any[]>('user').pipe(

//       switchMap(users => {

//         const exists = users.some(
//           u => u.email?.toLowerCase() === form.email.toLowerCase()
//         );

//         if (exists) {
//           throw new Error('Email already registered');
//         }

//         // Step 2 — create user
//         return this.commonApi.post<any>('user', {
//           name: form.name,
//           email: form.email,
//           password: form.password,
//           parentId: null,
//           createdAt: new Date().toISOString(),
//           permissions: {
//             createTask: true,
//             editTask: true,
//             deleteTask: true,
//             createUser: true
//           }
//         });

//       })

//     ).subscribe({
//       next: (user) => {
//         this.api.setSession(user);
//         this.toastr.success('Registration successful');
//         this.router.navigate(['/dashboard']);
//       },
//       error: (err) => this.handleError(err),
//       complete: () => this.unlock()
//     });
//   }

//   private unlock() {
//     this.loading = false;
//     this.registerForm.enable();
//   }

//   private handleError(err: any) {
//     this.unlock();
//     this.toastr.error(err.message || 'Registration failed');
//   }

//   private scrollToFirstError() {

//     if (this.registerForm.get('name')?.invalid) {
//       this.scrollTo(this.nameInput);
//       return;
//     }

//     if (this.registerForm.get('email')?.invalid) {
//       this.scrollTo(this.emailInput);
//       return;
//     }

//     if (this.registerForm.get('password')?.invalid) {
//       this.scrollTo(this.passwordInput);
//       return;
//     }

//     if (
//       this.registerForm.get('confrimpassword')?.invalid ||
//       this.registerForm.hasError('passwordMismatch')
//     ) {
//       this.scrollTo(this.confirmPasswordInput);
//       return;
//     }
//   }
//   private scrollTo(element: ElementRef) {
//     element.nativeElement.focus();

//     element.nativeElement.scrollIntoView({
//       behavior: 'smooth',
//       block: 'center'
//     });
//   }


//   /* =========================
//      🔍 PASSWORD UI HELPERS
//   ========================= */
//   get password() {
//     return this.registerForm.get('password');
//   }

//   get hasUppercase() {
//     return /[A-Z]/.test(this.password?.value || '');
//   }

//   get hasLowercase() {
//     return /[a-z]/.test(this.password?.value || '');
//   }

//   get hasNumber() {
//     return /\d/.test(this.password?.value || '');
//   }

//   get hasSpecialChar() {
//     return /[@$!%*?&#]/.test(this.password?.value || '');
//   }

//   get hasMinLength() {
//     return (this.password?.value || '').length >= 8;
//   }

//   get hasMaxLength() {
//     return (this.password?.value || '').length <= 32;
//   }
// }


import { Component, ViewChild, ElementRef } from '@angular/core';
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
import { switchMap } from 'rxjs';

import { ApiService } from '../../../core/service/mocapi/api/api';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  /* =====================================================
     FORM STATE
  ===================================================== */
  registerForm: FormGroup;
  loading = false;

  /* =====================================================
     UI FLAGS
  ===================================================== */
  showPassword = false;
  showConfirmPassword = false;

  /* =====================================================
     TEMPLATE REFERENCES (AUTO SCROLL TO ERROR)
  ===================================================== */
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private commonApi: CommonApiService
  ) {
    // Registration form with strong password rules
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
            Validators.pattern(/[A-Z]/),       // uppercase
            Validators.pattern(/[a-z]/),       // lowercase
            Validators.pattern(/\d/),          // number
            Validators.pattern(/[@$!%*?&#]/),  // special char
          ],
        ],
        confrimpassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /* =====================================================
     CUSTOM VALIDATOR
     Ensures password and confirm password match
  ===================================================== */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confrimpassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  /* =====================================================
     SUBMIT REGISTRATION
     1. Validate form
     2. Check existing email
     3. Create user
     4. Store session
     5. Navigate dashboard
  ===================================================== */
  submit() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      setTimeout(() => this.scrollToFirstError());
      return;
    }

    const form = this.registerForm.getRawValue();

    this.loading = true;
    this.registerForm.disable();

    // Step 1 — Load users (MockAPI limitation: no unique constraint)
    this.commonApi.get<any[]>('user').pipe(

      switchMap(users => {

        const exists = users.some(
          u => u.email?.toLowerCase() === form.email.toLowerCase()
        );

        if (exists) {
          throw new Error('Email already registered');
        }

        // Step 2 — Create new user
        return this.commonApi.post<any>('user', {
          name: form.name,
          email: form.email,
          password: form.password,
          parentId: null,
          createdAt: new Date().toISOString(),
          permissions: {
            createTask: true,
            editTask: true,
            deleteTask: true,
            createUser: true
          }
        });

      })

    ).subscribe({
      next: (user) => {
        this.api.setSession(user);     // store logged-in user globally
        this.toastr.success('Registration successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => this.handleError(err),
      complete: () => this.unlock()
    });
  }

  /* =====================================================
     REQUEST STATE HELPERS
  ===================================================== */
  private unlock() {
    this.loading = false;
    this.registerForm.enable();
  }

  private handleError(err: any) {
    this.unlock();
    this.toastr.error(err.message || 'Registration failed');
  }

  /* =====================================================
     AUTO SCROLL TO FIRST INVALID FIELD
  ===================================================== */
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

  /* =====================================================
     PASSWORD UI INDICATORS
     Used for live password strength hints
  ===================================================== */
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
