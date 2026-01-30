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
      this.applyFilter();
      const start = Date.now();
      this.loading = false;

      // setTimeout(() => {
      //   this.loading = false;
      // }, Math.max(300 - (Date.now() - start), 0));

      // this.loading = false;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  /* =====================
     ➕ ADD USER
  ===================== */
  // openAdd() {
  //   if (!this.canManageUsers()) {
  //     this.toastr.warning('You do not have permission to manage users');
  //     return;
  //   }

  //   this.editUser = null;
  //   this.sidebarOpen = true;
  //   this.renderer.addClass(document.body, 'overflow-hidden');
  // }


  openAdd() {
    if (!this.canManageUsers()) {
      this.toastr.warning('You do not have permission');
      return;
    }

    this.isEditMode = false;
    this.editUser = null;
    this.adminForm.reset();
    this.sidebarOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  /* =====================
     ✏️ EDIT USER
  ===================== */
  // openEdit(user: any) {
  //   if (!this.canManageUsers()) {
  //     this.toastr.warning('You do not have permission to manage users');
  //     return;
  //   }

  //   this.editUser = user;
  //   this.sidebarOpen = true;
  // }

  openEdit(user: any) {
    if (!this.canManageUsers()) {
      this.toastr.warning('You do not have permission');
      return;
    }

    this.isEditMode = true;
    this.editUser = user;

    this.adminForm.reset({
      name: user.name,
      email: user.email,
      ...user.permissions,
    });

    this.adminForm.get('name')?.disable();
    this.adminForm.get('email')?.disable();
    this.adminForm.get('password')?.disable();

    this.sidebarOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  // closeSidebar() {
  //   this.sidebarOpen = false;
  //   this.editUser = null;
  //   this.renderer.removeClass(document.body, 'overflow-hidden');
  //   // ✅ NO reload, store already updated
  // }
  closeSidebar() {
    this.sidebarOpen = false;
    this.editUser = null;
    this.isEditMode = false;
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

  submitAdminForm() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const raw = this.adminForm.getRawValue();

    const permissions = {
      createUser: !!raw.createUser,
      createTask: !!raw.createTask,
      editTask: !!raw.editTask,
      deleteTask: !!raw.deleteTask,
    };

    this.formLoading = true;

    if (this.isEditMode && this.editUser) {
      this.api.updateUser(this.editUser.id, { permissions }).subscribe({
        next: () => {
          this.toastr.success('User updated');
          this.closeSidebar();
        },
        error: () => {
          this.toastr.error('Update failed');
          this.formLoading = false;
        }
      });
      return;
    }

    this.api.createUser({
      name: raw.name,
      email: raw.email,
      password: raw.password,
      permissions,
    }).subscribe({
      next: () => {
        this.toastr.success('User created');
        this.closeSidebar();
      },
      error: () => {
        this.toastr.error('Creation failed');
        this.formLoading = false;
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
  // deleteUser(user: any) {
  //   if (!this.canManageUsers()) {
  //     this.toastr.warning('You do not have permission');
  //     return;
  //   }

  //   if (!confirm(`Delete ${user.name}?`)) return;

  //   this.api.deleteUser(user.id).subscribe({
  //     next: () => this.toastr.success('User deleted'),
  //     error: () => this.toastr.error('Delete failed'),
  //   });
  // }

  // deleteUser(user: any) {
  //   if (!this.canManageUsers()) {
  //     this.toastr.warning('You do not have permission');
  //     return;
  //   }

  //   // 🔴 CHECK ASSIGNED TASKS
  //   const hasTasks = this.api.hasAssignedTasks(user.id);

  //   if (hasTasks) {
  //     const goToTasks = confirm(
  //       `${user.name} is assigned to one or more tasks.\n\nYou cannot delete this user until those tasks are reviewed.\n\nDo you want to view the assigned tasks?`
  //     );

  //     if (goToTasks) {
  //       this.api.setTaskFilterUser(user.id);
  //       this.router.navigate(['/tasks']);
  //     }
  //     return;
  //   }

  //   // 🔴 NORMAL DELETE
  //   if (!confirm(`Delete ${user.name}?`)) return;

  //   this.api.deleteUser(user.id).subscribe({
  //     next: () => this.toastr.success('User deleted'),
  //     error: () => this.toastr.error('Delete failed'),
  //   });
  // }

  // deleteUser(user: any) {
  //   if (!this.canManageUsers()) {
  //     this.toastr.warning('You do not have permission');
  //     return;
  //   }

  //   // 🔍 check assigned tasks (cached)
  //   const hasTasks = this.api.hasAssignedTasks(user.id);

  //   if (hasTasks) {
  //     const confirmView = confirm(
  //       `${user.name} has one or more assigned tasks.\n\nYou cannot delete this user until those tasks are handled.\n\nDo you want to view the assigned tasks now?`
  //     );

  //     if (confirmView) {
  //       // ✅ set filter BEFORE navigation
  //       this.api.setTaskFilterUser(user.id);

  //       // ✅ CORRECT ROUTE
  //       this.router.navigate(['/tasks']);
  //     }

  //     return; // ⛔ stop delete
  //   }

  //   // ✅ normal delete (no tasks)
  //   if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

  //   this.api.deleteUser(user.id).subscribe({
  //     next: () => this.toastr.success('User deleted'),
  //     error: () => this.toastr.error('Delete failed'),
  //   });
  // }

  // deleteUser(user: any) {
  //   console.log('DELETE USER', user);
  //   console.log('DELETE USER id', user.id);

  //   const hasAssignedTasks = this.api.tasksSnapshot.some(task =>
  //     task.assignedUsers?.includes(user.id)
  //   );

  //   // if (hasAssignedTasks) {

  //   //   const confirmCheck = confirm(
  //   //     `${user.name} has assigned tasks. Do you want to review them first?`
  //   //   );

  //   //   if (!confirmCheck) return;

  //   //   // ✅ PASS THE USER BEING DELETED
  //   //   this.api.setTaskFilterUser(user.id);

  //   //   // ✅ REDIRECT TO TASKS
  //   //   this.router.navigate(['/tasks']);
  //   //   return;
  //   // }

  //   if (hasAssignedTasks) {
  //     // 👉 OPEN CUSTOM POPUP
  //     this.userToDelete = user;
  //     this.showTaskBlockPopup = true;
  //     document.body.classList.add('overflow-hidden');
  //     return;
  //   }

  //   // no tasks → allow delete
  //   this.api.deleteUser(user.id).subscribe(() => {
  //     this.toastr.success('User deleted');
  //   });
  // }

  deleteUser(user: any) {
    if (!this.canManageUsers()) {
      this.toastr.warning('You do not have permission');
      return;
    }

    this.userToDelete = user;

    const hasAssignedTasks = this.api.hasAssignedTasks(user.id);

    // 🔴 CASE 1: USER HAS ASSIGNED TASKS → BLOCK DELETE
    if (hasAssignedTasks) {
      this.showTaskBlockPopup = true;
      document.body.classList.add('overflow-hidden');
      return;
    }

    // 🟡 CASE 2: USER HAS NO TASKS → ASK CONFIRMATION
    this.showDeleteConfirmPopup = true;
    document.body.classList.add('overflow-hidden');
  }

  closeTaskPopup() {
    this.showTaskBlockPopup = false;
    this.userToDelete = null;
    document.body.classList.remove('overflow-hidden');
  }

 
  closeAllPopups() {
    this.showTaskBlockPopup = false;
    this.showDeleteConfirmPopup = false;
    this.userToDelete = null;
    document.body.classList.remove('overflow-hidden');
  }

  confirmFinalDelete() {
    if (!this.userToDelete) return;

    this.api.deleteUser(this.userToDelete.id).subscribe(() => {
      this.toastr.success('User deleted');
      this.closeAllPopups();
      this.sidebarOpen = false;
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

  // get totalUsers() {
  //   return this.filteredUsers.length;
  // }

  // get adminCount() {
  //   return this.filteredUsers.filter(u => !!u.permissions?.createUser).length;
  // }

  // get normalUserCount() {
  //   return this.filteredUsers.filter(u => !u.permissions?.createUser).length;
  // }

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

  // Total users (already correct)
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

}
