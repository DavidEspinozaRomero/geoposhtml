import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, catchError, throwError, switchMap, shareReplay } from 'rxjs';

import { Auth } from './auth';

const AUTH_LOGIN_PATH = 'auth/login';
const AUTH_REFRESH_PATH = 'auth/refresh';

let refreshInFlight: Observable<string> | null = null;

function doRefresh(auth: Auth): Observable<string> {
  if (!refreshInFlight) {
    refreshInFlight = auth.refreshToken().pipe(
      shareReplay(1),
      finalize(() => (refreshInFlight = null)),
    );
  }
  return refreshInFlight;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (req.url.includes(AUTH_LOGIN_PATH)) {
    return next(req.clone({ withCredentials: true }));
  }

  if (req.url.includes(AUTH_REFRESH_PATH)) {
    return next(req);
  }

  const token = auth.token;
  const authReq = token
    ? req.clone({
        withCredentials: true,
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return doRefresh(auth).pipe(
          switchMap((newToken) => {
            const retryReq = req.clone({
              withCredentials: true,
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            auth.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
