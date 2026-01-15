// import { Component } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { Auth } from '../../../core/auth/auth';
// import { ToastrService } from 'ngx-toastr';
// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [ReactiveFormsModule, RouterModule,],
//   templateUrl: './register.html',
//   styleUrl: './register.css',
// })
// export class Register {

//   errorMessage: string = '';
//   successMessage: string = '';
//   showPassword = false;
//   showConfirmPassword = false;

//   userForm;

//   constructor(private authService: Auth, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {

//     this.userForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required,
//         Validators.minLength(8),
//       Validators.maxLength(32),
//       Validators.pattern(/[A-Z]/),
//       Validators.pattern(/[a-z]/),
//       Validators.pattern(/\d/),
//       Validators.pattern(/[@$!%*?&#]/),]],
//       confrimpassword: ['', [Validators.required, Validators.minLength(6)]],
//     });
//   }


//   async signin() {
//     //
//     if (this.userForm.invalid) {
//       // this.toastr.warning("Please fill in all fields correctly");
//       this.userForm.markAllAsTouched();
//       return;
//     }
//     if (this.userForm.value.password !== this.userForm.value.confrimpassword) {
//       this.toastr.warning("Passwords do not match");
//       return;
//     }
//     try {

//       await this.authService.register(this.userForm.value.email!, this.userForm.value.password!);
//       console.log('Registration successful');
//       this.successMessage = "Registration successfull";
//       this.toastr.success("Registration successfull")
//       this.router.navigate(['/login']);
//     } catch (error: any) {
//       console.error('Registration failed:', error.code);
//       if (error.code = 'auth/email-already-in-use') {
//         this.toastr.error('Email already in Exists', 'Registration Failed');
//         this.errorMessage = "Email already in Exists";
//       }
//       else {
//         this.toastr.error('Something went wrong. Try again.', 'Error');
//       }
//       // console.log(error.messsage);
//     }
//   }


//   get passwordValue(): string {
//     return this.userForm.get('password')?.value || '';
//   }

//   get hasUppercase(): boolean {
//     return /[A-Z]/.test(this.passwordValue);
//   }

//   get hasLowercase(): boolean {
//     return /[a-z]/.test(this.passwordValue);
//   }

//   get hasNumber(): boolean {
//     return /\d/.test(this.passwordValue);
//   }

//   get hasSpecialChar(): boolean {
//     return /[@$!%*?&#]/.test(this.passwordValue);
//   }

//   get hasMinLength(): boolean {
//     return this.passwordValue.length >= 8;
//   }

//   get hasMaxLength(): boolean {
//     return this.passwordValue.length <= 32;
//   }

// }

// import { Component } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { Auth } from '../../../core/auth/auth';
// import { ToastrService } from 'ngx-toastr';
 
// import { AuthService } from '../../../core/service/auth.service';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [ReactiveFormsModule, RouterModule,],
//   templateUrl: './register.html',
//   styleUrl: './register.css',
// })
// export class Register  {
//   registerForm;
//   constructor(private fb: FormBuilder, private auth: AuthService) {

    
//     this.registerForm = this.fb.group({
//       name: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       role: ['user'],
//       create: [false],
//       edit: [false],
//       delete: [false],
//     });
    
//   }
//   submit() {
//     const form = this.registerForm.value;

//     const payload: any = {
//       name: form.name,
//       email: form.email,
//       password: form.password,
//       role: form.role,
//     };

//     if (form.role === 'user') {
//       payload.permissions = {
//         create: form.create,
//         edit: form.edit,
//         delete: form.delete,
//       };
//     }

//     this.auth.register(payload).subscribe({
//       next: (res) => {
//         console.log(res);
//         alert('Registered successfully')
//       },
//       error: (err) => alert(err.error.message),
//     });
//   }
// }


import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
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

        role: ['user'],

        create: [false],
        edit: [false],
        delete: [false],
      },
      { validators: this.passwordMatchValidator }
    );

    // Reset permissions when role is admin
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'admin') {
        this.registerForm.patchValue({
          create: false,
          edit: false,
          delete: false,
        });
      }
    });
  }

  // 🔐 Confirm password validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confrimpassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastr.warning('Please fix form errors');
      return;
    }

    const form = this.registerForm.value;

    const payload: any = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    if (form.role === 'user') {
      payload.permissions = {
        create: form.create,
        edit: form.edit,
        delete: form.delete,
      };
    }

    this.auth.register(payload).subscribe({
      next: () => {
        this.toastr.success('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Registration failed');
      },
    });
  }

  // 🔍 Helpers for UI
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
