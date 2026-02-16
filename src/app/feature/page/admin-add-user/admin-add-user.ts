
// import {
//   Component,
//   EventEmitter,
//   Input,
//   Output,
//   OnChanges
// } from '@angular/core';
// import {
//   FormBuilder,
//   Validators,
//   ReactiveFormsModule,
//   FormGroup
// } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';

// import { ApiService } from '../../../core/service/mocapi/api/api';

// @Component({
//   selector: 'app-admin-add-user',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './admin-add-user.html',
// })
// export class AdminAddUser implements OnChanges {

//   @Input() editUser: any | null = null;
//   @Output() close = new EventEmitter<void>();

//   loading = false;
//   showPassword = false;
//   isEditMode = false;

//   adminForm!: FormGroup; // ✅ declare only

//   constructor(
//     private fb: FormBuilder,
//     private api: ApiService,
//     private toastr: ToastrService
//   ) {
//     // ✅ initialize INSIDE constructor
//     this.adminForm = this.fb.group({
//       name: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: [''],

//       createUser: [false],
//       createTask: [false],
//       editTask: [false],
//       deleteTask: [false],
//     });
//   }

//   /* ==========================
//      🔁 EDIT MODE
//   ========================== */
//   ngOnChanges() {
//     if (!this.editUser) return;

//     this.isEditMode = true;

//     this.adminForm.patchValue({
//       name: this.editUser.name,
//       email: this.editUser.email,
//       ...this.editUser.permissions,
//     });

//     // 🔒 lock immutable fields
//     this.adminForm.get('name')?.disable();
//     this.adminForm.get('email')?.disable();
//     this.adminForm.get('password')?.disable();
//   }

//   /* ==========================
//      🟢 SUBMIT
//   ========================== */
//   submit() {
//     if (!this.api.hasPermission('createUser')) {
//       this.toastr.error('You do not have permission to manage users');
//       return;
//     }

//     if (this.adminForm.invalid) {
//       this.adminForm.markAllAsTouched();
//       return;
//     }

//     this.loading = true;

//     const raw = this.adminForm.getRawValue();

//     const permissions = {
//       createUser: !!raw.createUser,
//       createTask: !!raw.createTask,
//       editTask: !!raw.editTask,
//       deleteTask: !!raw.deleteTask,
//     };

//     // ✏️ UPDATE
//     if (this.isEditMode && this.editUser) {
//       this.api.updateUser(this.editUser.id, { permissions }).subscribe({
//         next: () => {
//           this.toastr.success('User updated');
//           this.finish();
//         },
//         error: () => {
//           this.toastr.error('Update failed');
//           this.loading = false;
//         }
//       });
//       return;
//     }

//     // ➕ CREATE
//     const payload = {
//       name: raw.name,
//       email: raw.email,
//       password: raw.password,
//       permissions,
//     };

//     this.api.createUser(payload).subscribe({
//       next: () => {
//         this.toastr.success('User created');
//         this.finish();
//       },
//       error: (err) => {
//         this.toastr.error(err?.message || 'Creation failed');
//         this.loading = false;
//       }
//     });
//   }

//   /* ==========================
//      🗑 DELETE
//   ========================== */

//   deleteUser() {
//     if (!this.editUser) return;
//     if (!confirm('Delete this user?')) return;

//     this.loading = true;

//     this.api.deleteUser(this.editUser.id).subscribe({
//       next: () => {
//         this.toastr.success('User deleted');
//         this.finish();
//       },
//       error: () => {
//         this.toastr.error('Delete failed');
//         this.loading = false;
//       }
//     });
//   }

//   /* ==========================
//      🔚 CLEANUP
//   ========================== */
//   finish() {
//     this.loading = false;
//     this.isEditMode = false;
//     this.adminForm.reset();
//     this.close.emit();
//   }
// }
