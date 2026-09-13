import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LucideApple, LucideDynamicIcon, LucideLogOut, type LucideIcon } from '@lucide/angular';
import { Auth } from '../../../services/auth';
import { iconMap } from '../../../shared/ui/icon-map';

@Component({
  selector: 'app-layout-employee',
  standalone: true,
  imports: [RouterModule, TitleCasePipe, LucideDynamicIcon, LucideApple, LucideLogOut],
  templateUrl: './layout-employee.component.html',
  styleUrl: './layout-employee.component.scss',
})
export class LayoutEmployeeComponent {
  router = inject(Router);
  auth = inject(Auth);

  menu: { icon: LucideIcon; label: string; route: string }[] = [
    {
      icon: iconMap['briefcase'],
      label: 'workday',
      route: '/employee/workday',
    },
    {
      icon: iconMap['journal-text'],
      label: 'records',
      route: '/employee/records',
    },
    {
      icon: iconMap['calendar3'],
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
