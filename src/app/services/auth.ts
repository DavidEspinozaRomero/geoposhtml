import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { AuthUser, LoginRequest, LoginResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + 'auth/login';

  #user = signal<AuthUser | null>(null);
  #token = signal<string | null>(null);

  readonly user = this.#user.asReadonly();
  readonly isLoggedIn = computed(() => this.#token() !== null);

  get currentUser(): AuthUser | null {
    return this.#user();
  }

  get token(): string | null {
    return this.#token();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap((res) => {
        this.#token.set(res.access_token);
        this.#user.set(res.user);
      })
    );
  }

  logout(): void {
    this.#token.set(null);
    this.#user.set(null);
  }
}
