import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutEmployeeComponent } from './layout-employee.component';

describe('LayoutEmployeeComponent', () => {
  let component: LayoutEmployeeComponent;
  let fixture: ComponentFixture<LayoutEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayoutEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
