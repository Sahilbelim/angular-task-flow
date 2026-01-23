// // import { Component, AfterViewInit } from '@angular/core';
// // import { Chart, registerables } from 'chart.js';

// // Chart.register(...registerables);

// // @Component({
// //   selector: 'app-home',
// //   standalone: true,
// //   imports: [],
// //   templateUrl: './home.html',
// //   styleUrl: './home.css',
// // })
// // export class Home implements AfterViewInit {
// //   // 🔢 TEMPORARY KPI DATA
// //   totalTasks = 120;
// //   completed = 58;
// //   inProgress = 42;
// //   pending = 20;
// //   users = 12;

// //   ngAfterViewInit(): void {
// //     this.initStatusChart();
// //     this.initLineChart();
// //     this.initPriorityChart();
// //     this.initRadarChart();
// //     this.initPolarChart();
// //   }

// //   // 🟢 Doughnut – Task Status
// //   initStatusChart() {
// //     new Chart('statusChart', {
// //       type: 'doughnut',
// //       data: {
// //         labels: ['Completed', 'In Progress', 'Pending'],
// //         datasets: [{
// //           data: [58, 42, 20],
// //           backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
// //           borderWidth: 0
// //         }]
// //       },
// //       options: {
// //         cutout: '70%',
// //         plugins: { legend: { position: 'bottom' } },
// //         maintainAspectRatio: false
// //       }
// //     });
// //   }

// //   // 🔵 Line – Tasks Over Time
// //   initLineChart() {
// //     new Chart('lineChart', {
// //       type: 'line',
// //       data: {
// //         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
// //         datasets: [{
// //           data: [10, 18, 25, 30, 40, 55],
// //           borderColor: '#3b82f6',
// //           backgroundColor: 'rgba(59,130,246,0.12)',
// //           tension: 0.4,
// //           fill: true,
// //           pointRadius: 3
// //         }]
// //       },
// //       options: {
// //         plugins: { legend: { display: false } },
// //         maintainAspectRatio: false
// //       }
// //     });
// //   }

// //   // 🟠 Bar – Priority
// //   initPriorityChart() {
// //     new Chart('priorityChart', {
// //       type: 'bar',
// //       data: {
// //         labels: ['Low', 'Medium', 'High'],
// //         datasets: [{
// //           data: [35, 55, 30],
// //           backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
// //           borderRadius: 6
// //         }]
// //       },
// //       options: {
// //         plugins: { legend: { display: false } },
// //         maintainAspectRatio: false
// //       }
// //     });
// //   }

// //   // 🟣 Radar – User Activity
// //   initRadarChart() {
// //     new Chart('radarChart', {
// //       type: 'radar',
// //       data: {
// //         labels: ['Create', 'Edit', 'Assign', 'Complete', 'Comment'],
// //         datasets: [{
// //           data: [65, 50, 70, 80, 40],
// //           borderColor: '#6366f1',
// //           backgroundColor: 'rgba(99,102,241,0.25)',
// //           pointBackgroundColor: '#6366f1'
// //         }]
// //       },
// //       options: {
// //         scales: { r: { ticks: { display: false } } },
// //         plugins: { legend: { display: false } },
// //         maintainAspectRatio: false
// //       }
// //     });
// //   }

// //   // 🔴 Polar – Task Type
// //   initPolarChart() {
// //     new Chart('polarChart', {
// //       type: 'polarArea',
// //       data: {
// //         labels: ['Bug', 'Feature', 'Improvement', 'Research'],
// //         datasets: [{
// //           data: [20, 40, 25, 15],
// //           backgroundColor: ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b']
// //         }]
// //       },
// //       options: {
// //         plugins: { legend: { position: 'right' } },
// //         maintainAspectRatio: false
// //       }
// //     });
// //   }
// // }


// import { Component, AfterViewInit, OnInit } from '@angular/core';
// import { Chart, registerables } from 'chart.js';
// import { DashboardAnalyticsService } from '../../../core/service/dashboard-analytics.service';

// Chart.register(...registerables);

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   templateUrl: './home.html',
// })
// export class Home implements OnInit, AfterViewInit {

//   loading = true;

//   taskStats = {
//     total: 0,
//     completed: 0,
//     pending: 0,
//     inProgress: 0,
//   };

//   userStats = {
//     totalUsers: 0,
//     canCreateUser: 0,
//     canCreateTask: 0,
//     canEditTask: 0,
//     canDeleteTask: 0,
//   };

//   constructor(private dashboard: DashboardAnalyticsService) { }

//   ngOnInit() {
//     this.dashboard.getDashboardStats().subscribe(data => {
//       this.taskStats = data.taskStats;
//       this.userStats = data.userStats;
//       this.loading = false;

//       this.initTaskChart();
//       this.initUserChart();
//     });
//   }

//   ngAfterViewInit() { }

//   /* =====================
//      PIE – TASK STATUS
//   ====================== */
//   initTaskChart() {
//     new Chart('taskPie', {
//       type: 'doughnut',
//       data: {
//         labels: ['Completed Tasks', 'In Progress', 'Pending'],
//         datasets: [{
//           data: [
//             this.taskStats.completed,
//             this.taskStats.inProgress,
//             this.taskStats.pending,
//           ],
//           backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
//           borderWidth: 0,
//         }]
//       },
//       options: {
//         cutout: '72%',
//         plugins: { legend: { position: 'bottom' } },
//         maintainAspectRatio: false,
//       }
//     });
//   }

//   /* =====================
//      BAR – USER PERMISSIONS
//   ====================== */
//   initUserChart() {
//     new Chart('userBar', {
//       type: 'bar',
//       data: {
//         labels: ['Create User', 'Create Task', 'Edit Task', 'Delete Task'],
//         datasets: [{
//           data: [
//             this.userStats.canCreateUser,
//             this.userStats.canCreateTask,
//             this.userStats.canEditTask,
//             this.userStats.canDeleteTask,
//           ],
//           backgroundColor: '#3b82f6',
//           borderRadius: 6,
//           maxBarThickness: 40,
//         }]
//       },
//       options: {
//         plugins: { legend: { display: false } },
//         scales: {
//           x: { grid: { display: false } },
//           y: { grid: { color: '#e5e7eb' } },
//         },
//         maintainAspectRatio: false,
//       }
//     });
//   }
// }

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../../../core/service/mocapi/api/api';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
})
export class Home implements OnInit, AfterViewInit {

  loading = true;

  /* =====================
     STATS
  ===================== */
  taskStats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  };

  userStats = {
    totalUsers: 0,
    canCreateUser: 0,
    canCreateTask: 0,
    canEditTask: 0,
    canDeleteTask: 0,
  };

  private chartsInitialized = false;

  constructor(private api: ApiService) { }

  /* =====================
     LOAD DATA (ONCE)
  ===================== */
  ngOnInit() {
    this.api.getTasks$().subscribe(tasks => {
      this.computeTaskStats(tasks);
      this.tryInitCharts();
    });

    this.api.getUsers$().subscribe(users => {
      this.computeUserStats(users);
      this.tryInitCharts();
    });
  }

  ngAfterViewInit() {
    this.tryInitCharts();
  }

  /* =====================
     COMPUTATIONS
  ===================== */
  private computeTaskStats(tasks: any[]) {
    this.taskStats.total = tasks.length;
    this.taskStats.completed = tasks.filter(t => t.status === 'completed').length;
    this.taskStats.inProgress = tasks.filter(t => t.status === 'in-progress').length;
    this.taskStats.pending = tasks.filter(t => t.status === 'pending').length;
  }

  private computeUserStats(users: any[]) {
    this.userStats.totalUsers = users.length;

    this.userStats.canCreateUser =
      users.filter(u => u.permissions?.createUser).length;

    this.userStats.canCreateTask =
      users.filter(u => u.permissions?.createTask).length;

    this.userStats.canEditTask =
      users.filter(u => u.permissions?.editTask).length;

    this.userStats.canDeleteTask =
      users.filter(u => u.permissions?.deleteTask).length;
  }

  /* =====================
     SAFE CHART INIT
  ===================== */
  private tryInitCharts() {
    if (this.chartsInitialized) return;

    if (
      this.taskStats.total > 0 &&
      this.userStats.totalUsers > 0 &&
      document.getElementById('taskPie') &&
      document.getElementById('userBar')
    ) {
      this.initTaskChart();
      this.initUserChart();

      this.chartsInitialized = true;
      this.loading = false;
    }
  }

  /* =====================
     CHARTS
  ===================== */
  private initTaskChart() {
    new Chart('taskPie', {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [{
          data: [
            this.taskStats.completed,
            this.taskStats.inProgress,
            this.taskStats.pending,
          ],
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
          borderWidth: 0,
        }]
      },
      options: {
        cutout: '72%',
        plugins: { legend: { position: 'bottom' } },
        maintainAspectRatio: false,
      }
    });
  }

  private initUserChart() {
    new Chart('userBar', {
      type: 'bar',
      data: {
        labels: ['Create User', 'Create Task', 'Edit Task', 'Delete Task'],
        datasets: [{
          data: [
            this.userStats.canCreateUser,
            this.userStats.canCreateTask,
            this.userStats.canEditTask,
            this.userStats.canDeleteTask,
          ],
          backgroundColor: '#3b82f6',
          borderRadius: 6,
          maxBarThickness: 40,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#e5e7eb' } },
        },
        maintainAspectRatio: false,
      }
    });
  }
}
