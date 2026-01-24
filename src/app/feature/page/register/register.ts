 

// import { Component } from '@angular/core';
// import {
//   FormBuilder,
//   Validators,
//   ReactiveFormsModule,
//   AbstractControl,
//   ValidationErrors
// } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../../core/service/mocapi/auth';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [ReactiveFormsModule, RouterModule],
//   templateUrl: './register.html',
//   styleUrl: './register.css',
// })
// export class Register {

//   registerForm;

//   showPassword = false;
//   showConfirmPassword = false;

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private toastr: ToastrService,
//     private router: Router
//   ) {

//     this.registerForm = this.fb.group(
//       {
//         name: ['', Validators.required],
//         email: ['', [Validators.required, Validators.email]],

//         password: ['',
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

//   // 🔐 Confirm password validator
//   passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
//     const password = control.get('password')?.value;
//     const confirm = control.get('confrimpassword')?.value;
//     return password === confirm ? null : { passwordMismatch: true };
//   }

//   submit() {
//     if (this.registerForm.invalid) {
//       this.registerForm.markAllAsTouched();
//       this.toastr.warning('Please fix form errors');
//       return;
//     }

//     const form = this.registerForm.value;

//     const payload: any = {
//       name: form.name,
     
//       email: form.email,
//       password: form.password,
//       parentId: null,
//       bio: 'bio',
//       permissions: {
//         createTask: true,
//         editTask: true,
//         deleteTask: true,
//         createUser: true
//       },
//     }
//     console.log(payload);

//     this.auth.register(payload).subscribe({
//       next: (res) => {
//         console.log(res)
//         this.toastr.success('Registration successful');
//         this.router.navigate(['/login']);
//       },
//       error: (err) => {
//         this.toastr.error(err?.error?.message || 'Registration failed');
//       },
//     });
//   }

//   // 🔍 Helpers for UI
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
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastr.warning('Please fix form errors');
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

    this.loading = true;

    this.api.register(payload).subscribe({
      next: () => {
        this.toastr.success('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err: Error) => {
        this.toastr.error(err.message || 'Registration failed');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
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
