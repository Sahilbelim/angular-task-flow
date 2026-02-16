// // // // import { Component, OnInit } from '@angular/core';
// // // // import { UserService } from '../../../core/service/user';
// // // // import { ToastrService } from 'ngx-toastr';

// // // // @Component({
// // // //   selector: 'app-admin-users',
// // // //   standalone: true,
// // // //   templateUrl: './admin-users.html',
// // // // })
// // // // export class AdminUsers  implements OnInit {
// // // //   users: any[] = [];
// // // //   loading = true;

// // // //   constructor(
// // // //     private userService: UserService,
// // // //     private toastr: ToastrService
// // // //   ) { }

// // // //   ngOnInit() {
// // // //     this.loadUsers();
// // // //   }

// // // //   loadUsers() {
// // // //     this.userService.getAllUsers().subscribe({
// // // //       next: (res) => {
// // // //         this.users = res;
// // // //         this.loading = false;
// // // //       },
// // // //       error: () => {
// // // //         this.toastr.error('Failed to load users');
// // // //         this.loading = false;
// // // //       }
// // // //     });
// // // //   }

// // // //   updatePermissions(user: any) {
// // // //     this.userService
// // // //       .updatePermissions(user._id, user.permissions)
// // // //       .subscribe({
// // // //         next: () => this.toastr.success('Permissions updated'),
// // // //         error: () => this.toastr.error('Update failed'),
// // // //       });
// // // //   }
// // // // }

// // // import { Component, OnInit } from '@angular/core';
// // // import { CommonModule } from '@angular/common';
// // // import { FormsModule } from '@angular/forms';   // ✅ REQUIRED
// // // import { UserService } from '../../../core/service/user';
// // // import { ToastrService } from 'ngx-toastr';
// // // import { TaskComponent } from '../tasks/tasks';
// // // import { Subscription } from 'rxjs';

// // // @Component({
// // //   selector: 'app-admin-users',
// // //   standalone: true,
// // //   imports: [
// // //     CommonModule,
// // //     FormsModule // ✅ ADD THIS
// // //     ,
// // //     // TaskComponent
// // // ],
// // //   templateUrl: './admin-users.html',
// // // })
// // // export class AdminUsers implements OnInit {
// // //   users: any[] = [];
// // //   loading = true;
// // //   private sub!: Subscription;
// // //   constructor(
// // //     private userService: UserService,
// // //     private toastr: ToastrService
// // //   ) {
    
// // //   }

// // //   ngOnInit() {
// // //     this.loadUsers();

// // //     this.sub = this.userService.refreshUsers$.subscribe(() => {
// // //       this.loadUsers();
// // //     });
// // //   }
// // //   ngOnDestroy() {
// // //     this.sub?.unsubscribe();
// // //   }
// // //   loadUsers() {
// // //     this.userService.getAllUsers().subscribe({
// // //       next: (res :any) => {
// // //         this.users = res;
// // //         this.loading = false;
// // //       },
// // //       error: (err) => {
// // //         console.log(err);
// // //         this.toastr.error('Failed to load users');
// // //         this.loading = false;
// // //       }
// // //     });
// // //   }

// // //   updatePermissions(user: any) {
// // //     this.userService
// // //       .updatePermissions(user._id, user.permissions)
// // //       .subscribe({
// // //         next: () => this.toastr.success('Permissions updated'),
// // //         error: () => this.toastr.error('Update failed'),
// // //       });
// // //   }
// // // }


// // import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { Subscription } from 'rxjs';
// // import { UserService } from '../../../core/service/user';
// // import { ToastrService } from 'ngx-toastr';
// // import { NgxPaginationModule } from "ngx-pagination";

// // @Component({
// //   selector: 'app-admin-users',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, NgxPaginationModule],
// //   templateUrl: './admin-users.html',
// // })
// // export class AdminUsers implements OnInit, OnDestroy {

// //   @Output() open = new EventEmitter<void>();
// //   /** DATA */
// //   users: any[] = [];
// //   filteredUsers: any[] = [];
// //   loading = true;

// //   /** FILTERS */
// //   searchText = '';
// //   roleFilter: 'all' | 'admin' | 'user' = 'all';
// //   dateRange: { startDate: any; endDate: any } | null = null;

// //   /** PAGINATION */
// //   p = 1;
// //   itemsPerPage = 5;
// //   pageSizeOptions = [5, 10, 20, 'All'];
// //   selectedPageSize: number | 'All' = 5;

// //   private sub!: Subscription;

// //   constructor(
// //     private userService: UserService,
// //     private toastr: ToastrService
// //   ) { }

// //   ngOnInit() {
// //     this.loadUsers();

// //     // 🔁 Auto refresh when admin adds user
// //     this.sub = this.userService.refreshUsers$.subscribe(() => {
// //       this.loadUsers();
// //     });
// //   }

// //   ngOnDestroy() {
// //     this.sub?.unsubscribe();
// //   }

// //   // ======================
// //   // 🔄 LOAD USERS
// //   // ======================
// //   loadUsers() {
// //     this.loading = true;

// //     this.userService.getAllUsers().subscribe({
// //       next: (res: any[]) => {
// //         this.users = res;
// //         this.filteredUsers = [...res];
// //         this.loading = false;
// //       },
// //       error: () => {
// //         this.toastr.error('Failed to load users');
// //         this.loading = false;
// //       },
// //     });
// //   }

// //   // ======================
// //   // 🔍 SEARCH
// //   // ======================
// //   filterBySearch() {
// //     const text = this.searchText.toLowerCase();

// //     this.filteredUsers = this.users.filter(
// //       (u) =>
// //         u.name.toLowerCase().includes(text) ||
// //         u.email.toLowerCase().includes(text)
// //     );
// //   }

// //   // ======================
// //   // 👤 ROLE FILTER
// //   // ======================
// //   filterByRole() {
// //     if (this.roleFilter === 'all') {
// //       this.filteredUsers = [...this.users];
// //       return;
// //     }

// //     this.filteredUsers = this.users.filter(
// //       (u) => u.role === this.roleFilter
// //     );
// //   }

// //   // ======================
// //   // 📅 DATE FILTER
// //   // ======================
// //   applyDateFilter(range: any) {
// //     if (!range?.startDate || !range?.endDate) {
// //       this.filteredUsers = [...this.users];
// //       return;
// //     }

// //     const start = new Date(range.startDate).getTime();
// //     const end = new Date(range.endDate).getTime();

// //     this.filteredUsers = this.users.filter((u) => {
// //       const created = new Date(u.createdAt).getTime();
// //       return created >= start && created <= end;
// //     });
// //   }

// //   clearDateFilter() {
// //     this.dateRange = null;
// //     this.filteredUsers = [...this.users];
// //   }

// //   // ======================
// //   // 🔢 PAGINATION
// //   // ======================
// //   onPageSizeChange(value: number | 'All') {
// //     this.p = 1;

// //     this.itemsPerPage =
// //       value === 'All' ? this.filteredUsers.length || 1 : value;
// //   }

// //   // ======================
// //   // 🔐 UPDATE PERMISSIONS
// //   // ======================
// //   updatePermissions(user: any) {
// //     this.userService
// //       .updatePermissions(user._id, user.permissions)
// //       .subscribe({
// //         next: () => this.toastr.success('Permissions updated'),
// //         error: () => this.toastr.error('Update failed'),
// //       });
// //   }
// // }


// import {
//   Component,
//   OnInit,
//   OnDestroy,
//   Output,
//   EventEmitter,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Subscription } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';
// import { NgxPaginationModule } from 'ngx-pagination';

// import { UserService } from '../../../core/service/mocapi/user';
// import { AuthService } from '../../../core/service/mocapi/auth';
// // import { AdminAddUser } from "../admin-add-user/admin-add-user";

// @Component({
//   selector: 'app-admin-users',
//   standalone: true,
//   imports: [CommonModule, FormsModule, NgxPaginationModule,
//     // AdminAddUser
//   ],
//   templateUrl: './admin-users.html',
// })
// export class AdminUsers implements OnInit, OnDestroy {
//   @Output() open = new EventEmitter<void>();

//   /** DATA */
//   users: any[] = [];
//   filteredUsers: any[] = [];
//   loading = true;

//   /** FILTERS */
//   searchText = '';

//   /** PAGINATION */
//   p = 1;
//   itemsPerPage = 5;
//   pageSizeOptions = [5, 10, 20, 'All'];
//   selectedPageSize: number | 'All' = 5;

//   private sub?: Subscription;

//   constructor(
//     private userService: UserService,
//     private auth: AuthService,
//     private toastr: ToastrService
//   ) { 

//   }

//   // ======================
//   // 🔄 INIT
//   // ======================
//   ngOnInit() {
//     this.loadUsers();

//     // Optional: if later you add refresh Subject in service
//     // this.sub = this.userService.refreshUsers$.subscribe(() => {
//     //   this.loadUsers();
//     // });
//   }

//   ngOnDestroy() {
//     this.sub?.unsubscribe();
//   }

//   editUser: any | null = null;

//   openEdit(user: any) {
//     this.editUser = user;
//   }

//   closeSidebar() {
//     this.editUser = null;
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
//   // 🔍 SEARCH
//   // ======================
//   filterBySearch() {
//     const text = this.searchText.trim().toLowerCase();

//     if (!text) {
//       this.filteredUsers = [...this.users];
//       return;
//     }

//     this.filteredUsers = this.users.filter(
//       (u) =>
//         u.name.toLowerCase().includes(text) ||
//         u.email.toLowerCase().includes(text)
//     );
//   }

//   // ======================
//   // 🔢 PAGINATION
//   // ======================
//   onPageSizeChange(value: number | 'All') {
//     this.p = 1;
//     this.itemsPerPage =
//       value === 'All' ? this.filteredUsers.length || 1 : value;
//   }

//   // ======================
//   // 🔐 PERMISSIONS
//   // ======================
//   canManageUsers(): boolean {
//     return this.auth.hasPermission('createUser');
//   }

//   // ======================
//   // ✏️ UPDATE USER PERMISSIONS
//   // ======================
//   updatePermissions(user: any) {
//     if (!this.canManageUsers()) {
//       this.toastr.warning('You do not have permission');
//       return;
//     }

//     this.userService
//       .updateUserPermissions(user.id, user.permissions)
//       .subscribe({
//         next: () => this.toastr.success('Permissions updated'),
//         error: () => this.toastr.error('Update failed'),
//       });
//   }

//   // ======================
//   // 🗑 DELETE USER (OPTIONAL)
//   // ======================
//   deleteUser(userId: string) {
//     if (!this.canManageUsers()) {
//       this.toastr.warning('You do not have permission');
//       return;
//     }

//     if (!confirm('Delete this user?')) return;

//     this.userService.deleteUser(userId).subscribe({
//       next: () => {
//         this.toastr.success('User deleted');
//         this.loadUsers();
//       },
//       error: () => this.toastr.error('Delete failed'),
//     });
//   }
// }
