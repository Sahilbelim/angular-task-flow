import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ValidationErrors } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { ApiService } from '../../../core/service/mocapi/api/api';
import { AdminAddUser } from '../admin-add-user/admin-add-user';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Renderer2, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    // AdminAddUser,
  ],
  templateUrl: './user.html',
})
export class UsersPage implements OnInit, OnDestroy {

  /* =====================
     UI STATE
  ===================== */
  sidebarOpen = false;
  editUser: any | null = null;
  loading = true;

  /* =====================
     DATA (STORE)
  ===================== */
  users: any[] = [];
  filteredUsers: any[] = [];

  /* =====================
     FILTER
  ===================== */
  searchText = '';

  /* =====================
     PAGINATION
  ===================== */
  p = 1;
  itemsPerPage = 5;
  pageSizeOptions = [5, 10, 20, 'All'];
  selectedPageSize: number | 'All' = 5;

  private sub!: Subscription;


  /* =====================
     DELETE POPUPS
  ===================== */
  showTaskBlockPopup = false;
  showDeleteConfirmPopup = false;
  userToDelete: any = null;

  adminForm: any;
  isEditMode = false;
  showPassword = false;
  formLoading = false;

  userSaving = false;     // add + edit user
  userDeleting = false;  // delete user



  private renderer = inject(Renderer2);
  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private router: Router,
  private fb: FormBuilder
  ) {
    // this.adminForm = this.fb.group({
    //   name: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   password: [''],
    //   createUser: [false],
    //   createTask: [false],
    //   editTask: [false],
    //   deleteTask: [false],
    // });
    this.adminForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],

        password: [
          '',
          this.isEditMode
            ? []
            : [
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(32),
              Validators.pattern(/[A-Z]/),
              Validators.pattern(/[a-z]/),
              Validators.pattern(/\d/),
              Validators.pattern(/[@$!%*?&#]/),
            ],
        ],

        createUser: [false],
        createTask: [false],
        editTask: [false],
        deleteTask: [false],
      },
      { validators: this.permissionValidator }
    );

   }

  /* =====================
     INIT
  ===================== */
  ngOnInit() {

   
    // 🔥 load once (cached internally)
    this.sub = this.api.getUsers$().subscribe(users => {
      this.users = users;
      const meId = this.currentUserId;

      // 🔥 EXCLUDE SELF ONLY HERE
      this.users = users.filter(u => u.id !== meId);

      this.applyFilter();
      const start = Date.now();
      this.loading = false;

    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  /* =====================
     ➕ ADD USER
  ===================== */
    openAdd() {
    if (!this.canManageUsers()) {
      this.toastr.warning('You do not have permission');
      return;
    }

    this.isEditMode = false;
      this.editUser = null;
      this.enableAllAdminControls();

    this.adminForm.reset();
    this.sidebarOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  /* =====================
     ✏️ EDIT USER
  ===================== */
  openEdit(user: any) {
    if (!this.canManageUsers()) {
      this.toastr.warning('You do not have permission');
      return;
    }

    this.isEditMode = true;
    this.editUser = user;
    this.enableAllAdminControls();

    this.adminForm.reset({
      name: user.name,
      email: user.email,
      ...user.permissions,
    });

    this.adminForm.get('name')?.disable();
    this.adminForm.get('email')?.disable();
    this.adminForm.get('password')?.disable();

    this.sidebarOpen = true;
    // this.isEditMode = false;
    document.body.classList.add('overflow-hidden');
  }
  closeSidebar() {
    this.sidebarOpen = false;
    this.editUser = null;
    this.isEditMode = false;
    this.enableAllAdminControls();
    this.adminForm.reset();
    document.body.classList.remove('overflow-hidden');
  }

  permissionValidator(control: AbstractControl): ValidationErrors | null {
    const {
      createUser,
      createTask,
      editTask,
      deleteTask,
    } = control.value || {};

    return createUser || createTask || editTask || deleteTask
      ? null
      : { noPermission: true };
  }

  // submitAdminForm() {
  //   if (this.adminForm.invalid) {
  //     this.adminForm.markAllAsTouched();
  //     return;
  //   }
  //   this.userSaving = true;        // 🔒 lock
  //   this.adminForm.disable();     // 🔒 UI lock

  //   const raw = this.adminForm.getRawValue();

  //   const permissions = {
  //     createUser: !!raw.createUser,
  //     createTask: !!raw.createTask,
  //     editTask: !!raw.editTask,
  //     deleteTask: !!raw.deleteTask,
  //   };

  //   this.formLoading = true;

  //   if (this.isEditMode && this.editUser) {
  //     this.api.updateUser(this.editUser.id, { permissions }).subscribe({
  //       next: () => {
  //         this.toastr.success('User updated');
  //         this.closeSidebar();
  //       },
  //       error: () => {
  //         this.toastr.error('Update failed');
  //         this.formLoading = false;
  //       }
  //     });
  //     return;
  //   }

  //   this.api.createUser({
  //     name: raw.name,
  //     email: raw.email,
  //     password: raw.password,
  //     permissions,
  //   }).subscribe({
  //     next: () => {
  //       this.toastr.success('User created');
  //       this.closeSidebar();
  //     },
  //     error: () => {
  //       this.toastr.error('Creation failed');
  //       this.formLoading = false;
  //     }
  //   });
  // }

  submitAdminForm() {
    if (this.adminForm.invalid || this.userSaving) {
      this.adminForm.markAllAsTouched();
      return;
    }

    this.userSaving = true;        // 🔒 lock
    this.adminForm.disable();     // 🔒 UI lock

    const raw = this.adminForm.getRawValue();

    const permissions = {
      createUser: !!raw.createUser,
      createTask: !!raw.createTask,
      editTask: !!raw.editTask,
      deleteTask: !!raw.deleteTask,
    };

    const req$ = this.isEditMode && this.editUser
      ? this.api.updateUser(this.editUser.id, { permissions })
      : this.api.createUser({
        name: raw.name,
        email: raw.email,
        password: raw.password,
        permissions,
      });

    req$.subscribe({
      next: () => {
        this.toastr.success(
          this.isEditMode ? 'User updated' : 'User created'
        );
        this.closeSidebar();
      },
      error: () => {
        this.toastr.error('Operation failed');
      },
      complete: () => {
        this.userSaving = false;   // 🔓 unlock
        this.adminForm.enable();
      }
    });
  }


  /* =====================
     🔍 SEARCH
  ===================== */
  filterBySearch() {
    this.applyFilter();
  }

  private applyFilter() {
    const text = this.searchText.trim().toLowerCase();

    this.filteredUsers = !text
      ? [...this.users]
      : this.users.filter(u =>
        u.name?.toLowerCase().includes(text) ||
        u.email?.toLowerCase().includes(text)
      );

    this.onPageSizeChange(this.selectedPageSize);
  }

  /* =====================
     🔢 PAGINATION
  ===================== */
  onPageSizeChange(size: number | 'All') {
    this.p = 1;
    this.itemsPerPage =
      size === 'All' ? this.filteredUsers.length || 1 : size;
  }

  /* =====================
     🔐 PERMISSION
  ===================== */
  canManageUsers(): boolean {
    return this.api.hasPermission('createUser');
  }

  /* =====================
     🗑 DELETE USER
  ===================== */
  //  deleteUser(user: any) {
  //   if (!this.canManageUsers()) {
  //     this.toastr.warning('You do not have permission');
  //     return;
  //   }

  //   this.showTaskBlockPopup = false;
  //   this.showDeleteConfirmPopup = false;
  //   this.userToDelete = user;
  //   document.body.classList.add('overflow-hidden');

  //   this.api.hasAssignedTasks$(user.id).subscribe(hasTasks => {
  //     if (hasTasks) {
  //       this.showTaskBlockPopup = true;
  //     } else {
  //       this.showDeleteConfirmPopup = true;
  //     }
  //   });
  // }

  // deleteUser(user: any) {
  //   if (!this.canManageUsers()) {
  //     this.toastr.warning('You do not have permission');
  //     return;
  //   }

  //   if (this.userDeleting) return;

  //   // reset state
  //   this.closeAllPopups();
  //   this.userToDelete = user;
  //   document.body.classList.add('overflow-hidden');

  //   // 🔥 ALWAYS ensure tasks are loaded
  //   this.api.ensureTasksLoaded$().subscribe(tasks => {
  //     const hasTasks = tasks.some(
  //       task =>
  //         Array.isArray(task.assignedUsers) &&
  //         task.assignedUsers.map(String).includes(String(user.id))
  //     );

  //     if (hasTasks) {
  //       this.showTaskBlockPopup = true;
  //     } else {
  //       this.showDeleteConfirmPopup = true;
  //     }
  //   });
  // }

  // deleteUser(user: any) {
  //   if (!this.canManageUsers()) {
  //     this.toastr.warning('You do not have permission');
  //     return;
  //   }

  //   if (!user || !user.id) return;

  //   if (!user || !user.id) {
  //     console.warn('deleteUser called with invalid user', user);
  //     return;
  //   }


  //   if (this.userDeleting) return;

  //   // 🔒 CAPTURE ID ONCE (IMPORTANT)
  //   const userId = String(user.id);

  //   this.closeAllPopups();
  //   this.userToDelete = user;
  //   document.body.classList.add('overflow-hidden');

  //   this.api.ensureTasksLoaded$().subscribe(tasks => {
  //     const hasTasks = tasks.some(
  //       task =>
  //         Array.isArray(task.assignedUsers) &&
  //         task.assignedUsers.map(String).includes(userId)
  //     );

  //     if (hasTasks) {
  //       this.showTaskBlockPopup = true;
  //     } else {
  //       this.showDeleteConfirmPopup = true;
  //     }
  //   });
  // }

  deleteUser(user: any) {
    if (!this.canManageUsers()) {
      this.toastr.warning('You do not have permission');
      return;
    }

    if (!user?.id || this.userDeleting) return;

    // capture once
    this.userToDelete = user;
    document.body.classList.add('overflow-hidden');

    this.api.ensureTasksLoaded$().subscribe(tasks => {
      const userId = String(user.id);

      const hasTasks = tasks.some(
        t =>
          Array.isArray(t.assignedUsers) &&
          t.assignedUsers.map(String).includes(userId)
      );

      if (hasTasks) {
        this.showTaskBlockPopup = true;
      } else {
        this.showDeleteConfirmPopup = true;
      }
    });
  }


  closeTaskPopup() {
    this.showTaskBlockPopup = false;
    this.userToDelete = null;
    document.body.classList.remove('overflow-hidden');
  }

  // closeAllPopups() {
  //   this.showTaskBlockPopup = false;
  //   this.showDeleteConfirmPopup = false;
  //   this.userToDelete = null;
  //   document.body.classList.remove('overflow-hidden');
  // }

  closeAllPopups() {
    this.showTaskBlockPopup = false;
    this.showDeleteConfirmPopup = false;
    this.userToDelete = null;
    this.userDeleting = false;
    document.body.classList.remove('overflow-hidden');
  }


  // confirmFinalDelete() {
  //   if (!this.userToDelete || this.userDeleting) return;

  //   this.userDeleting = true;

  //   this.api.ensureTasksLoaded$().subscribe(tasks => {
  //     const hasTasks = tasks.some(
  //       t =>
  //         Array.isArray(t.assignedUsers) &&
  //         t.assignedUsers.map(String).includes(String(this.userToDelete.id))
  //     );

  //     if (hasTasks) {
  //       this.userDeleting = false;
  //       this.closeAllPopups();
  //       this.showTaskBlockPopup = true;
  //       document.body.classList.add('overflow-hidden');
  //       return;
  //     }

  //     // ✅ SAFE DELETE
  //     this.api.deleteUser(this.userToDelete.id).subscribe({
  //       next: () => {
  //         this.toastr.success('User deleted successfully');
  //         this.closeAllPopups();
  //       },
  //       error: () => {
  //         this.toastr.error('Failed to delete user');
  //         this.userDeleting = false;
  //       }
  //     });
  //   });
  // }


  // confirmFinalDelete() {
  //   if (!this.userToDelete) return;

  //   this.api.hasAssignedTasks$(this.userToDelete.id).subscribe(hasTasks => {

  //     if (hasTasks) {
  //       this.closeAllPopups();
  //       this.showTaskBlockPopup = true;
  //       document.body.classList.add('overflow-hidden');
  //       return;
  //     }

  //     // ✅ SAFE DELETE
  //     this.api.deleteUser(this.userToDelete.id).subscribe({
  //       next: () => {
  //         this.toastr.success('User deleted successfully');
  //         this.closeAllPopups();
  //       },
  //       error: () => {
  //         this.toastr.error('Failed to delete user');
  //       }
  //     });
  //   });
  // }

  // confirmFinalDelete() {
  //   if (!this.userToDelete || this.userDeleting) return;

  //   this.userDeleting = true; // 🔒 lock

  //   this.api.deleteUser(this.userToDelete.id).subscribe({
  //     next: () => {
  //       this.toastr.success('User deleted successfully');
  //       this.closeAllPopups();
  //     },
  //     error: () => {
  //       this.toastr.error('Failed to delete user');
  //       this.userDeleting = false;
  //     },
  //     complete: () => {
  //       this.userDeleting = false; // 🔓 unlock
  //     }
  //   });
  // }

  // confirmFinalDelete() {
  //   if (!this.userToDelete || this.userDeleting) return;

  //   const userId = String(this.userToDelete.id); // 🔒 capture once
  //   this.userDeleting = true;

  //   this.api.ensureTasksLoaded$().subscribe(tasks => {
  //     const hasTasks = tasks.some(
  //       t =>
  //         Array.isArray(t.assignedUsers) &&
  //         t.assignedUsers.map(String).includes(userId)
  //     );

  //     if (hasTasks) {
  //       this.userDeleting = false;
  //       this.closeAllPopups();
  //       this.showTaskBlockPopup = true;
  //       document.body.classList.add('overflow-hidden');
  //       return;
  //     }

  //     this.api.deleteUser(userId).subscribe({
  //       next: () => {
  //         this.toastr.success('User deleted successfully');
  //         this.closeAllPopups();
  //       },
  //       error: () => {
  //         this.toastr.error('Failed to delete user');
  //         this.userDeleting = false;
  //       }
  //     });
  //   });
  // }

  confirmFinalDelete() {
    if (!this.userToDelete?.id || this.userDeleting) return;

    this.userDeleting = true;
    const userId = String(this.userToDelete.id);

    this.api.deleteUser(userId).subscribe({
      next: () => {
        this.toastr.success('User deleted successfully');
        this.closeAllPopups();
      },
      error: () => {
        this.toastr.error('Failed to delete user');
        this.userDeleting = false;
      }
    });
  }

  goToUserTasks() {
    if (!this.userToDelete) return;

    this.api.setTaskFilterUser(this.userToDelete.id);
    this.closeAllPopups();
    this.router.navigate(['/tasks']);
  }

  /* =====================
     📊 STATS
  ===================== */
  get password() {
    return this.adminForm.get('password');
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

  /* =====================
   📊 TOP STATS (CARDS)
===================== */
  get totalUsers() {
    return this.filteredUsers.length;
  }

  // Users who can manage users
  get manageUserCount() {
    return this.filteredUsers.filter(
      u => u.permissions?.createUser
    ).length;
  }

  // Users who can create OR edit tasks
  get createEditTaskCount() {
    return this.filteredUsers.filter(
      u => u.permissions?.createTask || u.permissions?.editTask
    ).length;
  }

  // Users who can delete tasks
  get deleteTaskCount() {
    return this.filteredUsers.filter(
      u => u.permissions?.deleteTask
    ).length;
  }

  get currentUserId() {
    return this.api.user()?.id;
  }

  private enableAllAdminControls() {
    Object.keys(this.adminForm.controls).forEach(key => {
      this.adminForm.get(key)?.enable();
    });
  }

}
