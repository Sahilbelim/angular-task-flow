import { Routes } from '@angular/router';
import { Login } from './feature/page/login/login';
import { Home } from './feature/page/home/home';
import { Dashbord } from './feature/page/dashbord/dashbord';

export const routes: Routes = [
    { path: '', component:Home },
    { path: 'login', component: Login },
    {path:'dashbord',component:Dashbord}
];
