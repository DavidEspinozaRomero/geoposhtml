import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [NgClass, RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
  //#region variables
  menu = [
    // { icon: '', label: '', route: '' },
    // { icon: 'bi bi-building', label: 'brand name', route: './brand' },
    { icon: 'bi bi-house-door', label: 'dashboard', route: './dashboard' },
    { icon: 'bi bi-person', label: 'customers', route: './contacts' },
    { icon: 'bi bi-chat', label: 'messages', route: './messages' },
    { icon: 'bi bi-question-circle', label: 'help', route: './help' },
    { icon: 'bi bi-chat', label: 'messages', route: './messages' },
    { icon: 'bi bi-gear', label: 'settings', route: './settings' },
    { icon: 'bi bi-box-arrow-left', label: 'log out' },
  ];
  colapse: boolean = true;
  //#endregion variables
}
