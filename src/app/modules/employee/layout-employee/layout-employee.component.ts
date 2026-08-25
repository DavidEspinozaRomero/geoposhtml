import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-layout-employee',
  standalone: true,
  imports: [RouterModule, NgClass, TitleCasePipe],
  templateUrl: './layout-employee.component.html',
  styleUrl: './layout-employee.component.scss',
})
export class LayoutEmployeeComponent {
  router = inject(Router);
  auth = inject(Auth);

  menu = [
    {
      icon: 'bi bi-briefcase',
      label: 'workday',
      route: '/employee/workday',
    },
    {
      icon: 'bi bi-journal-text',
      label: 'records',
      route: '/employee/records',
    },
    {
      icon: 'bi bi-calendar3',
      label: 'calendar',
      route: '/employee/calendary',
    },
  ];
  colapse = true;

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
