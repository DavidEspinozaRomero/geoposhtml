import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { NgClass, TitleCasePipe } from '@angular/common';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [RouterModule, TitleCasePipe, NgClass],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.scss',
})
export class LayoutAdminComponent {
  //#region variables
  router = inject(Router);
  auth = inject(Auth);

  menu = [
    // { icon: '', label: '', route: '' },
    // { icon: 'bi bi-building', label: 'brand name', route: './brand' },
    // { icon: 'bi bi-house-door', label: 'dashboard', route: '/dashboard' },
    {
      icon: 'bi bi-person',
      label: 'employees',
      route: '/administrator/employees',
    },
    {
      icon: 'bi bi-building',
      label: 'companies',
      route: '/administrator/companies',
    },
    {
      icon: 'bi bi-people',
      label: 'workdays',
      route: '/administrator/workdays',
    },
    {
      icon: 'bi bi-journal-text',
      label: 'records',
      route: '/administrator/records',
    },
    { icon: 'bi bi-balloon', label: 'events', route: '/administrator/events' },
    {
      icon: 'bi bi-calendar3',
      label: 'calendar',
      route: '/administrator/calendar',
    },
    // {
    //   icon: 'bi bi-question-circle',
    //   label: 'help',
    //   route: '/administrator/help',
    // },
    // { icon: 'bi bi-box-arrow-left', label: 'log out' },
  ];
  colapse = true;
  //#endregion variables

  //#region methods

  // toggleMenu() {
  //   this.colapse = !this.colapse;
  // }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
  //#endregion methods
}
