 
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
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';

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
  // private viewReady = false;
  private domReady = false;
  private latestTasks: any[] = [];
  private latestUsers: any[] = [];


  constructor(private api: ApiService,
    private http: CommonApiService
  ) { }

  /* =====================
     INIT
  ===================== */


  // ngOnInit() {

  //   combineLatest([
  //     this.api.getTasks$(),
  //     this.api.getUsers$(),
  //   ])
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(([tasks, users]) => {

  //       this.latestTasks = tasks;
  //       this.latestUsers = users;

  //       this.computeTaskStats(tasks);
  //       this.computeUserStats(users);

  //       this.hasTaskData = tasks.length > 0;
  //       this.hasUserData = users.length > 0;

  //       this.loading = false;
  //       this.dataReady = true;

  //       this.tryRenderCharts();
  //     });
  // }

  // ngOnInit() {

  //   // load once from backend
  //   this.loadInitialData();

  //   // listen to store only
  //   combineLatest([
  //     this.api.tasks$,
  //     this.api.users$
  //   ])
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(([tasks, users]) => {

  //       this.latestTasks = tasks;
  //       this.latestUsers = users;

  //       this.computeTaskStats(tasks);
  //       this.computeUserStats(users);

  //       this.hasTaskData = tasks.length > 0;
  //       this.hasUserData = users.length > 0;

  //       this.loading = false;
  //       this.dataReady = true;

  //       this.tryRenderCharts();
  //     });
  // }

  // ngOnInit() {

  //   this.loading = true;

  //   combineLatest([
  //     this.api.tasks$,
  //     this.api.users$
  //   ])
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(([tasks, users]) => {

  //       this.latestTasks = tasks;
  //       this.latestUsers = users;

  //       this.computeTaskStats(tasks);
  //       this.computeUserStats(users);

  //       this.hasTaskData = tasks.length > 0;
  //       this.hasUserData = users.length > 0;

  //       this.loading = false;
  //       this.dataReady = true;

  //       this.tryRenderCharts();
  //     });

  // }


  ngOnInit() {

    this.loading = true;
    this.dataReady = false;

    // 1️⃣ wait for REAL backend hydration
    this.api.initialDataResolved$
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolved => {

        if (!resolved) {
          this.loading = true;
          return;
        }

        // 2️⃣ now listen to store normally
        combineLatest([
          this.api.tasks$,
          this.api.users$
        ])
          .pipe(takeUntil(this.destroy$))
          .subscribe(([tasks, users]) => {

            this.latestTasks = tasks;
            this.latestUsers = users;

            this.computeTaskStats(tasks);
            this.computeUserStats(users);

            this.hasTaskData = tasks.length > 0;
            this.hasUserData = users.length > 0;

            this.loading = false;
            this.dataReady = true;

            this.tryRenderCharts();
          });
      });
  }

  ngAfterViewInit() {
    this.domReady = true;
    this.tryRenderCharts();
  }
  // private tryRenderCharts() {
  //   if (!this.domReady || !this.dataReady) return;
  //   this.renderCharts();
  // }

  private tryRenderCharts() {
    if (!this.domReady || !this.dataReady) return;
    this.renderChartsSafely();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCharts();
  }


  private loadInitialData() {

    // users
    this.http.get<any[]>('user').subscribe(users => {
      this.api.setUsers(users);
    });

    // tasks
    this.http.get<any[]>('tasks').subscribe(tasks => {
      this.api.setTasks(tasks);
    });

  }


  // ngOnInit() {
  //   this.loading = true;
  //   this.dataReady = false;

  //   combineLatest([
  //     this.api.getTasks$(),
  //     this.api.getUsers$(),
  //   ])
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(([tasks, users]) => {

  //       // 🚫 IGNORE FIRST EMPTY CACHE EMISSION
  //       if (!this.hasRealData(tasks, users)) {
  //         return;
  //       }

  //       // ✅ REAL DATA ONLY FROM HERE
  //       this.computeTaskStats(tasks);
  //       this.computeUserStats(users);

  //       this.hasTaskData = tasks.length > 0;
  //       this.hasUserData = users.length > 0;

  //       this.loading = false;
  //       this.dataReady = true;

  //       // ⛑️ SAFE render AFTER DOM + data
  //       setTimeout(() => {
  //         if (this.viewReady) {
  //           this.renderCharts();
  //         }
  //       });
  //     });
  // }

  // ngAfterViewInit() {
  //   this.viewReady = true;

  //   if (this.dataReady) {
  //     this.renderCharts();
  //   }
  // }


  // ngOnDestroy() {
  //   this.destroy$.next();
  //   this.destroy$.complete();

  //   this.destroyCharts();
  // }


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

  private renderCharts() {
    this.destroyCharts();

    if (this.hasTaskData) {
      this.initTaskChart();
    }

    if (this.hasUserData) {
      this.initUserChart();
    }
  }



  private destroyCharts() {
    this.taskChart?.destroy();
    this.userChart?.destroy();
  }


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



  // private hasRealData(tasks: any[], users: any[]): boolean {
  //   return tasks.length > 0 || users.length > 0;
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

  private renderChartsSafely() {

    // wait for Angular DOM render
    requestAnimationFrame(() => {
      setTimeout(() => {

        if (!this.domReady || !this.dataReady) return;

        const pie = document.getElementById('taskPie');
        const bar = document.getElementById('userBar');

        // canvas still not in DOM
        if (!pie && !bar) return;

        this.renderCharts();

      });
    });
  }


}
