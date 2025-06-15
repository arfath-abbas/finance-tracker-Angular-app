import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransactionService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = `${environment.apiBaseUrl}/api/transactions`;

	getAll(): Observable<any[]> {
		return this.http.get<any[]>(`${this.baseUrl}/getAll`);
	}

	create(tx: any): Observable<any> {
		return this.http.post<any>(`${this.baseUrl}`, tx);
	}

	update(id: number, tx: any): Observable<any> {
		return this.http.put<any>(`${this.baseUrl}/${id}`, tx);
	}

	delete(id: number): Observable<string> {
		return this.http.delete(`${this.baseUrl}/${id}`, {
			responseType: 'text'
		});
	}
}

