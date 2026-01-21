import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';
import { AuthService } from './mocapi/auth';

@Injectable({ providedIn: 'root' })
export class DashboardAnalyticsService {

    private USERS_API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task/user';
    private TASKS_API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task/tasks';

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) { }

    /** MAIN DASHBOARD DATA */
    getDashboardStats() {
        const currentUser = this.auth.user();
        const currentUserId = String(currentUser.id);

        return forkJoin({
            users: this.http.get<any[]>(this.USERS_API),
            tasks: this.http.get<any[]>(this.TASKS_API),
        }).pipe(
            map(({ users, tasks }) => {

                /* =====================
                   USER FILTERING LOGIC
                ====================== */

                const relatedUsers = users.filter(u =>
                    u.parentId === currentUserId ||   // children
                    u.id === currentUserId            // myself
                );

                /* =====================
                   TASK FILTERING LOGIC
                ====================== */

                const myTasks = tasks.filter(t =>
                    t.createdBy === currentUserId ||
                    (Array.isArray(t.assignedTo) && t.assignedTo.includes(currentUserId))
                );

                /* =====================
                   TASK STATS
                ====================== */

                const totalTasks = myTasks.length;
                const completed = myTasks.filter(t => t.status === 'completed').length;
                const pending = myTasks.filter(t => t.status === 'pending').length;
                const inProgress = myTasks.filter(t => t.status === 'in-progress').length;

                /* =====================
                   USER PERMISSION STATS
                ====================== */

                const canCreateUser = relatedUsers.filter(u => u.permissions?.createUser).length;
                const canCreateTask = relatedUsers.filter(u => u.permissions?.createTask).length;
                const canEditTask = relatedUsers.filter(u => u.permissions?.editTask).length;
                const canDeleteTask = relatedUsers.filter(u => u.permissions?.deleteTask).length;

                return {
                    taskStats: {
                        total: totalTasks,
                        completed,
                        pending,
                        inProgress,
                    },
                    userStats: {
                        totalUsers: relatedUsers.length,
                        canCreateUser,
                        canCreateTask,
                        canEditTask,
                        canDeleteTask,
                    }
                };
            })
        );
    }
}
