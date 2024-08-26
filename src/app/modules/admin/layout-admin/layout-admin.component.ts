import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { NgClass, TitleCasePipe } from '@angular/common';

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
  colapse: boolean = true;
  //#endregion variables

  constructor() {}

  ngOnInit(): void {}

  //#region methods

  // toggleMenu() {
  //   this.colapse = !this.colapse;
  // }

  logout() {
    console.log('logout');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth');
  }
  //#endregion methods
}
