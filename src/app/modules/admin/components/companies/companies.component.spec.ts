import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesComponent } from './companies.component';
import { Company } from '../../../../models';

describe('CompaniesComponent', () => {
  let component: CompaniesComponent;
  let fixture: ComponentFixture<CompaniesComponent>;

  const COMPANY: Company = {
    id: 'comp-1',
    name: 'Google S.A.',
    cif: 'B12345678',
    account: '12/3456789/01',
    address: 'Calle Falsa 123',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('openCreate should open the modal in create mode', () => {
    component.openCreate();
    expect(component.modalOpen()).toBe(true);
    expect(component.company()).toBeUndefined();
  });

  it('editCompany should set the company and open the modal', () => {
    component.editCompany(COMPANY);
    expect(component.company()).toEqual(COMPANY);
    expect(component.modalOpen()).toBe(true);
  });

  it('closeModal should clear the company and close the modal', () => {
    component.editCompany(COMPANY);
    component.closeModal();
    expect(component.company()).toBeUndefined();
    expect(component.modalOpen()).toBe(false);
  });
});
