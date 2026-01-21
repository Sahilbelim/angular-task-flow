import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task/user';

  constructor(private http: HttpClient) { }

  /** 👤 VIEW PROFILE */
  getProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.API}/${userId}`);
  }

  /** ✏️ UPDATE PROFILE (email NOT allowed) */
  updateProfile(userId: string, payload: {
    name?: string;
    bio?: string;
    phone?: string;
    address?: string;
  }): Observable<any> {
    return this.http.put(`${this.API}/${userId}`, payload);
  }

  /** 🔐 CHANGE PASSWORD */
  // changePassword(userId: string, newPassword: string): Observable<any> {
  //   return this.http.put(`${this.API}/${userId}`, {
  //     password: newPassword
  //   });
  // }

  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    return this.getProfile(userId).pipe(
      switchMap((user: any) => {
        if (user.password !== currentPassword) {
          throw new Error('Current password is incorrect');
        }

        return this.http.put(
          `${this.API}/${userId}`,
          { password: newPassword }
        );
      })
    );
  }

}
