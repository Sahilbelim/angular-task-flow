// import { Component, effect, OnInit } from '@angular/core';
// import { ReactiveFormsModule,FormBuilder, Validators, FormsModule, FormControl } from '@angular/forms';
// import { TaskService } from '../../../core/service/task';
// import { Auth } from '../../../core/auth/auth';
// import { PostService } from '../../../core/service/post';
// import { Post } from '../../../core/models/post.model';
// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { ToastrService } from 'ngx-toastr';
// import { CommonModule } from '@angular/common';
// import { AdminAddUser } from "../admin-add-user/admin-add-user";
// type TaskStatus = 'pending' | 'in-progress' | 'completed';

// @Component({
//   selector: 'app-dashbord',
//   standalone: true,
//   imports: [ReactiveFormsModule, FormsModule, NgxDaterangepickerMd, NgxPaginationModule, CommonModule, AdminAddUser],
//   templateUrl: './dashbord.html',
//   styleUrl: './dashbord.css',
// })
  

// export class Dashbord implements OnInit  {

//   popupVisible = false;

//   taskForm;
//   user:any;
//   posts: Post[] = [];

//   searchText = '';
//   statusFilter: TaskStatus | 'all' = 'all';
//   dateRange: { startDate: any; endDate: any } | null = null;
//   filteredTasks: any[] = [];
//   dateRangeControl = new FormControl(null);

//   editingTask: any = null;
//   deletingTask: boolean =false ;
//   deleteId: string | null = null;
//   tasks: any[] = [];
//   totalTasks: number = 0;
//   complatedTasks: number = 0;
//   inprogressTasks: number = 0;
//   pendingTasks: number = 0;
//   loading = true;

//   p = 1;                 // current page
//   itemsPerPage = 5;      // items per page
//   pageSizeOptions = [5, 10, 20, 'All'];

//   selectedPageSize: number | 'All' = 5;

//   // constructor(
//   //   private fb: FormBuilder,
//   //   public taskService: TaskService,
//   //   private auth: Auth,
//   //   public postService: PostService,
//   //   private toststr: ToastrService
//   // ) {
//   //   this.taskForm = this.fb.nonNullable.group({
//   //     title: ['', Validators.required],
//   //     dueDate: ['', Validators.required],
//   //     status: ['pending' as TaskStatus, Validators.required],
//   //     deleteId: [null],
//   //   });
//   //   effect(() => {
//   //     const data = this.taskService.tasks();

//   //     this.tasks = [...data];
//   //     this.filteredTasks = [...data];

//   //     // 🔢 Stats update
//   //     this.totalTasks = data.length;
//   //     this.complatedTasks = data.filter(t => t.status === 'completed').length;
//   //     this.inprogressTasks = data.filter(t => t.status === 'in-progress').length;
//   //     this.pendingTasks = data.filter(t => t.status === 'pending').length;
//   //   });

   
//   // }

//   // ngOnInit(): void {
//   //   this.user = this.auth.user()?.uid;

//   //   if (this.user) {
//   //     this.taskService.loadTasks(this.user);
//   //   }

//   //   this.dateRangeControl.valueChanges.subscribe(range => {
//   //     this.applyDateFilter(range);
//   //   });
//   // }

//   constructor(
//     private fb: FormBuilder,
//     public taskService: TaskService,
//     private auth: Auth,
//     public postService: PostService,
//     private toststr: ToastrService
//   ) {
//     this.taskForm = this.fb.nonNullable.group({
//       title: ['', Validators.required],
//       dueDate: ['', Validators.required],
//       status: ['pending' as TaskStatus, Validators.required],
//       deleteId: [null],
//     });

//     // ✅ REACT TO AUTH STATE
//     effect(() => {
//       const user = this.auth.user();

//       if (user?.uid) {
//         console.log('Auth ready → loading tasks');
//         this.taskService.loadTasks(user.uid);
//       }
//     });

//     // ✅ REACT TO TASK CHANGES
//     effect(() => {

//       this.loading = !this.taskService.loaded();
//       const data = this.taskService.tasks();
     


//       this.tasks = [...data];
//       this.filteredTasks = [...data];

//       this.totalTasks = data.length;
//       this.complatedTasks = data.filter(t => t.status === 'completed').length;
//       this.inprogressTasks = data.filter(t => t.status === 'in-progress').length;
//       this.pendingTasks = data.filter(t => t.status === 'pending').length;
//     });
//   }

//   ngOnInit(): void {
//     this.dateRangeControl.valueChanges.subscribe(range => {
//       this.applyDateFilter(range);
//     });
//   }

//   onPageSizeChange(value: number | 'All') {
//     this.p = 1;

//     if (value === 'All') {
//       this.itemsPerPage = this.filteredTasks.length || 1;
//     } else {
//       this.itemsPerPage = value;
//     }
//   }


//   togglePopup() {
//     this.popupVisible = !this.popupVisible;

//     if (this.popupVisible) {
//       document.body.classList.add('overflow-hidden');
//     } else {
//       document.body.classList.remove('overflow-hidden');
//       this.resetForm();
//     }
//   }


//   // async addTask() {
//   //   if (this.taskForm.invalid) return;
//   //   console.log(this.taskForm.value)

//   //   const { title, dueDate, status } = this.taskForm.getRawValue();

//   //   await this.taskService.addTask({
//   //     title,
//   //     dueDate,
//   //     status,
//   //     createdAt: Date.now(),
//   //     userId: this.auth.user()!.uid,
//   //   });

//   //   this.taskForm.reset({
//   //     title: '',
//   //     dueDate: '',
//   //     status: 'pending',
//   //   });

//   //   this.togglePopup();
//   // }

//   async saveTask() {
//     if (this.taskForm.invalid) {
//       this.taskForm.markAllAsTouched();
//       return
//     }

//     const { title, dueDate, status } = this.taskForm.getRawValue();

//     document.body.classList.remove('overflow-hidden');
//     if (this.editingTask) {
//       await this.taskService.updateTask(this.editingTask.id, {
//         title,
//         dueDate,
//         status,
//       });
//       this.toststr.success('Task updated successfully');
//     }
    
//     else {
//       await this.taskService.addTask({
//         title,
//         dueDate,
//         status,
//         createdAt: Date.now(),
//         userId: this.auth.user()!.uid,
//       });
//       this.toststr.success('Task added successfully');
//     }

//     this.resetForm();
//   }

  
//   editTask(task: any) {
//     this.editingTask = task;
//     this.popupVisible = true;
//     document.body.classList.add('overflow-hidden');
//     this.taskForm.patchValue({
//       title: task.title,
//       dueDate: task.dueDate,
//       status: task.status,
//     });
//   }

//   viewTask(task: any) {
//     console.log(task)
//     this.deletingTask = true;
//     this.deleteId = null;
//     document.body.classList.add('overflow-hidden');
//     this.taskForm.patchValue({
//       title: task.title,
//       dueDate: task.dueDate,
//       status: task.status,
//     });
//     this.taskForm.disable();
//   }
//   deleteTask(task: any) {
//     this.deleteId = task.id;
//     this.deletingTask = true;
//     console.log(task)
//     document.body.classList.add('overflow-hidden');
//     this.taskForm.patchValue({
//       title: task.title,
//       dueDate: task.dueDate,
//       status: task.status,
//     });
//     this.taskForm.disable();
//     // this.taskService.deleteTask(task.id).then(() => {
//     //   this.deletingTask = false;
//     // });
    
//   }
//   confirmDelete( ) {
//     this.deletingTask = false;
//     this.taskService.deleteTask(this.deleteId).then(() => {
//       this.toststr.success('Task deleted successfully');
//       this.resetForm();
//       this.deleteId = null;
//     });
   
//     this.taskForm.enable();
//   }
//   resetForm() {
//     this.taskForm.reset({
//       title: '',
//       dueDate: '',
//       status: 'pending',
//     });

//     this.popupVisible = false;
//     this.editingTask = null;
//   }

//    getpost() {
//      this.postService.getPost().subscribe(data => {
//        this.posts = data;
//        console.log(data)
//      })
    
//     this.postService.getPostById(5).subscribe(data => {
//       console.log(data)
//       this.postService.updatePost(7, data).subscribe(res => {
//         console.log(res);
//       })
//     })
//     console.log(this.posts)
    
//   }
//   filterBySearch() {
//     const text = this.searchText.trim().toLowerCase();

    
//     if (!text) {
//       this.filteredTasks = [...this.tasks];
//       return;
//     }

  
//     this.filteredTasks = this.tasks.filter(task =>
//       task.title.toLowerCase().includes(text)
//     );
//   }

//   filterByStatus() {
//     if (this.statusFilter === 'all') {
//       this.filteredTasks = [...this.tasks];
//       return;
//     }

//     this.filteredTasks = this.tasks.filter(
//       task => task.status === this.statusFilter
//     );
//   }

//   applyDateFilter(range: { startDate: any; endDate: any } | null) {
//     // If no date selected → show all tasks
//     if (!range || !range.startDate || !range.endDate) {
//       this.filteredTasks = [...this.tasks];
//       return;
//     }

//     const start = new Date(range.startDate).getTime();
//     const end = new Date(range.endDate).getTime();

//     this.filteredTasks = this.tasks.filter(task => {
//       const taskDate = new Date(task.dueDate).getTime();
//       return taskDate >= start && taskDate <= end;
//     });

    

//   }

//   closeDeleteModal() {
//     this.deletingTask = false;
//     this.deleteId = null;
//     this.taskForm.enable();
//     document.body.classList.remove('overflow-hidden');
//   }

//   clearDateFilter() {
//     // reset date picker
//     this.dateRangeControl.setValue(null);

//     // show all tasks
//     this.filteredTasks = [...this.tasks];
//   }

   


  
// }


import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';

import { NewTaskService } from '../../../core/service/mocapi/task';
import { AuthService } from '../../../core/service/mocapi/auth';

import { NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../../../core/service/mocapi/user';



type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDaterangepickerMd,
    NgxPaginationModule,
    NgSelectModule
  ],
  templateUrl: './dashbord.html',
})
export class Dashbord implements OnInit {
  /** UI */
  popupVisible = false;
  deletingTask = false;
  loading = true;

  /** DATA */
  tasks: any[] = [];
  filteredTasks: any[] = [];
  editingTask: any = null;
  deleteId: string | null = null;

  /** STATS */
  totalTasks = 0;
  complatedTasks = 0;
  inprogressTasks = 0;
  pendingTasks = 0;

  /** FILTERS */
  searchText = '';
  statusFilter: TaskStatus | 'all' = 'all';
  dateRangeControl = new FormControl(null);

  /** PAGINATION */
  p = 1;
  itemsPerPage = 5;
  pageSizeOptions = [5, 10, 20, 'All'];
  selectedPageSize: number | 'All' = 5;

  /** FORM */
  taskForm: any;
  assignableUsers: string[] = [];
  currentUser: any;
  assignedUserMap: Record<string, { id: string; name: string; email: string }[]> = {};


  constructor(
    private fb: FormBuilder,
    private taskService: NewTaskService,
    public auth: AuthService,
    private toastr: ToastrService
  ) { 
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['pending' as TaskStatus],
      priority: ['medium' as TaskPriority],
      assignedUsers: [[] as string[]],

    });
    this.loadTasks();
  }

  // ngOnInit() {
  //   this.loadTasks();

  //   this.dateRangeControl.valueChanges.subscribe((range) =>
  //     this.applyDateFilter(range)
  //   );
  // }
  ngOnInit() {
    this.currentUser = this.auth.user();
    this.loadAssignableUsers();
    this.loadTasks();
    console.log('Assigned users:', this.assignedUserMap);
    // this.tasks.forEach(task => this.resolveAssignedUsers(task));
    console.log('Assigned users after resolving:', this.assignedUserMap);
    this.dateRangeControl.valueChanges.subscribe(range =>
      this.applyDateFilter(range)
    );
  }


  // ======================
  // 🔄 LOAD TASKS (API)
  // ======================

  // loadAssignableUsers() {
  //   const me = this.auth.user();
  //   if (!me) return;

  //   this.taskService.getUsers().subscribe((users: any[]) => {
  //     this.assignableUsers = users.filter(u =>
  //       u.id !== me.id &&
  //       (
  //         u.parentId === me.id ||            // my children
  //         (me.parentId && u.parentId === me.parentId) // my siblings
  //       )
  //     );
  //   });
  // }
  // resolveAssignedUsers(task: any) {
  //   if (!task.assignedTo || task.assignedTo.length === 0) {
  //     this.assignedUserMap[task.id] = [];
  //     return;
  //   }

  //   this.taskService
  //     .getUsersByIds(task.assignedTo)
  //     .subscribe(res => {
  //       this.assignedUserMap[task.id] = res;
  //     });
  // }

  loadAssignableUsers() {
    const me = this.auth.user();
    if (!me) return;

    const myId = String(me.id);
    const myParentId = me.parentId ? String(me.parentId) : null;

    this.taskService.getUsers().subscribe((users: any[]) => {
      this.assignableUsers = users.filter(u => {
        const userId = String(u.id);
        const userParentId = u.parentId ? String(u.parentId) : null;

        // ❌ cannot assign to myself
        // if (userId === myId) return false;

        // ✅ my children
        if (userParentId === myId) return true;

        // ✅ my siblings
        if (myParentId && userParentId === myParentId) return true;
        

        return false;
      });
    });
  }
  users: any[] = [];
  userMap: Record<string, any> = {};

  
  // getAssignedUsers(task: any): string {
  //   if (!task.assignedTo || task.assignedTo.length === 0) {
  //     return '—';
  //   }

  //   return task.assignedTo
  //     .map((id: string) => {
  //       const u = this.userMap[String(id)];
  //       return u ? `${u.name} (${u.email})` : null;
  //     })
  //     .filter(Boolean)
  //     .join(', ');
  // }

  loadTasks() {
    this.loading = true;

    this.taskService.getTasks().subscribe({
      next: (res: any[]) => {
        console.log('Tasks loaded:', res);
        this.tasks = res;
        this.filteredTasks = [...res];
        this.updateStats(res);
        this.resolveAssignedUsers(res); // ✅ IMPORTANT
        console.log('Assigned users map:', this.assignedUsersMap);

        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load tasks');
        this.loading = false;
      },
    });
  }

  // ======================
  // ➕ ADD / ✏️ UPDATE
  // ======================
  // saveTask() {
  //   if (this.taskForm.invalid) {
  //     this.taskForm.markAllAsTouched();
  //     return;
  //   }

  //   const payload = this.taskForm.value;

  //   if (this.editingTask) {
  //     console.log('Task updated:', payload);

  //     this.taskService
  //       .updateTask(this.editingTask.id, payload)
  //       .subscribe((res) => {
  //         console.log('Task updated:', res);
  //         this.toastr.success('Task updated');
  //         this.resetForm();
  //         this.loadTasks();
  //       });
  //   } else {
  //     this.taskService.createTask(payload).subscribe((res) => {
  //       console.log('Task created:', res);
  //       this.toastr.success('Task created');
  //       this.resetForm();
  //       this.loadTasks();
  //     });
  //   }
  // }


  // resolveAssignedUsers(task: any) {
  //   const ids = task.assignedTo || [];

  //   console.log('Resolving for task:', task.id, ids);

  //   this.taskService.getUsersByIds(ids).subscribe(users => {
  //     this.assignedUserMap[task.id] = users;

  //     console.log('Assigned users after resolving:', this.assignedUserMap);
  //   });
  // }

  assignedUsersMap: Record<string, any[] | undefined> = {};

  // resolveAssignedUsers() {
  //   this.assignedUsersMap = {};

  //   for (const task of this.tasks) {
  //     const ids = task.assignedUsers || [];

  //     this.taskService.getUsersByIds(ids).subscribe(users => {
  //       this.assignedUsersMap[task.id] = users;
  //     });
  //     console.log('Assigned users map:', this.assignedUsersMap);
  //   }
  // }

  resolveAssignedUsers(tasks: any[]) {
    tasks.forEach(task => {

      // SAFETY
      if (!Array.isArray(task.assignedUsers) || task.assignedUsers.length === 0) {
        this.assignedUsersMap[task.id] = [];
        return;
      }

      this.taskService.getUsersByIds(task.assignedUsers).subscribe(users => {
        this.assignedUsersMap[task.id] = users;
      });

    });
  }

  getAssignedUsers(taskId: string): any[] {
    return this.assignedUsersMap[taskId] ?? [];
  }


  getSingleAssignedUser(task: any): any | null {
    const users = this.getAssignedUsers(task);
    return users.length === 1 ? users[0] : null;
  }

  saveTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.taskForm.value,
      assignedTo: this.taskForm.value.assignedUsers,
      
      createdBy: this.auth.user().id, // optional but recommended
    };
console.log('Saving task:',this.taskForm.value.assignedUsers);
    console.log('Saving task:', payload);
    if (this.editingTask) {
      this.taskService
        .updateTask(this.editingTask.id, payload)
        .subscribe(() => {
          this.toastr.success('Task updated');
          this.resetForm();
          this.loadTasks();
        });
    } else {
      this.taskService
        .createTask(payload)
        .subscribe((res) => {
          console.log('Task created:', res);
          this.toastr.success('Task created');
          this.resetForm();
          this.loadTasks();
        });
    }
  }


  // editTask(task: any) {
  //   this.editingTask = task;
  //   this.popupVisible = true;
  //   this.taskForm.patchValue(task);
  //   document.body.classList.add('overflow-hidden');
  // }

  // ======================
  // 🗑 DELETE
  // ======================

  editTask(task: any) {
    this.editingTask = task;
    this.popupVisible = true;

    this.taskForm.patchValue({
      title: task.title,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority || 'medium',
      assignedUsers: task.assignedUsers || [],
    });

    document.body.classList.add('overflow-hidden');
  }

  deleteTask(task: any) {
    this.deleteId = task.id;
    console.log(task);
    this.deletingTask = true;
    document.body.classList.add('overflow-hidden');

   
        this.taskForm.patchValue({
          title: task.title,
          dueDate: task.dueDate,
          status: task.status,
        });
        this.taskForm.disable();
      
  }

  confirmDelete() {
    if (!this.deleteId) return;

    this.taskService.deleteTask(this.deleteId).subscribe(() => {
      this.toastr.success('Task deleted');
      this.closeDeleteModal();
      this.loadTasks();
    });
    this.taskForm.enable();
  }

  closeDeleteModal() {
    this.deletingTask = false;
    this.deleteId = null;
    document.body.classList.remove('overflow-hidden');
  }

  // ======================
  // 🔍 FILTERS
  // ======================
  filterBySearch() {
    const text = this.searchText.toLowerCase();
    this.filteredTasks = this.tasks.filter((t) =>
      t.title.toLowerCase().includes(text)
    );
  }

  filterByStatus() {
    if (this.statusFilter === 'all') {
      this.filteredTasks = [...this.tasks];
      return;
    }

    this.filteredTasks = this.tasks.filter(
      (t) => t.status === this.statusFilter
    );
  }

  applyDateFilter(range: any) {
    if (!range?.startDate || !range?.endDate) {
      this.filteredTasks = [...this.tasks];
      return;
    }

    const start = new Date(range.startDate).getTime();
    const end = new Date(range.endDate).getTime();

    this.filteredTasks = this.tasks.filter((t) => {
      const due = new Date(t.dueDate).getTime();
      return due >= start && due <= end;
    });
  }

  clearDateFilter() {
    this.dateRangeControl.setValue(null);
    this.filteredTasks = [...this.tasks];
  }

  // ======================
  // 📊 STATS
  // ======================
  updateStats(tasks: any[]) {
    this.totalTasks = tasks.length;
    this.complatedTasks = tasks.filter(t => t.status === 'completed').length;
    this.inprogressTasks = tasks.filter(t => t.status === 'in-progress').length;
    this.pendingTasks = tasks.filter(t => t.status === 'pending').length;
  }

  // ======================
  // 🔐 PERMISSIONS
  // ======================
  // canCreate() {
  //   return this.auth.hasPermission('create');
  // }

  // canEdit() {
  //   return this.auth.hasPermission('edit');
  // }

  // canDelete() {
  //   return this.auth.hasPermission('delete');
  // }

  canCreate() { return this.auth.hasPermission('createTask'); }
  canEdit() { return this.auth.hasPermission('editTask'); }
  canDelete() { return this.auth.hasPermission('deleteTask'); }

  // ======================
  // 🧹 HELPERS
  // ======================
  togglePopup() {
    this.popupVisible = !this.popupVisible;
    document.body.classList.toggle('overflow-hidden', this.popupVisible);

    if (!this.popupVisible) {
      this.resetForm();
    }
  }

  resetForm() {
    this.popupVisible = false;
    this.editingTask = null;
    this.taskForm.reset({ status: 'pending' });
    document.body.classList.remove('overflow-hidden');
  }

  onPageSizeChange(size: number | 'All') {
    this.p = 1;
    this.itemsPerPage =
      size === 'All' ? this.filteredTasks.length || 1 : size;
  }

  hasMultipleAssignedUsers(taskId: string): boolean {
    return (this.assignedUserMap?.[taskId]?.length ?? 0) > 1;
  }

  hasSingleAssignedUser(taskId: string): boolean {
    return (this.assignedUserMap?.[taskId]?.length ?? 0) === 1;
  }

  // getAssignedUsers(taskId: string) {
  //   return this.assignedUserMap?.[taskId] ?? [];
  // }

}
