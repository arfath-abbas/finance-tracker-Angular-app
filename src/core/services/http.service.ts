import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private readonly baseUrl = environment.apiBaseUrl;
    private readonly http = inject(HttpClient);

    get<T>(endpoint: string, params?: HttpParams): Observable<T> {
        return this.http.get<T>(this.baseUrl + endpoint, { params });
    }

    post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
        return this.http.post<T>(this.baseUrl + endpoint, body, { headers });
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(this.baseUrl + endpoint, body);
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(this.baseUrl + endpoint);
    }

    public handleCatchError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            return of(result as T); // fallback
        };
    }

    handleErrorResponse(error: any): string {
        let errorMessage = 'An unknown error occurred. Please try again later.';

        if (error?.status) {
            switch (error.status) {
                case 400:
                    errorMessage = 'Bad Request. Please check the form data.';
                    break;
                case 401:
                    errorMessage = 'Unauthorized. Please log in again.';
                    break;
                case 403:
                    errorMessage =
                        'Forbidden. You do not have permission to perform this action.';
                    break;
                case 404:
                    errorMessage = 'Resource not found. Please check the endpoint.';
                    break;
                case 500:
                    errorMessage = 'Internal Server Error. Please try again later.';
                    break;
                default:
                    errorMessage = error.message ?? errorMessage;
            }
        }

        return errorMessage;
    }
}
