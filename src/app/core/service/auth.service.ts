import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    permissions?: {
        create?: boolean;
        edit?: boolean;
        delete?: boolean;
    };
}

export interface LoginPayload {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private API_URL = 'http://localhost:5000/api';

    // 🔹 Global auth state
    user = signal<any>(null);
    token = signal<string | null>(localStorage.getItem('token'));

    constructor(private http: HttpClient) { }

    // ✅ REGISTER
    register(data: RegisterPayload) {
        return this.http.post(`${this.API_URL}/auth/register`, data);
    }

    // ✅ LOGIN
    login(data: LoginPayload) {
        return this.http.post<any>(`${this.API_URL}/auth/login`, data).pipe(
            tap((res) => {
                // console.log('Login response:', res.user);
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
                this.token.set(res.token);
                this.user.set(res.user);

                // console.log('User logged in:', res.user);
            })
        );
    }
    


    adminCreateUser(data: any) {
        const token = localStorage.getItem('token');

        return this.http.post(
            `${this.API_URL}/admin/create-user`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    // ✅ LOGOUT
    logout() {
        localStorage.clear();
        this.token.set(null);
        this.user.set(null);
    }

    // ✅ CHECK LOGIN
    isLoggedIn(): boolean {
        const token = this.token();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }


    // ✅ LOAD USER ON REFRESH
    loadFromStorage() {
        const user = localStorage.getItem('user');
        if (user) this.user.set(JSON.parse(user));
    }
    setToken(token: string) {
        this.token.set(token);
        localStorage.setItem('token', token);
    }

    hasPermission(permission: 'create' | 'edit' | 'delete'): boolean {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
        // console.log('Checking permission:', permission, 'for user:', user);

        // ✅ user not loaded yet
        if (!user) {
            return false;
        }

        // ✅ admin has all permissions
        if (user.role === 'admin') {
            return true;
        }

        // ✅ normal user permissions
        return !!user.permissions?.[permission];
    }

}
