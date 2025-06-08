import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}`;

  getAllTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/transactions/getAll`);
  }

  createTransaction(tx: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, tx);
  }
}
