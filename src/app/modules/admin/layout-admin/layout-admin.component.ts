import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LucideApple, LucideDynamicIcon, LucideLogOut, type LucideIcon } from '@lucide/angular';

import { NgClass, TitleCasePipe } from '@angular/common';
import { Auth } from '../../../services/auth';
import { iconMap } from '../../../shared/ui/icon-map';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [RouterModule, TitleCasePipe, NgClass, LucideDynamicIcon, LucideApple, LucideLogOut],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.scss',
})
export class LayoutAdminComponent {
  //#region variables
  router = inject(Router);
  auth = inject(Auth);

  menu: { icon: LucideIcon; label: string; route: string }[] = [
    // { icon: iconMap['building'], label: 'brand name', route: './brand' },
    // { icon: iconMap['house-door'], label: 'dashboard', route: '/dashboard' },
    {
      icon: iconMap['person'],
      label: 'employees',
      route: '/administrator/employees',
    },
    {
      icon: iconMap['building'],
      label: 'companies',
      route: '/administrator/companies',
    },
    {
      icon: iconMap['people'],
      label: 'workdays',
      route: '/administrator/workdays',
    },
    {
      icon: iconMap['journal-text'],
      label: 'records',
      route: '/administrator/records',
    },
    { icon: iconMap['balloon'], label: 'events', route: '/administrator/events' },
    {
      icon: iconMap['file-earmark-bar-graph'],
      label: 'reports',
      route: '/administrator/reports',
    },
    {
      icon: iconMap['calendar3'],
      label: 'calendar',
      route: '/administrator/calendar',
    },
    // {
    //   icon: iconMap['question-circle'],
    //   label: 'help',
    //   route: '/administrator/help',
    // },
    // { icon: iconMap['box-arrow-left'], label: 'log out' },
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
