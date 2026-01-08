import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todomodel } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private readonly API_URL = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) { }

   
  getTodos(): Observable<Todomodel[]> {
    return this.http.get<Todomodel[]>(this.API_URL);
  }
 
  getTodoById(id: number): Observable<Todomodel> {
    return this.http.get<Todomodel>(`${this.API_URL}/${id}`);
  }
 
  createTodo(todo: Todomodel): Observable<Todomodel> {
    return this.http.post<Todomodel>(this.API_URL, todo);
  }
 
  updateTodo(id: number, todo: Todomodel): Observable<Todomodel> {
    return this.http.put<Todomodel>(`${this.API_URL}/${id}`, todo);
  }

 
  patchTodo(id: number, data: Partial<Todomodel>): Observable<Todomodel> {
    return this.http.patch<Todomodel>(`${this.API_URL}/${id}`, data);
  }
 
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
