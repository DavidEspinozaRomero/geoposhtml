import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss',
})
export class RoadmapComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateMeta({
      description:
        'Descubrí lo que ya ofrece JornadaGo y las próximas mejoras: avisos por email y exportación de registros en Excel y PDF.',
      path: '/roadmap',
    });
  }
}
