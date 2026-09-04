import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be logged in initially', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser).toBeNull();
    expect(service.token).toBeNull();
  });

  it('should be initialized after restoreSession succeeds', () => {
    expect(service.isReady()).toBe(false);

    service.restoreSession().subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('auth/refresh'));
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ access_token: 'new_access' });

    expect(service.isReady()).toBe(true);
    expect(service.token).toBe('new_access');
  });

  it('should set isReady even when restoreSession fails', () => {
    service.restoreSession().subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('auth/refresh'));
    req.error(new ProgressEvent('error'));

    expect(service.isReady()).toBe(true);
    expect(service.token).toBeNull();
  });

  it('should persist and restore user from sessionStorage', () => {
    const mockUser = { id: '1', username: 'admin', role: 'admin' as const, employeeId: 10 };

    // Simulate login by manually setting user (login pipe does this + persist)
    sessionStorage.setItem('jornadago_user', JSON.stringify(mockUser));

    // New session — restoreSession should pick up from sessionStorage
    service.restoreSession().subscribe();
    const req = httpMock.expectOne((r) => r.url.includes('auth/refresh'));
    req.flush({ access_token: 'tok' });

    expect(service.currentUser).toEqual(mockUser);
  });

  it('should not restore user if sessionStorage is empty', () => {
    service.restoreSession().subscribe();
    const req = httpMock.expectOne((r) => r.url.includes('auth/refresh'));
    req.flush({ access_token: 'tok' });

    expect(service.currentUser).toBeNull();
  });

  it('should clear state on logout', () => {
    // Pre-set state via login flow
    service.restoreSession().subscribe();
    const refreshReq = httpMock.expectOne((r) => r.url.includes('auth/refresh'));
    refreshReq.flush({ access_token: 'some_token' });

    expect(service.isLoggedIn()).toBe(true);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser).toBeNull();
    expect(service.token).toBeNull();
    expect(sessionStorage.getItem('jornadago_user')).toBeNull();

    const logoutReq = httpMock.expectOne((r) => r.url.includes('auth/logout'));
    expect(logoutReq.request.method).toBe('POST');
    expect(logoutReq.request.withCredentials).toBe(true);
    logoutReq.flush({ message: 'ok' });
  });
});
