import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCheck, LucideClock, LucideMapPin, LucideMenu } from '@lucide/angular';

import { SeoService } from '../../services/seo.service';
import { AppBadgeDirective, AppCardDirective } from '../../shared/ui';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [
    RouterLink,
    AppBadgeDirective,
    AppCardDirective,
    LucideCheck,
    LucideClock,
    LucideMapPin,
    LucideMenu,
  ],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss',
})
export class RoadmapComponent implements OnInit {
  private seo = inject(SeoService);

  navCollapsed = signal(false);

  ngOnInit(): void {
    this.seo.updateMeta({
      description:
        'Descubrí lo que ya ofrece JornadaGo y las próximas mejoras: avisos por email y reportes en PDF.',
      path: '/roadmap',
    });
  }
}
