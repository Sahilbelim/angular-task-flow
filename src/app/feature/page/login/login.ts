// // import { Component } from '@angular/core';
// // import { Auth } from '../../../core/auth/auth';
// // import { ReactiveFormsModule,FormBuilder,Validators ,} from '@angular/forms';
// // import { Router,RouterModule } from '@angular/router';
// // import { ToastrService } from 'ngx-toastr';

// // @Component({
// //   selector: 'app-login',
// //   standalone: true,
// //   imports: [ReactiveFormsModule, RouterModule],
// //   templateUrl: './login.html',
// //   styleUrl: './login.css',
// // })
// // export class Login {
// //   userForm;
// //   showPassword = false;
// //   constructor(private authService: Auth, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {

// //     this.userForm = this.fb.group({
// //       email: ['', [Validators.required, Validators.email]],
// //       password: ['', [
// //         Validators.required,
// //         // Validators.minLength(8),
// //         // Validators.pattern(/[A-Z]/),
// //         // Validators.pattern(/[a-z]/),
// //         // Validators.pattern(/\d/),
// //         // Validators.pattern(/[@$!%*?&#]/),
// //         // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/)
// //       ]],
// //     });
// //   }
 
// //   errorMessage: string = '';
// //   successMessage: string = '';
// //   async login() {
// //     if (this.userForm.invalid) {
// //       // this.toastr.warning("Please fill in all fields correctly");
// //       this.userForm.markAllAsTouched();
// //       console.log('Please fill in all fields correctly');
// //       return;
// //     }
// //     try {
// //       await this.authService.login(this.userForm.value.email!, this.userForm.value.password!);
// //       console.log('Login successful');
// //       this.successMessage = "Login successfull";
// //       this.toastr.success('Login successful', 'Welcome');
// //       // alert("Login successfull")
// //       this.router.navigate(['/']);
// //     } catch (error:any) {
// //       console.error('Login failed:', error);
// //       if (error.code == 'auth/invalid-credential')
// //       {
// //         error.code = 'Invalid email or password';
// //         this.toastr.error('Invalid email or password', 'Login Failed');
// //       }
// //       else {
// //         this.toastr.error('Something went wrong. Try again.', 'Error');
// //       }
// //     }
// //   }




// // }


// import { Component } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../../core/service/mocapi/auth';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [ReactiveFormsModule, RouterModule],
//   templateUrl: './login.html',
// })
// export class Login {
//   showPassword = false;

//   loginForm;
  
//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private router: Router,
//     private toastr: ToastrService
//   ) {


//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//     });

//    }

//   submit() {
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched();
//       this.toastr.warning('Please fill all fields correctly');
//       return;
//     }

//     // this.auth.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
//     //   next: (res) => {
//     //     console.log('Login successful', res);
//     //     this.toastr.success('Login successful');
//     //     this.router.navigate(['/dashboard']);
//     //   },
//     //   error: (err) => {
//     //     this.toastr.error(err.error?.message || 'Login failed');
//     //   },
//     // });
//     const { email, password } = this.loginForm.getRawValue();

//     if (!email || !password) {
//       return;
//     }

//     this.auth.login(email, password).subscribe({
//       next: (res: any) => {
//             console.log('Login successful', res);
//             this.toastr.success('Login successful');
//             this.router.navigate(['/dashboard']);
//       },
//       error: (err: Error) => {
//         this.toastr.error(err?.message || 'Login failed');
//       }
//     });

//   }
// }

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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
})
export class Login {

  showPassword = false;
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.warning('Please fill all fields correctly');
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    // ✅ Type safety (fixes TS2345)
    if (!email || !password) return;

    this.loading = true;

    this.api.login(email, password).subscribe({
      next: () => {
        // ✅ user already stored in ApiService (signal + localStorage)
        this.toastr.success('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err: Error) => {
        this.toastr.error(err.message || 'Login failed');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
