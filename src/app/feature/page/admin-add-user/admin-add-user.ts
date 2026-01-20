// // import { Component, EventEmitter, Output } from '@angular/core';
// // import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// // import { CommonModule } from '@angular/common';
// // import { ToastrService } from 'ngx-toastr';
// // import { AuthService } from '../../../core/service/auth.service';
// // import { UserService } from '../../../core/service/user';

// // @Component({
// //   selector: 'app-admin-add-user',
// //   standalone: true,
// //   imports: [CommonModule, ReactiveFormsModule],
// //   templateUrl: './admin-add-user.html',
// // })
// // export class AdminAddUser {
// //   @Output() close = new EventEmitter<void>();

// //   loading = false;
// //   showPassword = false;

// //   adminForm;
// //   constructor(
// //     private fb: FormBuilder,
// //     private authService: AuthService,
// //     private toastr: ToastrService,
// //     private userService: UserService
// //   ) {

// //     this.adminForm = this.fb.group({
// //       name: ['', Validators.required],
// //       email: ['', [Validators.required, Validators.email]],
// //       password: ['', [
// //         Validators.required,
// //         Validators.minLength(8),
// //         Validators.maxLength(32),
// //         Validators.pattern(/[A-Z]/),      // uppercase
// //         Validators.pattern(/[a-z]/),      // lowercase
// //         Validators.pattern(/\d/),         // number
// //         Validators.pattern(/[@$!%*?&#]/), // special char
// //       ]],
// //       role: ['user'],
// //       create: [false],
// //       edit: [false],
// //       delete: [false],
// //     });

// //     this.adminForm.get('role')?.valueChanges.subscribe(role => {
// //       if (role === 'admin') {
// //         this.adminForm.patchValue({
// //           role: 'admin',
// //           create: true,
// //           edit: true,
// //           delete: true,
// //         });
// //       }
// //     });
// //   }

// //   submit() {
// //     this.adminForm.markAllAsTouched();
// //     if (this.adminForm.invalid) {
// //       this.toastr.warning('Please fill all fields correctly');
// //       return;
// //     }

// //     this.loading = true;

// //     const form = this.adminForm.value;

// //     const payload = {
// //       name: form.name,
// //       email: form.email,
// //       password: form.password,
// //       role: form.role,
// //       permissions: {
// //         create: form.create,
// //         edit: form.edit,
// //         delete: form.delete,
// //       },
// //     };
// //     console.log('Payload:', payload);
// //     this.authService.adminCreateUser(payload).subscribe({
 
// //       next: () => {
// //         this.toastr.success('User created successfully');
// //         this.close.emit()
// //         this.userService.triggerRefresh();
// //         this.adminForm.reset({
// //           create: false,
// //           edit: false,
// //           delete: false,
// //         });
// //         this.loading = false;
// //       },
// //       error: (err) => {
// //         this.toastr.error(err.error?.message || 'Something went wrong');
// //         this.loading = false;
// //       },
// //     });
// //   }

// //   // ===== Password helpers (UI validation) =====
// //   get passwordValue(): string {
// //     return this.adminForm.get('password')?.value || '';
// //   }

// //   get hasUppercase() { return /[A-Z]/.test(this.passwordValue); }
// //   get hasLowercase() { return /[a-z]/.test(this.passwordValue); }
// //   get hasNumber() { return /\d/.test(this.passwordValue); }
// //   get hasSpecialChar() { return /[@$!%*?&#]/.test(this.passwordValue); }
// //   get hasMinLength() { return this.passwordValue.length >= 8; }
// //   get hasMaxLength() { return this.passwordValue.length <= 32; }
// // }

// import { Component, EventEmitter, Output } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';

// import { AuthService } from '../../../core/service/mocapi/auth';
// import { UserService } from '../../../core/service/mocapi/user';
// import { User } from '../../../core/models/user.model';

// @Component({
//   selector: 'app-admin-add-user',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './admin-add-user.html',
// })
// export class AdminAddUser {
//   @Output() close = new EventEmitter<void>();

//   loading = false;
//   showPassword = false;

//   adminForm;

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private toastr: ToastrService,
//     private userService: UserService
//   ) {
//     this.adminForm = this.fb.group({
//       name: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(8),
//           Validators.maxLength(32),
//           Validators.pattern(/[A-Z]/),
//           Validators.pattern(/[a-z]/),
//           Validators.pattern(/\d/),
//           Validators.pattern(/[@$!%*?&#]/),
//         ],
//       ],

//       // permissions
//       createUser: [false],
//       createTask: [false],
//       editTask: [false],
//       deleteTask: [false],
//     });
//   }

//   // ======================
//   // 🚫 PERMISSION GUARD
//   // ======================
//   canCreateUser(): boolean {
//     return this.auth.hasPermission('createUser');
//   }

//   // ======================
//   // ➕ SUBMIT
//   // ======================
//   submit() {
//     if (!this.canCreateUser()) {
//       this.toastr.error('You do not have permission to create users');
//       return;
//     }

//     this.adminForm.markAllAsTouched();
//     if (this.adminForm.invalid) {
//       this.toastr.warning('Please fill all fields correctly');
//       return;
//     }

//     this.loading = true;

//     const form = this.adminForm.value;
//     const parent = this.auth.user(); // logged-in user (parent)

//     const payload = {
//       name: form.name,
//       email: form.email,
//       password: form.password,

//       parentId: parent.id, // 🔑 VERY IMPORTANT

//       permissions: {
//         createUser: form.createUser,
//         createTask: form.createTask,
//         editTask: form.editTask,
//         deleteTask: form.deleteTask,
//       },

//       createdAt: new Date().toISOString(),
//     };

//     this.userService.createUser(payload as Partial<User>).subscribe({
//       next: () => {
//         this.toastr.success('User created successfully');
//         this.userService.triggerRefresh();
//         this.adminForm.reset();
//         this.close.emit();
//         this.loading = false;
//       },
//       error: () => {
//         this.toastr.error('User already exists');
//         this.loading = false;
//       },
//     });
//   }

//   // ======================
//   // 🔐 PASSWORD HELPERS
//   // ======================
//   get passwordValue(): string {
//     return this.adminForm.get('password')?.value || '';
//   }

//   get hasUppercase() {
//     return /[A-Z]/.test(this.passwordValue);
//   }
//   get hasLowercase() {
//     return /[a-z]/.test(this.passwordValue);
//   }
//   get hasNumber() {
//     return /\d/.test(this.passwordValue);
//   }
//   get hasSpecialChar() {
//     return /[@$!%*?&#]/.test(this.passwordValue);
//   }
//   get hasMinLength() {
//     return this.passwordValue.length >= 8;
//   }
//   get hasMaxLength() {
//     return this.passwordValue.length <= 32;
//   }
// }


import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../core/service/mocapi/auth';
import { UserService } from '../../../core/service/mocapi/user';
import { User } from '../../../core/models/user.model';
 

@Component({
  selector: 'app-admin-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-user.html',
})
export class AdminAddUser implements OnChanges {

  @Input() editUser: any | null = null;
  @Output() close = new EventEmitter<void>();

  loading = false;
  showPassword = false;
  isEditMode = false;

  adminForm;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],

      createUser: [false],
      createTask: [false],
      editTask: [false],
      deleteTask: [false],
    });
  }

  ngOnChanges() {
    if (this.editUser) {
      this.isEditMode = true;

      this.adminForm.patchValue({
        name: this.editUser.name,
        email: this.editUser.email,
        ...this.editUser.permissions,
      });

      this.adminForm.get('name')?.disable();
      this.adminForm.get('email')?.disable();
      this.adminForm.get('password')?.disable();
    }
  }

  // ==========================
  // 🟢 SUBMIT (ADD / UPDATE)
  // ==========================
  submit() {
    if (!this.auth.hasPermission('createUser')) {
      this.toastr.error('You do not have permission to manage users');
      return;
    }

    this.loading = true;

    const raw = this.adminForm.getRawValue();

    const permissions = {
      createUser: !!raw.createUser,
      createTask: !!raw.createTask,
      editTask: !!raw.editTask,
      deleteTask: !!raw.deleteTask,
    };


    if (this.isEditMode) {

      this.userService
        .updateUserPermissions(this.editUser.id, permissions)
        .subscribe({
          next: () => {
            if (this.editUser.id === this.auth.user()?.id) {
              this.auth.refreshCurrentUser(this.editUser.id)
                .subscribe(updatedUser => {
                  this.auth.setUser(updatedUser); // ✅ instant permission update
                });
            }
            this.toastr.success('User updated');
            this.finish();
          },
          error: () => {
            this.toastr.error('Update failed');
            this.loading = false;
          }
        });

    } else {

      const payload: Partial<User> = {
        name: this.adminForm.value.name!,
        email: this.adminForm.value.email!,
        password: this.adminForm.value.password!,
        parentId: this.auth.user().id,
        createdAt: new Date().toISOString(),
        permissions
      };

      this.userService.createUser(payload).subscribe({
        next: () => {
          this.toastr.success('User created');
          this.finish();
        },
        error: () => {
          this.toastr.error('Creation failed');
          this.loading = false;
        }
      });
    }
  }


  // ==========================
  // 🗑 DELETE USER
  // ==========================
  deleteUser() {
    if (!confirm('Delete this user?')) return;

    this.userService.deleteUser(this.editUser.id).subscribe(() => {
      this.toastr.success('User deleted');
      this.finish();
    });
  }

  finish() {
    this.loading = false;
    this.adminForm.reset();
    this.isEditMode = false;
    this.close.emit();
    this.userService.triggerRefresh();
  }
}
