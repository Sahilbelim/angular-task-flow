 
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Home implements OnInit, AfterViewInit, OnDestroy {

  loading = true;
  dataReady = false;
  hasTaskData = false;
  hasUserData = false;


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

  private destroy$ = new Subject<void>();
  private taskChart?: Chart;
  private userChart?: Chart;
  private viewReady = false;

  constructor(private api: ApiService) { }

  /* =====================
     INIT
  ===================== */
  // ngOnInit() {
  //   this.loading = true;
  //   combineLatest([
  //     this.api.getTasks$(),
  //     this.api.getUsers$(),
  //   ])
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(([tasks, users]) => {
  //       this.computeTaskStats(tasks);
  //       this.computeUserStats(users);

  //       // View is already rendered → safe to draw
  //       if (this.viewReady) {
  //         this.renderCharts();
  //       }

  //       this.loading = false;
  //     });
  // }

  // ngOnInit() {
  //   this.loading = true;

  //   combineLatest([
  //     this.api.getTasks$(),
  //     this.api.getUsers$(),
  //   ])
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(([tasks, users]) => {
  //       this.computeTaskStats(tasks);
  //       this.computeUserStats(users);

  //       this.hasTaskData = tasks.length > 0;
  //       this.hasUserData = users.length > 0;

  //       this.dataReady = true;
  //       this.loading = false;

  //       // ⛑️ Delay chart rendering until DOM + data are ready
  //       queueMicrotask(() => {
  //         if (this.viewReady) {
  //           this.renderCharts();
  //         }
  //       });
  //     });
  // }


  ngOnInit() {
    this.loading = true;
    this.dataReady = false;

    combineLatest([
      this.api.getTasks$(),
      this.api.getUsers$(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([tasks, users]) => {

        // 🚫 IGNORE FIRST EMPTY CACHE EMISSION
        if (!this.hasRealData(tasks, users)) {
          return;
        }

        // ✅ REAL DATA ONLY FROM HERE
        this.computeTaskStats(tasks);
        this.computeUserStats(users);

        this.hasTaskData = tasks.length > 0;
        this.hasUserData = users.length > 0;

        this.loading = false;
        this.dataReady = true;

        // ⛑️ SAFE render AFTER DOM + data
        setTimeout(() => {
          if (this.viewReady) {
            this.renderCharts();
          }
        });
      });
  }

  ngAfterViewInit() {
    this.viewReady = true;

    if (this.dataReady) {
      this.renderCharts();
    }
  }

  // ngAfterViewInit() {
  //   this.viewReady = true;

  //   if (!this.loading) {
  //     this.renderCharts();
  //   }
  // }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.destroyCharts();
  }

  /* =====================
     STATS
  ===================== */
  private computeTaskStats(tasks: any[]) {
    this.taskStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      pending: tasks.filter(t => t.status === 'pending').length,
    };
  }

  private computeUserStats(users: any[]) {
    this.userStats = {
      totalUsers: users.length,
      canCreateUser: users.filter(u => u.permissions?.createUser).length,
      canCreateTask: users.filter(u => u.permissions?.createTask).length,
      canEditTask: users.filter(u => u.permissions?.editTask).length,
      canDeleteTask: users.filter(u => u.permissions?.deleteTask).length,
    };
  }

  /* =====================
     CHARTS (SAFE)
  ===================== */
  // private renderCharts() {
  //   this.destroyCharts();
  //   this.initTaskChart();
  //   this.initUserChart();
  // }

  private renderCharts() {
    this.destroyCharts();

    if (this.hasTaskData) {
      this.initTaskChart();
    }

    if (this.hasUserData) {
      this.initUserChart();
    }
  }
  // private renderCharts() {
  //   this.destroyCharts();

  //   if (this.hasTaskData) {
  //     this.initTaskRingChart(); // 🔥 new chart
  //   }

  //   if (this.hasUserData) {
  //     this.initUserChart();
  //   }
  // }


  private destroyCharts() {
    this.taskChart?.destroy();
    this.userChart?.destroy();
  }

  // private initTaskChart() {
  //   this.taskChart = new Chart('taskPie', {
  //     type: 'doughnut',
  //     data: {
  //       labels: ['Completed', 'In Progress', 'Pending'],
  //       datasets: [{
  //         data: [
  //           this.taskStats.completed,
  //           this.taskStats.inProgress,
  //           this.taskStats.pending,
  //         ],
  //         backgroundColor: [
  //           'rgba(34, 197, 94, 0.85)',   // green
  //           'rgba(245, 158, 11, 0.85)',  // orange
  //           'rgba(239, 68, 68, 0.85)',   // red
  //         ],
  //         // subtle separation
  //         borderColor: '#ffffff',
  //         borderWidth: 3,

  //         hoverBackgroundColor: [
  //           'rgba(34, 197, 94, 1)',
  //           'rgba(245, 158, 11, 1)',
  //           'rgba(239, 68, 68, 1)',
  //         ],
        
  //       }]
  //     },
  //     options: {
  //       cutout: '72%',
  //       plugins: { legend: { position: 'bottom' } },
  //       maintainAspectRatio: false,
  //     }
  //   });
  // }

  // private initTaskChart() {
  //   if (!this.hasTaskData) return;

  //   this.taskChart = new Chart('taskPie', {
  //     type: 'doughnut',
  //     data: {
  //       labels: [
  //         `Completed (${this.taskStats.completed})`,
  //         `In Progress (${this.taskStats.inProgress})`,
  //         `Pending (${this.taskStats.pending})`,
  //       ],
  //       datasets: [{
  //         data: [
  //           this.taskStats.completed,
  //           this.taskStats.inProgress,
  //           this.taskStats.pending,
  //         ],
  //         backgroundColor: [
  //           '#22c55e',
  //           '#f59e0b',
  //           '#ef4444',
  //         ],
  //         borderWidth: 3,
  //         borderColor: '#ffffff',
  //       }],
  //     },
  //     options: {
  //       cutout: '72%',
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       plugins: {
  //         legend: {
  //           position: 'bottom',
  //           labels: {
  //             boxWidth: 14,
  //             padding: 16,
  //             font: { size: 13, weight: 600 },
  //           },
  //         },
  //         tooltip: {
  //           callbacks: {
  //             label: (ctx) => `${ctx.label}`,
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  // private initTaskChart() {
  //   const ctx = document.getElementById('taskPie') as HTMLCanvasElement;
  //   if (!ctx) return;

  //   this.taskChart = new Chart(ctx, {
  //     type: 'doughnut',
  //     data: {
  //       labels: ['Completed', 'In Progress', 'Pending'],
  //       datasets: [{
  //         data: [
  //           this.taskStats.completed,
  //           this.taskStats.inProgress,
  //           this.taskStats.pending,
  //         ],
  //         backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
  //         borderWidth: 4,
  //         borderColor: '#ffffff',
  //       }],
  //     },
  //     options: {
  //       cutout: '75%',
  //       plugins: {
  //         legend: {
  //           position: 'bottom',
  //           labels: { font: { weight: 600 } },
  //         },
  //         tooltip: {
  //           displayColors: false,
  //           callbacks: {
  //             label: (ctx) => {
  //               const label = ctx.label?.toLowerCase() ?? '';
  //               const value = ctx.raw;

  //               // singular / plural handling
  //               const taskWord = value === 1 ? 'task' : 'tasks';

  //               return `  ${taskWord}: ${value}`;
  //             },
  //           },
  //         },
  //       },
  //       maintainAspectRatio: false,
  //     },
  //     plugins: [{
  //       id: 'centerText',
  //       afterDraw: chart => {
  //         const { ctx, width, height } = chart;
  //         ctx.restore();
  //         ctx.font = '700 24px Inter';
  //         ctx.fillStyle = '#111827';
  //         ctx.textAlign = 'center';
  //         ctx.textBaseline = 'middle';
  //         ctx.fillText(
  //           `${this.taskStats.total}`,
  //           width / 2,
  //           height / 2
  //         );
  //         ctx.font = '12px Inter';
  //         ctx.fillStyle = '#6b7280';
  //         ctx.fillText(
  //           'Total Tasks',
  //           width / 2,
  //           height / 2 + 22
  //         );
  //         ctx.save();
  //       },
  //     }],
  //   });
  // }

  private initTaskChart() {
    const ctx = document.getElementById('taskPie') as HTMLCanvasElement;
    if (!ctx) return;

    this.taskChart = new Chart(ctx, {
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
          borderWidth: 4,
          borderColor: '#ffffff',
        }],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { weight: 600 } },
            
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: () => '', // ❌ remove top bold title (Completed)
              label: (ctx) => {
                const label = ctx.label ?? '';
                const value = ctx.raw as number;

                const taskWord = value === 1 ? 'task' : 'tasks';

                return `${label} ${taskWord}: ${value}`;
              },
            },
          },


        },
      },
      plugins: [{
        id: 'centerText',
        afterDraw: chart => {
          const { ctx, chartArea } = chart;
          if (!chartArea) return;

          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2;

          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // 🔢 Number
          ctx.font = '700 28px Inter';
          ctx.fillStyle = '#111827';
          ctx.fillText(
            String(this.taskStats.total),
            centerX,
            centerY - 6
          );

          // 🏷 Label
          ctx.font = '500 13px Inter';
          ctx.fillStyle = '#6b7280';
          ctx.fillText(
            'Total Tasks',
            centerX,
            centerY + 18
          );

          ctx.restore();
        },
      }],
    });
  }

  // private initUserChart() {
  //   this.userChart = new Chart('userBar', {
  //     type: 'bar',
  //     data: {
  //       labels: [
  //         'Create User',
  //         'Create Task',
  //         'Edit Task',
  //         'Delete Task',
  //       ],
  //       datasets: [
  //         {
  //           data: [
  //             this.userStats.canCreateUser,
  //             this.userStats.canCreateTask,
  //             this.userStats.canEditTask,
  //             this.userStats.canDeleteTask,
  //           ],

  //           /* 🎨 PER-BAR COLORS */
  //           backgroundColor: [
  //             'rgba(59, 130, 246, 0.85)',   // blue
  //             'rgba(34, 197, 94, 0.85)',    // green
  //             'rgba(245, 158, 11, 0.85)',   // orange
  //             'rgba(239, 68, 68, 0.85)',    // red
  //           ],

  //           hoverBackgroundColor: [
  //             'rgba(59, 130, 246, 1)',
  //             'rgba(34, 197, 94, 1)',
  //             'rgba(245, 158, 11, 1)',
  //             'rgba(239, 68, 68, 1)',
  //           ],

  //           borderRadius: 10,
  //           borderSkipped: false,
  //           maxBarThickness: 44,
  //         },
  //       ],
  //     },

  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,

  //       plugins: {
  //         legend: {
  //           display: false,
  //         },
  //         tooltip: {
  //           backgroundColor: '#1f2937',
  //           titleColor: '#fff',
  //           bodyColor: '#e5e7eb',
  //           padding: 10,
  //           cornerRadius: 8,
  //           callbacks: {
  //             label: (ctx) => ` ${ctx.raw} users`,
  //           },
  //         },
  //       },

  //       scales: {
  //         x: {
  //           grid: { display: false },
  //           ticks: {
  //             color: '#475569',
  //             font: { weight: 600 },
  //           },
  //         },
  //         y: {
  //           beginAtZero: true,
  //           grid: {
  //             color: '#e5e7eb',
  //             // drawBorder: false,
  //           },
  //           border: {
  //             display: false,
  //           },

  //           ticks: {
  //             color: '#64748b',
  //             stepSize: 1,
  //           },
  //         },
  //       },

  //       animation: {
  //         duration: 900,
  //         easing: 'easeOutQuart',
  //       },
  //     },
  //   });
  // }

  private hasRealData(tasks: any[], users: any[]): boolean {
    return tasks.length > 0 || users.length > 0;
  }

  // private initUserChart() {
  //   if (!this.hasUserData) return;

  //   this.userChart = new Chart('userBar', {
  //     type: 'bar',
  //     data: {
  //       labels: [
  //         'Create User',
  //         'Create Task',
  //         'Edit Task',
  //         'Delete Task',
  //       ],
  //       datasets: [{
  //         label: 'Users',
  //         data: [
  //           this.userStats.canCreateUser,
  //           this.userStats.canCreateTask,
  //           this.userStats.canEditTask,
  //           this.userStats.canDeleteTask,
  //         ],
  //         backgroundColor: [
  //           '#3b82f6',
  //           '#22c55e',
  //           '#f59e0b',
  //           '#ef4444',
  //         ],
  //         borderRadius: 12,
  //         maxBarThickness: 48,
  //       }],
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       plugins: {
  //         legend: { display: false },
  //         tooltip: {
  //           callbacks: {
  //             label: (ctx) => ` ${ctx.raw} users`,
  //           },
  //         },
  //       },
  //       scales: {
  //         x: {
  //           grid: { display: false },
  //           ticks: { font: { weight: 600 } },
  //         },
  //         y: {
  //           beginAtZero: true,
  //           ticks: {
  //             stepSize: 1,
  //             precision: 0,
  //           },
  //         },
  //       },
  //       animation: {
  //         duration: 700,
  //         easing: 'easeOutQuart',
  //       },
  //     },
  //   });
  // }

  private initUserChart() {
    const ctx = document.getElementById('userBar') as HTMLCanvasElement;
    if (!ctx) return;

    this.userChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Create User', 'Create Task', 'Edit Task', 'Delete Task'],
        datasets: [{
          label: 'Users with Permission',
          data: [
            this.userStats.canCreateUser,
            this.userStats.canCreateTask,
            this.userStats.canEditTask,
            this.userStats.canDeleteTask,
          ],
          backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'],
          borderRadius: 10,
          maxBarThickness: 42,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.raw} users`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: {
              display: true,
              text: 'Number of Users',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Permission Type',
            },
          },
        },
      },
    });
  }

  get hasTasks(): boolean {
    return this.taskStats.total > 0;
  }

  // private initTaskRingChart() {
  //   const canvas = document.getElementById('taskRing') as HTMLCanvasElement;
  //   if (!canvas || !this.hasTaskData) return;

  //   const total = this.taskStats.total || 1;

  //   const data = [
  //     this.taskStats.completed,
  //     this.taskStats.inProgress,
  //     this.taskStats.pending,
  //   ];

  //   // const percentage = Math.round(
  //   //   (this.taskStats.completed / total) * 100
  //   // );

  //   const  percentage = this.taskStats.total;

  //   this.taskChart = new Chart(canvas, {
  //     type: 'doughnut',
  //     data: {
  //       labels: ['Completed', 'In Progress', 'Pending'],
  //       datasets: [{
  //         data,
  //         backgroundColor: [
  //           '#22c55e', // green
  //           '#f59e0b', // orange
  //           '#ef4444', // red
  //         ],
  //         borderWidth: 6,
  //         borderColor: '#ffffff',
  //         hoverOffset: 8,
  //       }],
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       cutout: '75%',
  //       plugins: {
  //         legend: { display: false },
  //         tooltip: {
  //           displayColors: false, // 👈 change to false if you want no color box
  //           callbacks: {
  //             title: () => '', // ❌ remove top title line completely
  //             label: (ctx) => {
  //               const value = ctx.raw as number;
  //               return `Completed Tasks: ${value}`;
  //             },
  //           },
  //           // callbacks: {
  //           //   label: ctx => {
  //           //     const value = ctx.raw as number;
  //           //     const percent = Math.round((value / total) * 100);
  //           //     return `${ctx.label}: ${value} (${percent}%)`;
  //           //   },
  //           // },
  //         },
  //       },
  //     },
  //     plugins: [{
  //       id: 'centerText',
  //       afterDraw: chart => {
  //         const { ctx, width, height } = chart;
  //         ctx.save();
  //         ctx.textAlign = 'center';
  //         ctx.textBaseline = 'middle';

  //         ctx.font = '600 14px Inter';
  //         ctx.fillStyle = '#6b7280';
  //         ctx.fillText('Task Progress', width / 2, height / 2 - 16);

  //         ctx.font = '700 28px Inter';
  //         ctx.fillStyle = '#111827';
  //         ctx.fillText(`${percentage}%`, width / 2, height / 2 + 12);

  //         ctx.restore();
  //       },
  //     }],
  //   });
  // }

  private initTaskRingChart() {
    const canvas = document.getElementById('taskRing') as HTMLCanvasElement;
    if (!canvas || !this.hasTaskData) return;

    const total = this.taskStats.total || 0;

    this.taskChart = new Chart(canvas, {
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
          borderWidth: 6,
          borderColor: '#ffffff',
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${ctx.raw} tasks`,
            },
          },
        },
      },
      plugins: [{
        id: 'centerText',
        afterDraw: chart => {
          const { ctx, width, height } = chart;
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.font = '600 13px Inter';
          ctx.fillStyle = '#6b7280';
          ctx.fillText('Total Tasks', width / 2, height / 2 - 14);

          ctx.font = '700 30px Inter';
          ctx.fillStyle = '#111827';
          ctx.fillText(String(total), width / 2, height / 2 + 14);

          ctx.restore();
        },
      }],
    });
  }


}
