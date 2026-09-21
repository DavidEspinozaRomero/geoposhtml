import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero CTA to login', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(links).toContain('/login');
  });

  it('should render a public design system navigation link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const designSystemLink = Array.from(compiled.querySelectorAll('a')).find(
      (a) => a.getAttribute('href') === '/design-system',
    );

    expect(designSystemLink?.textContent).toContain('Sistema de diseño');
  });

  it('should render brand name and hero title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.landing-brand')?.textContent).toContain('JornadaGo');
    expect(compiled.querySelector('.hero-title')?.textContent).toContain('Tu equipo marca entrada');
  });

  it('should render features section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.feature-card').length).toBe(6);
  });

  it('should toggle the mobile nav collapse', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toggler = compiled.querySelector('.navbar-toggler') as HTMLButtonElement;
    const collapse = compiled.querySelector('.landing-nav-collapse') as HTMLElement;

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

  it('should render FAQ as native exclusive details accordion', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const details = Array.from(compiled.querySelectorAll<HTMLElement>('details[name="faq"]'));
    const summaries = Array.from(
      compiled.querySelectorAll<HTMLElement>('details[name="faq"] > summary'),
    );

    expect(details.length).toBeGreaterThanOrEqual(3);

    // First panel open by default
    expect(details[0].hasAttribute('open')).toBe(true);
    for (const d of details.slice(1)) {
      expect(d.hasAttribute('open')).toBe(false);
    }

    // All panels share the same name → browser enforces exclusivity
    for (const d of details) {
      expect(d.getAttribute('name')).toBe('faq');
    }

    // Summary text content matches questions
    expect(summaries[0].textContent).toContain('¿Qué necesito para usarlo?');
    expect(summaries[1].textContent).toContain('¿La geolocalización es obligatoria?');
    expect(summaries[2].textContent).toContain('¿Puedo asignar varias empresas a un empleado?');
  });
});
