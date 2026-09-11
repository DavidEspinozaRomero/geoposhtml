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

  it('should open the first FAQ by default and toggle single-open', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(compiled.querySelectorAll('.faq-button')) as HTMLButtonElement[];
    const panels = Array.from(compiled.querySelectorAll('.faq-panel')) as HTMLElement[];

    expect(panels[0].classList.contains('open')).toBe(true);
    expect(panels[1].classList.contains('open')).toBe(false);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');

    buttons[1].click();
    fixture.detectChanges();
    expect(panels[0].classList.contains('open')).toBe(false);
    expect(panels[1].classList.contains('open')).toBe(true);
    expect(buttons[1].getAttribute('aria-expanded')).toBe('true');

    buttons[1].click();
    fixture.detectChanges();
    expect(panels[1].classList.contains('open')).toBe(false);
  });
});
