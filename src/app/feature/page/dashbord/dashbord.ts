// import { Component, OnInit } from '@angular/core';
// import {
//   FormBuilder,
//   Validators,
//   ReactiveFormsModule,
//   FormsModule,
//   FormControl,
// } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { ToastrService } from 'ngx-toastr';

// import { NewTaskService } from '../../../core/service/mocapi/task';
// import { AuthService } from '../../../core/service/mocapi/auth';

// import { NgSelectModule } from '@ng-select/ng-select';
// import { UserService } from '../../../core/service/mocapi/user';
// import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';



// type TaskStatus = 'pending' | 'in-progress' | 'completed';
// type TaskPriority = 'low' | 'medium' | 'high';

// @Component({
//   selector: 'app-dashbord',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     FormsModule,
//     NgxDaterangepickerMd,
//     NgxPaginationModule,
//     NgSelectModule,
//     DragDropModule,
//   ],
//   templateUrl: './dashbord.html',
// })
// export class Dashbord implements OnInit {
//   /** UI */
//   popupVisible = false;
//   deletingTask = false;
//   loading = true;

//   /** DATA */
//   tasks: any[] = [];
//   filteredTasks: any[] = [];
//   editingTask: any = null;
//   deleteId: string | null = null;

//   /** STATS */
//   totalTasks = 0;
//   complatedTasks = 0;
//   inprogressTasks = 0;
//   pendingTasks = 0;

//   /** FILTERS */
//   searchText = '';
//   statusFilter: TaskStatus | 'all' = 'all';
//   dateRangeControl = new FormControl(null);

//   /** PAGINATION */
//   p = 1;
//   itemsPerPage = 5;
//   pageSizeOptions = [5, 10, 20, 'All'];
//   selectedPageSize: number | 'All' = 5;

//   /** FORM */
//   taskForm: any;
//   assignableUsers: string[] = [];
//   currentUser: any;
//   assignedUserMap: Record<string, { id: string; name: string; email: string }[]> = {};

//   // VIEW MODE
//   viewMode: 'table' | 'board' = 'table';

//   // SORT ORDER
//   sortOrder: 'desc' | 'asc' = 'desc';

//   boardColumns: {
//     title: string;
//     color: string;
//     status: TaskStatus;
//     data: any[];
//   }[] = [];

//   connectedDropLists: string[] = [];

  
//   constructor(
//     private fb: FormBuilder,
//     private taskService: NewTaskService,
//     public auth: AuthService,
//     private toastr: ToastrService
//   ) {
//     this.taskForm = this.fb.group({
//       title: ['', Validators.required],
//       dueDate: ['', Validators.required],
//       status: ['pending' as TaskStatus],
//       priority: ['medium' as TaskPriority],
//       assignedUsers: [[] as string[]],

//     });
//     this.loadTasks();
//   }

 
//   ngOnInit() {
//     this.currentUser = this.auth.user();
//     this.loadAssignableUsers();
//     this.loadTasks();
//     this.updateBoardColumns();
//     this.connectedDropLists = this.boardColumns.map(c => c.status);

//     console.log('Assigned users:', this.assignedUserMap);
//     // this.tasks.forEach(task => this.resolveAssignedUsers(task));
//     console.log('Assigned users after resolving:', this.assignedUserMap);
//     this.dateRangeControl.valueChanges.subscribe(range =>
//       this.applyDateFilter(range)
//     );
//   }


//   // ======================
//   // 🔄 LOAD TASKS (API)
//   // ======================
 
//   loadAssignableUsers() {
//     const me = this.auth.user();
//     if (!me) return;

//     const myId = String(me.id);
//     const myParentId = me.parentId ? String(me.parentId) : null;

//     this.taskService.getUsers().subscribe((users: any[]) => {
//       this.assignableUsers = users.filter(u => {
//         const userId = String(u.id);
//         const userParentId = u.parentId ? String(u.parentId) : null;

//         // ❌ cannot assign to myself
//         // if (userId === myId) return false;

//         // ✅ my children
//         if (userParentId === myId) return true;

//         // ✅ my siblings
//         if (myParentId && userParentId === myParentId) return true;
        

//         return false;
//       });
//     });
//   }
//   users: any[] = [];
//   userMap: Record<string, any> = {};

 
//   // loadTasks() {
//   //   this.loading = true;

//   //   this.taskService.getTasks().subscribe({
//   //     next: (res: any[]) => {
//   //       console.log('Tasks loaded:', res);
//   //       this.tasks = res;
//   //       this.filteredTasks = [...res];
//   //       this.updateStats(res);
//   //       this.resolveAssignedUsers(res); // ✅ IMPORTANT
//   //       console.log('Assigned users map:', this.assignedUsersMap);

//   //       this.loading = false;
//   //     },
//   //     error: () => {
//   //       this.toastr.error('Failed to load tasks');
//   //       this.loading = false;
//   //     },
//   //   });
//   // }

//   loadTasks() {
//     this.loading = true;

//     this.taskService.getTasks().subscribe({
//       next: (res: any[]) => {
//         // ✅ SORT FIRST
//         // const sorted = this.sortTasks(res);
//         const sorted = [...res].sort(
//           (a, b) => (a.order_id ?? 9999) - (b.order_id ?? 9999)
//         );

//         this.tasks = sorted;
//         this.filteredTasks = [...sorted];

//         this.updateStats(sorted);
//         this.resolveAssignedUsers(sorted);

//         // ✅ IMPORTANT: rebuild board AFTER data arrives
//         this.updateBoardColumns();

//         this.loading = false;
//       },
//       error: () => {
//         this.toastr.error('Failed to load tasks');
//         this.loading = false;
//       }
//     });
//   }
 
 
//   assignedUsersMap: Record<string, any[] | undefined> = {};

 
//   resolveAssignedUsers(tasks: any[]) {
//     tasks.forEach(task => {

//       // SAFETY
//       if (!Array.isArray(task.assignedUsers) || task.assignedUsers.length === 0) {
//         this.assignedUsersMap[task.id] = [];
//         return;
//       }

//       this.taskService.getUsersByIds(task.assignedUsers).subscribe(users => {
//         this.assignedUsersMap[task.id] = users;
//       });

//     });
//   }

//   getAssignedUsers(taskId: string): any[] {
//     return this.assignedUsersMap[taskId] ?? [];
//   }


//   getSingleAssignedUser(task: any): any | null {
//     const users = this.getAssignedUsers(task);
//     return users.length === 1 ? users[0] : null;
//   }

//   saveTask() {
//     if (this.taskForm.invalid) {
//       this.taskForm.markAllAsTouched();
//       return;
//     }

//     const payload = {
//       ...this.taskForm.value,
//       assignedTo: this.taskForm.value.assignedUsers,
      
//       createdBy: this.auth.user().id, // optional but recommended
//     };
// console.log('Saving task:',this.taskForm.value.assignedUsers);
//     console.log('Saving task:', payload);
//     if (this.editingTask) {
//       this.taskService
//         .updateTask(this.editingTask.id, payload)
//         .subscribe(() => {
//           this.toastr.success('Task updated');
//           this.resetForm();
//           this.loadTasks();
//         });
//     } else {
//       this.taskService
//         .createTask(payload)
//         .subscribe((res) => {
//           console.log('Task created:', res);
//           this.toastr.success('Task created');
//           this.resetForm();
//           this.loadTasks();
//         });
//     }
//   }

 
//   editTask(task: any) {
//     this.editingTask = task;
//     this.popupVisible = true;

//     this.taskForm.enable();

//     this.taskForm.patchValue({
//       title: task.title,
//       dueDate: task.dueDate,
//       status: task.status,
//       priority: task.priority || 'medium',
//       assignedUsers: task.assignedUsers || [],
//     });

//     document.body.classList.add('overflow-hidden');
//   }

//   deleteTask(task: any) {
//     this.deleteId = task.id;
//     console.log(task);
//     this.deletingTask = true;
//     document.body.classList.add('overflow-hidden');

   
//         this.taskForm.patchValue({
//           title: task.title,
//           dueDate: task.dueDate,
//           status: task.status,
//         });
//         this.taskForm.disable();
      
//   }

//   confirmDelete() {
//     if (!this.deleteId) return;

//     this.taskService.deleteTask(this.deleteId).subscribe(() => {
//       this.toastr.success('Task deleted');
//       this.closeDeleteModal();
//       this.loadTasks();
//     });
//     this.taskForm.enable();
//   }

//   closeDeleteModal() {
//     this.deletingTask = false;
//     this.deleteId = null;
//     this.taskForm.enable();
//     document.body.classList.remove('overflow-hidden');
//   }


//   // onTaskDrop(
//   //   event: CdkDragDrop<any[]>,
//   //   tarUser.container.data,
//   //       event.previousIndex,
//   //       event.currentIndex
//   //     );

//   //     // update order_id
//   //     event.container.data.forEach((task, index) => {
//   //       task.order_id = index;
//   //     });

//   //   } else {
//   //     // DIFFERENT COLUMN → move + status change
//   //     transferArrayItem(
//   //       event.previousContainer.data,
//   //       event.container.data,
//   //       event.previousIndex,
//   //       event.currentIndex
//   //     );

//   //     const movedTask = event.container.data[event.currentIndex];

//   //     movedTask.status = targetStatus;

//   //     // update order_id in new column
//   //     event.container.data.forEach((task, index) => {
//   //       task.order_id = index;
//   //     });

//   //     // 🔥 persist status + order
//   //     this.taskService.updateTask(movedTask.id, {
//   //       status: targetStatus,
//   //       order_id: movedTask.order_id
//   //     }).subscribe();
//   //   }
//   // }

//   // ======================
//   // 🔍 FILTERS
//   // ======================
//   // filterBySearch() {
//   //   const text = this.searchText.toLowerCase();
//   //   this.filteredTasks = this.tasks.filter((t) =>
//   //     t.title.toLowerCase().includes(text)
//   //   );
//   // }

//   // onTaskDrop(
//   //   event: CdkDragDrop<any[]>,
//   //   targetStatus: 'pending' | 'in-progress' | 'completed'
//   // ) {
//   //   if (event.previousContainer === event.container) {
//   //     moveItemInArray(
//   //       event.container.data,
//   //       event.previousIndex,
//   //       event.currentIndex
//   //     );

//   //     event.container.data.forEach((task, index) => {
//   //       task.order_id = index;
//   //     });

//   //   } else {
//   //     transferArrayItem(
//   //       event.previousContainer.data,
//   //       event.container.data,
//   //       event.previousIndex,
//   //       event.currentIndex
//   //     );

//   //     const movedTask = event.container.data[event.currentIndex];
//   //     movedTask.status = targetStatus;
//   //     movedTask.order_id = event.currentIndex;

//   //     this.taskService.updateTask(movedTask.id, {
//   //       status: targetStatus,
//   //       order_id: movedTask.order_id
//   //     }).subscribe();
//   //   }
//   // }

//   // onTaskDrop(
//   //   event: CdkDragDrop<any[]>,
//   //   targetStatus: 'pending' | 'in-progress' | 'completed'
//   // ) {
//   //   if (event.previousContainer === event.container) {

//   //     // ✅ SAME COLUMN REORDER
//   //     moveItemInArray(
//   //       event.container.data,
//   //       event.previousIndex,
//   //       event.currentIndex
//   //     );

//   //     // ✅ UPDATE ORDER FOR ALL TASKS IN THAT COLUMN
//   //     event.container.data.forEach((task, index) => {
//   //       task.order_id = index;

//   //       this.taskService.updateTask(task.id, {
//   //         order_id: index
//   //       }).subscribe();
//   //     });

//   //   } else {

//   //     // ✅ CROSS COLUMN MOVE
//   //     transferArrayItem(
//   //       event.previousContainer.data,
//   //       event.container.data,
//   //       event.previousIndex,
//   //       event.currentIndex
//   //     );

//   //     // FIX SOURCE COLUMN ORDER
//   //     event.previousContainer.data.forEach((task, index) => {
//   //       task.order_id = index;
//   //       this.taskService.updateTask(task.id, { order_id: index }).subscribe();
//   //     });

//   //     // FIX TARGET COLUMN ORDER + STATUS
//   //     event.container.data.forEach((task, index) => {
//   //       task.order_id = index;
//   //       task.status = targetStatus;

//   //       this.taskService.updateTask(task.id, {
//   //         status: task.status,
//   //         order_id: task.order_id
//   //       }).subscribe();
//   //     });
//   //   }
//   // }

//   // onTaskDrop(
//   //   event: CdkDragDrop<any[]>,
//   //   targetStatus: TaskStatus
//   // ) {
//   //   // SAME COLUMN → reorder only
//   //   if (event.previousContainer === event.container) {

//   //     moveItemInArray(
//   //       event.container.data,
//   //       event.previousIndex,
//   //       event.currentIndex
//   //     );

//   //     // 🔥 update order locally
//   //     const updatedTasks = event.container.data.map((task, index) => ({
//   //       ...task,
//   //       order_id: index
//   //     }));

//   //     // 🔥 persist in correct order (sequential)
//   //     this.persistOrder(updatedTasks);

//   //   }
//   //   // DIFFERENT COLUMN → move + status + order
//   //   else {

//   //     transferArrayItem(
//   //       event.previousContainer.data,
//   //       event.container.data,
//   //       event.previousIndex,
//   //       event.currentIndex
//   //     );

//   //     // update source column order
//   //     const sourceTasks = event.previousContainer.data.map((task, index) => ({
//   //       ...task,
//   //       order_id: index
//   //     }));

//   //     // update target column order + status
//   //     const targetTasks = event.container.data.map((task, index) => ({
//   //       ...task,
//   //       status: targetStatus,
//   //       order_id: index
//   //     }));

//   //     this.persistOrder([...sourceTasks, ...targetTasks]);
//   //   }
//   // }

//   onTaskDrop(
//     event: CdkDragDrop<any[]>,
//     targetStatus: TaskStatus
//   ) {
//     // SAME COLUMN → reorder
//     if (event.previousContainer === event.container) {

//       moveItemInArray(
//         event.container.data,
//         event.previousIndex,
//         event.currentIndex
//       );

//       event.container.data.forEach((task, index) => {
//         task.order_id = index;
//         this.syncLocalTask(task.id, { order_id: index });
//       });

//       this.persistOrder(event.container.data);
//     }
//     // DIFFERENT COLUMN → move + status + order
//     else {

//       transferArrayItem(
//         event.previousContainer.data,
//         event.container.data,
//         event.previousIndex,
//         event.currentIndex
//       );

//       // source column reorder
//       event.previousContainer.data.forEach((task, index) => {
//         task.order_id = index;
//         this.syncLocalTask(task.id, { order_id: index });
//       });

//       // target column reorder + STATUS UPDATE 🔥
//       event.container.data.forEach((task, index) => {
//         task.order_id = index;
//         task.status = targetStatus;

//         this.syncLocalTask(task.id, {
//           status: targetStatus,
//           order_id: index
//         });
//       });

//       this.persistOrder([
//         ...event.previousContainer.data,
//         ...event.container.data
//       ]);
//     }

//     // 🔥 rebuild board immediately from updated data
//     this.updateBoardColumns();
//   }

//   // onTableDrop(event: CdkDragDrop<any[]>) {
//   //   moveItemInArray(
//   //     this.filteredTasks,
//   //     event.previousIndex,
//   //     event.currentIndex
//   //   );

//   //   // ✅ persist order_id
//   //   this.filteredTasks.forEach((task, index) => {
//   //     task.order_id = index;

//   //     this.taskService.updateTask(task.id, {
//   //       order_id: index
//   //     }).subscribe();
//   //   });

//   //   // keep board in sync
//   //   this.updateBoardColumns();
//   // }

//   // onTableDrop(event: CdkDragDrop<any[]>) {
//   //   if (this.selectedPageSize !== 'All') return;

//   //   moveItemInArray(
//   //     this.filteredTasks,
//   //     event.previousIndex,
//   //     event.currentIndex
//   //   );

//   //   // persist order_id
//   //   this.filteredTasks.forEach((task, index) => {
//   //     task.order_id = index;
//   //   });

//   //   // batch persist (avoids race condition)
//   //   this.filteredTasks.reduce((p, task) => {
//   //     return p.then(() =>
//   //       this.taskService.updateTask(task.id, {
//   //         order_id: task.order_id
//   //       }).toPromise()
//   //     );
//   //   }, Promise.resolve());

//   //   this.updateBoardColumns();
//   // }

//   // onTableDrop(event: CdkDragDrop<any[]>) {

//   //   // ❌ safety
//   //   if (this.selectedPageSize !== 'All') return;

//   //   // ✅ reorder SAME array
//   //   moveItemInArray(
//   //     this.filteredTasks,
//   //     event.previousIndex,
//   //     event.currentIndex
//   //   );

//   //   // ✅ sync main source array too
//   //   this.tasks = [...this.filteredTasks];

//   //   // ✅ reassign order_id
//   //   this.filteredTasks.forEach((task, index) => {
//   //     task.order_id = index;
//   //   });

//   //   // ✅ persist sequentially (NO race condition)
//   //   this.filteredTasks.reduce((p, task) => {
//   //     return p.then(() =>
//   //       this.taskService.updateTask(task.id, {
//   //         order_id: task.order_id
//   //       }).toPromise()
//   //     );
//   //   }, Promise.resolve());

//   //   // ✅ keep board view synced
//   //   this.updateBoardColumns();
//   // }
//   // onTableDrop(event: CdkDragDrop<any[]>) {
//   //   console.log('DROP FIRED', event.previousIndex, event.currentIndex);

//   //   // if (this.selectedPageSize !== 'All') return;

//   //   moveItemInArray(
//   //     this.filteredTasks,
//   //     event.previousIndex,
//   //     event.currentIndex
//   //   );

//   //   // this.filteredTasks.forEach((task, index) => {
//   //   //   task.order_id = index;
//   //   // });

//   //   // this.persistOrder(this.filteredTasks);
//   //   // this.updateBoardColumns();
//   // }

//   onTableDrop(event: CdkDragDrop<any[]>) {
//     moveItemInArray(
//       this.filteredTasks,
//       event.previousIndex,
//       event.currentIndex
//     );

//     // reassign order_id
//     this.filteredTasks.forEach((task, index) => {
//       task.order_id = index;
//     });

//     // persist sequentially
//     this.persistOrder(this.filteredTasks);

//     // sync board view
//     this.updateBoardColumns();
//   }

//   private persistOrder(tasks: any[]) {
//     // 🔐 execute updates sequentially to avoid race condition
//     tasks.reduce((prev, task) => {
//       return prev.then(() =>
//         this.taskService.updateTask(task.id, {
//           status: task.status,
//           order_id: task.order_id
//         }).toPromise()
//       );
//     }, Promise.resolve());
//   }

//   trackByTaskId(index: number, task: any) {
//     return task.id;
//   }

//   get paginatedTasks() {
//     if (this.selectedPageSize === 'All') {
//       return this.filteredTasks;
//     }

//     const start = (this.p - 1) * this.itemsPerPage;
//     const end = start + this.itemsPerPage;
//     return this.filteredTasks.slice(start, end);
//   }

//   // filterBySearch() {
//   //   const text = this.searchText.toLowerCase();
//   //   this.filteredTasks = this.tasks.filter(t =>
//   //     t.title.toLowerCase().includes(text)
//   //   );
//   //   this.updateBoardColumns();
//   // }

//   filterBySearch() {
//     const text = (this.searchText || '').toLowerCase();

//     this.filteredTasks = this.tasks.filter(task => {
//       const title = (task?.title || '').toLowerCase();
//       return title.includes(text);
//     });

//     this.updateBoardColumns();
//   }


//   // filterByStatus() {
//   //   if (this.statusFilter === 'all') {
//   //     this.filteredTasks = [...this.tasks];
//   //     return;
//   //   }

//   //   this.filteredTasks = this.tasks.filter(
//   //     (t) => t.status === this.statusFilter
//   //   );
//   // }

//   filterByStatus() {
//     if (this.statusFilter === 'all') {
//       this.filteredTasks = [...this.tasks];
//     } else {
//       this.filteredTasks = this.tasks.filter(
//         t => t.status === this.statusFilter
//       );
//     }
//     this.updateBoardColumns();
//   }

//   // applyDateFilter(range: any) {
//   //   if (!range?.startDate || !range?.endDate) {
//   //     this.filteredTasks = [...this.tasks];
//   //     return;
//   //   }

//   //   const start = new Date(range.startDate).getTime();
//   //   const end = new Date(range.endDate).getTime();

//   //   this.filteredTasks = this.tasks.filter((t) => {
//   //     const due = new Date(t.dueDate).getTime();
//   //     return due >= start && due <= end;
//   //   });
//   // }

//   applyDateFilter(range: any) {
//     if (!range?.startDate || !range?.endDate) {
//       this.filteredTasks = [...this.tasks];
//     } else {
//       const start = new Date(range.startDate).getTime();
//       const end = new Date(range.endDate).getTime();

//       this.filteredTasks = this.tasks.filter(t => {
//         const due = new Date(t.dueDate).getTime();
//         return due >= start && due <= end;
//       });
//     }
//     this.updateBoardColumns();
//   }

//   clearDateFilter() {
//     this.dateRangeControl.setValue(null);
//     this.filteredTasks = [...this.tasks];
//   }

//   private updateBoardColumns() {
//     this.boardColumns = [
//       {
//         title: 'Pending',
//         color: 'red',
//         status: 'pending',
//         data: this.pendingBoard
//       },
//       {
//         title: 'In Progress',
//         color: 'yellow',
//         status: 'in-progress',
//         data: this.inProgressBoard
//       },
//       {
//         title: 'Completed',
//         color: 'green',
//         status: 'completed',
//         data: this.completedBoard
//       }
//     ];
//   }

//   get sortedTasks() {
//     return [...this.filteredTasks].sort((a, b) => {
//       const d1 = new Date(a.createdAt).getTime();
//       const d2 = new Date(b.createdAt).getTime();
//       return this.sortOrder === 'desc' ? d2 - d1 : d1 - d2;
//     });
//   }

//   private sortTasks(tasks: any[]) {
//     return [...tasks].sort((a, b) => {
//       const aOrder = a.order_id ?? new Date(a.createdAt).getTime();
//       const bOrder = b.order_id ?? new Date(b.createdAt).getTime();

//       return this.sortOrder === 'desc'
//         ? bOrder - aOrder   // newest first
//         : aOrder - bOrder;  // oldest first
//     });
//   }

//   // get pendingBoard() {
//   //   return this.sortedTasks.filter(t => t.status === 'pending');
//   // }

//   // get inProgressBoard() {
//   //   return this.sortedTasks.filter(t => t.status === 'in-progress');
//   // }

//   // get completedBoard() {
//   //   return this.sortedTasks.filter(t => t.status === 'completed');
//   // }

//   get pendingBoard() {
//     return this.sortedTasks
//       .filter(t => t.status === 'pending')
//       .sort((a, b) => (a.order_id ?? 0) - (b.order_id ?? 0));
//   }

//   get inProgressBoard() {
//     return this.sortedTasks
//       .filter(t => t.status === 'in-progress')
//       .sort((a, b) => (a.order_id ?? 0) - (b.order_id ?? 0));
//   }

//   get completedBoard() {
//     return this.sortedTasks
//       .filter(t => t.status === 'completed')
//       .sort((a, b) => (a.order_id ?? 0) - (b.order_id ?? 0));
//   }

//   toggleSortBy(field: 'order' | 'dueDate') {
//     this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';

//     if (field === 'dueDate') {
//       this.filteredTasks = [...this.filteredTasks].sort((a, b) => {
//         const aDate = new Date(a.dueDate).getTime();
//         const bDate = new Date(b.dueDate).getTime();
//         return this.sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
//       });
//     } else {
//       this.filteredTasks = this.sortTasks(this.filteredTasks);
//     }

//     this.updateBoardColumns();
//   }

//   openBoardCreate(status: TaskStatus) {
//     this.popupVisible = true;
//     this.editingTask = null;
//     this.taskForm.reset({
//       title: '',
//       dueDate: '',
//       status,
//       priority: 'medium',
//       assignedUsers: []
//     });
//   }


//   // ======================
//   // 📊 STATS
//   // ======================
//   updateStats(tasks: any[]) {
//     this.totalTasks = tasks.length;
//     this.complatedTasks = tasks.filter(t => t.status === 'completed').length;
//     this.inprogressTasks = tasks.filter(t => t.status === 'in-progress').length;
//     this.pendingTasks = tasks.filter(t => t.status === 'pending').length;
//   }

//   // ======================
//   // 🔐 PERMISSIONS
//   // ======================
 

//   canCreate() { return this.auth.hasPermission('createTask'); }
//   canEdit() { return this.auth.hasPermission('editTask'); }
//   canDelete() { return this.auth.hasPermission('deleteTask'); }

//   // ======================
//   // 🧹 HELPERS
//   // ======================
//   togglePopup() {
//     this.popupVisible = !this.popupVisible;
//     document.body.classList.toggle('overflow-hidden', this.popupVisible);

//     if (!this.popupVisible) {

//       this.resetForm();
//     }
//     else {
//       this.taskForm.enable();
//     }
//   }

//   resetForm() {
//     this.popupVisible = false;
//     this.editingTask = null;
//     this.taskForm.reset({ status: 'pending' });
//     document.body.classList.remove('overflow-hidden');
//   }

//   onPageSizeChange(size: number | 'All') {
//     this.p = 1;
//     // this.itemsPerPage =
//     //   size === 'All' ? this.filteredTasks.length || 1 : size;
//     this.itemsPerPage =
//       size === 'All' ? this.filteredTasks.length : size;

//   }

//   hasMultipleAssignedUsers(taskId: string): boolean {
//     return (this.assignedUserMap?.[taskId]?.length ?? 0) > 1;
//   }

//   hasSingleAssignedUser(taskId: string): boolean {
//     return (this.assignedUserMap?.[taskId]?.length ?? 0) === 1;
//   }
 
//   private syncLocalTask(taskId: string, changes: Partial<any>) {
//     // update in main tasks array
//     this.tasks = this.tasks.map(t =>
//       t.id === taskId ? { ...t, ...changes } : t
//     );

//     // keep filteredTasks in sync
//     this.filteredTasks = this.filteredTasks.map(t =>
//       t.id === taskId ? { ...t, ...changes } : t
//     );
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

import { ApiService } from '../../../core/service/mocapi/api/api';
import { AuthService } from '../../../core/service/mocapi/auth';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

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
  }

  /* =====================
     INIT
  ===================== */
  // ngOnInit() {
  //   this.loadUsersOnce();
  //   this.loadTasks();

  //   this.dateRangeControl.valueChanges.subscribe(range =>
  //     this.applyDateFilter(range)
  //   );
  // }
  ngOnInit() {
    this.api.getTasks$().subscribe(tasks => {
      this.tasks = [...tasks].sort(
        (a, b) => (a.order_id ?? 0) - (b.order_id ?? 0)
      );

      this.applyAllFilters();
      this.buildAssignedUsersMap();
      this.updateStats(this.tasks);
      this.rebuildBoard();

      this.loading = false;
    });

    this.api.getUsers$().subscribe(users => {
      users.forEach(u => (this.userMap[u.id] = u));
      this.assignableUsers = users;
    });

    this.dateRangeControl.valueChanges.subscribe(r =>
      this.applyDateFilter(r)
    );
  }


  /* =====================
     LOAD USERS (ONCE)
  ===================== */
  private loadUsersOnce() {
    const me = this.auth.user();
    if (!me) return;

    this.api.getUsers$().subscribe((users: any[]) => {
      users.forEach((u: any) => {
        this.userMap[u.id] = u;
      });

      const me = this.auth.user();
      if (!me) return;

      const myId = String(me.id);
      const myParentId = me.parentId ? String(me.parentId) : null;

      this.assignableUsers = users.filter((u: any) => {
        const pid = u.parentId ? String(u.parentId) : null;
        return pid === myId || (myParentId && pid === myParentId);
      });
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
  // applyAllFilters() {
  //   let data = [...this.tasks];

  //   if (this.searchText) {
  //     const t = this.searchText.toLowerCase();
  //     data = data.filter(x => x.title.toLowerCase().includes(t));
  //   }

  //   if (this.statusFilter !== 'all') {
  //     data = data.filter(x => x.status === this.statusFilter);
  //   }

  //   this.filteredTasks = data;
  // }

  applyAllFilters() {
    let data = [...this.tasks];

    if (this.searchText) {
      const t = this.searchText.toLowerCase();
      data = data.filter(x => x.title.toLowerCase().includes(t));
    }

    if (this.statusFilter !== 'all') {
      data = data.filter(x => x.status === this.statusFilter);
    }

    this.filteredTasks = data;
  }


  /* =====================
     SAVE / UPDATE
  ===================== */
  // saveTask() {
  //   if (this.taskForm.invalid) return;

  //   const payload = {
  //     ...this.taskForm.value,
  //     createdBy: this.auth.user().id,
  //   };

  //   const req$ = this.editingTask
  //     ? this.taskService.updateTask(this.editingTask.id, payload)
  //     : this.taskService.createTask(payload);

  //   req$.subscribe(() => {
  //     this.toastr.success(this.editingTask ? 'Task updated' : 'Task created');
  //     this.resetForm();
  //     this.loadTasks();
  //   });
  // }

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
    this.taskForm.disable();
  }

  // confirmDelete() {
  //   if (!this.deleteId) return;

  //   this.taskService.deleteTask(this.deleteId).subscribe(() => {
  //     this.toastr.success('Task deleted');
  //     this.closeDeleteModal();
  //     this.loadTasks();
  //   });
  // }

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
    this.taskForm.enable();
    document.body.classList.remove('overflow-hidden');
  }

  /* =====================
     DRAG & DROP
  ===================== */
  // onTaskDrop(event: CdkDragDrop<any[]>, status: TaskStatus) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }

  //   [...event.container.data, ...event.previousContainer.data].forEach(
  //     (task, i) => (task.order_id = i)
  //   );

  //   this.persistOrder([...event.container.data, ...event.previousContainer.data]);
  //   this.rebuildBoard();
  // }

  // onTaskDrop(event: CdkDragDrop<any[]>, targetStatus: TaskStatus) {

  //   const source = event.previousContainer.data;
  //   const target = event.container.data;

  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(target, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       source,
  //       target,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }

  //   const patches: { id: string; changes: any }[] = [];

  //   [...source, ...target].forEach((task, index) => {
  //     task.order_id = index;

  //     const changes: any = { order_id: index };

  //     if (target.includes(task)) {
  //       changes.status = targetStatus;
  //       task.status = targetStatus;
  //     }

  //     patches.push({ id: task.id, changes });
  //   });

  //   // 🔥 optimistic UI already done
  //   this.api.batchUpdateTasks(patches);
  // }

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
    const t = this.searchText.toLowerCase();
    this.filteredTasks = this.tasks.filter(x =>
      x.title.toLowerCase().includes(t)
    );
    this.rebuildBoard();
  }

  filterByStatus() {
    this.filteredTasks =
      this.statusFilter === 'all'
        ? [...this.tasks]
        : this.tasks.filter(t => t.status === this.statusFilter);
    this.rebuildBoard();
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
      status,
      priority: 'medium',
      assignedUsers: [],
    });

    document.body.classList.add('overflow-hidden');
  }

  resetForm() {
    this.popupVisible = false;
    this.editingTask = null;
    this.taskForm.reset({ status: 'pending' });
    document.body.classList.remove('overflow-hidden');
  }

  trackByTaskId(_: number, t: any) {
    return t.id;
  }

  canCreate() { return this.auth.hasPermission('createTask'); }
  canEdit() { return this.auth.hasPermission('editTask'); }
  canDelete() { return this.auth.hasPermission('deleteTask'); }
}
