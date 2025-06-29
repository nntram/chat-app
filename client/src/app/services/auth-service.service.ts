import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, pipe, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = 'http://localhost:5000/api/account';
  private httpClient = inject(HttpClient);
  private token = 'token';

  register(data: FormData) : Observable<ApiResponse<string>> {
    return this.httpClient
    .post<ApiResponse<string>>(`${this.baseUrl}/register`, data)
    .pipe(
      tap(response => {
        localStorage.setItem('token', response.data);
      })
    );
  }

  login(email: string, password: string) : Observable<ApiResponse<string>> {
    return this.httpClient
    .post<ApiResponse<string>>(`${this.baseUrl}/login`, {email, password})
    .pipe(
      tap(response => {
        if (response.isSuccess)
        {
          localStorage.setItem('token', response.data);
        }
      })
    );
  }
}
