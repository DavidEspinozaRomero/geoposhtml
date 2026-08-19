import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordModalComponent } from './record-modal.component';

describe('RecordModalComponent', () => {
  let component: RecordModalComponent;
  let fixture: ComponentFixture<RecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordModalComponent);
    component = fixture.componentInstance;
    component.record = {
      id: 1,
      employeeId: 1,
      companyId: 1,
      employeeName: 'Test',
      employeeUsername: 'test',
      companyName: 'TestCo',
      googlemapurl: '',
      geoStart: { accuracy: 0, latitude: 0, longitude: 0, timestamp: Date.now() },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
