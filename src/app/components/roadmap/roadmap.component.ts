import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCheck, LucideClock, LucideMapPin } from '@lucide/angular';

import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [RouterLink, LucideCheck, LucideClock, LucideMapPin],
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
