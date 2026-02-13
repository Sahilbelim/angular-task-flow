import { Routes } from '@angular/router';
import { Login } from './feature/page/login/login';
import { Home } from './feature/page/home/home';
import { Dashbord } from './feature/page/dashbord/dashbord';
import { Register } from './feature/page/register/register';
import { authGuard } from './core/guards/auth-guard';
import { AdminUsers } from './feature/page/admin-users/admin-users';
import { AdminUsersPage } from './feature/page/admin-users-page/admin-users-page';
import { UsersPage } from './feature/page/user/user';
import { ProfilePage } from './feature/page/profile/profile';
import { ChangePasswordPage } from './feature/page/change-password/change-password';
import { DashboardCharts } from './feature/page/dashboard-charts/dashboard-charts';
export const routes: Routes = [
   
    { path: 'dashboard', component: Home, canActivate: [authGuard], },
    { path: 'login',   component: Login },
    { path: 'register', component: Register },
    {
        path: 'tasks',
        canActivate: [authGuard],
        component: Dashbord
    },
       {
        path: 'users',
           component: UsersPage,
           canActivate: [authGuard]
        
       
    },{
        path: 'profile',
           component: ProfilePage,
           canActivate: [authGuard]
    },
    {
        path: 'change-password',
        component: ChangePasswordPage,
        canActivate: [authGuard]
    },
    {
        path: 'charts',
        component: DashboardCharts
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
   

];
