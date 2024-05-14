import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout-employee',
  standalone: true,
  imports: [RouterModule, NgClass, TitleCasePipe],
  templateUrl: './layout-employee.component.html',
  styleUrl: './layout-employee.component.scss',
})
export class LayoutEmployeeComponent {
  //#region variables
  router = inject(Router);
  menu = [
    // { icon: '', label: '', route: '' },
    // { icon: 'bi bi-building', label: 'brand name', route: './brand' },
    // { icon: 'bi bi-house-door', label: 'dashboard', route: '/dashboard' },
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
    // { icon: 'bi bi-balloon', label: 'events', route: '/employee/events' },
    {
      icon: 'bi bi-calendar3',
      label: 'calendar',
      route: '/employee/calendary',
    },
    // {
    //   icon: 'bi bi-question-circle',
    //   label: 'help',
    //   route: '/employee/help',
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
