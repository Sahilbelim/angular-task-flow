import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
@Injectable({
  providedIn: 'root',
})
export class PostService {

  private API_URL = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) { }
  
  getPost():Observable<Post[]> {
    return this.http.get<Post[]>(this.API_URL)
   
  
  }
  getPostById(id:number): Observable<Post>{
    return this.http.get<Post>(`${this.API_URL}/${id}`)
  }

  updatePost(id: number,post:Post): Observable<Post> {
    return this.http.put<Post>(`${this.API_URL}/${id}`,post)
  }
  deletePostById(id: number): Observable<Post> {
    return this.http.delete<Post>(`${this.API_URL}/${id}`)
  }
}
