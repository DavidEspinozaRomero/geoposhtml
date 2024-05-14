import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendaryModalComponent } from './calendary-modal.component';

describe('CalendaryModalComponent', () => {
  let component: CalendaryModalComponent;
  let fixture: ComponentFixture<CalendaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendaryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
