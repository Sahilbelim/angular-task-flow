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
    // external<T>(url: string): Observable<T> {

    //     return this.http.get<T>(url);
    // }
}
