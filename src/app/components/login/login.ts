import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submitted = false;
  errorMessage = '';

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.form.invalid) return;

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        const role = res.user.role;
        this.router.navigateByUrl(
          role === 'admin' ? '/administrator/employees' : '/employee/workday'
        );
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Credenciales inválidas';
      },
    });
  }
}
