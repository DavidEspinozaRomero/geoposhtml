import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyModalComponent } from './company-modal.component';
import { Company } from '../../../../models';

describe('CompanyModalComponent', () => {
  let component: CompanyModalComponent;
  let fixture: ComponentFixture<CompanyModalComponent>;

  const COMPANY: Company = {
    id: 'comp-1',
    name: 'Google S.A.',
    cif: 'B12345678',
    account: '12/3456789/01',
    address: 'Calle Falsa 123',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stay closed while the open input is false', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should open when the open input flips to true (create mode)', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  it('should reset the form with the company values when a company is provided (edit mode)', async () => {
    fixture.componentRef.setInput('company', COMPANY);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.companyForm.value.name).toBe('Google S.A.');
    expect(component.companyForm.value.id).toBe('comp-1');
  });

  it('should reset the form to empty when the company is cleared (close)', async () => {
    fixture.componentRef.setInput('company', COMPANY);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.companyForm.value.name).toBe('Google S.A.');

    fixture.componentRef.setInput('company', undefined);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.companyForm.value.name).toBe('');
    expect(component.companyForm.value.id).toBe('');
  });
});
