// // // // import { Injectable } from '@angular/core';
// // // // import { HttpClient, HttpParams } from '@angular/common/http';
// // // // import { Observable } from 'rxjs';
// // // // import { API_BASE } from './api-endpoints';

// // // // @Injectable({ providedIn: 'root' })
// // // // export class CommonApiService {

// // // //     constructor(private http: HttpClient) { }

// // // //     get<T>(endpoint: string, params?: any): Observable<T> {
// // // //         return this.http.get<T>(`${API_BASE}/${endpoint}`, {
// // // //             params: params ? new HttpParams({ fromObject: params }) : undefined
// // // //         });
// // // //     }

// // // //     post<T>(endpoint: string, body: any): Observable<T> {
// // // //         return this.http.post<T>(`${API_BASE}/${endpoint}`, body);
// // // //     }

// // // //     put<T>(endpoint: string, body: any): Observable<T> {
// // // //         return this.http.put<T>(`${API_BASE}/${endpoint}`, body);
// // // //     }

// // // //     delete<T>(endpoint: string): Observable<T> {
// // // //         return this.http.delete<T>(`${API_BASE}/${endpoint}`);
// // // //     }
// // // // }


// // // import { Injectable } from '@angular/core';
// // // import { HttpClient, HttpParams } from '@angular/common/http';
// // // import { Observable } from 'rxjs';

// // // @Injectable({ providedIn: 'root' })
// // // export class CommonApiService {

// // //     private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

// // //     constructor(private http: HttpClient) { }

// // //     /* ================= USER ================= */

// // //     getUsers(params?: any): Observable<any[]> {
// // //         return this.http.get<any[]>(`${this.API}/user`, { params });
// // //     }

// // //     getUserById(id: string | number): Observable<any> {
// // //         return this.http.get<any>(`${this.API}/user/${id}`);
// // //     }

// // //     createUser(body: any): Observable<any> {
// // //         return this.http.post<any>(`${this.API}/user`, body);
// // //     }

// // //     updateUser(id: string | number, body: any): Observable<any> {
// // //         return this.http.put<any>(`${this.API}/user/${id}`, body);
// // //     }

// // //     deleteUser(id: string | number): Observable<any> {
// // //         return this.http.delete<any>(`${this.API}/user/${id}`);
// // //     }

// // //     /* ================= TASKS ================= */

// // //     getTasks(): Observable<any[]> {
// // //         return this.http.get<any[]>(`${this.API}/tasks`);
// // //     }

// // //     createTask(body: any): Observable<any> {
// // //         return this.http.post<any>(`${this.API}/tasks`, body);
// // //     }

// // //     updateTask(id: string | number, body: any): Observable<any> {
// // //         return this.http.put<any>(`${this.API}/tasks/${id}`, body);
// // //     }

// // //     deleteTask(id: string | number): Observable<any> {
// // //         return this.http.delete<any>(`${this.API}/tasks/${id}`);
// // //     }

// // //     /* ================= COUNTRIES ================= */

// // //     getCountries(): Observable<any[]> {
// // //         return this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name');
// // //     }
// // // }

// // import { Injectable } from '@angular/core';
// // import { HttpClient, HttpParams } from '@angular/common/http';
// // import { Observable } from 'rxjs';

// // @Injectable({ providedIn: 'root' })
// // export class CommonApiService {

// //     private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

// //     constructor(private http: HttpClient) { }

// //     /* ================= USERS ================= */

    
// //     // get<T>(endpoint: string, params?: any): Observable<T> {
// //     //     return this.http.get<T>(`${this.API}/${endpoint}`, {
// //     //         params: params ? new HttpParams({ fromObject: params }) : undefined
// //     //     });
// //     // }
// //     getUsers(params?: any): Observable<any[]> {
// //         return this.http.get<any[]>(`${this.API}/user`, { params });
// //     }

// //     getUserById(id: string | number): Observable<any> {
// //         return this.http.get<any>(`${this.API}/user/${id}`);
// //     }

// //     createUser(body: any): Observable<any> {
// //         return this.http.post<any>(`${this.API}/user`, body);
// //     }

// //     updateUser(id: string | number, body: any): Observable<any> {
// //         return this.http.put<any>(`${this.API}/user/${id}`, body);
// //     }

// //     deleteUser(id: string | number): Observable<any> {
// //         return this.http.delete<any>(`${this.API}/user/${id}`);
// //     }

// //     /* ================= TASKS ================= */

// //     getTasks(): Observable<any[]> {
// //         return this.http.get<any[]>(`${this.API}/tasks`);
// //     }

// //     createTask(body: any): Observable<any> {
// //         return this.http.post<any>(`${this.API}/tasks`, body);
// //     }

// //     updateTask(id: string | number, body: any): Observable<any> {
// //         return this.http.put<any>(`${this.API}/tasks/${id}`, body);
// //     }

// //     deleteTask(id: string | number): Observable<any> {
// //         return this.http.delete<any>(`${this.API}/tasks/${id}`);
// //     }

// //     /* ================= COUNTRIES ================= */

// //     getCountries(): Observable<any[]> {
// //         return this.http.get<any[]>(
// //             'https://restcountries.com/v3.1/all?fields=name'
// //         );
// //     }
// // }

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { API_BASE } from './api.config';

// export const ENDPOINTS = {
//     USERS: 'user',
//     USER_BY_ID: (id: string | number) => `user/${id}`,

//     TASKS: 'tasks',
//     TASK_BY_ID: (id: string | number) => `tasks/${id}`,

//     COUNTRIES: 'https://restcountries.com/v3.1/all?fields=name'
// };


// @Injectable({ providedIn: 'root' })
// export class CommonApiService {

//     constructor(private http: HttpClient) { }

//     private url(endpoint: string) {
//         if (endpoint.startsWith('http')) return endpoint;
//         return `${API_BASE}/${endpoint}`;
//     }

//     get<T>(endpoint: string, params?: any): Observable<T> {
//         return this.http.get<T>(this.url(endpoint), {
//             params: params ? new HttpParams({ fromObject: params }) : undefined
//         });
//     }

//     post<T>(endpoint: string, body: any): Observable<T> {
//         return this.http.post<T>(this.url(endpoint), body);
//     }

//     put<T>(endpoint: string, body: any): Observable<T> {
//         return this.http.put<T>(this.url(endpoint), body);
//     }

//     delete<T>(endpoint: string): Observable<T> {
//         return this.http.delete<T>(this.url(endpoint));
//     }
// }


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class CommonApiService {

//     private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

//     constructor(private http: HttpClient) { }

//     /* ================= GENERIC GET ================= */

//     get<T>(endpoint: string, params?: any): Observable<T> {

//         let url = `${this.API}/${endpoint}`;

//         // if id exists → append /id
//         if (params?.id) {
//             url += `/${params.id}`;
//             delete params.id;
//         }

//         const httpParams = params
//             ? new HttpParams({ fromObject: params })
//             : undefined;

//         return this.http.get<T>(url, { params: httpParams });
//     }

//     /* ================= GENERIC POST ================= */

//     post<T>(endpoint: string, body: any): Observable<T> {
//         return this.http.post<T>(`${this.API}/${endpoint}`, body);
//     }

//     /* ================= GENERIC PUT ================= */

//     put<T>(endpoint: string, id: string | number, body: any): Observable<T> {
//         return this.http.put<T>(`${this.API}/${endpoint}/${id}`, body);
//     }

//     /* ================= GENERIC DELETE ================= */

//     delete<T>(endpoint: string, id: string | number): Observable<T> {
//         return this.http.delete<T>(`${this.API}/${endpoint}/${id}`);
//     }

//     /* ================= EXTERNAL ================= */

//     external<T>(url: string): Observable<T> {
//         return this.http.get<T>(url);
//     }
// }

/* =========================================================
   🌐 COMMON API SERVICE
   ---------------------------------------------------------
   Purpose:
   A reusable generic HTTP service used across the entire app
   to communicate with backend APIs.

   Why this exists?
   Instead of writing HttpClient logic in every component,
   we centralize API calls here.

   Benefits:
   ✔ Clean components (no HTTP clutter)
   ✔ Easy backend URL change
   ✔ Reusable CRUD operations
   ✔ Scalable architecture (industry standard pattern)
   ✔ Acts like a mini API SDK for frontend
   ========================================================= */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



/* =========================================================
   Injectable → available globally (Singleton Service)
   ========================================================= */
@Injectable({ providedIn: 'root' })
export class CommonApiService {

    /* -----------------------------------------------------
       Base API URL
       Every endpoint will be appended after this
       Example:
       tasks → https://api/tasks
       users → https://api/users
       ----------------------------------------------------- */
    private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';



    /* -----------------------------------------------------
       HttpClient injection
       Angular built-in service for HTTP communication
       ----------------------------------------------------- */
    constructor(private http: HttpClient) { }



    /* =====================================================
       🟢 GENERIC GET
       -----------------------------------------------------
       Fetch data from server

       Can handle:
       ✔ List fetch
       ✔ Single record fetch
       ✔ Filtered query fetch

       Examples:
       get('tasks') → all tasks
       get('tasks', { id: 5 }) → single task
       get('tasks', { status: 'pending' }) → filtered
       ===================================================== */
    get<T>(endpoint: string, params?: any): Observable<T> {

        // Build base URL
        let url = `${this.API}/${endpoint}`;

        /* -------------------------------------------------
           If params contains id
           → convert to REST URL format

           Instead of:
           /tasks?id=5

           Use:
           /tasks/5
           (More RESTful)
           ------------------------------------------------- */
        if (params?.id) {
            url += `/${params.id}`;
            delete params.id;
        }

        /* -------------------------------------------------
           Convert object to HTTP query params
           Example:
           { status: 'pending', page: 2 }
           → ?status=pending&page=2
           ------------------------------------------------- */
        const httpParams = params
            ? new HttpParams({ fromObject: params })
            : undefined;

        // Perform GET request
        return this.http.get<T>(url, { params: httpParams });
    }



    /* =====================================================
       🟡 GENERIC POST
       -----------------------------------------------------
       Create new record in backend

       Used for:
       ✔ Create task
       ✔ Register user
       ✔ Add comment
       ✔ Any insert operation
       ===================================================== */
    post<T>(endpoint: string, body: any): Observable<T> {

        // POST always sends data in request body
        return this.http.post<T>(`${this.API}/${endpoint}`, body);
    }



    /* =====================================================
       🟠 GENERIC PUT
       -----------------------------------------------------
       Update existing record

       REST pattern:
       PUT /resource/{id}

       Used for:
       ✔ Update task
       ✔ Update profile
       ✔ Change password
       ✔ Edit any data
       ===================================================== */
    put<T>(endpoint: string, id: string | number, body: any): Observable<T> {

        return this.http.put<T>(`${this.API}/${endpoint}/${id}`, body);
    }



    /* =====================================================
       🔴 GENERIC DELETE
       -----------------------------------------------------
       Remove record from server

       Used for:
       ✔ Delete task
       ✔ Delete user
       ✔ Remove any resource
       ===================================================== */
    delete<T>(endpoint: string, id: string | number): Observable<T> {

        return this.http.delete<T>(`${this.API}/${endpoint}/${id}`);
    }



    /* =====================================================
       🌍 EXTERNAL API CALL
       -----------------------------------------------------
       Fetch data from third-party APIs
       (NOT from our backend)

       Used for:
       ✔ Countries list
       ✔ Weather API
       ✔ Payment gateway
       ✔ Maps API

       Example:
       restcountries.com
       ===================================================== */
    external<T>(url: string): Observable<T> {

        return this.http.get<T>(url);
    }
}
