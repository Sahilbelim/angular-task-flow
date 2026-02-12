import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from './api-endpoints';

@Injectable({ providedIn: 'root' })
export class CommonApiService {

    constructor(private http: HttpClient) { }

    get<T>(endpoint: string, params?: any): Observable<T> {
        return this.http.get<T>(`${API_BASE}/${endpoint}`, {
            params: params ? new HttpParams({ fromObject: params }) : undefined
        });
    }

    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${API_BASE}/${endpoint}`, body);
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${API_BASE}/${endpoint}`, body);
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${API_BASE}/${endpoint}`);
    }
}
