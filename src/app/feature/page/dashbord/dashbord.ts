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
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';



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
    NgSelectModule,
    DragDropModule,
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

  // VIEW MODE
  viewMode: 'table' | 'board' = 'table';

  // SORT ORDER
  sortOrder: 'desc' | 'asc' = 'desc';

  boardColumns: {
    title: string;
    color: string;
    status: TaskStatus;
    data: any[];
  }[] = [];

  connectedDropLists: string[] = [];

  
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
    this.updateBoardColumns();
    this.connectedDropLists = this.boardColumns.map(c => c.status);

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

 
  // loadTasks() {
  //   this.loading = true;

  //   this.taskService.getTasks().subscribe({
  //     next: (res: any[]) => {
  //       console.log('Tasks loaded:', res);
  //       this.tasks = res;
  //       this.filteredTasks = [...res];
  //       this.updateStats(res);
  //       this.resolveAssignedUsers(res); // ✅ IMPORTANT
  //       console.log('Assigned users map:', this.assignedUsersMap);

  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.toastr.error('Failed to load tasks');
  //       this.loading = false;
  //     },
  //   });
  // }

  loadTasks() {
    this.loading = true;

    this.taskService.getTasks().subscribe({
      next: (res: any[]) => {
        // ✅ SORT FIRST
        // const sorted = this.sortTasks(res);
        const sorted = [...res].sort(
          (a, b) => (a.order_id ?? 9999) - (b.order_id ?? 9999)
        );

        this.tasks = sorted;
        this.filteredTasks = [...sorted];

        this.updateStats(sorted);
        this.resolveAssignedUsers(sorted);

        // ✅ IMPORTANT: rebuild board AFTER data arrives
        this.updateBoardColumns();

        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load tasks');
        this.loading = false;
      }
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


  // onTaskDrop(
  //   event: CdkDragDrop<any[]>,
  //   targetStatus: 'pending' | 'in-progress' | 'completed'
  // ) {
  //   // SAME COLUMN → reorder
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );

  //     // update order_id
  //     event.container.data.forEach((task, index) => {
  //       task.order_id = index;
  //     });

  //   } else {
  //     // DIFFERENT COLUMN → move + status change
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );

  //     const movedTask = event.container.data[event.currentIndex];

  //     movedTask.status = targetStatus;

  //     // update order_id in new column
  //     event.container.data.forEach((task, index) => {
  //       task.order_id = index;
  //     });

  //     // 🔥 persist status + order
  //     this.taskService.updateTask(movedTask.id, {
  //       status: targetStatus,
  //       order_id: movedTask.order_id
  //     }).subscribe();
  //   }
  // }

  // ======================
  // 🔍 FILTERS
  // ======================
  // filterBySearch() {
  //   const text = this.searchText.toLowerCase();
  //   this.filteredTasks = this.tasks.filter((t) =>
  //     t.title.toLowerCase().includes(text)
  //   );
  // }

  // onTaskDrop(
  //   event: CdkDragDrop<any[]>,
  //   targetStatus: 'pending' | 'in-progress' | 'completed'
  // ) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );

  //     event.container.data.forEach((task, index) => {
  //       task.order_id = index;
  //     });

  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );

  //     const movedTask = event.container.data[event.currentIndex];
  //     movedTask.status = targetStatus;
  //     movedTask.order_id = event.currentIndex;

  //     this.taskService.updateTask(movedTask.id, {
  //       status: targetStatus,
  //       order_id: movedTask.order_id
  //     }).subscribe();
  //   }
  // }

  // onTaskDrop(
  //   event: CdkDragDrop<any[]>,
  //   targetStatus: 'pending' | 'in-progress' | 'completed'
  // ) {
  //   if (event.previousContainer === event.container) {

  //     // ✅ SAME COLUMN REORDER
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );

  //     // ✅ UPDATE ORDER FOR ALL TASKS IN THAT COLUMN
  //     event.container.data.forEach((task, index) => {
  //       task.order_id = index;

  //       this.taskService.updateTask(task.id, {
  //         order_id: index
  //       }).subscribe();
  //     });

  //   } else {

  //     // ✅ CROSS COLUMN MOVE
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );

  //     // FIX SOURCE COLUMN ORDER
  //     event.previousContainer.data.forEach((task, index) => {
  //       task.order_id = index;
  //       this.taskService.updateTask(task.id, { order_id: index }).subscribe();
  //     });

  //     // FIX TARGET COLUMN ORDER + STATUS
  //     event.container.data.forEach((task, index) => {
  //       task.order_id = index;
  //       task.status = targetStatus;

  //       this.taskService.updateTask(task.id, {
  //         status: task.status,
  //         order_id: task.order_id
  //       }).subscribe();
  //     });
  //   }
  // }

  onTaskDrop(
    event: CdkDragDrop<any[]>,
    targetStatus: TaskStatus
  ) {
    // SAME COLUMN → reorder only
    if (event.previousContainer === event.container) {

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // 🔥 update order locally
      const updatedTasks = event.container.data.map((task, index) => ({
        ...task,
        order_id: index
      }));

      // 🔥 persist in correct order (sequential)
      this.persistOrder(updatedTasks);

    }
    // DIFFERENT COLUMN → move + status + order
    else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // update source column order
      const sourceTasks = event.previousContainer.data.map((task, index) => ({
        ...task,
        order_id: index
      }));

      // update target column order + status
      const targetTasks = event.container.data.map((task, index) => ({
        ...task,
        status: targetStatus,
        order_id: index
      }));

      this.persistOrder([...sourceTasks, ...targetTasks]);
    }
  }

  // onTableDrop(event: CdkDragDrop<any[]>) {
  //   moveItemInArray(
  //     this.filteredTasks,
  //     event.previousIndex,
  //     event.currentIndex
  //   );

  //   // ✅ persist order_id
  //   this.filteredTasks.forEach((task, index) => {
  //     task.order_id = index;

  //     this.taskService.updateTask(task.id, {
  //       order_id: index
  //     }).subscribe();
  //   });

  //   // keep board in sync
  //   this.updateBoardColumns();
  // }

  // onTableDrop(event: CdkDragDrop<any[]>) {
  //   if (this.selectedPageSize !== 'All') return;

  //   moveItemInArray(
  //     this.filteredTasks,
  //     event.previousIndex,
  //     event.currentIndex
  //   );

  //   // persist order_id
  //   this.filteredTasks.forEach((task, index) => {
  //     task.order_id = index;
  //   });

  //   // batch persist (avoids race condition)
  //   this.filteredTasks.reduce((p, task) => {
  //     return p.then(() =>
  //       this.taskService.updateTask(task.id, {
  //         order_id: task.order_id
  //       }).toPromise()
  //     );
  //   }, Promise.resolve());

  //   this.updateBoardColumns();
  // }

  // onTableDrop(event: CdkDragDrop<any[]>) {

  //   // ❌ safety
  //   if (this.selectedPageSize !== 'All') return;

  //   // ✅ reorder SAME array
  //   moveItemInArray(
  //     this.filteredTasks,
  //     event.previousIndex,
  //     event.currentIndex
  //   );

  //   // ✅ sync main source array too
  //   this.tasks = [...this.filteredTasks];

  //   // ✅ reassign order_id
  //   this.filteredTasks.forEach((task, index) => {
  //     task.order_id = index;
  //   });

  //   // ✅ persist sequentially (NO race condition)
  //   this.filteredTasks.reduce((p, task) => {
  //     return p.then(() =>
  //       this.taskService.updateTask(task.id, {
  //         order_id: task.order_id
  //       }).toPromise()
  //     );
  //   }, Promise.resolve());

  //   // ✅ keep board view synced
  //   this.updateBoardColumns();
  // }
  onTableDrop(event: CdkDragDrop<any[]>) {
    console.log('DROP FIRED', event.previousIndex, event.currentIndex);

    // if (this.selectedPageSize !== 'All') return;

    moveItemInArray(
      this.filteredTasks,
      event.previousIndex,
      event.currentIndex
    );

    // this.filteredTasks.forEach((task, index) => {
    //   task.order_id = index;
    // });

    // this.persistOrder(this.filteredTasks);
    // this.updateBoardColumns();
  }

  private persistOrder(tasks: any[]) {
    // 🔐 execute updates sequentially to avoid race condition
    tasks.reduce((prev, task) => {
      return prev.then(() =>
        this.taskService.updateTask(task.id, {
          status: task.status,
          order_id: task.order_id
        }).toPromise()
      );
    }, Promise.resolve());
  }

  trackByTaskId(index: number, task: any) {
    return task.id;
  }

  get paginatedTasks() {
    if (this.selectedPageSize === 'All') {
      return this.filteredTasks;
    }

    const start = (this.p - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTasks.slice(start, end);
  }

  // filterBySearch() {
  //   const text = this.searchText.toLowerCase();
  //   this.filteredTasks = this.tasks.filter(t =>
  //     t.title.toLowerCase().includes(text)
  //   );
  //   this.updateBoardColumns();
  // }

  filterBySearch() {
    const text = (this.searchText || '').toLowerCase();

    this.filteredTasks = this.tasks.filter(task => {
      const title = (task?.title || '').toLowerCase();
      return title.includes(text);
    });

    this.updateBoardColumns();
  }


  // filterByStatus() {
  //   if (this.statusFilter === 'all') {
  //     this.filteredTasks = [...this.tasks];
  //     return;
  //   }

  //   this.filteredTasks = this.tasks.filter(
  //     (t) => t.status === this.statusFilter
  //   );
  // }

  filterByStatus() {
    if (this.statusFilter === 'all') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(
        t => t.status === this.statusFilter
      );
    }
    this.updateBoardColumns();
  }

  // applyDateFilter(range: any) {
  //   if (!range?.startDate || !range?.endDate) {
  //     this.filteredTasks = [...this.tasks];
  //     return;
  //   }

  //   const start = new Date(range.startDate).getTime();
  //   const end = new Date(range.endDate).getTime();

  //   this.filteredTasks = this.tasks.filter((t) => {
  //     const due = new Date(t.dueDate).getTime();
  //     return due >= start && due <= end;
  //   });
  // }

  applyDateFilter(range: any) {
    if (!range?.startDate || !range?.endDate) {
      this.filteredTasks = [...this.tasks];
    } else {
      const start = new Date(range.startDate).getTime();
      const end = new Date(range.endDate).getTime();

      this.filteredTasks = this.tasks.filter(t => {
        const due = new Date(t.dueDate).getTime();
        return due >= start && due <= end;
      });
    }
    this.updateBoardColumns();
  }

  clearDateFilter() {
    this.dateRangeControl.setValue(null);
    this.filteredTasks = [...this.tasks];
  }

  private updateBoardColumns() {
    this.boardColumns = [
      {
        title: 'Pending',
        color: 'red',
        status: 'pending',
        data: this.pendingBoard
      },
      {
        title: 'In Progress',
        color: 'yellow',
        status: 'in-progress',
        data: this.inProgressBoard
      },
      {
        title: 'Completed',
        color: 'green',
        status: 'completed',
        data: this.completedBoard
      }
    ];
  }

  get sortedTasks() {
    return [...this.filteredTasks].sort((a, b) => {
      const d1 = new Date(a.createdAt).getTime();
      const d2 = new Date(b.createdAt).getTime();
      return this.sortOrder === 'desc' ? d2 - d1 : d1 - d2;
    });
  }

  private sortTasks(tasks: any[]) {
    return [...tasks].sort((a, b) => {
      const aOrder = a.order_id ?? new Date(a.createdAt).getTime();
      const bOrder = b.order_id ?? new Date(b.createdAt).getTime();

      return this.sortOrder === 'desc'
        ? bOrder - aOrder   // newest first
        : aOrder - bOrder;  // oldest first
    });
  }

  // get pendingBoard() {
  //   return this.sortedTasks.filter(t => t.status === 'pending');
  // }

  // get inProgressBoard() {
  //   return this.sortedTasks.filter(t => t.status === 'in-progress');
  // }

  // get completedBoard() {
  //   return this.sortedTasks.filter(t => t.status === 'completed');
  // }

  get pendingBoard() {
    return this.sortedTasks
      .filter(t => t.status === 'pending')
      .sort((a, b) => (a.order_id ?? 0) - (b.order_id ?? 0));
  }

  get inProgressBoard() {
    return this.sortedTasks
      .filter(t => t.status === 'in-progress')
      .sort((a, b) => (a.order_id ?? 0) - (b.order_id ?? 0));
  }

  get completedBoard() {
    return this.sortedTasks
      .filter(t => t.status === 'completed')
      .sort((a, b) => (a.order_id ?? 0) - (b.order_id ?? 0));
  }

  toggleSortBy(field: 'order' | 'dueDate') {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';

    if (field === 'dueDate') {
      this.filteredTasks = [...this.filteredTasks].sort((a, b) => {
        const aDate = new Date(a.dueDate).getTime();
        const bDate = new Date(b.dueDate).getTime();
        return this.sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
      });
    } else {
      this.filteredTasks = this.sortTasks(this.filteredTasks);
    }

    this.updateBoardColumns();
  }

  openBoardCreate(status: TaskStatus) {
    this.popupVisible = true;
    this.editingTask = null;
    this.taskForm.reset({
      title: '',
      dueDate: '',
      status,
      priority: 'medium',
      assignedUsers: []
    });
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
    // this.itemsPerPage =
    //   size === 'All' ? this.filteredTasks.length || 1 : size;
    this.itemsPerPage =
      size === 'All' ? this.filteredTasks.length : size;

  }

  hasMultipleAssignedUsers(taskId: string): boolean {
    return (this.assignedUserMap?.[taskId]?.length ?? 0) > 1;
  }

  hasSingleAssignedUser(taskId: string): boolean {
    return (this.assignedUserMap?.[taskId]?.length ?? 0) === 1;
  }
 

  
}
