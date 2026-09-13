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
    expect(compiled.querySelector('.roadmap-hero h1')?.textContent).toContain('Roadmap');
  });

  it('should show the active Roadmap nav link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = Array.from(compiled.querySelectorAll('a')).find(
      (a) => a.getAttribute('routerlink') === '/roadmap',
    );
    expect(link).toBeTruthy();
    expect(link?.textContent).toContain('Roadmap');
  });

  it('should render seven available features', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const available = Array.from(compiled.querySelectorAll('.timeline-card')).filter((card) =>
      card.textContent?.includes('Disponible'),
    );
    expect(available.length).toBe(7);
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

  it('should toggle the mobile nav collapse', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toggler = compiled.querySelector('.navbar-toggler') as HTMLButtonElement;
    const collapse = compiled.querySelector('.roadmap-nav-collapse') as HTMLElement;

    expect(toggler.getAttribute('aria-expanded')).toBe('false');
    expect(collapse.classList.contains('open')).toBe(false);

    toggler.click();
    fixture.detectChanges();
    expect(toggler.getAttribute('aria-expanded')).toBe('true');
    expect(collapse.classList.contains('open')).toBe(true);

    toggler.click();
    fixture.detectChanges();
    expect(toggler.getAttribute('aria-expanded')).toBe('false');
    expect(collapse.classList.contains('open')).toBe(false);
  });
});
