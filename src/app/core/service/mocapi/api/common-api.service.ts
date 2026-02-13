// // import { Injectable } from '@angular/core';
// // import { HttpClient, HttpParams } from '@angular/common/http';
// // import { Observable } from 'rxjs';
// // import { API_BASE } from './api-endpoints';

// // @Injectable({ providedIn: 'root' })
// // export class CommonApiService {

// //     constructor(private http: HttpClient) { }

// //     get<T>(endpoint: string, params?: any): Observable<T> {
// //         return this.http.get<T>(`${API_BASE}/${endpoint}`, {
// //             params: params ? new HttpParams({ fromObject: params }) : undefined
// //         });
// //     }

// //     post<T>(endpoint: string, body: any): Observable<T> {
// //         return this.http.post<T>(`${API_BASE}/${endpoint}`, body);
// //     }

// //     put<T>(endpoint: string, body: any): Observable<T> {
// //         return this.http.put<T>(`${API_BASE}/${endpoint}`, body);
// //     }

// //     delete<T>(endpoint: string): Observable<T> {
// //         return this.http.delete<T>(`${API_BASE}/${endpoint}`);
// //     }
// // }


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class CommonApiService {

//     private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

//     constructor(private http: HttpClient) { }

//     /* ================= USER ================= */

//     getUsers(params?: any): Observable<any[]> {
//         return this.http.get<any[]>(`${this.API}/user`, { params });
//     }

//     getUserById(id: string | number): Observable<any> {
//         return this.http.get<any>(`${this.API}/user/${id}`);
//     }

//     createUser(body: any): Observable<any> {
//         return this.http.post<any>(`${this.API}/user`, body);
//     }

//     updateUser(id: string | number, body: any): Observable<any> {
//         return this.http.put<any>(`${this.API}/user/${id}`, body);
//     }

//     deleteUser(id: string | number): Observable<any> {
//         return this.http.delete<any>(`${this.API}/user/${id}`);
//     }

//     /* ================= TASKS ================= */

//     getTasks(): Observable<any[]> {
//         return this.http.get<any[]>(`${this.API}/tasks`);
//     }

//     createTask(body: any): Observable<any> {
//         return this.http.post<any>(`${this.API}/tasks`, body);
//     }

//     updateTask(id: string | number, body: any): Observable<any> {
//         return this.http.put<any>(`${this.API}/tasks/${id}`, body);
//     }

//     deleteTask(id: string | number): Observable<any> {
//         return this.http.delete<any>(`${this.API}/tasks/${id}`);
//     }

//     /* ================= COUNTRIES ================= */

//     getCountries(): Observable<any[]> {
//         return this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name');
//     }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonApiService {

    private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

    constructor(private http: HttpClient) { }

    /* ================= USERS ================= */

    getUsers(params?: any): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/user`, { params });
    }

    getUserById(id: string | number): Observable<any> {
        return this.http.get<any>(`${this.API}/user/${id}`);
    }

    createUser(body: any): Observable<any> {
        return this.http.post<any>(`${this.API}/user`, body);
    }

    updateUser(id: string | number, body: any): Observable<any> {
        return this.http.put<any>(`${this.API}/user/${id}`, body);
    }

    deleteUser(id: string | number): Observable<any> {
        return this.http.delete<any>(`${this.API}/user/${id}`);
    }

    /* ================= TASKS ================= */

    getTasks(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/tasks`);
    }

    createTask(body: any): Observable<any> {
        return this.http.post<any>(`${this.API}/tasks`, body);
    }

    updateTask(id: string | number, body: any): Observable<any> {
        return this.http.put<any>(`${this.API}/tasks/${id}`, body);
    }

    deleteTask(id: string | number): Observable<any> {
        return this.http.delete<any>(`${this.API}/tasks/${id}`);
    }

    /* ================= COUNTRIES ================= */

    getCountries(): Observable<any[]> {
        return this.http.get<any[]>(
            'https://restcountries.com/v3.1/all?fields=name'
        );
    }
}
