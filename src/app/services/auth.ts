import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { AuthUser, LoginRequest, LoginResponse, RefreshResponse } from '../models';
import { environment } from '../../environments/environment';

const USER_STORAGE_KEY = 'jornadago_user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + 'auth';

  #user = signal<AuthUser | null>(null);
  #token = signal<string | null>(null);
  #initialized = signal<boolean>(false);

  readonly isLoggedIn = computed(() => this.#token() !== null);
  readonly isReady = this.#initialized.asReadonly();

  get currentUser(): AuthUser | null {
    return this.#user();
  }

  get token(): string | null {
    return this.#token();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.#token.set(res.access_token);
          this.#user.set(res.user);
          this.#persistUser(res.user);
        }),
      );
  }

  refreshToken(): Observable<string> {
    return this.http
      .post<RefreshResponse>(`${this.apiUrl}/refresh`, null, {
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          this.#token.set(res.access_token);
          return res.access_token;
        }),
      );
  }

  restoreSession(): Observable<void> {
    return this.refreshToken().pipe(
      tap(() => {
        this.#restoreUserFromStorage();
        this.#initialized.set(true);
      }),
      catchError(() => {
        this.#clearAll();
        this.#initialized.set(true);
        return of(undefined);
      }),
      map(() => undefined),
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, null, { withCredentials: true }).subscribe({
      error: () => {
        /* fire-and-forget: logout server side es best-effort */
      },
    });
    this.#clearAll();
  }

  #persistUser(user: AuthUser): void {
    try {
      sessionStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role,
          employeeId: user.employeeId,
        }),
      );
    } catch {
      // sessionStorage puede estar lleno o bloqueado — no bloquear el login
    }
  }

  #restoreUserFromStorage(): void {
    try {
      const raw = sessionStorage.getItem(USER_STORAGE_KEY);
      if (raw) {
        const user: AuthUser = JSON.parse(raw);
        this.#user.set(user);
      }
    } catch {
      // JSON parse falló o storage corrupto — dejar user en null
    }
  }

  #clearAll(): void {
    this.#token.set(null);
    this.#user.set(null);
    try {
      sessionStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // ignorar
    }
  }
}
