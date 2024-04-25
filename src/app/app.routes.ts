import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'employee',
    loadComponent: () =>
      import('./modules/employee/workday/workday.component').then(
        (m) => m.WorkdayComponent
      ),
  },
  {
    path: 'administrator',
    children: [
      {
        path: 'employees',
        loadComponent: () =>
          import(
            './modules/admin/components/employees/employees.component'
          ).then((m) => m.EmployeesComponent),
      },
      {
        path: 'companies',
        loadComponent: () =>
          import(
            './modules/admin/components/companies/companies.component'
          ).then((m) => m.CompaniesComponent),
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
    ],
  },

  { path: '**', pathMatch: 'full', redirectTo: 'administrator/records' },
];
