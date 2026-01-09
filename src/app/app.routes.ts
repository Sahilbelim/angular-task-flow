import { Routes } from '@angular/router';
import { Login } from './feature/page/login/login';
import { Home } from './feature/page/home/home';
import { Dashbord } from './feature/page/dashbord/dashbord';
import { Register } from './feature/page/register/register';
import { authGuard } from './core/guards/auth-guard';
export const routes: Routes = [
    { path: '', component:Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path:'dashboard', canActivate:[authGuard] ,component:Dashbord}
];
