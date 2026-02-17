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

  /* =====================================================
     UI STATE
  ===================================================== */
  loading = true;
  dataReady = false;
  hasTaskData = false;
  hasUserData = false;

  /* =====================================================
     STATISTICS DATA MODELS
  ===================================================== */
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

  /* =====================================================
     INTERNAL STATE
  ===================================================== */
  private destroy$ = new Subject<void>();
  private taskChart?: Chart;
  private userChart?: Chart;
  private domReady = false;
  private latestTasks: any[] = [];
  private latestUsers: any[] = [];

  constructor(
    private api: ApiService,
    private http: CommonApiService
  ) { }

  /* =====================================================
     COMPONENT INIT
     Waits for backend hydration then listens to store
  ===================================================== */
  ngOnInit() {

    this.loading = true;
    this.dataReady = false;

    this.api.initialDataResolved$
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolved => {

        if (!resolved) {
          this.loading = true;
          return;
        }

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

  /* =====================================================
     DOM READY
     Ensures canvas elements exist before rendering charts
  ===================================================== */
  ngAfterViewInit() {
    this.domReady = true;
    this.tryRenderCharts();
  }

  /* =====================================================
     CLEANUP
  ===================================================== */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCharts();
  }

  /* =====================================================
     STATISTICS CALCULATIONS
  ===================================================== */
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

  /* =====================================================
     CHART RENDER CONTROL
  ===================================================== */
  private tryRenderCharts() {
    if (!this.domReady || !this.dataReady) return;
    this.renderChartsSafely();
  }

  private renderChartsSafely() {

    requestAnimationFrame(() => {
      setTimeout(() => {

        if (!this.domReady || !this.dataReady) return;

        const pie = document.getElementById('taskPie');
        const bar = document.getElementById('userBar');

        if (!pie && !bar) return;

        this.renderCharts();

      });
    });
  }

  /* =====================================================
     CHART INITIALIZATION
  ===================================================== */
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

  /* =====================================================
     TASK DOUGHNUT CHART
  ===================================================== */
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
              title: () => '',
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

          ctx.font = '700 28px Inter';
          ctx.fillStyle = '#111827';
          ctx.fillText(String(this.taskStats.total), centerX, centerY - 6);

          ctx.font = '500 13px Inter';
          ctx.fillStyle = '#6b7280';
          ctx.fillText('Total Tasks', centerX, centerY + 18);

          ctx.restore();
        },
      }],
    });
  }

  /* =====================================================
     USER PERMISSION BAR CHART
  ===================================================== */
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
            title: { display: true, text: 'Number of Users' },
          },
          x: {
            title: { display: true, text: 'Permission Type' },
          },
        },
      },
    });
  }

  /* =====================================================
     TEMPLATE HELPERS
  ===================================================== */
  get hasTasks(): boolean {
    return this.taskStats.total > 0;
  }

}
