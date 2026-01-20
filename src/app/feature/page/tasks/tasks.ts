 
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
