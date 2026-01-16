// // import { Component, OnInit } from '@angular/core';
// // import { NewTaskService } from '../../../core/service/newtask';
// // import { AuthService } from '../../../core/service/auth.service';
// // import { Task } from '../../../core/models/task.model';

// // @Component({
// //   selector: 'app-tasks',
// //   standalone: true,
// //   templateUrl: './tasks.html',
// // })
// // export class TasksComponent implements OnInit {
// //   tasks: Task[] = [];
// //   loading = true;

// //   userId!: string;
// //   role!: string;

// //   constructor(
// //     private taskService: NewTaskService,
// //     private auth: AuthService
// //   ) {
// //     console.log('User ID:', this.userId, 'Role:', this.role);
// //     this.loadTasks();
// //    }

// //   ngOnInit() {
// //     const user = this.auth.user();
// //     this.userId = user.id;
// //     this.role = user.role;
// //     console.log('User ID:', this.userId, 'Role:', this.role);
// //     this.loadTasks();
// //   }

// //   loadTasks() {
// //     this.taskService.getTasks().subscribe({
// //       next: (res: any) => {
// //         console.log('Tasks loaded:', res);
// //         this.tasks = res;
// //         this.loading = false;
// //       },
// //       error: () => (this.loading = false),
// //     });
// //   }

// //   canEdit(task: Task) {
// //     return (
// //       this.role === 'admin' ||
// //       task.permissions.edit.includes(this.userId)
// //     );
// //   }

// //   canDelete(task: Task) {
// //     return (
// //       this.role === 'admin' ||
// //       task.permissions.delete.includes(this.userId)
// //     );
// //   }

// //   deleteTask(id: string) {
// //     if (!confirm('Delete this task?')) return;

// //     this.taskService.deleteTask(id).subscribe(() => {
// //       this.tasks = this.tasks.filter((t) => t._id !== id);
// //     });
// //   }
// // }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { NewTaskService } from '../../../core/service/newtask';
// import { AuthService } from '../../../core/service/auth.service';
// import { Task } from '../../../core/models/task.model';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-tasks',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './tasks.html',
// })
// export class TasksComponent implements OnInit {
//   tasks: Task[] = [];
//   loading = true;

//   userId!: string;
//   role!: string;

//   showForm = false;
//   editingTask: Task | null = null;
//   taskForm: any;


//   constructor(
//     private fb: FormBuilder,
//     private taskService: NewTaskService,
//     private auth: AuthService,
//     private toastr: ToastrService
//   ) {
//     this.taskForm = this.fb.group({
//       title: ['', Validators.required],
//       description: [''],
//       dueDate: ['', Validators.required],
//       status: ['pending', Validators.required],
//     });

//     console.log('User ID:', this.userId, 'Role:', this.role);
//     this.loadTasks();
//   }

//   ngOnInit() {
//     const user = this.auth.user();
//     this.userId = user.id;
//     this.role = user.role;
//     this.loadTasks();
//   }

//   loadTasks() {
//     this.taskService.getTasks().subscribe({
//       next: (res) => {
//         this.tasks = res;
//         console.log('Tasks loaded:', res);
//         this.loading = false;
//       },
//       error: () => {
//         this.toastr.error('Failed to load tasks');
//         this.loading = false;
//       },
//     });
//   }

//   /** ---------- ADD / UPDATE ---------- */
//   openAddTask() {
//     this.editingTask = null;
//     this.taskForm.reset({ status: 'pending' });
//     this.showForm = true;
//   }

//   openEditTask(task: Task) {
//     this.editingTask = task;
//     this.taskForm.patchValue(task);
//     this.showForm = true;
//   }

//   submitTask() {
//     if (this.taskForm.invalid) {
//       this.toastr.warning('Fill required fields');
//       return;
//     }

//     const payload: Partial<Task> = {
//       ...this.taskForm.value,
//     };

//     if (this.editingTask) {
//       this.taskService
//         .updateTask(this.editingTask._id!, payload)
//         .subscribe(() => {
//           this.toastr.success('Task updated');
//           this.showForm = false;
//           this.loadTasks();
//         });
//     } else {
//       this.taskService.createTask(payload as Task).subscribe(() => {
//         this.toastr.success('Task created');
//         this.showForm = false;
//         this.loadTasks();
//       });
//     }
//   }

//   /** ---------- DELETE ---------- */
//   deleteTask(task: Task) {
//     if (!confirm('Delete this task?')) return;

//     this.taskService.deleteTask(task._id!).subscribe(() => {
//       this.toastr.success('Task deleted');
//       this.tasks = this.tasks.filter((t) => t._id !== task._id);
//     });
//   }

//   /** ---------- PERMISSIONS ---------- */



//   canCreate() {
//     return this.auth.hasPermission('create');
//   }

//   canEdit() {
//     return this.auth.hasPermission('edit');
//   }

//   canDelete() {
//     return this.auth.hasPermission('delete');
//   }

// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewTaskService } from '../../../core/service/newtask';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.html',
})
export class TaskComponent implements OnInit {
  tasks: any[] = [];
  editingTask: any = null;
  taskForm: any;
 

  constructor(
    private fb: FormBuilder,
    private taskService: NewTaskService,
    private auth: AuthService,
    private toastr: ToastrService
  ) { 

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['pending'],
    });
    this.loadTasks();
    const user = this.auth.user();
    // console.log('User logged in:', user);
    // console.log('user ID:', this.auth.user().id, 'Role:', this.auth.user().role);
  }

  ngOnInit() {
    this.loadTasks();
  }

  // 🔄 LOAD
  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        console.log('Tasks loaded:', res);
        this.tasks = res;
       
      },
      error: () => this.toastr.error('Failed to load tasks'),
    });
  }

  // ➕ CREATE / ✏️ UPDATE
  submit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    if (this.editingTask) {
      this.taskService
        .updateTask(this.editingTask._id, this.taskForm.value)
        .subscribe({
          next: () => {
            this.toastr.success('Task updated');
            this.reset();
          },
        });
    } else {
      this.taskService.createTask(this.taskForm.value).subscribe({
        next: () => {
          this.toastr.success('Task created');
          this.reset();
        },
      });
    }
  }

  // ✏️ EDIT
  edit(task: any) {
    this.editingTask = task;
    this.taskForm.patchValue(task);
  }

  // 🗑 DELETE
  remove(id: string) {
    if (!confirm('Delete task?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.toastr.success('Task deleted');
        this.loadTasks();
      },
    });
  }

  reset() {
    this.editingTask = null;
    this.taskForm.reset({ status: 'pending' });
    this.loadTasks();
  }

  // 🔐 PERMISSION HELPERS
  canCreate() {
    return this.auth.hasPermission('create');
  }

  canEdit() {
    return this.auth.hasPermission('edit');
  }

  canDelete() {
    return this.auth.hasPermission('delete');
  }
}
