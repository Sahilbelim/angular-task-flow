
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {  filter } from 'rxjs';
import moment from 'moment';
import { ViewChild, ElementRef } from '@angular/core';


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
      // 👇 DATE PICKER
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,

    DragDropModule,
  ],
  templateUrl: './dashbord.html',
})
export class Dashbord implements OnInit {


  @ViewChild('taskScrollContainer') taskScrollContainer!: ElementRef;

  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('dueDateInput') dueDateInput!: ElementRef;
  @ViewChild('assignUsersInput') assignUsersInput!: ElementRef;

  /* =====================
     UI STATE
  ===================== */
  loading = true;
  dataLoaded = false;

  popupVisible = false;
  deletingTask = false;
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
  filterDateRange: any = null;

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


  savingTask = false;     // add / edit
  deletingTaskBusy = false; // delete


  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastr: ToastrService
  ) { 
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      dueDate: [null,
        Validators.required
      ],
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
    ])
      .pipe(
        filter(([tasks]) => tasks.length > 0)
      )
      .subscribe(([tasks, users, filterUserId]) => {

        // build user map
        this.userMap = {};
        users.forEach(u => (this.userMap[u.id] = u));
        this.assignableUsers = users;

        // source data only
        this.tasks = [...tasks].sort(
          (a, b) => (a.order_id ?? 0) - (b.order_id ?? 0)
        );

        // apply redirect filter ONCE
        if (filterUserId && !this.redirectFilterApplied) {
          this.redirectFilterApplied = true;
          this.selectedUserFilter = [filterUserId];
        }

        // ✅ ALWAYS apply filters here
        this.applyAllFilters();

        this.buildAssignedUsersMap();
        this.loading = false;
        this.dataLoaded = true;
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
    // if (this.taskForm.invalid) {
    //   this.taskForm.markAllAsTouched();
    //   return;
    // }

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();

      setTimeout(() => {
        this.scrollToFirstError();
      });

      return;
    }
    this.savingTask = true;      // 🔒 lock
    this.taskForm.disable();     // 🔒 UI lock


    const raw = this.taskForm.value;
    console.log('RAW dueDate value:', raw.dueDate);


    const payload = {
      ...raw,
      dueDate: this.normalizeDueDate(raw.dueDate),
    };


    const req$ = this.editingTask
      ? this.api.updateTaskOptimistic(this.editingTask.id, payload)
      : this.api.createTaskOptimistic(payload);


    req$.subscribe({
      next: () => {
        this.toastr.success(
          this.editingTask ? 'Task updated' : 'Task created'
        );
        this.resetForm();
      },
      error: () => {
        this.toastr.error('Operation failed');
      },
      complete: () => {
        this.savingTask = false; // 🔓 unlock
        this.taskForm.enable();
      }
    });
  }

  private scrollToFirstError() {

    if (this.taskForm.get('title')?.invalid) {
      this.scrollTo(this.titleInput);
      return;
    }

    if (this.taskForm.get('dueDate')?.invalid) {
      this.scrollTo(this.dueDateInput);
      return;
    }

    // Optional: require at least one assigned user
    if (
      this.taskForm.get('assignedUsers')?.invalid
    ) {
      this.scrollTo(this.assignUsersInput);
      return;
    }
  }

  private scrollTo(element: ElementRef) {
    if (!element) return;

    const container = this.taskScrollContainer?.nativeElement;
    const el = element.nativeElement;

    if (container && el) {
      container.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      });

      setTimeout(() => el.focus(), 300);
    }
  }


  editTask(task: any) {
    this.editingTask = task;
    this.popupVisible = true;

    this.taskForm.patchValue({
      title: task.title,
      dueDate: task.dueDate ? this.toMoment(task.dueDate) : null,
      status: task.status,
      priority: task.priority,
      assignedUsers: task.assignedUsers || [],
    });

    this.api.setOverlay(true);
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

    // document.body.classList.add('overflow-hidden');
     this.api.setOverlay(true);
    

   }


 

  confirmDelete() {
    if (!this.deleteId) return;

    this.deletingTaskBusy = true;

    const deletedId = this.deleteId;

    this.api.deleteTaskOptimistic(deletedId).subscribe({
      next: () => {

        // ✅ HARD SYNC DERIVED STATE
        this.tasks = this.tasks.filter(t => t.id !== deletedId);
        this.filteredTasks = this.filteredTasks.filter(t => t.id !== deletedId);

        // 🔥 REMOVE STALE ASSIGNED USERS CACHE
        delete this.assignedUsersMap[deletedId];

        // 🔥 REBUILD EVERYTHING THAT DEPENDS ON TASKS
        this.buildAssignedUsersMap();
        this.updateStats(this.filteredTasks);
        this.rebuildBoard();

        this.toastr.success('Task deleted');
        this.closeDeleteModal();
      },
      error: () => {
        this.toastr.error('Delete failed');
      },
      complete: () => {
        this.deletingTaskBusy = false;
      }
    });
  }


  closeDeleteModal() {
    this.deleteId = null;
    this.deletingTask = false;
    // this.popupVisible = false;

    this.taskForm.enable(); // ✅ restore form
    this.taskForm.reset({
      title: '',
      dueDate: '',
      status: 'pending',
      priority: 'medium',
      assignedUsers: [],
    });
 
    this.api.setOverlay(false);


    // document.body.classList.remove('overflow-hidden');
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

 

  private normalizeDueDate(value: any): string | null {
    if (!value) return null;

    // 🔥 ngx-daterangepicker SINGLE date (Day.js)
    if (value.$isDayjsObject && value.$d) {
      return moment(value.$d).format('YYYY-MM-DD');
    }

    // 🔥 daterangepicker RANGE object (safety)
    if (value.startDate?.$d) {
      return moment(value.startDate.$d).format('YYYY-MM-DD');
    }

    // Moment
    if (moment.isMoment(value)) {
      return value.format('YYYY-MM-DD');
    }

    // Native Date
    if (value instanceof Date) {
      return moment(value).format('YYYY-MM-DD');
    }

    // String
    if (typeof value === 'string') {
      const m = moment(value, ['DD/MM/YYYY', 'YYYY-MM-DD'], true);
      return m.isValid() ? m.format('YYYY-MM-DD') : null;
    }

    return null;
  }


  private toMoment(date: string | Date | null) {
    return date ? moment(date) : null;
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

    // 📅 DATE RANGE — ✅ CORRECT & SAFE
    if (this.selectedDateRange?.startDate && this.selectedDateRange?.endDate) {
      const start = this.selectedDateRange.startDate.clone().startOf('day');
      const end = this.selectedDateRange.endDate.clone().endOf('day');

      console.log(
        'DATE FILTER:',
        start.format('YYYY-MM-DD'),
        '→',
        end.format('YYYY-MM-DD')
      );

      data = data.filter(task => {
        if (!task.dueDate) return false;

        const due = moment(task.dueDate, 'YYYY-MM-DD').startOf('day');

        return due.isSameOrAfter(start) && due.isSameOrBefore(end);
      });
    }
    console.log('Filtered tasks:', data);

    this.filteredTasks = data;
    this.updateStats(this.filteredTasks);
    this.rebuildBoard();
  }

  clearAllFilters() {
    this.searchText = '';
    this.statusFilter = 'all';
    this.selectedUserFilter = [];
    this.selectedDateRange = null;
    this.onDateRangeClear();
    // 🔥 THESE TWO LINES FIX THE INPUT
    this.selectedDateRange = null;
    this.filterDateRange = null;
    // this.dateRangeControl.setValue(null, { emitEvent: false });

    this.filteredTasks = [...this.tasks];
    this.updateStats(this.filteredTasks);
    this.rebuildBoard();
  }

 

  onDateRangeChange(range: any) {
    if (!range?.startDate || !range?.endDate) {
      this.selectedDateRange = null;
      this.applyAllFilters();
      return;
    }
    console.log(range);

    console.log(range.startDate, range.endDate);

   

    const start = moment(range.startDate.$d).startOf('day');
    const end = moment(range.endDate.$d).endOf('day');

    this.filterDateRange = range; // 🔥 keeps input in sync
    this.selectedDateRange = { startDate: start, endDate: end };

    console.log('normalized range:', {
      start: this.selectedDateRange.startDate.format('YYYY-MM-DD'),
      end: this.selectedDateRange.endDate.format('YYYY-MM-DD'),
    });

    this.applyAllFilters();
  }

  onDateRangeClear() {
    this.selectedDateRange = null;
    this.applyAllFilters();
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
    this.api.setOverlay(this.popupVisible);

    if (!this.popupVisible) {
      this.resetForm();
    }
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

    // document.body.classList.add('overflow-hidden');
    this.api.setOverlay(true);
  

  }

  resetForm() {
    this.popupVisible = false;
    this.editingTask = null;
    this.taskForm.reset({
      title: '',
      dueDate: '',
      status: 'pending',
      priority: 'medium',
      assignedUsers: [],
    });
 
    this.api.setOverlay(false);

    // document.body.classList.remove('overflow-hidden');
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
