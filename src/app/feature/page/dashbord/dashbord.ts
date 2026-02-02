
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
import { ApiService } from '../../../core/service/mocapi/api/api';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { combineLatest } from 'rxjs';


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

  /* =====================
     UI STATE
  ===================== */
  popupVisible = false;
  deletingTask = false;
  loading = true;
  editingTask: any = null;
  deleteId: string | null = null;

  /* =====================
     DATA
  ===================== */
  tasks: any[] = [];
  filteredTasks: any[] = [];

  /* =====================
     STATS
  ===================== */
  totalTasks = 0;
  complatedTasks = 0;
  inprogressTasks = 0;
  pendingTasks = 0;

  /* =====================
     FILTERS
  ===================== */
  searchText = '';
  statusFilter: TaskStatus | 'all' = 'all';
  dateRangeControl = new FormControl(null);
  selectedDateRange: any = null;
  selectedUserFilter: string[] = [];
  private redirectFilterApplied = false;

  /* =====================
     PAGINATION
  ===================== */
  p = 1;
  itemsPerPage = 5;
  pageSizeOptions: (number | 'All')[] = [5, 10, 20, 'All'];
  selectedPageSize: number | 'All' = 5;

  /* =====================
     FORM
  ===================== */
  taskForm: any;

  /* =====================
     USERS (OPTIMIZED)
  ===================== */
  assignableUsers: any[] = [];
  private userMap: Record<string, any> = {};
  assignedUsersMap: Record<string, any[]> = {};

  /* =====================
     BOARD VIEW
  ===================== */
  boardColumns: {
    title: string;
    color: string;
    status: TaskStatus;
    data: any[];
  }[] = [];

  connectedDropLists: string[] = [];

  /* =====================
     SORT
  ===================== */
  sortOrder: 'asc' | 'desc' = 'desc';

  // VIEW MODE (table | board)
  viewMode: 'table' | 'board' = 'table';




  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastr: ToastrService
  ) { 
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['pending' as TaskStatus],
      priority: ['medium' as TaskPriority],
      assignedUsers: [[] as string[]],
    });
  }

  /* =====================
     INIT
  ===================== */
 
  ngOnInit() {
    this.loading = true;

    combineLatest([
      this.api.getTasks$(),
      this.api.getUsers$(),
      this.api.taskFilterUser$
    ]).subscribe(([tasks, users, filterUserId]) => {

      // build user map
      this.userMap = {};
      users.forEach(u => (this.userMap[u.id] = u));
      this.assignableUsers = users;

      // sort tasks
      this.tasks = [...tasks].sort(
        (a, b) => (a.order_id ?? 0) - (b.order_id ?? 0)
      );

      // ✅ APPLY REDIRECT FILTER ONLY ONCE
      // console.log('Redirect filter user:', filterUserId);
      if (filterUserId && !this.redirectFilterApplied) {
        this.redirectFilterApplied = true;

        this.selectedUserFilter = [filterUserId];
        // console.log('Filtered tasks:', this.selectedUserFilter);

        this.filteredTasks = this.tasks.filter(task =>
          task.assignedUsers?.includes(filterUserId)
        );
        // console.log('Filtered tasks:', this.filteredTasks);

        // clear AFTER applying once
        // this.api.setTaskFilterUser(null);
      }
      // ❌ DO NOT override filteredTasks again
      else if (!this.redirectFilterApplied) {
        this.filteredTasks = [...this.tasks];
      }

      this.buildAssignedUsersMap();
      this.updateStats(this.filteredTasks);
      this.rebuildBoard();

      this.loading = false;
    });

    this.dateRangeControl.valueChanges.subscribe(range => {
      this.selectedDateRange = range;
      this.applyAllFilters();
    });

  }



  /* =====================
     LOAD TASKS
  ===================== */
  loadTasks() {
    this.loading = true;

    this.api.getTasks$().subscribe((tasks: any[]) => {
      this.tasks = [...tasks].sort(
        (a, b) => (a.order_id ?? 0) - (b.order_id ?? 0)
      );

      this.applyAllFilters();
      this.buildAssignedUsersMap();
      this.updateStats(this.tasks);
      this.rebuildBoard();

      this.loading = false;
    });

  }

  /* =====================
     ASSIGNED USERS (NO N+1)
  ===================== */
  private buildAssignedUsersMap() {
    this.assignedUsersMap = {};

    this.tasks.forEach(task => {
      this.assignedUsersMap[task.id] =
        task.assignedUsers?.map((id: string) => this.userMap[id]).filter(Boolean) || [];
    });
  }

  getAssignedUsers(taskId: string) {
    return this.assignedUsersMap[taskId] || [];
  }
   



  /* =====================
     SAVE / UPDATE
  ===================== */
  
  saveTask() {
    if (this.taskForm.invalid) return;

    const payload = this.taskForm.value;

    const req$ = this.editingTask
      ? this.api.updateTaskOptimistic(this.editingTask.id, payload)
      : this.api.createTaskOptimistic(payload);

    req$.subscribe(() => {
      this.toastr.success(
        this.editingTask ? 'Task updated' : 'Task created'
      );
      this.resetForm();
    });
  }

  editTask(task: any) {
    this.editingTask = task;
    this.popupVisible = true;

    this.taskForm.patchValue({
      title: task.title,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      assignedUsers: task.assignedUsers || [],
    });

    document.body.classList.add('overflow-hidden');
  }

  /* =====================
     DELETE
  ===================== */
   deleteTask(task: any) {
    this.deleteId = task.id;
    this.deletingTask = true;
    // this.popupVisible = true;

    // ✅ PATCH FIRST
    this.taskForm.patchValue({
      title: task.title,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      assignedUsers: task.assignedUsers || []
    });

    // ✅ THEN DISABLE (read-only mode)
    this.taskForm.disable();

    document.body.classList.add('overflow-hidden');
  }


  confirmDelete() {
    if (!this.deleteId) return;

    this.api.deleteTaskOptimistic(this.deleteId).subscribe(() => {
      this.toastr.success('Task deleted');
      this.closeDeleteModal();
    });
  }


  closeDeleteModal() {
    this.deleteId = null;
    this.deletingTask = false;
    // this.popupVisible = false;

    this.taskForm.enable(); // ✅ restore form
    this.taskForm.reset({ status: 'pending' });

    document.body.classList.remove('overflow-hidden');
  }

  /* =====================
     DRAG & DROP
  ===================== */
 
  onTaskDrop(event: CdkDragDrop<any[]>, status: TaskStatus) {
    const source = event.previousContainer.data;
    const target = event.container.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(target, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        source,
        target,
        event.previousIndex,
        event.currentIndex
      );
    }

    const patches: { id: string; changes: any }[] = [];

    [...source, ...target].forEach((task, index) => {
      task.order_id = index;

      const changes: any = { order_id: index };

      if (target.includes(task)) {
        task.status = status;
        changes.status = status;
      }

      patches.push({ id: task.id, changes });
    });

    // 🔥 ONE backend sync
    this.api.batchUpdateTasks(patches);
  }

  onTableDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.filteredTasks, event.previousIndex, event.currentIndex);
    this.filteredTasks.forEach((t, i) => (t.order_id = i));
    this.persistOrder(this.filteredTasks);
    this.rebuildBoard();
  }

  private persistOrder(tasks: any[]) {
    tasks.reduce(
      (p, t) =>
        p.then(() =>
          this.api.updateTask(t.id, {
            status: t.status,
            order_id: t.order_id,
          }).toPromise()
        ),
      Promise.resolve()
    );
  }

  /* =====================
     FILTERS
  ===================== */
 
  filterBySearch() {
    this.applyAllFilters();
  }

  filterByStatus() {
    this.applyAllFilters();
  }

  applyDateFilter(range: any) {
    if (!range?.startDate) {
      this.filteredTasks = [...this.tasks];
    } else {
      const s = new Date(range.startDate).getTime();
      const e = new Date(range.endDate).getTime();
      this.filteredTasks = this.tasks.filter(t => {
        const d = new Date(t.dueDate).getTime();
        return d >= s && d <= e;
      });
    }
    this.rebuildBoard();
  }

  applyAllFilters() {
    let data = [...this.tasks];

    // 🔍 Search
    if (this.searchText?.trim()) {
      const t = this.searchText.toLowerCase();
      data = data.filter(task =>
        task.title?.toLowerCase().includes(t)
      );
    }

    // 📌 Status
    if (this.statusFilter !== 'all') {
      data = data.filter(task => task.status === this.statusFilter);
    }

    // 👤 Assigned users
    if (this.selectedUserFilter.length) {
      data = data.filter(task =>
        task.assignedUsers?.some((id: string) =>
          this.selectedUserFilter.includes(id)
        )
      );
    }

    // 📅 Date range (timezone safe)
    if (this.selectedDateRange?.startDate && this.selectedDateRange?.endDate) {
      const start = this.selectedDateRange.startDate.startOf('day').valueOf();
      const end = this.selectedDateRange.endDate.endOf('day').valueOf();

      data = data.filter(task => {
        const due = new Date(task.dueDate + 'T12:00:00').getTime();
        return due >= start && due <= end;
      });
    }

    this.filteredTasks = data;
    this.updateStats(this.filteredTasks);
    this.rebuildBoard();
  }

  clearAllFilters() {
    this.searchText = '';
    this.statusFilter = 'all';
    this.selectedUserFilter = [];
    this.selectedDateRange = null;

    this.dateRangeControl.setValue(null, { emitEvent: false });

    this.filteredTasks = [...this.tasks];
    this.updateStats(this.filteredTasks);
    this.rebuildBoard();
  }


  /* =====================
     BOARD
  ===================== */
  private rebuildBoard() {
    this.boardColumns = [
      { title: 'Pending', color: 'red', status: 'pending', data: this.pendingBoard },
      { title: 'In Progress', color: 'yellow', status: 'in-progress', data: this.inProgressBoard },
      { title: 'Completed', color: 'green', status: 'completed', data: this.completedBoard },
    ];
    this.connectedDropLists = this.boardColumns.map(c => c.status);
  }

  get pendingBoard() {
    return this.filteredTasks.filter(t => t.status === 'pending');
  }

  get inProgressBoard() {
    return this.filteredTasks.filter(t => t.status === 'in-progress');
  }

  get completedBoard() {
    return this.filteredTasks.filter(t => t.status === 'completed');
  }

  /* =====================
     STATS
  ===================== */
  updateStats(tasks: any[]) {
    this.totalTasks = tasks.length;
    this.complatedTasks = tasks.filter(t => t.status === 'completed').length;
    this.inprogressTasks = tasks.filter(t => t.status === 'in-progress').length;
    this.pendingTasks = tasks.filter(t => t.status === 'pending').length;
  }

  /* =====================
     HELPERS
  ===================== */
  togglePopup() {
    this.popupVisible = !this.popupVisible;
    document.body.classList.toggle('overflow-hidden', this.popupVisible);
    if (!this.popupVisible) this.resetForm();
  }

  toggleSortBy(field: 'order' | 'dueDate') {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

    if (field === 'dueDate') {
      this.filteredTasks = [...this.filteredTasks].sort((a, b) => {
        const aDate = new Date(a.dueDate).getTime();
        const bDate = new Date(b.dueDate).getTime();
        return this.sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
      });
    } else {
      this.filteredTasks = [...this.filteredTasks].sort(
        (a, b) =>
          this.sortOrder === 'desc'
            ? (b.order_id ?? 0) - (a.order_id ?? 0)
            : (a.order_id ?? 0) - (b.order_id ?? 0)
      );
    }

    this.rebuildBoard();
  }
  onPageSizeChange(size: number | 'All') {
    this.p = 1;
    this.itemsPerPage =
      size === 'All' ? this.filteredTasks.length || 1 : size;
  }

  openDelete(task: any) {
    this.deleteTask(task);
  }

  openBoardCreate(status: TaskStatus) {
    this.popupVisible = true;
    this.editingTask = null;

    this.taskForm.reset({
      title: '',
      dueDate: '',
      status : 'pending',
      priority: 'medium',
      assignedUsers: [],
    });

    document.body.classList.add('overflow-hidden');
  }

  resetForm() {
    this.popupVisible = false;
    this.editingTask = null;
    this.taskForm.reset({ status: 'pending' });
    this.taskForm.reset({ priority: 'medium' });
    document.body.classList.remove('overflow-hidden');
  }

  getAssignedUserNames(taskId: string): string {
    return (this.assignedUsersMap[taskId] || [])
      .map(u => u?.name)
      .filter(Boolean)
      .join(', ');
  }

  trackByTaskId(_: number, t: any) {
    return t.id;
  }

  canCreate() { return this.api.hasPermission('createTask'); }
  canEdit() { return this.api.hasPermission('editTask'); }
  canDelete() { return this.api.hasPermission('deleteTask'); }

}
