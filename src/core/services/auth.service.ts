import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

      constructor(private readonly router: Router) {}

    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiBaseUrl}/api/auth`;

    login(payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/login`, payload);
    }

    signup(payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/signup`, payload);
    }

    logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}