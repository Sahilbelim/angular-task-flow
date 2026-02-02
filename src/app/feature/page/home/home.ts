 
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

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Home implements OnInit, AfterViewInit, OnDestroy {

  loading = true;

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
  ngOnInit() {
    combineLatest([
      this.api.getTasks$(),
      this.api.getUsers$(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([tasks, users]) => {
        this.computeTaskStats(tasks);
        this.computeUserStats(users);

        // View is already rendered → safe to draw
        if (this.viewReady) {
          this.renderCharts();
        }

        this.loading = false;
      });
  }

  ngAfterViewInit() {
    this.viewReady = true;

    if (!this.loading) {
      this.renderCharts();
    }
  }

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
  private renderCharts() {
    this.destroyCharts();
    this.initTaskChart();
    this.initUserChart();
  }

  private destroyCharts() {
    this.taskChart?.destroy();
    this.userChart?.destroy();
  }

  private initTaskChart() {
    this.taskChart = new Chart('taskPie', {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [{
          data: [
            this.taskStats.completed,
            this.taskStats.inProgress,
            this.taskStats.pending,
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.85)',   // green
            'rgba(245, 158, 11, 0.85)',  // orange
            'rgba(239, 68, 68, 0.85)',   // red
          ],
          // subtle separation
          borderColor: '#ffffff',
          borderWidth: 3,

          hoverBackgroundColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
          ],
        
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
    this.userChart = new Chart('userBar', {
      type: 'bar',
      data: {
        labels: [
          'Create User',
          'Create Task',
          'Edit Task',
          'Delete Task',
        ],
        datasets: [
          {
            data: [
              this.userStats.canCreateUser,
              this.userStats.canCreateTask,
              this.userStats.canEditTask,
              this.userStats.canDeleteTask,
            ],

            /* 🎨 PER-BAR COLORS */
            backgroundColor: [
              'rgba(59, 130, 246, 0.85)',   // blue
              'rgba(34, 197, 94, 0.85)',    // green
              'rgba(245, 158, 11, 0.85)',   // orange
              'rgba(239, 68, 68, 0.85)',    // red
            ],

            hoverBackgroundColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(34, 197, 94, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(239, 68, 68, 1)',
            ],

            borderRadius: 10,
            borderSkipped: false,
            maxBarThickness: 44,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#fff',
            bodyColor: '#e5e7eb',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.raw} users`,
            },
          },
        },

        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#475569',
              font: { weight: 600 },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#e5e7eb',
              // drawBorder: false,
            },
            border: {
              display: false,
            },

            ticks: {
              color: '#64748b',
              stepSize: 1,
            },
          },
        },

        animation: {
          duration: 900,
          easing: 'easeOutQuart',
        },
      },
    });
  }

  get hasTasks(): boolean {
    return this.taskStats.total > 0;
  }


}
