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
        path: 'admin/users',
        component: AdminUsersPage,
        canActivate: [authGuard]
    },
       {
        path: 'users',
        component: UsersPage,
        // canActivate: [authGuard]
    },{
        path: 'profile',
        component: ProfilePage,
    },
    {
        path: 'change-password',
        component: ChangePasswordPage,
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
   

];
