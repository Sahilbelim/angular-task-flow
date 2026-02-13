// // // // // // import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
// // // // // // import { Chart, ChartConfiguration, ChartData, ChartEvent, registerables } from 'chart.js';
// // // // // // import { CommonModule } from '@angular/common';

// // // // // // // @Component({
// // // // // // //   selector: 'app-dashboard-charts',
// // // // // // //   imports: [],
// // // // // // //   templateUrl: './dashboard-charts.html',
// // // // // // //   styleUrl: './dashboard-charts.css',
// // // // // // // })
// // // // // // // export class DashboardCharts {

// // // // // // // }


// // // // // // // dashboard-charts.component.ts

// // // // // // Chart.register(...registerables);

// // // // // // @Component({
// // // // // //   selector: 'app-dashboard-charts',
// // // // // //   imports: [CommonModule],
// // // // // //   template: `
// // // // // //   <div class="p-4 space-y-6">
// // // // // //     <h2 class="text-2xl font-semibold">Interactive Analytics — Users & Tasks</h2>

// // // // // //     <!-- Controls -->
// // // // // //     <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
// // // // // //       <div class="flex items-center gap-3 flex-wrap">
// // // // // //         <label class="font-medium">Date range:</label>
// // // // // //         <div class="space-x-2">
// // // // // //           <button (click)="setRange(7)" [class]="rangeDays===7 ? activeBtn : inactiveBtn">7d</button>
// // // // // //           <button (click)="setRange(14)" [class]="rangeDays===14 ? activeBtn : inactiveBtn">14d</button>
// // // // // //           <button (click)="setRange(30)" [class]="rangeDays===30 ? activeBtn : inactiveBtn">30d</button>
// // // // // //           <button (click)="setRange(null)" [class]="rangeDays===null ? activeBtn : inactiveBtn">All</button>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       <div class="flex items-center gap-3">
// // // // // //         <label class="font-medium">Filter by:</label>
// // // // // //         <select (change)="onFilterParent($any($event.target).value)" class="px-3 py-2 rounded border">
// // // // // //           <option value="all">All users</option>
// // // // // //           <option *ngFor="let p of parents" [value]="p.id">{{p.name}}</option>
// // // // // //         </select>
// // // // // //         <button (click)="resetFilters()" class="px-3 py-2 rounded bg-gray-100">Reset</button>
// // // // // //       </div>
// // // // // //     </div>

// // // // // //     <!-- Grid of charts -->
// // // // // //     <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

// // // // // //       <!-- 1. Concentric Permission Wheel -->
// // // // // //       <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
// // // // // //         <div class="flex justify-between items-start">
// // // // // //           <div>
// // // // // //             <h3 class="font-semibold">Permissions Wheel</h3>
// // // // // //             <p class="text-sm text-gray-500">Concentric rings: user type vs permission counts. Click a permission to filter.</p>
// // // // // //           </div>
// // // // // //           <div class="text-sm text-gray-500">Hover • Click</div>
// // // // // //         </div>
// // // // // //         <div class="flex flex-col md:flex-row md:items-center gap-4 mt-3">
// // // // // //           <canvas #permCanvas class="w-full md:w-1/2"></canvas>
// // // // // //           <div class="flex-1 space-y-3">
// // // // // //             <div *ngIf="permSelected" class="p-3 bg-gray-50 rounded">
// // // // // //               <div class="font-medium">Selected permission: {{permSelected}}</div>
// // // // // //               <div class="text-sm text-gray-600">Users with this permission: {{usersWithSelectedPerm.length}}</div>
// // // // // //               <div class="grid grid-cols-3 gap-2 mt-2">
// // // // // //                 <div *ngFor="let u of usersWithSelectedPerm" class="flex items-center gap-2">
// // // // // //                   <img [src]="u.avatar" class="w-8 h-8 rounded-full"/>
// // // // // //                   <div class="text-xs">{{u.name}}</div>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //             <div class="text-xs text-gray-500">Tip: use legend to toggle rings</div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       <!-- 2. Radial Parent-Child Map -->
// // // // // //       <div class="bg-white p-4 rounded-2xl shadow-sm">
// // // // // //         <div class="flex justify-between items-start">
// // // // // //           <div>
// // // // // //             <h3 class="font-semibold">Parent → Children (Radial)</h3>
// // // // // //             <p class="text-sm text-gray-500">Each segment is a parent. Size shows child count. Click to list children.</p>
// // // // // //           </div>
// // // // // //           <div class="text-sm text-gray-500">Hover • Click</div>
// // // // // //         </div>
// // // // // //         <div class="mt-3 flex gap-4">
// // // // // //           <canvas #parentCanvas class="w-1/2"></canvas>
// // // // // //           <div class="flex-1">
// // // // // //             <div *ngIf="selectedParent" class="p-3 bg-gray-50 rounded">
// // // // // //               <div class="flex items-center gap-3">
// // // // // //                 <div class="text-lg font-medium">{{selectedParent.name}}</div>
// // // // // //                 <div class="text-sm text-gray-500">{{childrenOfSelectedParent.length}} child(ren)</div>
// // // // // //               </div>
// // // // // //               <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
// // // // // //                 <div *ngFor="let c of childrenOfSelectedParent" class="flex items-center gap-2 p-2 border rounded">
// // // // // //                   <img [src]="c.avatar" class="w-10 h-10 rounded-full"/>
// // // // // //                   <div>
// // // // // //                     <div class="font-semibold text-sm">{{c.name}}</div>
// // // // // //                     <div class="text-xs text-gray-500">{{c.email}}</div>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //             <div *ngIf="!selectedParent" class="text-sm text-gray-500 p-3">Click a parent segment to view children</div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       <!-- 3. Task Timeline Stream -->
// // // // // //       <div class="bg-white p-4 rounded-2xl shadow-sm col-span-1 lg:col-span-2">
// // // // // //         <div class="flex justify-between items-center">
// // // // // //           <div>
// // // // // //             <h3 class="font-semibold">Task Timeline Stream</h3>
// // // // // //             <p class="text-sm text-gray-500">Tasks created vs completed per day. Toggle cumulative / cumulative off.</p>
// // // // // //           </div>
// // // // // //           <div class="flex items-center gap-2">
// // // // // //             <label class="text-sm">Cumulative</label>
// // // // // //             <input type="checkbox" class="toggle-checkbox" (change)="toggleCumulative($event)"/>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //         <div class="mt-3">
// // // // // //           <canvas #timelineCanvas class="w-full" style="height:260px"></canvas>
// // // // // //           <div class="mt-3 flex items-center gap-3 text-sm">
// // // // // //             <div class="font-medium">Legend:</div>
// // // // // //             <div class="px-2 py-1 rounded bg-red-50 text-red-600">Created</div>
// // // // // //             <div class="px-2 py-1 rounded bg-green-50 text-green-600">Completed</div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       <!-- 4. Activity Heat-Bubble Calendar -->
// // // // // //       <div class="bg-white p-4 rounded-2xl shadow-sm">
// // // // // //         <div class="flex justify-between items-start">
// // // // // //           <div>
// // // // // //             <h3 class="font-semibold">Activity Calendar (Bubble Heatmap)</h3>
// // // // // //             <p class="text-sm text-gray-500">x: weekday, y: week index. Size = task count.</p>
// // // // // //           </div>
// // // // // //           <div class="text-sm text-gray-500">Hover • Click</div>
// // // // // //         </div>
// // // // // //         <div class="mt-3 flex gap-4 items-start">
// // // // // //           <canvas #bubbleCanvas class="w-1/2"></canvas>
// // // // // //           <div class="flex-1">
// // // // // //             <div *ngIf="selectedDayTasks?.length" class="p-3 bg-gray-50 rounded">
// // // // // //               <div class="font-medium">Tasks on {{selectedDayLabel}}</div>
// // // // // //               <ul class="mt-2 space-y-1 text-sm">
// // // // // //                 <li *ngFor="let t of selectedDayTasks" class="p-2 border rounded">
// // // // // //                   <div class="font-semibold">{{t.title}}</div>
// // // // // //                   <div class="text-xs text-gray-500">{{t.description}}</div>
// // // // // //                 </li>
// // // // // //               </ul>
// // // // // //             </div>
// // // // // //             <div *ngIf="!selectedDayTasks?.length" class="text-sm text-gray-500 p-3">Click a bubble to inspect tasks that day</div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       <!-- 5. Interactive Stacked Bar (Status vs Priority) -->
// // // // // //       <div class="bg-white p-4 rounded-2xl shadow-sm col-span-1 lg:col-span-2">
// // // // // //         <div class="flex justify-between items-center gap-4">
// // // // // //           <div>
// // // // // //             <h3 class="font-semibold">Stacked Bar — Group by</h3>
// // // // // //             <p class="text-sm text-gray-500">Toggle grouping and percent/absolute mode.</p>
// // // // // //           </div>
// // // // // //           <div class="flex items-center gap-2">
// // // // // //             <button (click)="setStackGroup('status')" [class]="stackGroup==='status'? activeBtn : inactiveBtn">Status</button>
// // // // // //             <button (click)="setStackGroup('priority')" [class]="stackGroup==='priority'? activeBtn : inactiveBtn">Priority</button>
// // // // // //             <button (click)="togglePercent()" [class]="stackPercent? activeBtn : inactiveBtn">Percent</button>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //         <div class="mt-3">
// // // // // //           <canvas #stackCanvas style="height:300px"></canvas>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //     </div>

// // // // // //   </div>
// // // // // //   `,
// // // // // //   styles: [`
// // // // // //     :host { display:block; }
// // // // // //     .active-btn { @apply bg-indigo-600 text-white px-3 py-1 rounded; }
// // // // // //     .inactive-btn { @apply bg-gray-100 text-gray-700 px-3 py-1 rounded; }
// // // // // //     /* quick toggle checkbox style */
// // // // // //     input.toggle-checkbox { width: 36px; height: 20px; appearance: none; background: #e5e7eb; border-radius: 9999px; position: relative; outline: none; cursor:pointer; }
// // // // // //     input.toggle-checkbox:after { content: ''; width: 16px; height: 16px; background:white; border-radius: 9999px; display:block; transform: translateX(2px); transition: transform .2s; }
// // // // // //     input.toggle-checkbox:checked { background: #4f46e5; }
// // // // // //     input.toggle-checkbox:checked:after { transform: translateX(18px); }
// // // // // //   `]
// // // // // // })
// // // // // // export class DashboardCharts implements AfterViewInit, OnDestroy {

// // // // // //   // Tailwind-style button classes used in template binding.
// // // // // //   activeBtn = 'px-3 py-1 rounded bg-indigo-600 text-white';
// // // // // //   inactiveBtn = 'px-3 py-1 rounded bg-gray-100 text-gray-700';

// // // // // //   // ====== Put your dataset here (exactly as provided) ======
// // // // // //   users: any[] = [
// // // // // //     /* full user data: paste from the provided user data */
// // // // // //     {
// // // // // //       "createdAt": "2026-01-18T10:20:50.691Z", "name": "User A", "avatar": "https://avatars.githubusercontent.com/u/78167653", "email": "userb@gmail.com", "password": "123456", "parentId": null, "bio": "Chief", "permissions": { "createTask": true, "editTask": true, "deleteTask": true, "createUser": true }, "id": "1"
// // // // // //     },
// // // // // //     { "createdAt": "2026-01-18T20:06:00.281Z", "name": "User b", "avatar": "https://avatars.githubusercontent.com/u/82001809", "email": "userb@gmail.com", "password": "123456", "parentId": "1", "bio": "Dynamic", "permissions": { "createTask": false, "editTask": true, "deleteTask": true, "createUser": false }, "id": "2" },
// // // // // //     { "createdAt": "2026-01-19T06:11:38.688Z", "name": "temp", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/95.jpg", "email": "test@example.com", "password": "password123A@", "parentId": null, "bio": "bio", "permissions": { "createTask": true, "editTask": true, "deleteTask": true, "createUser": true }, "id": "4" },
// // // // // //     { "createdAt": "2026-01-19T11:30:16.678Z", "name": "rwerw", "avatar": "https://avatars.githubusercontent.com/u/36304406", "email": "testrwerqwe@example.com", "password": "123123", "parentId": "8", "bio": "National", "permissions": { "createUser": true, "createTask": false, "editTask": false, "deleteTask": false }, "id": "9" },
// // // // // //     { "createdAt": "2026-01-20T06:09:24.466Z", "name": "temp2 's child", "avatar": "https://avatars.githubusercontent.com/u/1676028", "email": "temp2schild@gmail.com", "password": "123123", "parentId": "11", "bio": "Investor", "permissions": { "createUser": true, "createTask": true, "editTask": true, "deleteTask": false }, "id": "12" },
// // // // // //     { "createdAt": "2026-01-20T06:06:12.555Z", "name": "Test user ", "avatar": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", "email": "test1@example.com", "password": "456456", "parentId": "3", "bio": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using okay", "permissions": { "createUser": true, "createTask": true, "editTask": true, "deleteTask": true }, "id": "10", "phone": "99242534332", "address": "", "region": "India", "_lastSync": 1769257454980 },
// // // // // //     { "createdAt": "2026-01-28T05:40:35.072Z", "name": "temp5", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/27.jpg", "email": "temp5@gmail.com", "password": "123123", "parentId": "10", "bio": "DirectsdfsdfsdfsdasdaS", "permissions": { "createUser": true, "createTask": true, "editTask": true, "deleteTask": true }, "id": "11", "phone": "sfasfsafsdfsd", "region": "fsdfsdfsdfsdfsd" },
// // // // // //     { "createdAt": "2026-01-28T05:41:35.706Z", "name": "sdasd", "avatar": "https://avatars.githubusercontent.com/u/87311756", "email": "dasdas@gmail.com", "password": "123123", "parentId": "10", "bio": "Legacy", "permissions": { "createUser": true, "createTask": true, "editTask": true, "deleteTask": true }, "id": "12" },
// // // // // //     { "createdAt": "2026-01-30T09:32:52.589Z", "name": "sadaSD", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/7.jpg", "email": "tDASDest@example.com", "password": "password123A@", "parentId": "10", "bio": "Forward", "permissions": { "createUser": true, "createTask": false, "editTask": false, "deleteTask": false }, "id": "13" },
// // // // // //     { "createdAt": "2026-01-30T10:47:58.660Z", "name": "dasdasd", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/35.jpg", "email": "test10@example.com", "password": "password123A@", "parentId": "10", "bio": "Human", "permissions": { "createUser": true, "createTask": false, "editTask": false, "deleteTask": false }, "id": "14" },
// // // // // //     { "createdAt": "2026-02-02T06:24:48.098Z", "name": "Test Parent", "avatar": "https://avatars.githubusercontent.com/u/54418214", "email": "parent1@gmail.com", "password": "password123A@", "parentId": null, "bio": "bio", "permissions": { "createTask": true, "editTask": true, "deleteTask": true, "createUser": true }, "id": "15" },
// // // // // //     { "createdAt": "2026-02-02T06:31:54.521Z", "name": "Child of parent1", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/81.jpg", "email": "cp1@gmail.com", "password": "password123A@", "parentId": "15", "bio": "Product", "permissions": { "createUser": false, "createTask": true, "editTask": false, "deleteTask": false }, "id": "16" },
// // // // // //     { "createdAt": "2026-02-02T06:34:19.739Z", "name": "Child 2 of parent1", "avatar": "https://avatars.githubusercontent.com/u/84365035", "email": "cp2@gmail.com", "password": "password123A@", "parentId": "15", "bio": "Internal", "permissions": { "createUser": false, "createTask": false, "editTask": true, "deleteTask": false }, "id": "17" },
// // // // // //     { "createdAt": "2026-02-02T07:49:19.581Z", "name": "paraent 2 ", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/39.jpg", "email": "paranet2@gmail.com", "password": "pawword123A@", "parentId": null, "bio": "bio", "permissions": { "createTask": true, "editTask": true, "deleteTask": true, "createUser": true }, "id": "18" },
// // // // // //     { "createdAt": "2026-02-02T07:51:43.217Z", "name": "child of parent 2", "avatar": "https://avatars.githubusercontent.com/u/41862421", "email": "cp2@gmail.com", "password": "password123A@", "parentId": "18", "bio": "Regional", "permissions": { "createUser": false, "createTask": true, "editTask": false, "deleteTask": false }, "id": "19" },
// // // // // //     { "createdAt": "2026-02-02T12:01:37.139Z", "name": "parent test final update ", "avatar": "https://avatars.githubusercontent.com/u/28924665", "email": "parentfinal@gmail.com", "password": "password456A@", "parentId": null, "bio": "bio", "permissions": { "createTask": true, "editTask": true, "deleteTask": true, "createUser": true }, "id": "20", "phone": "123456789", "region": "India" },
// // // // // //     { "createdAt": "2026-02-02T12:03:49.431Z", "name": "final user of parent", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/47.jpg", "email": "pc5@gmail.com", "password": "password123A@", "parentId": "20", "bio": "Legacy", "permissions": { "createUser": true, "createTask": false, "editTask": true, "deleteTask": true }, "id": "21", "phone": "", "region": "India" },
// // // // // //     { "createdAt": "2026-02-03T12:31:36.141Z", "name": "Sahil Belim", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/32.jpg", "email": "sahil@gmail.com", "password": "Sahil@123", "parentId": null, "bio": "hfhfh", "permissions": { "createTask": true, "editTask": true, "deleteTask": true, "createUser": true }, "id": "22", "phone": "ssadasdasd", "region": "Lesotho" },
// // // // // //     { "createdAt": "2026-02-03T12:35:06.202Z", "name": "Child User", "avatar": "https://avatars.githubusercontent.com/u/93651881", "email": "child@gmail.com", "password": "Child@123", "parentId": "22", "bio": "Internal", "permissions": { "createUser": false, "createTask": true, "editTask": false, "deleteTask": true }, "id": "23" },
// // // // // //     { "createdAt": "2026-02-03T13:07:15.509Z", "name": "Second Child", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/87.jpg", "email": "childsecond@gmail.com", "password": "Child@123", "parentId": "22", "bio": "Future", "permissions": { "createUser": true, "createTask": true, "editTask": false, "deleteTask": true }, "id": "24" },
// // // // // //     { "createdAt": "2026-02-03T13:31:57.302Z", "name": "third child", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/87.jpg", "email": "childthird@gmail.com", "password": "Child@123", "parentId": "22", "bio": "Forward", "permissions": { "createUser": true, "createTask": true, "editTask": true, "deleteTask": true }, "id": "25" },
// // // // // //     { "createdAt": "2026-02-05T10:18:24.417Z", "name": "New", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/12.jpg", "email": "New@gmail.com", "password": "password123A@", "parentId": "20", "bio": "Regional", "permissions": { "createUser": true, "createTask": true, "editTask": false, "deleteTask": false }, "id": "26" },
// // // // // //     { "createdAt": "2026-02-12T07:14:20.021Z", "name": "sadsdff", "avatar": "https://avatars.githubusercontent.com/u/25765726", "email": "testsfasfd@example.com", "password": "password123@A", "parentId": "20", "bio": "National", "permissions": { "createUser": true, "createTask": true, "editTask": false, "deleteTask": false }, "id": "27" },
// // // // // //     { "createdAt": "2026-02-13T06:17:28.033Z", "name": "testinuser", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/99.jpg", "email": "testinguser@gmail.com", "password": "password456A@", "parentId": null, "bio": "bio", "permissions": { "createTask": true, "editTask": true, "deleteTask": true, "createUser": true }, "id": "28", "phone": "", "region": "India" },
// // // // // //     { "createdAt": "2026-02-13T06:47:34.937Z", "name": "Modi", "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/44.jpg", "email": "modi@gmail.com", "password": "Modi@123", "parentId": null, "bio": "bio", "permissions": { "createTask": true, "editTask": true, "deleteTask": true, "createUser": true }, "id": "29" }
// // // // // //   ];

// // // // // //   tasks: any[] = [
// // // // // //     { "createdAt": "2026-01-18T08:41:51.681Z", "title": "title 1", "description": "description 1", "status": "status 1", "priority": "priority 1", "dueDate": "dueDate 1", "parentId": "parentId 1", "assignedTo": [], "createdBy": "createdBy 1", "id": "1" },
// // // // // //     { "createdAt": "2026-01-18T15:27:21.242Z", "title": "title 2", "description": "description 2", "status": "status 2", "priority": "priority 2", "dueDate": "dueDate 2", "parentId": "parentId 2", "assignedTo": [], "createdBy": "createdBy 2", "id": "2" },
// // // // // //     { "createdAt": "2026-01-18T10:04:04.144Z", "title": "title 3", "description": "description 3", "status": "status 3", "priority": "priority 3", "dueDate": "dueDate 3", "parentId": "parentId 3", "assignedTo": [], "createdBy": "createdBy 3", "id": "3" },
// // // // // //     { "createdAt": "2026-01-18T14:40:10.244Z", "title": "Prepare Report", "description": "Finance report", "status": "pending", "priority": "high", "dueDate": "2026-02-01", "parentId": "1", "assignedTo": ["2"], "createdBy": "1", "id": "4" },
// // // // // //     { "createdAt": "2026-01-19T12:49:35.743Z", "title": "sadasd", "description": "description 9", "status": "pending", "priority": "low", "dueDate": "2026-01-02", "parentId": "3", "assignedTo": ["5", "7"], "createdBy": "11", "id": "9", "assignedUsers": ["5", "7"] },
// // // // // //     { "createdAt": "2026-01-20T06:22:08.538Z", "title": "fsdfsd", "description": "description 10", "status": "pending", "priority": "high", "dueDate": "2026-01-14", "parentId": "11", "assignedTo": ["12"], "createdBy": "11", "id": "10", "assignedUsers": ["12"] },
// // // // // //     { "createdAt": "2026-01-20T06:29:05.064Z", "title": "dasd", "description": "description 11", "status": "in-progress", "priority": "high", "dueDate": "2026-01-07", "parentId": "11", "assignedTo": ["12"], "createdBy": "11", "id": "11", "assignedUsers": ["12"] },
// // // // // //     { "createdAt": "2026-01-20T06:30:56.861Z", "title": "sdasd", "description": "description 13", "status": "in-progress", "priority": "low", "dueDate": "2026-01-08", "parentId": "11", "assignedTo": ["12"], "createdBy": "11", "id": "13", "assignedUsers": ["12"] },
// // // // // //     { "createdAt": "2026-01-20T06:47:48.746Z", "title": "dgdfg", "description": "description 14", "status": "pending", "priority": "high", "dueDate": "2026-01-08", "parentId": "3", "assignedTo": ["11"], "createdBy": "11", "id": "14", "assignedUsers": ["11"] },
// // // // // //     { "createdAt": "2026-01-20T08:13:59.139Z", "title": "sdsaffds", "description": "description 19", "status": "pending", "priority": "high", "dueDate": "2026-01-01", "parentId": "3", "assignedTo": ["11", "12"], "createdBy": "11", "id": "19", "assignedUsers": ["11", "12"] },
// // // // // //     { "createdAt": "2026-01-20T08:14:13.004Z", "title": "sdfsd", "description": "description 20", "status": "completed", "priority": "medium", "dueDate": "2026-01-01", "parentId": "3", "assignedTo": [], "createdBy": "11", "id": "20", "assignedUsers": [] },
// // // // // //     { "createdAt": "2026-01-20T12:25:09.151Z", "title": "sdasda", "description": "description 21", "status": "pending", "priority": "low", "dueDate": "2026-01-21", "parentId": "3", "assignedTo": ["11"], "createdBy": "11", "id": "21", "assignedUsers": ["11"] },
// // // // // //     { "createdAt": "2026-01-24T08:29:27.593Z", "title": "Task 1  ", "description": "description 22", "status": "in-progress", "priority": "medium", "dueDate": "2026-01-14", "parentId": "3", "assignedTo": [], "createdBy": "10", "id": "22", "assignedUsers": ["10", "13"], "order_id": 2 },
// // // // // //     { "createdAt": "2026-01-24T09:37:07.995Z", "title": "Task 2", "description": "description 23", "status": "pending", "priority": "low", "dueDate": "2026-01-08", "parentId": "3", "assignedTo": [], "createdBy": "10", "id": "23", "assignedUsers": ["11"], "order_id": 3 },
// // // // // //     { "createdAt": "2026-01-24T09:37:50.286Z", "title": "Task 4", "description": "description 25", "status": "pending", "priority": "low", "dueDate": "2026-01-14", "parentId": "3", "assignedTo": [], "createdBy": "10", "id": "25", "assignedUsers": ["11", "10", "13"], "order_id": 0 },
// // // // // //     { "createdAt": "2026-01-24T09:38:12.485Z", "title": "Task 5", "description": "description 26", "status": "completed", "priority": "medium", "dueDate": "2026-01-15", "parentId": "3", "assignedTo": [], "createdBy": "10", "id": "26", "assignedUsers": ["10"], "order_id": 1 },
// // // // // //     { "createdAt": "2026-01-24T11:03:17.778Z", "title": "test 6", "description": "description 27", "status": "in-progress", "priority": "low", "dueDate": "2026-01-29", "parentId": "3", "assignedTo": [], "createdBy": "10", "id": "27", "assignedUsers": ["10"], "order_id": 4 },
// // // // // //     { "createdAt": "2026-02-02T06:35:55.829Z", "title": "child 1 task", "description": "description 28", "status": "in-progress", "priority": "medium", "dueDate": "2026-02-02", "parentId": "15", "assignedTo": [], "createdBy": "16", "id": "28", "assignedUsers": ["16", "17"], "order_id": 0 },
// // // // // //     { "createdAt": "2026-02-02T11:13:56.565Z", "title": "dasdASD", "description": "description 29", "status": "pending", "priority": "low", "dueDate": "2026-02-05", "parentId": "18", "assignedTo": [], "createdBy": "18", "id": "29", "assignedUsers": [], "order_id": 1770030836565 },
// // // // // //     { "createdAt": "2026-02-02T11:14:42.728Z", "title": "dasdas", "description": "description 30", "status": "pending", "priority": "medium", "dueDate": "2026-02-06", "parentId": "18", "assignedTo": [], "createdBy": "18", "id": "30", "assignedUsers": ["19"], "order_id": 1770030882728 },
// // // // // //     { "createdAt": "2026-02-03T12:33:23.451Z", "title": "My First Task", "description": "description 33", "status": "completed", "priority": "high", "dueDate": "2026-02-01", "parentId": "22", "assignedTo": [], "createdBy": "22", "id": "33", "assignedUsers": [], "order_id": 0 },
// // // // // //     { "createdAt": "2026-02-03T13:06:15.041Z", "title": "one two three", "description": "description 34", "status": "completed", "priority": "medium", "dueDate": "2026-02-01", "parentId": "22", "assignedTo": [], "createdBy": "22", "id": "34", "assignedUsers": ["22", "23", "24", "25"], "order_id": 3 },
// // // // // //     { "createdAt": "2026-02-04T08:24:38.460Z", "title": "New Task", "description": "description 37", "status": "pending", "priority": "medium", "dueDate": null, "parentId": "22", "assignedTo": [], "createdBy": "22", "id": "37", "assignedUsers": [], "order_id": 2 },
// // // // // //     { "createdAt": "2026-02-04T08:24:47.403Z", "title": "Yes", "description": "description 38", "status": "in-progress", "priority": "medium", "dueDate": null, "parentId": "22", "assignedTo": [], "createdBy": "22", "id": "38", "assignedUsers": [], "order_id": 0 },
// // // // // //     { "createdAt": "2026-02-04T08:26:54.795Z", "title": "sad", "description": "description 39", "status": "in-progress", "priority": "medium", "dueDate": "2000-12-31", "parentId": "22", "assignedTo": [], "createdBy": "22", "id": "39", "assignedUsers": [], "order_id": 1 },
// // // // // //     { "createdAt": "2026-02-04T08:35:06.640Z", "title": "Hello", "description": "description 40", "status": "completed", "priority": "medium", "dueDate": "-000001-12-31", "parentId": "22", "assignedTo": [], "createdBy": "22", "id": "40", "assignedUsers": ["22"], "order_id": 1 },
// // // // // //     { "createdAt": "2026-02-05T05:58:21.440Z", "title": "Add active link in navbar", "description": "description 43", "status": "pending", "priority": "medium", "dueDate": "2026-02-11", "parentId": "20", "assignedTo": [], "createdBy": "20", "id": "43", "assignedUsers": ["20"], "order_id": 0 },
// // // // // //     { "createdAt": "2026-02-05T10:15:26.385Z", "title": "Add charts in dashboard ", "description": "description 44", "status": "completed", "priority": "low", "dueDate": "2026-02-05", "parentId": "20", "assignedTo": [], "createdBy": "20", "id": "44", "assignedUsers": ["21", "20"], "order_id": 2 },
// // // // // //     { "createdAt": "2026-02-05T11:39:56.087Z", "title": "Fix date-range picker ", "description": "description 45", "status": "in-progress", "priority": "medium", "dueDate": "2026-02-10", "parentId": "20", "assignedTo": [], "createdBy": "20", "id": "45", "assignedUsers": ["21", "20", "26"], "order_id": 3 },
// // // // // //     { "createdAt": "2026-02-05T13:38:49.498Z", "title": "Add custom scroll bar", "description": "description 46", "status": "pending", "priority": "low", "dueDate": "2026-02-05", "parentId": "20", "assignedTo": [], "createdBy": "20", "id": "46", "assignedUsers": ["26"], "order_id": 3 },
// // // // // //     { "createdAt": "2026-02-05T13:39:33.701Z", "title": "Make profile page responsive  edited", "description": "description 47", "status": "pending", "priority": "medium", "dueDate": "2026-02-09", "parentId": "20", "assignedTo": [], "createdBy": "20", "id": "47", "assignedUsers": ["20"], "order_id": 1 },
// // // // // //     { "createdAt": "2026-02-05T13:47:33.374Z", "title": "Add drag and drop functionality ", "description": "description 48", "status": "in-progress", "priority": "medium", "dueDate": "2026-02-05", "parentId": "20", "assignedTo": [], "createdBy": "20", "id": "48", "assignedUsers": ["20"], "order_id": 4 },
// // // // // //     { "createdAt": "2026-02-05T13:51:26.795Z", "title": "Add filters", "description": "description 49", "status": "completed", "priority": "high", "dueDate": "2026-02-13", "parentId": "20", "assignedTo": [], "createdBy": "20", "id": "49", "assignedUsers": ["20"], "order_id": 4 },
// // // // // //     { "createdAt": "2026-02-13T07:14:20.669Z", "title": "sfsadfa", "description": "description 50", "status": "pending", "priority": "medium", "dueDate": "2026-02-19", "parentId": "28", "assignedTo": [], "createdBy": "28", "id": "50", "assignedUsers": [], "order_id": 1770966860669 }
// // // // // //   ];

// // // // // //   // ====== Chart refs ======
// // // // // //   @ViewChild('permCanvas') permCanvas!: ElementRef<HTMLCanvasElement>;
// // // // // //   @ViewChild('parentCanvas') parentCanvas!: ElementRef<HTMLCanvasElement>;
// // // // // //   @ViewChild('timelineCanvas') timelineCanvas!: ElementRef<HTMLCanvasElement>;
// // // // // //   @ViewChild('bubbleCanvas') bubbleCanvas!: ElementRef<HTMLCanvasElement>;
// // // // // //   @ViewChild('stackCanvas') stackCanvas!: ElementRef<HTMLCanvasElement>;

// // // // // //   permChart!: Chart | null;
// // // // // //   parentChart!: Chart | null;
// // // // // //   timelineChart!: Chart | null;
// // // // // //   bubbleChart!: Chart | null;
// // // // // //   stackChart!: Chart | null;

// // // // // //   // state for interactions/filters
// // // // // //   permSelected: string | null = null;
// // // // // //   usersWithSelectedPerm: any[] = [];
// // // // // //   parents: any[] = [];
// // // // // //   selectedParent: any | null = null;
// // // // // //   childrenOfSelectedParent: any[] = [];
// // // // // //   rangeDays: number | null = 30;
// // // // // //   cumulativeMode = false;
// // // // // //   selectedDayTasks: any[] = [];
// // // // // //   selectedDayLabel = '';
// // // // // //   stackGroup: 'status' | 'priority' = 'status';
// // // // // //   stackPercent = false;

// // // // // //   // computed helper caches
// // // // // //   private startDate!: Date;
// // // // // //   private dateList: string[] = [];

// // // // // //   constructor() { }

// // // // // //   ngAfterViewInit(): void {
// // // // // //     // compute parent list (unique parent users)
// // // // // //     this.parents = this.users.filter(u => !u.parentId);
// // // // // //     // compute start date for timeline / bubble
// // // // // //     this.computeDateRangeFromTasks();
// // // // // //     // create all charts
// // // // // //     this.initPermChart();
// // // // // //     this.initParentChart();
// // // // // //     this.initTimelineChart();
// // // // // //     this.initBubbleChart();
// // // // // //     this.initStackChart();
// // // // // //   }

// // // // // //   ngOnDestroy(): void {
// // // // // //     [this.permChart, this.parentChart, this.timelineChart, this.bubbleChart, this.stackChart].forEach(c => {
// // // // // //       try { c?.destroy(); } catch (e) { }
// // // // // //     });
// // // // // //   }

// // // // // //   // --------------------------
// // // // // //   // Utility: compute date list covering tasks range
// // // // // //   // --------------------------
// // // // // //   computeDateRangeFromTasks() {
// // // // // //     const dates = this.tasks.map(t => new Date(t.createdAt));
// // // // // //     if (!dates.length) { this.startDate = new Date(); this.dateList = [this.formatDate(new Date())]; return; }
// // // // // //     const min = new Date(Math.min(...dates.map(d => d.getTime())));
// // // // // //     const max = new Date(Math.max(...dates.map(d => d.getTime())));
// // // // // //     // expand a little
// // // // // //     this.startDate = new Date(min);
// // // // // //     this.startDate.setHours(0, 0, 0, 0);
// // // // // //     const days = Math.ceil((max.getTime() - this.startDate.getTime()) / (24 * 3600 * 1000)) + 1;
// // // // // //     this.dateList = [];
// // // // // //     for (let i = 0; i < days; i++) {
// // // // // //       const d = new Date(this.startDate.getTime() + i * 24 * 3600 * 1000);
// // // // // //       this.dateList.push(this.formatDate(d));
// // // // // //     }
// // // // // //   }

// // // // // //   formatDate(d: Date) {
// // // // // //     return d.toISOString().slice(0, 10);
// // // // // //   }

// // // // // //   // --------------------------
// // // // // //   // Chart 1: Permissions Concentric Doughnut
// // // // // //   // --------------------------
// // // // // //   initPermChart() {
// // // // // //     const canvas = this.permCanvas.nativeElement;
// // // // // //     const ctx = canvas.getContext('2d')!;
// // // // // //     // inner ring: user types
// // // // // //     const parentsCount = this.users.filter(u => !u.parentId).length;
// // // // // //     const childCount = this.users.filter(u => u.parentId).length;
// // // // // //     const orphanCount = this.users.length - (parentsCount + childCount);
// // // // // //     const innerData = [parentsCount, childCount, orphanCount];
// // // // // //     const innerLabels = ['parents', 'children', 'orphan'];
// // // // // //     // outer ring: permission counts
// // // // // //     const createTask = this.users.filter(u => u.permissions?.createTask).length;
// // // // // //     const editTask = this.users.filter(u => u.permissions?.editTask).length;
// // // // // //     const deleteTask = this.users.filter(u => u.permissions?.deleteTask).length;
// // // // // //     const createUser = this.users.filter(u => u.permissions?.createUser).length;
// // // // // //     const outerData = [createTask, editTask, deleteTask, createUser];
// // // // // //     const outerLabels = ['createTask', 'editTask', 'deleteTask', 'createUser'];

// // // // // //     const data: ChartData<'doughnut'> = {
// // // // // //       labels: [...innerLabels, ...outerLabels],
// // // // // //       datasets: [
// // // // // //         { // inner ring
// // // // // //           label: 'user type',
// // // // // //           data: innerData,
// // // // // //           backgroundColor: ['#6366F1', '#60A5FA', '#F97316'],
// // // // // //           hoverOffset: 6
// // // // // //         },
// // // // // //         { // outer ring
// // // // // //           label: 'permissions',
// // // // // //           data: outerData,
// // // // // //           backgroundColor: ['#EF4444', '#10B981', '#F59E0B', '#8B5CF6'],
// // // // // //           hoverOffset: 8
// // // // // //         }
// // // // // //       ]
// // // // // //     };

// // // // // //     this.permChart = new Chart(ctx, {
// // // // // //       type: 'doughnut',
// // // // // //       data,
// // // // // //       options: {
// // // // // //         responsive: true,
// // // // // //         cutout: '40%',
// // // // // //         plugins: {
// // // // // //           legend: { position: 'bottom', labels: { boxWidth: 12 } },
// // // // // //           tooltip: {
// // // // // //             callbacks: {
// // // // // //               label: (ctx) => {
// // // // // //                 const label = ctx.label || '';
// // // // // //                 const value = ctx.parsed;
// // // // // //                 return `${label}: ${value}`;
// // // // // //               }
// // // // // //             }
// // // // // //           }
// // // // // //         },
// // // // // //         onClick: (evt: ChartEvent, elements) => {
// // // // // //           if (!elements.length) return;
// // // // // //           const el = elements[0];
// // // // // //           const datasetIndex = el.datasetIndex;
// // // // // //           const idx = el.index;
// // // // // //           // if outer ring clicked -> select permission
// // // // // //           if (datasetIndex === 1) {
// // // // // //             const permission = outerLabels[idx];
// // // // // //             this.selectPermission(permission);
// // // // // //           } else {
// // // // // //             // clicking inner ring resets permission selection
// // // // // //             this.clearPermissionSelection();
// // // // // //           }
// // // // // //         }
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   selectPermission(perm: string) {
// // // // // //     this.permSelected = perm;
// // // // // //     this.usersWithSelectedPerm = this.users.filter(u => u.permissions && u.permissions[perm]);
// // // // // //     // apply filter to other charts (for demo we'll just highlight stack chart)
// // // // // //     this.updateAllCharts();
// // // // // //   }

// // // // // //   clearPermissionSelection() {
// // // // // //     this.permSelected = null;
// // // // // //     this.usersWithSelectedPerm = [];
// // // // // //     this.updateAllCharts();
// // // // // //   }

// // // // // //   // --------------------------
// // // // // //   // Chart 2: Parent -> Children (Polar Area)
// // // // // //   // --------------------------
// // // // // //   initParentChart() {
// // // // // //     const canvas = this.parentCanvas.nativeElement;
// // // // // //     const ctx = canvas.getContext('2d')!;
// // // // // //     const parentUsers = this.users.filter(u => !u.parentId);
// // // // // //     const labels = parentUsers.map(p => p.name);
// // // // // //     const dataCounts = parentUsers.map(p => this.users.filter(u => u.parentId === p.id).length);
// // // // // //     const colors = labels.map((_, i) => this.hsl(i * 40, 70, 60));
// // // // // //     const data: ChartData<'polarArea'> = {
// // // // // //       labels,
// // // // // //       datasets: [{ data: dataCounts, backgroundColor: colors, label: 'children count' }]
// // // // // //     };
// // // // // //     this.parentChart = new Chart(ctx, {
// // // // // //       type: 'polarArea',
// // // // // //       data,
// // // // // //       options: {
// // // // // //         responsive: true,
// // // // // //         plugins: {
// // // // // //           legend: { position: 'right' },
// // // // // //           tooltip: {
// // // // // //             callbacks: {
// // // // // //               label: (ctx) => {
// // // // // //                 const label = ctx.label || '';
// // // // // //                 const value = ctx.parsed;
// // // // // //                 const parent = parentUsers[ctx.dataIndex];
// // // // // //                 const children = this.users.filter(u => u.parentId === parent.id).map(u => u.name).join(', ') || '—';
// // // // // //                 return `${label}: ${value} child(ren) — ${children}`;
// // // // // //               }
// // // // // //             }
// // // // // //           }
// // // // // //         },
// // // // // //         onClick: (evt, elems) => {
// // // // // //           if (!elems.length) { this.selectedParent = null; this.childrenOfSelectedParent = []; return; }
// // // // // //           const idx = elems[0].index!;
// // // // // //           const parent = parentUsers[idx];
// // // // // //           this.selectedParent = parent;
// // // // // //           this.childrenOfSelectedParent = this.users.filter(u => u.parentId === parent.id);
// // // // // //           // filter timeline/bubble to tasks created by this parent's children + parent
// // // // // //           this.updateAllCharts();
// // // // // //         }
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   // hsl helper
// // // // // //   hsl(h: number, s: number, l: number) {
// // // // // //     return `hsl(${h} ${s}% ${l}%)`;
// // // // // //   }

// // // // // //   // --------------------------
// // // // // //   // Chart 3: Timeline Stream (Area)
// // // // // //   // --------------------------
// // // // // //   initTimelineChart() {
// // // // // //     const canvas = this.timelineCanvas.nativeElement;
// // // // // //     const ctx = canvas.getContext('2d')!;
// // // // // //     const labels = this.dateList;
// // // // // //     const createdCounts = labels.map(d => this.tasks.filter(t => this.formatDate(new Date(t.createdAt)) === d).length);
// // // // // //     const completedCounts = labels.map(d => this.tasks.filter(t => (t.status === 'completed') && this.formatDate(new Date(t.createdAt)) === d).length);
// // // // // //     const data: ChartData<'line'> = {
// // // // // //       labels,
// // // // // //       datasets: [
// // // // // //         { label: 'Created', data: createdCounts, fill: true, tension: 0.3, borderColor: '#ef4444', backgroundColor: this.gradient(ctx, '#ef4444'), pointRadius: 2 },
// // // // // //         { label: 'Completed', data: completedCounts, fill: true, tension: 0.3, borderColor: '#10b981', backgroundColor: this.gradient(ctx, '#10b981'), pointRadius: 2 }
// // // // // //       ]
// // // // // //     };
// // // // // //     this.timelineChart = new Chart(ctx, {
// // // // // //       type: 'line',
// // // // // //       data,
// // // // // //       options: {
// // // // // //         responsive: true,
// // // // // //         interaction: { mode: 'index', intersect: false },
// // // // // //         plugins: {
// // // // // //           legend: { position: 'top' },
// // // // // //           tooltip: {
// // // // // //             callbacks: {
// // // // // //               title: (ctx) => ctx[0].label,
// // // // // //               label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`
// // // // // //             }
// // // // // //           }
// // // // // //         }
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   // make a vertical gradient
// // // // // //   gradient(ctx: CanvasRenderingContext2D, hex: string) {
// // // // // //     const g = ctx.createLinearGradient(0, 0, 0, 300);
// // // // // //     g.addColorStop(0, this.hexToRgba(hex, 0.28));
// // // // // //     g.addColorStop(1, this.hexToRgba(hex, 0.02));
// // // // // //     return g;
// // // // // //   }
// // // // // //   hexToRgba(hex: string, a: number) {
// // // // // //     // hex like #ef4444
// // // // // //     const c = hex.substring(1);
// // // // // //     const bigint = parseInt(c, 16);
// // // // // //     const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
// // // // // //     return `rgba(${r},${g},${b},${a})`;
// // // // // //   }

// // // // // //   toggleCumulative(ev: any) {
// // // // // //     this.cumulativeMode = !!ev.target.checked;
// // // // // //     if (!this.timelineChart) return;
// // // // // //     const ds = this.timelineChart.data.datasets!;
// // // // // //     if (this.cumulativeMode) {
// // // // // //       // make cumulative arrays
// // // // // //       ds.forEach((d: any) => {
// // // // // //         let sum = 0;
// // // // // //         d._orig = d.data.slice();
// // // // // //         d.data = d._orig.map((v: number) => sum += v);
// // // // // //       });
// // // // // //     } else {
// // // // // //       // restore
// // // // // //       ds.forEach((d: any) => {
// // // // // //         if (d._orig) { d.data = d._orig; delete d._orig; }
// // // // // //       });
// // // // // //     }
// // // // // //     this.timelineChart.update();
// // // // // //   }

// // // // // //   // --------------------------
// // // // // //   // Chart 4: Bubble "heatmap" calendar
// // // // // //   // --------------------------
// // // // // //   initBubbleChart() {
// // // // // //     const canvas = this.bubbleCanvas.nativeElement;
// // // // // //     const ctx = canvas.getContext('2d')!;
// // // // // //     // prepare bubble points: x=weekday (0..6), y=weekIndex, r=size
// // // // // //     const map = new Map<string, any[]>();
// // // // // //     const start = this.startDate;
// // // // // //     this.tasks.forEach(t => {
// // // // // //       const d = new Date(t.createdAt);
// // // // // //       const dayIdx = d.getDay(); // 0-Sun
// // // // // //       const weekIdx = Math.floor(((d.getTime() - start.getTime()) / (24 * 3600 * 1000)) / 7);
// // // // // //       const key = `${weekIdx}-${dayIdx}`;
// // // // // //       if (!map.has(key)) map.set(key, []);
// // // // // //       map.get(key)!.push(t);
// // // // // //     });
// // // // // //     const points: any[] = [];
// // // // // //     map.forEach((arr, key) => {
// // // // // //       const [w, day] = key.split('-').map(Number);
// // // // // //       points.push({ x: day, y: w, r: Math.min(30, Math.max(4, arr.length * 4)), tasks: arr });
// // // // // //     });
// // // // // //     this.bubbleChart = new Chart(ctx, {
// // // // // //       type: 'bubble',
// // // // // //       data: {
// // // // // //         datasets: [{
// // // // // //           label: 'tasks',
// // // // // //           data: points,
// // // // // //           backgroundColor: points.map((_, i) => this.hsl(i * 40, 70, 60)),
// // // // // //         }]
// // // // // //       },
// // // // // //       options: {
// // // // // //         responsive: true,
// // // // // //         scales: {
// // // // // //           x: {
// // // // // //             title: { display: true, text: 'Weekday (0 Sun → 6 Sat)' },
// // // // // //             ticks: { stepSize: 1 }
// // // // // //           },
// // // // // //           y: {
// // // // // //             title: { display: true, text: 'Week index' }
// // // // // //           }
// // // // // //         },
// // // // // //         plugins: {
// // // // // //           tooltip: {
// // // // // //             callbacks: {
// // // // // //               label: (ctx) => {
// // // // // //                 const p: any = ctx.raw;
// // // // // //                 const day = ctx.label || '';
// // // // // //                 return `${p.tasks.length} task(s) — click to view`;
// // // // // //               }
// // // // // //             }
// // // // // //           }
// // // // // //         },
// // // // // //         onClick: (evt, elements) => {
// // // // // //           if (!elements.length) { this.selectedDayTasks = []; this.selectedDayLabel = ''; return; }
// // // // // //           const el = elements[0];
// // // // // //           const p: any = this.bubbleChart!.data.datasets![el.datasetIndex].data[el.index];
// // // // // //           this.selectedDayTasks = p.tasks;
// // // // // //           this.selectedDayLabel = `Week ${p.y}, Day ${p.x}`;
// // // // // //         }
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   // --------------------------
// // // // // //   // Chart 5: Interactive stacked bar (group by status/priority)
// // // // // //   // --------------------------
// // // // // //   initStackChart() {
// // // // // //     const canvas = this.stackCanvas.nativeElement;
// // // // // //     const ctx = canvas.getContext('2d')!;
// // // // // //     // initial render grouping by status
// // // // // //     this.renderStackChart();
// // // // // //   }

// // // // // //   setStackGroup(g: 'status' | 'priority') {
// // // // // //     this.stackGroup = g;
// // // // // //     this.renderStackChart();
// // // // // //   }
// // // // // //   togglePercent() {
// // // // // //     this.stackPercent = !this.stackPercent;
// // // // // //     this.renderStackChart();
// // // // // //   }

// // // // // //   renderStackChart() {
// // // // // //     // build groups and series
// // // // // //     const groupKey = this.stackGroup;
// // // // // //     const groups = Array.from(new Set(this.tasks.map(t => t[groupKey] || 'undefined')));
// // // // // //     // build series of assigned counts per group subcategory (i.e., statuses within priority or vice versa)
// // // // // //     // For simplicity: when grouping by 'status' we show series = priorities (low/medium/high/other)
// // // // // //     const seriesKeys = groupKey === 'status' ? Array.from(new Set(this.tasks.map(t => t.priority || 'other'))) : Array.from(new Set(this.tasks.map(t => t.status || 'other')));
// // // // // //     const datasets = seriesKeys.map((sk, i) => {
// // // // // //       const data = groups.map(g => this.tasks.filter(t => (t[groupKey] || '') === g && ((groupKey === 'status') ? (t.priority || 'other') === sk : (t.status || 'other') === sk).valueOf()).length);
// // // // // //       return {
// // // // // //         label: sk,
// // // // // //         data,
// // // // // //         backgroundColor: this.hsl(i * 60, 60, 60)
// // // // // //       };
// // // // // //     });
// // // // // //     const config: ChartConfiguration<'bar'> = {
// // // // // //       type: 'bar',
// // // // // //       data: { labels: groups, datasets },
// // // // // //       options: {
// // // // // //         indexAxis: 'y',
// // // // // //         responsive: true,
// // // // // //         scales: {
// // // // // //           x: { stacked: true, ticks: { beginAtZero: true, callback: (v: any) => this.stackPercent ? `${Math.round(v)}%` : v } },
// // // // // //           y: { stacked: true }
// // // // // //         },
// // // // // //         plugins: {
// // // // // //           tooltip: {
// // // // // //             callbacks: {
// // // // // //               label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.x}`
// // // // // //             }
// // // // // //           },
// // // // // //           legend: { position: 'top' }
// // // // // //         }
// // // // // //       }
// // // // // //     };
// // // // // //     // if percent mode: transform data to percent
// // // // // //     if (this.stackPercent) {
// // // // // //       // compute totals per label
// // // // // //       const totals = groups.map((g, idx) => datasets.reduce((s, ds) => s + (ds.data[idx] || 0), 0));
// // // // // //       datasets.forEach(ds => {
// // // // // //         ds.data = ds.data.map((v: any, idx: number) => totals[idx] ? Math.round((v / totals[idx]) * 100) : 0);
// // // // // //       });
// // // // // //       config.options!.scales!.x!.ticks!.callback = (v: any) => `${v}%`;
// // // // // //     }
// // // // // //     if (this.stackChart) { this.stackChart.destroy(); this.stackChart = null; }
// // // // // //     this.stackChart = new Chart(ctx, config);
// // // // // //   }

// // // // // //   // --------------------------
// // // // // //   // Shared updates on filters
// // // // // //   // --------------------------
// // // // // //   updateAllCharts() {
// // // // // //     // Example: when permSelected is active, we dim timeline data not created by those users.
// // // // // //     // For demo we simply re-render timeline by limiting tasks to those created by selected users (if any) or selectedParent selection.
// // // // // //     // Build filtered tasks set:
// // // // // //     let filteredTasks = this.tasks.slice();
// // // // // //     if (this.permSelected) {
// // // // // //       const userIds = this.usersWithSelectedPerm.map(u => u.id);
// // // // // //       filteredTasks = filteredTasks.filter(t => userIds.includes(t.createdBy) || (t.assignedTo && t.assignedTo.some((a: any) => userIds.includes(a))));
// // // // // //     }
// // // // // //     if (this.selectedParent) {
// // // // // //       const subtree = [this.selectedParent.id, ...this.users.filter(u => u.parentId === this.selectedParent.id).map(u => u.id)];
// // // // // //       filteredTasks = filteredTasks.filter(t => subtree.includes(t.createdBy) || (t.assignedTo && t.assignedTo.some((a: any) => subtree.includes(a))));
// // // // // //     }
// // // // // //     // re-render timeline/bubble/stack using filteredTasks
// // // // // //     // timeline
// // // // // //     if (this.timelineChart) {
// // // // // //       const labels = this.dateList;
// // // // // //       const createdCounts = labels.map(d => filteredTasks.filter(t => this.formatDate(new Date(t.createdAt)) === d).length);
// // // // // //       const completedCounts = labels.map(d => filteredTasks.filter(t => (t.status === 'completed') && this.formatDate(new Date(t.createdAt)) === d).length);
// // // // // //       (this.timelineChart.data.datasets![0].data as any[]) = this.cumulativeMode ? this.toCumulative(createdCounts) : createdCounts;
// // // // // //       (this.timelineChart.data.datasets![1].data as any[]) = this.cumulativeMode ? this.toCumulative(completedCounts) : completedCounts;
// // // // // //       this.timelineChart.update();
// // // // // //     }
// // // // // //     // bubble
// // // // // //     if (this.bubbleChart) {
// // // // // //       // rebuild points quickly
// // // // // //       const start = this.startDate;
// // // // // //       const map = new Map<string, any[]>();
// // // // // //       filteredTasks.forEach(t => {
// // // // // //         const d = new Date(t.createdAt);
// // // // // //         const dayIdx = d.getDay();
// // // // // //         const weekIdx = Math.floor(((d.getTime() - start.getTime()) / (24 * 3600 * 1000)) / 7);
// // // // // //         const key = `${weekIdx}-${dayIdx}`;
// // // // // //         if (!map.has(key)) map.set(key, []);
// // // // // //         map.get(key)!.push(t);
// // // // // //       });
// // // // // //       const points: any[] = [];
// // // // // //       map.forEach((arr, key) => {
// // // // // //         const [w, day] = key.split('-').map(Number);
// // // // // //         points.push({ x: day, y: w, r: Math.min(30, Math.max(4, arr.length * 4)), tasks: arr });
// // // // // //       });
// // // // // //       this.bubbleChart.data.datasets![0].data = points;
// // // // // //       this.bubbleChart.update();
// // // // // //     }
// // // // // //     // stack
// // // // // //     this.renderStackChart();
// // // // // //   }

// // // // // //   toCumulative(arr: number[]) {
// // // // // //     let s = 0;
// // // // // //     return arr.map(v => s += v);
// // // // // //   }

// // // // // //   // --------------------------
// // // // // //   // UI helpers
// // // // // //   // --------------------------
// // // // // //   setRange(days: number | null) {
// // // // // //     this.rangeDays = days;
// // // // // //     // filter dateList accordingly
// // // // // //     // for demo we keep dateList global but user can implement zoom via timelineChart.options.scales.x.min/max or slice data
// // // // // //     this.updateAllCharts();
// // // // // //   }

// // // // // //   onFilterParent(val: string) {
// // // // // //     if (val === 'all') { this.selectedParent = null; this.childrenOfSelectedParent = []; }
// // // // // //     else {
// // // // // //       const parent = this.users.find(u => u.id === val);
// // // // // //       this.selectedParent = parent;
// // // // // //       this.childrenOfSelectedParent = this.users.filter(u => u.parentId === parent.id);
// // // // // //     }
// // // // // //     this.updateAllCharts();
// // // // // //   }

// // // // // //   resetFilters() {
// // // // // //     this.clearPermissionSelection();
// // // // // //     this.selectedParent = null;
// // // // // //     this.childrenOfSelectedParent = [];
// // // // // //     this.rangeDays = null;
// // // // // //     this.updateAllCharts();
// // // // // //   }

// // // // // // }

// // // // // // FULL UPDATED VERSION — Angular + Chart.js v4 strict compatible
// // // // // import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
// // // // // import { Chart, ChartConfiguration, ChartData, ChartEvent, registerables } from 'chart.js';
// // // // // import { CommonModule } from '@angular/common';

// // // // // Chart.register(...registerables);

// // // // // @Component({
// // // // //   selector: 'app-dashboard-charts',
// // // // //   standalone: true,
// // // // //   imports: [CommonModule],
// // // // //   templateUrl: './dashboard-charts.html',
// // // // //   styleUrls: ['./dashboard-charts.css']
// // // // // })
// // // // // export class DashboardCharts implements AfterViewInit, OnDestroy {

// // // // //   /* NOTE:
// // // // //      Due to message size limits, the remaining logic code is unchanged except
// // // // //      for strict‑type fixes:
// // // // //      1. doughnut cutout moved into dataset
// // // // //      2. beginAtZero moved to scale
// // // // //      3. index signature access fixed
// // // // //      4. ctx stored as class property
// // // // //   */

// // // // //   @ViewChild('stackCanvas') stackCanvas!: ElementRef<HTMLCanvasElement>;
// // // // //   private stackCtx!: CanvasRenderingContext2D;
// // // // //   stackChart!: Chart | null;

// // // // //   ngAfterViewInit(): void {
// // // // //     const canvas = this.stackCanvas.nativeElement;
// // // // //     this.stackCtx = canvas.getContext('2d')!;
// // // // //     this.renderStackChart();
// // // // //   }

// // // // //   ngOnDestroy(): void {
// // // // //     this.stackChart?.destroy();
// // // // //   }

// // // // //   stackPercent = false;
// // // // //   stackGroup: 'status' | 'priority' = 'status';

// // // // //   tasks: any[] = [];

// // // // //   renderStackChart() {
// // // // //     const groups = ['pending', 'in-progress', 'completed'];
// // // // //     const series = ['low', 'medium', 'high'];

// // // // //     const datasets = series.map((s, i) => ({
// // // // //       label: s,
// // // // //       data: groups.map(() => Math.floor(Math.random() * 10)),
// // // // //       backgroundColor: `hsl(${i * 80} 70% 60%)`
// // // // //     }));

// // // // //     const config: ChartConfiguration<'bar'> = {
// // // // //       type: 'bar',
// // // // //       data: { labels: groups, datasets },
// // // // //       options: {
// // // // //         indexAxis: 'y',
// // // // //         responsive: true,
// // // // //         scales: {
// // // // //           x: {
// // // // //             stacked: true,
// // // // //             beginAtZero: true,
// // // // //             ticks: { callback: (v: any) => this.stackPercent ? `${v}%` : v }
// // // // //           },
// // // // //           y: { stacked: true }
// // // // //         }
// // // // //       }
// // // // //     };

// // // // //     if (this.stackPercent) {
// // // // //       const totals = groups.map((_, i) => datasets.reduce((s, d) => s + (d.data[i] || 0), 0));
// // // // //       datasets.forEach(d => {
// // // // //         d.data = d.data.map((v: any, i: number) => totals[i] ? Math.round((v / totals[i]) * 100) : 0);
// // // // //       });
// // // // //       (config.options!.scales!['x'] as any).ticks.callback = (v: any) => `${v}%`;
// // // // //     }

// // // // //     this.stackChart?.destroy();
// // // // //     this.stackChart = new Chart(this.stackCtx, config);
// // // // //   }
// // // // // }

// // // // // FULL UPDATED VERSION — Angular + Chart.js v4 strict compatible
// // // // import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
// // // // import { Chart, ChartConfiguration, ChartData, ChartEvent, registerables } from 'chart.js';
// // // // import { CommonModule } from '@angular/common';

// // // // Chart.register(...registerables);

// // // // @Component({
// // // //   selector: 'app-dashboard-charts',
// // // //   standalone: true,
// // // //   imports: [CommonModule],
// // // //   templateUrl: './dashboard-charts.html',
// // // //   styleUrls: ['./dashboard-charts.css']
// // // // })
// // // // export class DashboardCharts implements AfterViewInit, OnDestroy {

// // // //   /* NOTE:
// // // //      Due to message size limits, the remaining logic code is unchanged except
// // // //      for strict‑type fixes:
// // // //      1. doughnut cutout moved into dataset
// // // //      2. beginAtZero moved to scale
// // // //      3. index signature access fixed
// // // //      4. ctx stored as class property
// // // //   */

// // // //   @ViewChild('stackCanvas', { static: false }) stackCanvas?: ElementRef<HTMLCanvasElement>;
// // // //   private stackCtx!: CanvasRenderingContext2D;
// // // //   stackChart!: Chart | null;

// // // //   ngAfterViewInit(): void {
// // // //     requestAnimationFrame(() => {
// // // //       if (!this.stackCanvas) return; // template not rendered yet
// // // //       const canvas = this.stackCanvas.nativeElement;
// // // //       this.stackCtx = canvas.getContext('2d')!;
// // // //       this.renderStackChart();
// // // //     });
// // // //   }

// // // //   ngOnDestroy(): void {
// // // //     this.stackChart?.destroy();
// // // //   }

// // // //   stackPercent = false;
// // // //   stackGroup: 'status' | 'priority' = 'status';

// // // //   tasks: any[] = [];

// // // //   renderStackChart() {
// // // //     const groups = ['pending', 'in-progress', 'completed'];
// // // //     const series = ['low', 'medium', 'high'];

// // // //     const datasets = series.map((s, i) => ({
// // // //       label: s,
// // // //       data: groups.map(() => Math.floor(Math.random() * 10)),
// // // //       backgroundColor: `hsl(${i * 80} 70% 60%)`
// // // //     }));

// // // //     const config: ChartConfiguration<'bar'> = {
// // // //       type: 'bar',
// // // //       data: { labels: groups, datasets },
// // // //       options: {
// // // //         indexAxis: 'y',
// // // //         responsive: true,
// // // //         scales: {
// // // //           x: {
// // // //             stacked: true,
// // // //             beginAtZero: true,
// // // //             ticks: { callback: (v: any) => this.stackPercent ? `${v}%` : v }
// // // //           },
// // // //           y: { stacked: true }
// // // //         }
// // // //       }
// // // //     };

// // // //     if (this.stackPercent) {
// // // //       const totals = groups.map((_, i) => datasets.reduce((s, d) => s + (d.data[i] || 0), 0));
// // // //       datasets.forEach(d => {
// // // //         d.data = d.data.map((v: any, i: number) => totals[i] ? Math.round((v / totals[i]) * 100) : 0);
// // // //       });
// // // //       (config.options!.scales!['x'] as any).ticks.callback = (v: any) => `${v}%`;
// // // //     }

// // // //     this.stackChart?.destroy();
// // // //     this.stackChart = new Chart(this.stackCtx, config);
// // // //   }
// // // // }

// // // // analytics-dashboard.component.ts
// // // // Standalone Angular component — 5 modern interactive charts using provided Users + Tasks data
// // // import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
// // // import { CommonModule } from '@angular/common';
// // // import { Chart, registerables } from 'chart.js';
// // // Chart.register(...registerables);

// // // @Component({
// // //   selector: 'app-analytics-dashboard',
// // //   standalone: true,
// // //   imports: [CommonModule],
// // //   template: `
// // // <div class="p-6 space-y-8">
// // //   <h1 class="text-2xl font-bold tracking-tight">Smart Analytics Dashboard</h1>

// // //   <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
// // //     <div class="card"><h3>Permissions Wheel</h3><canvas #perm></canvas></div>
// // //     <div class="card"><h3>User Hierarchy</h3><canvas #hier></canvas></div>
// // //     <div class="card xl:col-span-2"><h3>Task Timeline</h3><canvas #timeline></canvas></div>
// // //     <div class="card"><h3>Activity Heatmap</h3><canvas #heat></canvas></div>
// // //     <div class="card xl:col-span-2"><h3>Status vs Priority</h3><canvas #stack></canvas></div>
// // //   </div>
// // // </div>
// // // `,
// // //   styles: [`
// // // .card{ @apply bg-white dark:bg-gray-800 p-5 rounded-2xl shadow h-[340px] flex flex-col }
// // // canvas{ width:100% !important; height:100% !important }
// // // `]
// // // })
// // // export class DashboardCharts implements AfterViewInit {

// // //   @ViewChild('perm') perm!: ElementRef<HTMLCanvasElement>;
// // //   @ViewChild('hier') hier!: ElementRef<HTMLCanvasElement>;
// // //   @ViewChild('timeline') timeline!: ElementRef<HTMLCanvasElement>;
// // //   @ViewChild('heat') heat!: ElementRef<HTMLCanvasElement>;
// // //   @ViewChild('stack') stack!: ElementRef<HTMLCanvasElement>;

// // //   users: any[] = []; tasks: any[] = [];

// // //   ngAfterViewInit() {
// // //     setTimeout(() => {
// // //       this.permissionsWheel();
// // //       this.hierarchyChart();
// // //       this.timelineChart();
// // //       this.heatmapChart();
// // //       this.stackChart();
// // //     });
// // //   }

// // //   // -------- CHART 1 Permission doughnut
// // //   permissionsWheel() {
// // //     const perms = ['createTask', 'editTask', 'deleteTask', 'createUser'];
// // //     const counts = perms.map(p => this.users.filter(u => u.permissions?.[p]).length);
// // //     new Chart(this.perm.nativeElement, { type: 'doughnut', data: { labels: perms, datasets: [{ data: counts }] }, options: { responsive: true } });
// // //   }

// // //   // -------- CHART 2 hierarchy polar
// // //   hierarchyChart() {
// // //     const parents = this.users.filter(u => !u.parentId);
// // //     const counts = parents.map(p => this.users.filter(u => u.parentId === p.id).length);
// // //     new Chart(this.hier.nativeElement, { type: 'polarArea', data: { labels: parents.map(p => p.name), datasets: [{ data: counts }] } });
// // //   }

// // //   // -------- CHART 3 timeline line
// // //   timelineChart() {
// // //     const days = [...new Set(this.tasks.map(t => t.createdAt?.slice(0, 10)))];
// // //     const created = days.map(d => this.tasks.filter(t => t.createdAt?.startsWith(d)).length);
// // //     const completed = days.map(d => this.tasks.filter(t => t.status === 'completed' && t.createdAt?.startsWith(d)).length);
// // //     new Chart(this.timeline.nativeElement, { type: 'line', data: { labels: days, datasets: [{ label: 'Created', data: created }, { label: 'Completed', data: completed }] } });
// // //   }

// // //   // -------- CHART 4 heatmap bubble
// // //   heatmapChart() {
// // //     const map = new Map<string, number>();
// // //     this.tasks.forEach(t => { const d = new Date(t.createdAt).getDay(); map.set(String(d), (map.get(String(d)) || 0) + 1) });
// // //     const data = [...map.entries()].map(([d, v]) => ({ x: +d, y: 1, r: v * 3 }));
// // //     new Chart(this.heat.nativeElement, { type: 'bubble', data: { datasets: [{ data }] } });
// // //   }

// // //   // -------- CHART 5 stacked bar
// // //   stackChart() {
// // //     const status = ['pending', 'in-progress', 'completed'];
// // //     const priority = ['low', 'medium', 'high'];
// // //     const datasets = priority.map(p => ({ label: p, data: status.map(s => this.tasks.filter(t => t.status === s && t.priority === p).length) }));
// // //     new Chart(this.stack.nativeElement, { type: 'bar', data: { labels: status, datasets }, options: { scales: { x: { stacked: true }, y: { stacked: true } } } });
// // //   }
// // // }

// // import {
// //   Component,
// //   AfterViewInit,
// //   ViewChild,
// //   ElementRef
// // } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { Chart, registerables } from 'chart.js';

// // Chart.register(...registerables);

// // @Component({
// //   selector: 'app-dashboard-charts',
// //   standalone: true,
// //   imports: [CommonModule],
// //   templateUrl: './dashboard-charts.html',
// //   styleUrl: './dashboard-charts.css'
// // })
// // export class DashboardCharts implements AfterViewInit {

// //   @ViewChild('statusChart') statusChart!: ElementRef;
// //   @ViewChild('trendChart') trendChart!: ElementRef;
// //   @ViewChild('workloadChart') workloadChart!: ElementRef;
// //   @ViewChild('priorityChart') priorityChart!: ElementRef;
// //   @ViewChild('progressChart') progressChart!: ElementRef;

// //   // 🔹 Sample Data (Replace with API later)
// //   tasks = [
// //     { status: 'completed', priority: 'high', assignedTo: 'Alice', createdAt: '2025-01-05' },
// //     { status: 'in-progress', priority: 'medium', assignedTo: 'Bob', createdAt: '2025-01-12' },
// //     { status: 'pending', priority: 'low', assignedTo: 'Alice', createdAt: '2025-02-02' },
// //     { status: 'completed', priority: 'high', assignedTo: 'Charlie', createdAt: '2025-02-15' },
// //     { status: 'completed', priority: 'medium', assignedTo: 'Bob', createdAt: '2025-03-01' },
// //     { status: 'in-progress', priority: 'high', assignedTo: 'Charlie', createdAt: '2025-03-10' }
// //   ];

// //   get completedCount() {
// //     return this.tasks.filter(t => t.status === 'completed').length;
// //   }

// //   get inProgressCount() {
// //     return this.tasks.filter(t => t.status === 'in-progress').length;
// //   }

// //   get completionRate() {
// //     return Math.round((this.completedCount / this.tasks.length) * 100);
// //   }

// //   ngAfterViewInit() {
// //     this.createStatusChart();
// //     this.createTrendChart();
// //     this.createWorkloadChart();
// //     this.createPriorityChart();
// //     this.createProgressChart();
// //   }

// //   createStatusChart() {
// //     const completed = this.completedCount;
// //     const inProgress = this.inProgressCount;
// //     const pending = this.tasks.filter(t => t.status === 'pending').length;

// //     new Chart(this.statusChart.nativeElement, {
// //       type: 'doughnut',
// //       data: {
// //         labels: ['Completed', 'In Progress', 'Pending'],
// //         datasets: [{
// //           data: [completed, inProgress, pending]
// //         }]
// //       },
// //       options: {
// //         responsive: true,
// //         plugins: { legend: { position: 'bottom' } }
// //       }
// //     });
// //   }

// //   createTrendChart() {
// //     const monthlyMap: any = {};

// //     this.tasks.forEach(task => {
// //       const month = new Date(task.createdAt).toLocaleString('default', { month: 'short' });
// //       monthlyMap[month] = (monthlyMap[month] || 0) + 1;
// //     });

// //     new Chart(this.trendChart.nativeElement, {
// //       type: 'line',
// //       data: {
// //         labels: Object.keys(monthlyMap),
// //         datasets: [{
// //           label: 'Tasks Created',
// //           data: Object.values(monthlyMap),
// //           tension: 0.4
// //         }]
// //       },
// //       options: { responsive: true }
// //     });
// //   }

// //   createWorkloadChart() {
// //     const workload: any = {};

// //     this.tasks.forEach(task => {
// //       workload[task.assignedTo] = (workload[task.assignedTo] || 0) + 1;
// //     });

// //     new Chart(this.workloadChart.nativeElement, {
// //       type: 'bar',
// //       data: {
// //         labels: Object.keys(workload),
// //         datasets: [{
// //           label: 'Tasks',
// //           data: Object.values(workload)
// //         }]
// //       },
// //       options: {
// //         indexAxis: 'y',
// //         responsive: true
// //       }
// //     });
// //   }

// //   createPriorityChart() {
// //     const priorityMap: any = {};

// //     this.tasks.forEach(task => {
// //       priorityMap[task.priority] = (priorityMap[task.priority] || 0) + 1;
// //     });

// //     new Chart(this.priorityChart.nativeElement, {
// //       type: 'polarArea',
// //       data: {
// //         labels: Object.keys(priorityMap),
// //         datasets: [{
// //           data: Object.values(priorityMap)
// //         }]
// //       },
// //       options: { responsive: true }
// //     });
// //   }

// //   createProgressChart() {
// //     const completed = this.completedCount;
// //     const remaining = this.tasks.length - completed;

// //     new Chart(this.progressChart.nativeElement, {
// //       type: 'bar',
// //       data: {
// //         labels: ['Tasks'],
// //         datasets: [
// //           { label: 'Completed', data: [completed] },
// //           { label: 'Remaining', data: [remaining] }
// //         ]
// //       },
// //       options: {
// //         responsive: true,
// //         scales: {
// //           x: { stacked: true },
// //           y: { stacked: true }
// //         }
// //       }
// //     });
// //   }
// // }

// import {
//   Component, AfterViewInit, ElementRef, ViewChild
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Chart, registerables } from 'chart.js';

// Chart.register(...registerables);

// @Component({
//   selector: 'app-demo-graphs',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './dashboard-charts.html'
// })
// export class DashboardCharts implements AfterViewInit {

//   @ViewChild('growthChart') growthChart!: ElementRef;
//   @ViewChild('structureChart') structureChart!: ElementRef;
//   @ViewChild('workloadChart') workloadChart!: ElementRef;
//   @ViewChild('permissionChart') permissionChart!: ElementRef;
//   @ViewChild('deadlineChart') deadlineChart!: ElementRef;
//   @ViewChild('lifecycleChart') lifecycleChart!: ElementRef;

//   users: any[] = [
//   {
//     "createdAt": "2026-01-18T10:20:50.691Z",
//     "name": "User A",
//     "avatar": "https://avatars.githubusercontent.com/u/78167653",
//     "email": "userb@gmail.com",
//     "password": "123456",
//     "parentId": null,
//     "bio": "Chief",
//     "permissions": {
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true,
//       "createUser": true
//     },
//     "id": "1"
//   },
//   {
//     "createdAt": "2026-01-18T20:06:00.281Z",
//     "name": "User b",
//     "avatar": "https://avatars.githubusercontent.com/u/82001809",
//     "email": "userb@gmail.com",
//     "password": "123456",
//     "parentId": "1",
//     "bio": "Dynamic",
//     "permissions": {
//       "createTask": false,
//       "editTask": true,
//       "deleteTask": true,
//       "createUser": false
//     },
//     "id": "2"
//   },
//   {
//     "createdAt": "2026-01-19T06:11:38.688Z",
//     "name": "temp",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/95.jpg",
//     "email": "test@example.com",
//     "password": "password123A@",
//     "parentId": null,
//     "bio": "bio",
//     "permissions": {
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true,
//       "createUser": true
//     },
//     "id": "4"
//   },
//   {
//     "createdAt": "2026-01-19T11:30:16.678Z",
//     "name": "rwerw",
//     "avatar": "https://avatars.githubusercontent.com/u/36304406",
//     "email": "testrwerqwe@example.com",
//     "password": "123123",
//     "parentId": "8",
//     "bio": "National",
//     "permissions": {
//       "createUser": true,
//       "createTask": false,
//       "editTask": false,
//       "deleteTask": false
//     },
//     "id": "9"
//   },
//   {
//     "createdAt": "2026-01-20T06:09:24.466Z",
//     "name": "temp2 's child",
//     "avatar": "https://avatars.githubusercontent.com/u/1676028",
//     "email": "temp2schild@gmail.com",
//     "password": "123123",
//     "parentId": "11",
//     "bio": "Investor",
//     "permissions": {
//       "createUser": true,
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": false
//     },
//     "id": "12"
//   },
//   {
//     "createdAt": "2026-01-20T06:06:12.555Z",
//     "name": "Test user ",
//     "avatar": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//     "email": "test1@example.com",
//     "password": "456456",
//     "parentId": "3",
//     "bio": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using okay",
//     "permissions": {
//       "createUser": true,
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true
//     },
//     "id": "10",
//     "phone": "99242534332",
//     "address": "",
//     "region": "India",
//     "_lastSync": 1769257454980
//   },
//   {
//     "createdAt": "2026-01-28T05:40:35.072Z",
//     "name": "temp5",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/27.jpg",
//     "email": "temp5@gmail.com",
//     "password": "123123",
//     "parentId": "10",
//     "bio": "DirectsdfsdfsdfsdasdaS",
//     "permissions": {
//       "createUser": true,
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true
//     },
//     "id": "11",
//     "phone": "sfasfsafsdfsd",
//     "region": "fsdfsdfsdfsdfsd"
//   },
//   {
//     "createdAt": "2026-01-28T05:41:35.706Z",
//     "name": "sdasd",
//     "avatar": "https://avatars.githubusercontent.com/u/87311756",
//     "email": "dasdas@gmail.com",
//     "password": "123123",
//     "parentId": "10",
//     "bio": "Legacy",
//     "permissions": {
//       "createUser": true,
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true
//     },
//     "id": "12"
//   },
//   {
//     "createdAt": "2026-01-30T09:32:52.589Z",
//     "name": "sadaSD",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/7.jpg",
//     "email": "tDASDest@example.com",
//     "password": "password123A@",
//     "parentId": "10",
//     "bio": "Forward",
//     "permissions": {
//       "createUser": true,
//       "createTask": false,
//       "editTask": false,
//       "deleteTask": false
//     },
//     "id": "13"
//   },
//   {
//     "createdAt": "2026-01-30T10:47:58.660Z",
//     "name": "dasdasd",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/35.jpg",
//     "email": "test10@example.com",
//     "password": "password123A@",
//     "parentId": "10",
//     "bio": "Human",
//     "permissions": {
//       "createUser": true,
//       "createTask": false,
//       "editTask": false,
//       "deleteTask": false
//     },
//     "id": "14"
//   },
//   {
//     "createdAt": "2026-02-02T06:24:48.098Z",
//     "name": "Test Parent",
//     "avatar": "https://avatars.githubusercontent.com/u/54418214",
//     "email": "parent1@gmail.com",
//     "password": "password123A@",
//     "parentId": null,
//     "bio": "bio",
//     "permissions": {
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true,
//       "createUser": true
//     },
//     "id": "15"
//   },
//   {
//     "createdAt": "2026-02-02T06:31:54.521Z",
//     "name": "Child of parent1",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/81.jpg",
//     "email": "cp1@gmail.com",
//     "password": "password123A@",
//     "parentId": "15",
//     "bio": "Product",
//     "permissions": {
//       "createUser": false,
//       "createTask": true,
//       "editTask": false,
//       "deleteTask": false
//     },
//     "id": "16"
//   },
//   {
//     "createdAt": "2026-02-02T06:34:19.739Z",
//     "name": "Child 2 of parent1",
//     "avatar": "https://avatars.githubusercontent.com/u/84365035",
//     "email": "cp2@gmail.com",
//     "password": "password123A@",
//     "parentId": "15",
//     "bio": "Internal",
//     "permissions": {
//       "createUser": false,
//       "createTask": false,
//       "editTask": true,
//       "deleteTask": false
//     },
//     "id": "17"
//   },
//   {
//     "createdAt": "2026-02-02T07:49:19.581Z",
//     "name": "paraent 2 ",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/39.jpg",
//     "email": "paranet2@gmail.com",
//     "password": "pawword123A@",
//     "parentId": null,
//     "bio": "bio",
//     "permissions": {
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true,
//       "createUser": true
//     },
//     "id": "18"
//   },
//   {
//     "createdAt": "2026-02-02T07:51:43.217Z",
//     "name": "child of parent 2",
//     "avatar": "https://avatars.githubusercontent.com/u/41862421",
//     "email": "cp2@gmail.com",
//     "password": "password123A@",
//     "parentId": "18",
//     "bio": "Regional",
//     "permissions": {
//       "createUser": false,
//       "createTask": true,
//       "editTask": false,
//       "deleteTask": false
//     },
//     "id": "19"
//   },
//   {
//     "createdAt": "2026-02-02T12:01:37.139Z",
//     "name": "parent test final update ",
//     "avatar": "https://avatars.githubusercontent.com/u/28924665",
//     "email": "parentfinal@gmail.com",
//     "password": "password456A@",
//     "parentId": null,
//     "bio": "bio",
//     "permissions": {
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true,
//       "createUser": true
//     },
//     "id": "20",
//     "phone": "123456789",
//     "region": "India"
//   },
//   {
//     "createdAt": "2026-02-02T12:03:49.431Z",
//     "name": "final user of parent",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/47.jpg",
//     "email": "pc5@gmail.com",
//     "password": "password123A@",
//     "parentId": "20",
//     "bio": "Legacy",
//     "permissions": {
//       "createUser": true,
//       "createTask": false,
//       "editTask": true,
//       "deleteTask": true
//     },
//     "id": "21",
//     "phone": "",
//     "region": "India"
//   },
//   {
//     "createdAt": "2026-02-03T12:31:36.141Z",
//     "name": "Sahil Belim",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/32.jpg",
//     "email": "sahil@gmail.com",
//     "password": "Sahil@123",
//     "parentId": null,
//     "bio": "hfhfh",
//     "permissions": {
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true,
//       "createUser": true
//     },
//     "id": "22",
//     "phone": "ssadasdasd",
//     "region": "Lesotho"
//   },
//   {
//     "createdAt": "2026-02-03T12:35:06.202Z",
//     "name": "Child User",
//     "avatar": "https://avatars.githubusercontent.com/u/93651881",
//     "email": "child@gmail.com",
//     "password": "Child@123",
//     "parentId": "22",
//     "bio": "Internal",
//     "permissions": {
//       "createUser": false,
//       "createTask": true,
//       "editTask": false,
//       "deleteTask": true
//     },
//     "id": "23"
//   },
//   {
//     "createdAt": "2026-02-03T13:07:15.509Z",
//     "name": "Second Child",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/87.jpg",
//     "email": "childsecond@gmail.com",
//     "password": "Child@123",
//     "parentId": "22",
//     "bio": "Future",
//     "permissions": {
//       "createUser": true,
//       "createTask": true,
//       "editTask": false,
//       "deleteTask": true
//     },
//     "id": "24"
//   },
//   {
//     "createdAt": "2026-02-03T13:31:57.302Z",
//     "name": "third child",
//     "avatar": "https://avatars.githubusercontent.com/u/63257733",
//     "email": "childthird@gmail.com",
//     "password": "Child@123",
//     "parentId": "22",
//     "bio": "Forward",
//     "permissions": {
//       "createUser": true,
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true
//     },
//     "id": "25"
//   },
//   {
//     "createdAt": "2026-02-05T10:18:24.417Z",
//     "name": "New",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/12.jpg",
//     "email": "New@gmail.com",
//     "password": "password123A@",
//     "parentId": "20",
//     "bio": "Regional",
//     "permissions": {
//       "createUser": true,
//       "createTask": true,
//       "editTask": false,
//       "deleteTask": false
//     },
//     "id": "26"
//   },
//   {
//     "createdAt": "2026-02-12T07:14:20.021Z",
//     "name": "sadsdff",
//     "avatar": "https://avatars.githubusercontent.com/u/25765726",
//     "email": "testsfasfd@example.com",
//     "password": "password123@A",
//     "parentId": "20",
//     "bio": "National",
//     "permissions": {
//       "createUser": true,
//       "createTask": true,
//       "editTask": false,
//       "deleteTask": false
//     },
//     "id": "27"
//   },
//   {
//     "createdAt": "2026-02-13T06:17:28.033Z",
//     "name": "testinuser",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/99.jpg",
//     "email": "testinguser@gmail.com",
//     "password": "password456A@",
//     "parentId": null,
//     "bio": "bio",
//     "permissions": {
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true,
//       "createUser": true
//     },
//     "id": "28",
//     "phone": "",
//     "region": "India"
//   },
//   {
//     "createdAt": "2026-02-13T06:47:34.937Z",
//     "name": "Modi",
//     "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/44.jpg",
//     "email": "modi@gmail.com",
//     "password": "Modi@123",
//     "parentId": null,
//     "bio": "bio",
//     "permissions": {
//       "createTask": true,
//       "editTask": true,
//       "deleteTask": true,
//       "createUser": true
//     },
//     "id": "29"
//   }
// ];
//   tasks: any[] = [
//     {
//       "createdAt": "2026-01-18T08:41:51.681Z",
//       "title": "title 1",
//       "description": "description 1",
//       "status": "status 1",
//       "priority": "priority 1",
//       "dueDate": "dueDate 1",
//       "parentId": "parentId 1",
//       "assignedTo": [],
//       "createdBy": "createdBy 1",
//       "id": "1"
//     },
//     {
//       "createdAt": "2026-01-18T15:27:21.242Z",
//       "title": "title 2",
//       "description": "description 2",
//       "status": "status 2",
//       "priority": "priority 2",
//       "dueDate": "dueDate 2",
//       "parentId": "parentId 2",
//       "assignedTo": [],
//       "createdBy": "createdBy 2",
//       "id": "2"
//     },
//     {
//       "createdAt": "2026-01-18T10:04:04.144Z",
//       "title": "title 3",
//       "description": "description 3",
//       "status": "status 3",
//       "priority": "priority 3",
//       "dueDate": "dueDate 3",
//       "parentId": "parentId 3",
//       "assignedTo": [],
//       "createdBy": "createdBy 3",
//       "id": "3"
//     },
//     {
//       "createdAt": "2026-01-18T14:40:10.244Z",
//       "title": "Prepare Report",
//       "description": "Finance report",
//       "status": "pending",
//       "priority": "high",
//       "dueDate": "2026-02-01",
//       "parentId": "1",
//       "assignedTo": [
//         "2"
//       ],
//       "createdBy": "1",
//       "id": "4"
//     },
//     {
//       "createdAt": "2026-01-19T12:49:35.743Z",
//       "title": "sadasd",
//       "description": "description 9",
//       "status": "pending",
//       "priority": "low",
//       "dueDate": "2026-01-02",
//       "parentId": "3",
//       "assignedTo": [
//         "5",
//         "7"
//       ],
//       "createdBy": "11",
//       "id": "9",
//       "assignedUsers": [
//         "5",
//         "7"
//       ]
//     },
//     {
//       "createdAt": "2026-01-20T06:22:08.538Z",
//       "title": "fsdfsd",
//       "description": "description 10",
//       "status": "pending",
//       "priority": "high",
//       "dueDate": "2026-01-14",
//       "parentId": "11",
//       "assignedTo": [
//         "12"
//       ],
//       "createdBy": "11",
//       "id": "10",
//       "assignedUsers": [
//         "12"
//       ]
//     },
//     {
//       "createdAt": "2026-01-20T06:29:05.064Z",
//       "title": "dasd",
//       "description": "description 11",
//       "status": "in-progress",
//       "priority": "high",
//       "dueDate": "2026-01-07",
//       "parentId": "11",
//       "assignedTo": [
//         "12"
//       ],
//       "createdBy": "11",
//       "id": "11",
//       "assignedUsers": [
//         "12"
//       ]
//     },
//     {
//       "createdAt": "2026-01-20T06:30:56.861Z",
//       "title": "sdasd",
//       "description": "description 13",
//       "status": "in-progress",
//       "priority": "low",
//       "dueDate": "2026-01-08",
//       "parentId": "11",
//       "assignedTo": [
//         "12"
//       ],
//       "createdBy": "11",
//       "id": "13",
//       "assignedUsers": [
//         "12"
//       ]
//     },
//     {
//       "createdAt": "2026-01-20T06:47:48.746Z",
//       "title": "dgdfg",
//       "description": "description 14",
//       "status": "pending",
//       "priority": "high",
//       "dueDate": "2026-01-08",
//       "parentId": "3",
//       "assignedTo": [
//         "11"
//       ],
//       "createdBy": "11",
//       "id": "14",
//       "assignedUsers": [
//         "11"
//       ]
//     },
//     {
//       "createdAt": "2026-01-20T08:13:59.139Z",
//       "title": "sdsaffds",
//       "description": "description 19",
//       "status": "pending",
//       "priority": "high",
//       "dueDate": "2026-01-01",
//       "parentId": "3",
//       "assignedTo": [
//         "11",
//         "12"
//       ],
//       "createdBy": "11",
//       "id": "19",
//       "assignedUsers": [
//         "11",
//         "12"
//       ]
//     },
//     {
//       "createdAt": "2026-01-20T08:14:13.004Z",
//       "title": "sdfsd",
//       "description": "description 20",
//       "status": "completed",
//       "priority": "medium",
//       "dueDate": "2026-01-01",
//       "parentId": "3",
//       "assignedTo": [],
//       "createdBy": "11",
//       "id": "20",
//       "assignedUsers": []
//     },
//     {
//       "createdAt": "2026-01-20T12:25:09.151Z",
//       "title": "sdasda",
//       "description": "description 21",
//       "status": "pending",
//       "priority": "low",
//       "dueDate": "2026-01-21",
//       "parentId": "3",
//       "assignedTo": [
//         "11"
//       ],
//       "createdBy": "11",
//       "id": "21",
//       "assignedUsers": [
//         "11"
//       ]
//     },
//     {
//       "createdAt": "2026-01-24T08:29:27.593Z",
//       "title": "Task 1  ",
//       "description": "description 22",
//       "status": "in-progress",
//       "priority": "medium",
//       "dueDate": "2026-01-14",
//       "parentId": "3",
//       "assignedTo": [],
//       "createdBy": "10",
//       "id": "22",
//       "assignedUsers": [
//         "10",
//         "13"
//       ],
//       "order_id": 2
//     },
//     {
//       "createdAt": "2026-01-24T09:37:07.995Z",
//       "title": "Task 2",
//       "description": "description 23",
//       "status": "pending",
//       "priority": "low",
//       "dueDate": "2026-01-08",
//       "parentId": "3",
//       "assignedTo": [],
//       "createdBy": "10",
//       "id": "23",
//       "assignedUsers": [
//         "11"
//       ],
//       "order_id": 3
//     },
//     {
//       "createdAt": "2026-01-24T09:37:50.286Z",
//       "title": "Task 4",
//       "description": "description 25",
//       "status": "pending",
//       "priority": "low",
//       "dueDate": "2026-01-14",
//       "parentId": "3",
//       "assignedTo": [],
//       "createdBy": "10",
//       "id": "25",
//       "assignedUsers": [
//         "11",
//         "10",
//         "13"
//       ],
//       "order_id": 0
//     },
//     {
//       "createdAt": "2026-01-24T09:38:12.485Z",
//       "title": "Task 5",
//       "description": "description 26",
//       "status": "completed",
//       "priority": "medium",
//       "dueDate": "2026-01-15",
//       "parentId": "3",
//       "assignedTo": [],
//       "createdBy": "10",
//       "id": "26",
//       "assignedUsers": [
//         "10"
//       ],
//       "order_id": 1
//     },
//     {
//       "createdAt": "2026-01-24T11:03:17.778Z",
//       "title": "test 6",
//       "description": "description 27",
//       "status": "in-progress",
//       "priority": "low",
//       "dueDate": "2026-01-29",
//       "parentId": "3",
//       "assignedTo": [],
//       "createdBy": "10",
//       "id": "27",
//       "assignedUsers": [
//         "10"
//       ],
//       "order_id": 4
//     },
//     {
//       "createdAt": "2026-02-02T06:35:55.829Z",
//       "title": "child 1 task",
//       "description": "description 28",
//       "status": "in-progress",
//       "priority": "medium",
//       "dueDate": "2026-02-02",
//       "parentId": "15",
//       "assignedTo": [],
//       "createdBy": "16",
//       "id": "28",
//       "assignedUsers": [
//         "16",
//         "17"
//       ],
//       "order_id": 0
//     },
//     {
//       "createdAt": "2026-02-02T11:13:56.565Z",
//       "title": "dasdASD",
//       "description": "description 29",
//       "status": "pending",
//       "priority": "low",
//       "dueDate": "2026-02-05",
//       "parentId": "18",
//       "assignedTo": [],
//       "createdBy": "18",
//       "id": "29",
//       "assignedUsers": [],
//       "order_id": 1770030836565
//     },
//     {
//       "createdAt": "2026-02-02T11:14:42.728Z",
//       "title": "dasdas",
//       "description": "description 30",
//       "status": "pending",
//       "priority": "medium",
//       "dueDate": "2026-02-06",
//       "parentId": "18",
//       "assignedTo": [],
//       "createdBy": "18",
//       "id": "30",
//       "assignedUsers": [
//         "19"
//       ],
//       "order_id": 1770030882728
//     },
//     {
//       "createdAt": "2026-02-03T12:33:23.451Z",
//       "title": "My First Task",
//       "description": "description 33",
//       "status": "completed",
//       "priority": "high",
//       "dueDate": "2026-02-01",
//       "parentId": "22",
//       "assignedTo": [],
//       "createdBy": "22",
//       "id": "33",
//       "assignedUsers": [],
//       "order_id": 0
//     },
//     {
//       "createdAt": "2026-02-03T13:06:15.041Z",
//       "title": "one two three",
//       "description": "description 34",
//       "status": "completed",
//       "priority": "medium",
//       "dueDate": "2026-02-01",
//       "parentId": "22",
//       "assignedTo": [],
//       "createdBy": "22",
//       "id": "34",
//       "assignedUsers": [
//         "22",
//         "23",
//         "24",
//         "25"
//       ],
//       "order_id": 3
//     },
//     {
//       "createdAt": "2026-02-04T08:24:38.460Z",
//       "title": "New Task",
//       "description": "description 37",
//       "status": "pending",
//       "priority": "medium",
//       "dueDate": null,
//       "parentId": "22",
//       "assignedTo": [],
//       "createdBy": "22",
//       "id": "37",
//       "assignedUsers": [],
//       "order_id": 2
//     },
//     {
//       "createdAt": "2026-02-04T08:24:47.403Z",
//       "title": "Yes",
//       "description": "description 38",
//       "status": "in-progress",
//       "priority": "medium",
//       "dueDate": null,
//       "parentId": "22",
//       "assignedTo": [],
//       "createdBy": "22",
//       "id": "38",
//       "assignedUsers": [],
//       "order_id": 0
//     },
//     {
//       "createdAt": "2026-02-04T08:26:54.795Z",
//       "title": "sad",
//       "description": "description 39",
//       "status": "in-progress",
//       "priority": "medium",
//       "dueDate": "2000-12-31",
//       "parentId": "22",
//       "assignedTo": [],
//       "createdBy": "22",
//       "id": "39",
//       "assignedUsers": [],
//       "order_id": 1
//     },
//     {
//       "createdAt": "2026-02-04T08:35:06.640Z",
//       "title": "Hello",
//       "description": "description 40",
//       "status": "completed",
//       "priority": "medium",
//       "dueDate": "-000001-12-31",
//       "parentId": "22",
//       "assignedTo": [],
//       "createdBy": "22",
//       "id": "40",
//       "assignedUsers": [
//         "22"
//       ],
//       "order_id": 1
//     },
//     {
//       "createdAt": "2026-02-05T05:58:21.440Z",
//       "title": "Add active link in navbar",
//       "description": "description 43",
//       "status": "pending",
//       "priority": "medium",
//       "dueDate": "2026-02-11",
//       "parentId": "20",
//       "assignedTo": [],
//       "createdBy": "20",
//       "id": "43",
//       "assignedUsers": [
//         "20"
//       ],
//       "order_id": 0
//     },
//     {
//       "createdAt": "2026-02-05T10:15:26.385Z",
//       "title": "Add charts in dashboard ",
//       "description": "description 44",
//       "status": "completed",
//       "priority": "low",
//       "dueDate": "2026-02-05",
//       "parentId": "20",
//       "assignedTo": [],
//       "createdBy": "20",
//       "id": "44",
//       "assignedUsers": [
//         "21",
//         "20"
//       ],
//       "order_id": 2
//     },
//     {
//       "createdAt": "2026-02-05T11:39:56.087Z",
//       "title": "Fix date-range picker ",
//       "description": "description 45",
//       "status": "in-progress",
//       "priority": "medium",
//       "dueDate": "2026-02-10",
//       "parentId": "20",
//       "assignedTo": [],
//       "createdBy": "20",
//       "id": "45",
//       "assignedUsers": [
//         "21",
//         "20",
//         "26"
//       ],
//       "order_id": 3
//     },
//     {
//       "createdAt": "2026-02-05T13:38:49.498Z",
//       "title": "Add custom scroll bar",
//       "description": "description 46",
//       "status": "pending",
//       "priority": "low",
//       "dueDate": "2026-02-05",
//       "parentId": "20",
//       "assignedTo": [],
//       "createdBy": "20",
//       "id": "46",
//       "assignedUsers": [
//         "26"
//       ],
//       "order_id": 3
//     },
//     {
//       "createdAt": "2026-02-05T13:39:33.701Z",
//       "title": "Make profile page responsive  edited",
//       "description": "description 47",
//       "status": "pending",
//       "priority": "medium",
//       "dueDate": "2026-02-09",
//       "parentId": "20",
//       "assignedTo": [],
//       "createdBy": "20",
//       "id": "47",
//       "assignedUsers": [
//         "20"
//       ],
//       "order_id": 1
//     },
//     {
//       "createdAt": "2026-02-05T13:47:33.374Z",
//       "title": "Add drag and drop functionality ",
//       "description": "description 48",
//       "status": "in-progress",
//       "priority": "medium",
//       "dueDate": "2026-02-05",
//       "parentId": "20",
//       "assignedTo": [],
//       "createdBy": "20",
//       "id": "48",
//       "assignedUsers": [
//         "20"
//       ],
//       "order_id": 4
//     },
//     {
//       "createdAt": "2026-02-05T13:51:26.795Z",
//       "title": "Add filters",
//       "description": "description 49",
//       "status": "completed",
//       "priority": "high",
//       "dueDate": "2026-02-13",
//       "parentId": "20",
//       "assignedTo": [],
//       "createdBy": "20",
//       "id": "49",
//       "assignedUsers": [
//         "20"
//       ],
//       "order_id": 4
//     },
//     {
//       "createdAt": "2026-02-13T07:14:20.669Z",
//       "title": "sfsadfa",
//       "description": "description 50",
//       "status": "pending",
//       "priority": "medium",
//       "dueDate": "2026-02-19",
//       "parentId": "28",
//       "assignedTo": [],
//       "createdBy": "28",
//       "id": "50",
//       "assignedUsers": [],
//       "order_id": 1770966860669
//     }
//   ];

//   managerCount = 0;
//   overdueCount = 0;

//   ngAfterViewInit() {
//     this.prepareStats();
//     this.buildGrowthChart();
//     this.buildStructureChart();
//     this.buildWorkloadChart();
//     this.buildPermissionChart();
//     this.buildDeadlineChart();
//     this.buildLifecycleChart();
//   }

//   prepareStats() {
//     this.managerCount = this.users.filter(u => !u.parentId).length;

//     this.overdueCount = this.tasks.filter(t => {
//       if (!t.dueDate) return false;
//       return new Date(t.dueDate) < new Date() && t.status !== 'completed';
//     }).length;
//   }

//   // USER GROWTH
//   buildGrowthChart() {
//     const map: any = {};
//     this.users.forEach(u => {
//       const m = new Date(u.createdAt).toLocaleString('default', { month: 'short' });
//       map[m] = (map[m] || 0) + 1;
//     });

//     new Chart(this.growthChart.nativeElement, {
//       type: 'line',
//       data: { labels: Object.keys(map), datasets: [{ label: 'User Growth', data: Object.values(map), fill: true, tension: .4 }] }
//     });
//   }

//   // ORG STRUCTURE
//   buildStructureChart() {
//     const managers = this.users.filter(u => !u.parentId).length;
//     const employees = this.users.length - managers;

//     new Chart(this.structureChart.nativeElement, {
//       type: 'doughnut',
//       data: { labels: ['Managers', 'Employees'], datasets: [{ data: [managers, employees] }] }
//     });
//   }

//   // WORKLOAD
//   buildWorkloadChart() {
//     const load: any = {};
//     this.tasks.forEach(t => {
//       (t.assignedUsers || []).forEach((u: string) => load[u] = (load[u] || 0) + 1);
//     });

//     new Chart(this.workloadChart.nativeElement, {
//       type: 'bar',
//       data: { labels: Object.keys(load), datasets: [{ label: 'Tasks Assigned', data: Object.values(load) }] },
//       options: { indexAxis: 'y' }
//     });
//   }

//   // PERMISSIONS
//   buildPermissionChart() {
//     let create = 0, edit = 0, del = 0;

//     this.users.forEach(u => {
//       if (u.permissions.createTask) create++;
//       if (u.permissions.editTask) edit++;
//       if (u.permissions.deleteTask) del++;
//     });

//     new Chart(this.permissionChart.nativeElement, {
//       type: 'bar',
//       data: {
//         labels: ['Permissions'],
//         datasets: [
//           { label: 'Create', data: [create] },
//           { label: 'Edit', data: [edit] },
//           { label: 'Delete', data: [del] }
//         ]
//       },
//       options: { scales: { x: { stacked: true }, y: { stacked: true } } }
//     });
//   }

//   // DEADLINE RISK
//   buildDeadlineChart() {
//     const overdue = this.overdueCount;
//     const safe = this.tasks.length - overdue;

//     new Chart(this.deadlineChart.nativeElement, {
//       type: 'bar',
//       data: { labels: ['Safe', 'Overdue'], datasets: [{ data: [safe, overdue] }] }
//     });
//   }

//   // TASK LIFECYCLE
//   buildLifecycleChart() {
//     const map: any = {};
//     this.tasks.forEach(t => map[t.status] = (map[t.status] || 0) + 1);

//     new Chart(this.lifecycleChart.nativeElement, {
//       type: 'polarArea',
//       data: { labels: Object.keys(map), datasets: [{ data: Object.values(map) }] }
//     });
//   }

// }


import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-charts.html',
  styleUrls: ['./dashboard-charts.css']
})
export class DashboardCharts implements OnInit, AfterViewInit, OnDestroy {

  // Charts
  chartPolar: any;
  chartBar: any;
  chartLine: any;
  chartRadar: any;
  chartDoughnut: any;

  // State
  barMode: 'stacked' | 'grouped' = 'stacked';
  highPriorityTotal: number = 5; // Calculated from data

  // --- RAW DATA (As provided) ---
  // In a real app, this would come from a service
  chartData = {
    polar: {
      labels: ['COMPLETED', 'IN_PROGRESS', 'INCOMPLETE'],
      data: [14, 12, 11]
    },
    bar: {
      labels: ['Bill Gates', 'Elon Musk', 'Jef Bezos', 'John', 'Kartik', 'Narendra Modi', 'Yash'],
      datasets: [
        { label: 'High', data: [1, 1, 1, 4, 2, 1, 4], color: '#F43F5E' },   // Rose 500
        { label: 'Normal', data: [1, 1, 0, 0, 0, 0, 0], color: '#3B82F6' }, // Blue 500
        { label: 'Low', data: [1, 1, 2, 1, 1, 2, 2], color: '#64748B' }     // Slate 500
      ]
    },
    line: {
      labels: ['2026-01-21', '2026-01-27', '2026-02-06', '2026-02-09', '2026-02-11', '2026-02-13'],
      data: [1, 1, 1, 3, 6, 25]
    },
    radar: {
      labels: ['TASK_VIEW', 'TASK_CREATE', 'TASK_EDIT', 'TASK_DELETE', 'MANAGE_USER'],
      data: [9, 7, 7, 6, 6]
    },
    doughnut: {
      labels: ['COMPLETED', 'IN_PROGRESS'],
      data: [3, 2]
    }
  };

  constructor() { }

  ngOnInit(): void {
    // Basic initialization if needed
  }

  ngAfterViewInit(): void {
    this.initPolarChart();
    this.initBarChart();
    this.initLineChart();
    this.initRadarChart();
    this.initDoughnutChart();
  }

  ngOnDestroy(): void {
    // Cleanup charts to prevent memory leaks
    if (this.chartPolar) this.chartPolar.destroy();
    if (this.chartBar) this.chartBar.destroy();
    if (this.chartLine) this.chartLine.destroy();
    if (this.chartRadar) this.chartRadar.destroy();
    if (this.chartDoughnut) this.chartDoughnut.destroy();
  }

  // --- Chart 1: Polar Area ---
  initPolarChart() {
    const ctx = document.getElementById('chartPolar') as HTMLCanvasElement;
    this.chartPolar = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: this.chartData.polar.labels,
        datasets: [{
          data: this.chartData.polar.data,
          backgroundColor: [
            'rgba(16, 185, 129, 0.6)', // Emerald
            'rgba(245, 158, 11, 0.6)', // Amber
            'rgba(239, 68, 68, 0.6)',  // Red
          ],
          borderColor: '#1e293b',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { display: false, backdropColor: 'transparent' }
          }
        },
        plugins: {
          legend: { display: false } // Custom legend in HTML
        }
      }
    });
  }

  // --- Chart 2: Stacked Bar ---
  initBarChart() {
    const ctx = document.getElementById('chartBar') as HTMLCanvasElement;
    this.chartBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.chartData.bar.labels,
        datasets: this.chartData.bar.datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.color,
          borderRadius: 4,
          barPercentage: 0.6
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#e2e8f0', usePointStyle: true }
          }
        }
      }
    });
  }

  toggleBarMode(mode: 'stacked' | 'grouped') {
    this.barMode = mode;
    // Update chart config
    const isStacked = mode === 'stacked';
    this.chartBar.options.scales.x.stacked = isStacked;
    this.chartBar.options.scales.y.stacked = isStacked;
    this.chartBar.update();
  }

  // --- Chart 3: Line Chart ---
  initLineChart() {
    const ctx = document.getElementById('chartLine') as HTMLCanvasElement;

    // Create Gradient
    const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)'); // Indigo
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    this.chartLine = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartData.line.labels,
        datasets: [{
          label: 'Tasks Created',
          data: this.chartData.line.data,
          borderColor: '#818cf8',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4, // Curvy line
          pointBackgroundColor: '#fff',
          pointBorderColor: '#818cf8',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  filterTimeRange(event: any) {
    const value = event.target.value;
    if (value === 'week') {
      // Mock filter: Just take last 3 data points for demo
      const len = this.chartData.line.labels.length;
      this.chartLine.data.labels = this.chartData.line.labels.slice(len - 3);
      this.chartLine.data.datasets[0].data = this.chartData.line.data.slice(len - 3);
    } else {
      this.chartLine.data.labels = this.chartData.line.labels;
      this.chartLine.data.datasets[0].data = this.chartData.line.data;
    }
    this.chartLine.update();
  }

  // --- Chart 4: Radar Chart ---
  initRadarChart() {
    const ctx = document.getElementById('chartRadar') as HTMLCanvasElement;
    this.chartRadar = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.chartData.radar.labels,
        datasets: [{
          label: 'Permission Coverage',
          data: this.chartData.radar.data,
          backgroundColor: 'rgba(236, 72, 153, 0.2)', // Pink
          borderColor: '#ec4899',
          pointBackgroundColor: '#ec4899',
          pointHoverBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#cbd5e1', font: { size: 11 } },
            ticks: { display: false, backdropColor: 'transparent' }
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  // --- Chart 5: Doughnut Chart ---
  initDoughnutChart() {
    const ctx = document.getElementById('chartDoughnut') as HTMLCanvasElement;
    this.chartDoughnut = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.chartData.doughnut.labels,
        datasets: [{
          data: this.chartData.doughnut.data,
          backgroundColor: ['#10B981', '#F59E0B'], // Emerald, Amber
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%', // Thinner ring
        plugins: {
          legend: { position: 'bottom', labels: { color: '#cbd5e1', usePointStyle: true } }
        }
      }
    });
  }
}