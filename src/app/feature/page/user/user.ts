// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { ToastrService } from 'ngx-toastr';

// import { UserService } from '../../../core/service/mocapi/user';
// import { AuthService } from '../../../core/service/mocapi/auth';
// import { AdminAddUser } from '../admin-add-user/admin-add-user';

// @Component({
//   selector: 'app-users-page',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     NgxPaginationModule,
//     AdminAddUser,
//   ],
//   templateUrl: './user.html',
// })
// export class UsersPage implements OnInit {

//   /** UI STATE */
//   sidebarOpen = false;
//   editUser: any | null = null;
//   loading = true;

//   /** DATA */
//   users: any[] = [];
//   filteredUsers: any[] = [];

//   /** FILTER */
//   searchText = '';

//   /** PAGINATION */
//   p = 1;
//   itemsPerPage = 5;
//   pageSizeOptions = [5, 10, 20, 'All'];
//   selectedPageSize: number | 'All' = 5;

//   constructor(
//     private userService: UserService,
//     private auth: AuthService,
//     private toastr: ToastrService
//   ) { }

//   // ======================
//   // 🔄 INIT
//   // ======================
//   ngOnInit() {
//     this.loadUsers();
//   }

//   // ======================
//   // 🔄 LOAD USERS (SCOPED)
//   // ======================
//   loadUsers() {
//     this.loading = true;

//     this.userService.getUsers().subscribe({
//       next: (res) => {
//         this.users = res;
//         this.filteredUsers = [...res];
//         this.loading = false;
//       },
//       error: () => {
//         this.toastr.error('Failed to load users');
//         this.loading = false;
//       },
//     });
//   }

//   // ======================
//   // ➕ ADD USER
//   // ======================
//   openAdd() {
//     if (!this.canManageUsers()) {
//       this.toastr.warning('You do not have permission to manage users');
//       return;
//     }

//     this.editUser = null;
//     this.sidebarOpen = true;
//   }

//   // ======================
//   // ✏️ EDIT USER
//   // ======================
//   openEdit(user: any) {
//     if (!this.canManageUsers()) {
//       this.toastr.warning('You do not have permission to manage users');
//       return;
//     }

//     this.editUser = user;
//     this.sidebarOpen = true;
//   }

//   closeSidebar() {
//     this.sidebarOpen = false;
//     this.editUser = null;
//     this.loadUsers(); // refresh after add/edit/delete
//   }

//   // ======================
//   // 🔍 SEARCH
//   // ======================
//   filterBySearch() {
//     const text = this.searchText.trim().toLowerCase();

//     if (!text) {
//       this.filteredUsers = [...this.users];
//       return;
//     }

//     this.filteredUsers = this.users.filter(
//       u =>
//         u.name.toLowerCase().includes(text) ||
//         u.email.toLowerCase().includes(text)
//     );
//   }

//   // ======================
//   // 🔢 PAGINATION
//   // ======================
//   onPageSizeChange(size: number | 'All') {
//     this.p = 1;
//     this.itemsPerPage =
//       size === 'All' ? this.filteredUsers.length || 1 : size;
//   }

//   // ======================
//   // 🔐 PERMISSION
//   // ======================
//   canManageUsers(): boolean {
//     return this.auth.hasPermission('createUser');
//   }

//   // ======================
//   // 🗑 DELETE USER
//   // ======================
//   deleteUser(user: any) {
//     if (!this.canManageUsers()) {
//       this.toastr.warning('You do not have permission');
//       return;
//     }

//     if (!confirm(`Delete ${user.name}?`)) return;

//     this.userService.deleteUser(user.id).subscribe({
//       next: () => {
//         this.toastr.success('User deleted');
//         this.loadUsers();
//       },
//       error: () => this.toastr.error('Delete failed'),
//     });
//   }

//   // ======================
//   // 📊 STATS (SAFE FOR TEMPLATE)
//   // ======================
//   get totalUsers(): number {
//     return this.filteredUsers.length;
//   }

//   get adminCount(): number {
//     return this.filteredUsers.filter(
//       u => !!u.permissions?.createUser
//     ).length;
//   }

//   get normalUserCount(): number {
//     return this.filteredUsers.filter(
//       u => !u.permissions?.createUser
//     ).length;
//   }

// }


// import { Component, OnInit, effect } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { ToastrService } from 'ngx-toastr';

// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { AdminAddUser } from '../admin-add-user/admin-add-user';

// @Component({
//   selector: 'app-users-page',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     NgxPaginationModule,
//     AdminAddUser,
//   ],
//   templateUrl: './user.html',
// })
// export class UsersPage implements OnInit {

//   /* =====================
//      UI STATE
//   ===================== */
//   sidebarOpen = false;
//   editUser: any | null = null;
//   loading = true;

//   /* =====================
//      DATA (FROM STORE)
//   ===================== */
//   users: any[] = [];
//   filteredUsers: any[] = [];

//   /* =====================
//      FILTER
//   ===================== */
//   searchText = '';

//   /* =====================
//      PAGINATION
//   ===================== */
//   p = 1;
//   itemsPerPage = 5;
//   pageSizeOptions = [5, 10, 20, 'All'];
//   selectedPageSize: number | 'All' = 5;

//   constructor(
//     private api: ApiService,
//     private toastr: ToastrService
//   ) {
//     // 🔁 Reactive user store
//     effect(() => {
//       this.loading = true;

//       this.api.getUsers$().subscribe(users => {
//         this.users = users;
//         this.applyFilter();
//         this.loading = false;
//       });
//     });
//   }

//   ngOnInit() {
//     // ✅ users loaded once internally (cached)
//     this.api.getUsers$().subscribe();
//   }

//   /* =====================
//      ➕ ADD USER
//   ===================== */
//   openAdd() {
//     if (!this.canManageUsers()) {
//       this.toastr.warning('You do not have permission to manage users');
//       return;
//     }

//     this.editUser = null;
//     this.sidebarOpen = true;
//   }

//   /* =====================
//      ✏️ EDIT USER
//   ===================== */
//   openEdit(user: any) {
//     if (!this.canManageUsers()) {
//       this.toastr.warning('You do not have permission to manage users');
//       return;
//     }

//     this.editUser = user;
//     this.sidebarOpen = true;
//   }

//   closeSidebar() {
//     this.sidebarOpen = false;
//     this.editUser = null;
//     // ❌ no reload, store already updated
//   }

//   /* =====================
//      🔍 SEARCH
//   ===================== */
//   filterBySearch() {
//     this.applyFilter();
//   }

//   private applyFilter() {
//     const text = this.searchText.trim().toLowerCase();

//     if (!text) {
//       this.filteredUsers = [...this.users];
//     } else {
//       this.filteredUsers = this.users.filter(
//         u =>
//           u.name?.toLowerCase().includes(text) ||
//           u.email?.toLowerCase().includes(text)
//       );
//     }

//     this.onPageSizeChange(this.selectedPageSize);
//   }

//   /* =====================
//      🔢 PAGINATION
//   ===================== */
//   onPageSizeChange(size: number | 'All') {
//     this.p = 1;
//     this.itemsPerPage =
//       size === 'All' ? this.filteredUsers.length || 1 : size;
//   }

//   /* =====================
//      🔐 PERMISSION
//   ===================== */
//   canManageUsers(): boolean {
//     return this.api.hasPermission('createUser');
//   }

//   /* =====================
//      🗑 DELETE USER
//   ===================== */
//   deleteUser(user: any) {
//     if (!this.canManageUsers()) {
//       this.toastr.warning('You do not have permission');
//       return;
//     }

//     if (!confirm(`Delete ${user.name}?`)) return;

//     this.api.deleteUser(user.id).subscribe({
//       next: () => {
//         this.toastr.success('User deleted');
//         // ✅ store auto-updated
//       },
//       error: () => this.toastr.error('Delete failed'),
//     });
//   }

//   /* =====================
//      📊 STATS
//   ===================== */
//   get totalUsers(): number {
//     return this.filteredUsers.length;
//   }

//   get adminCount(): number {
//     return this.filteredUsers.filter(
//       u => !!u.permissions?.createUser
//     ).length;
//   }

//   get normalUserCount(): number {
//     return this.filteredUsers.filter(
//       u => !u.permissions?.createUser
//     ).length;
//   }
// }


import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { ApiService } from '../../../core/service/mocapi/api/api';
import { AdminAddUser } from '../admin-add-user/admin-add-user';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    AdminAddUser,
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

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) { }

  /* =====================
     INIT
  ===================== */
  ngOnInit() {
    // 🔥 load once (cached internally)
    this.sub = this.api.getUsers$().subscribe(users => {
      this.users = users;
      this.applyFilter();
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
      this.toastr.warning('You do not have permission to manage users');
      return;
    }

    this.editUser = null;
    this.sidebarOpen = true;
  }

  /* =====================
     ✏️ EDIT USER
  ===================== */
  openEdit(user: any) {
    if (!this.canManageUsers()) {
      this.toastr.warning('You do not have permission to manage users');
      return;
    }

    this.editUser = user;
    this.sidebarOpen = true;
  }

  closeSidebar() {
    this.sidebarOpen = false;
    this.editUser = null;
    // ✅ NO reload, store already updated
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
  deleteUser(user: any) {
    if (!this.canManageUsers()) {
      this.toastr.warning('You do not have permission');
      return;
    }

    if (!confirm(`Delete ${user.name}?`)) return;

    this.api.deleteUser(user.id).subscribe({
      next: () => this.toastr.success('User deleted'),
      error: () => this.toastr.error('Delete failed'),
    });
  }

  /* =====================
     📊 STATS
  ===================== */
  get totalUsers() {
    return this.filteredUsers.length;
  }

  get adminCount() {
    return this.filteredUsers.filter(u => !!u.permissions?.createUser).length;
  }

  get normalUserCount() {
    return this.filteredUsers.filter(u => !u.permissions?.createUser).length;
  }
}
