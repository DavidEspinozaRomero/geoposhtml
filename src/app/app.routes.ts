import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/login').then((m) => m.Login) },
  {
    path: 'employee',
    canActivate: [authGuard, roleGuard],
    data: { role: 'employee' },
    loadComponent: () =>
      import('./modules/employee/layout-employee/layout-employee.component').then(
        (m) => m.LayoutEmployeeComponent
      ),
    children: [
      {
        path: 'workday',
        loadComponent: () =>
          import('./modules/employee/components/workday/workday.component').then(
            (m) => m.WorkdayComponent
          ),
      },
      {
        path: 'calendary',
        loadComponent: () =>
          import('./modules/employee/components/calendary/calendary.component').then(
            (m) => m.CalendaryComponent
          ),
      },
      {
        path: 'records',
        loadComponent: () =>
          import('./modules/employee/components/records/records.component').then(
            (m) => m.RecordsComponent
          ),
      },
    ],
  },
  {
    path: 'administrator',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () =>
      import('./modules/admin/layout-admin/layout-admin.component').then(
        (m) => m.LayoutAdminComponent
      ),
    children: [
      {
        path: 'employees',
        loadComponent: () =>
          import('./modules/admin/components/employees/employees.component').then(
            (m) => m.EmployeesComponent
          ),
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./modules/admin/components/companies/companies.component').then(
            (m) => m.CompaniesComponent
          ),
      },
      {
        path: 'workdays',
        loadComponent: () =>
          import('./modules/admin/components/workday/workday.component').then(
            (m) => m.WorkdayComponent
          ),
      },
      {
        path: 'records',
        loadComponent: () =>
          import('./modules/admin/components/records/records.component').then(
            (m) => m.RecordsComponent
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./modules/admin/components/calendar/calendar.component').then(
            (m) => m.CalendarComponent
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./modules/admin/components/events/events.component').then(
            (m) => m.EventsComponent
          ),
      },
    ],
  },

  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
