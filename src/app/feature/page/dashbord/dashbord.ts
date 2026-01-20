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

 
 
  assignedUsersMap: Record<string, any[] | undefined> = {};

 
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
 

}
