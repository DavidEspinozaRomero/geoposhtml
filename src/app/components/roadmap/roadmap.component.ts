import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss',
})
export class RoadmapComponent {}
