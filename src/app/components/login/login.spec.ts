import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Login } from './login';
import { Auth } from '../../services/auth';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let auth: Auth;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    auth = TestBed.inject(Auth);
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill the form and log in with demo credentials', () => {
    const loginSpy = vi.spyOn(auth, 'login').mockReturnValue(
      of({
        access_token: 'access-token',
        user: {
          id: '1',
          username: 'admin',
          role: 'admin',
          employeeId: 1,
        },
      }),
    );
    const navigateSpy = vi.spyOn(component['router'], 'navigateByUrl').mockResolvedValue(true);

    component.fillDemo('admin', 'password123');

    expect(component.form.value).toEqual({ username: 'admin', password: 'password123' });
    expect(loginSpy).toHaveBeenCalledWith({ username: 'admin', password: 'password123' });
    expect(navigateSpy).toHaveBeenCalledWith('/administrator/employees');
  });
});
