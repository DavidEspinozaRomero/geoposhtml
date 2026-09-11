import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideBell,
  LucideCalendarCheck,
  LucideCircleArrowRight,
  LucideCircleCheck,
  LucideLayoutGrid,
  LucideMapPin,
  LucideRocket,
  LucideShieldCheck,
  LucideTriangleAlert,
} from '@lucide/angular';

import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    LucideBell,
    LucideCalendarCheck,
    LucideCircleArrowRight,
    LucideCircleCheck,
    LucideLayoutGrid,
    LucideMapPin,
    LucideRocket,
    LucideShieldCheck,
    LucideTriangleAlert,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateMeta({
      description:
        'JornadaGo es la herramienta para controlar el fichaje de tus empleados con geolocalización, planificar jornadas por empresa, gestionar incidencias y centralizar la asistencia en un panel. Probá la demo.',
      path: '/',
    });
  }
}
