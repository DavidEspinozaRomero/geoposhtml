import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RoadmapComponent } from './roadmap.component';

describe('RoadmapComponent', () => {
  let component: RoadmapComponent;
  let fixture: ComponentFixture<RoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadmapComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render brand name and hero title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.landing-brand')?.textContent).toContain('JornadaGo');
    expect(compiled.querySelector('.hero-title')?.textContent).toContain('Roadmap');
  });

  it('should show the active Roadmap nav link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = Array.from(compiled.querySelectorAll('a')).find(
      (a) => a.getAttribute('routerlink') === '/roadmap',
    );
    expect(link).toBeTruthy();
    expect(link?.textContent).toContain('Roadmap');
  });

  it('should render six available features', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const available = Array.from(compiled.querySelectorAll('.roadmap-card')).filter((card) =>
      card.textContent?.includes('Disponible'),
    );
    expect(available.length).toBe(6);
  });

  it('should render two upcoming features', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const upcoming = Array.from(compiled.querySelectorAll('.roadmap-card-future'));
    expect(upcoming.length).toBe(2);
  });

  it('should render the login CTA', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(links).toContain('/login');
  });
});
