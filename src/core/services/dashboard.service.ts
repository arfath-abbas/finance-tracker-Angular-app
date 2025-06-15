import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiBaseUrl}/api/dashboard`;

    getDashboardData(month: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}?month=${month}`);
    }
}
