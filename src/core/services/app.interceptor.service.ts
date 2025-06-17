import { HttpInterceptorFn, HttpErrorResponse} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const token = localStorage.getItem('token');
	const router = inject(Router);

	let authReq = req;

	if (token) {
		authReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
	}

	return next(authReq).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === 401) {
				// Token is expired or invalid
				localStorage.clear(); // or remove token only
				router.navigate(['/login'], { queryParams: { sessionExpired: true } });
			}
			return throwError(() => error);
		})
	);
};
