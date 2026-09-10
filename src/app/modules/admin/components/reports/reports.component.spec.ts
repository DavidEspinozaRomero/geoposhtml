import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { ReportsComponent } from './reports.component';
import { ReportsService } from '../../../../services/reports.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let reportsService: ReportsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    reportsService = TestBed.inject(ReportsService);
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default the month to the current month in YYYY-MM', () => {
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    expect(component.month()).toBe(expected);
  });

  it('should disable the download button while downloading', () => {
    component.downloading.set(true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should disable the download button when no month is selected', () => {
    component.month.set('');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should not call the service without a month', () => {
    const getSpy = vi.spyOn(reportsService, 'getMonthlyReport');
    component.month.set('');
    component.downloadXlsx();

    expect(getSpy).not.toHaveBeenCalled();
  });

  it('should download the XLSX blob when the request succeeds', () => {
    const blob = new Blob(['xlsx'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const getSpy = vi.spyOn(reportsService, 'getMonthlyReport').mockReturnValue(of(blob));
    const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);

    component.downloadXlsx();

    expect(getSpy).toHaveBeenCalledWith(component.month(), 'xlsx');
    expect(createSpy).toHaveBeenCalledWith(blob);
    expect(revokeSpy).toHaveBeenCalledWith('blob:mock');
    expect(component.downloading()).toBe(false);
    expect(component.message()).toBe('');
  });

  it('should show the invalid month message on 400', () => {
    vi.spyOn(reportsService, 'getMonthlyReport').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400 })),
    );

    component.downloadXlsx();

    expect(component.message()).toBe('El mes debe tener formato YYYY-MM y ser válido');
    expect(component.downloading()).toBe(false);
  });

  it('should show the unavailable format message on 501', () => {
    vi.spyOn(reportsService, 'getMonthlyReport').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 501 })),
    );

    component.downloadXlsx();

    expect(component.message()).toBe('Formato no disponible aún. Probá con XLSX.');
    expect(component.downloading()).toBe(false);
  });

  it('should show a generic message on other errors', () => {
    vi.spyOn(reportsService, 'getMonthlyReport').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );

    component.downloadXlsx();

    expect(component.message()).toBe('No se pudo generar el reporte');
    expect(component.downloading()).toBe(false);
  });

  it('should clear the message when the month changes', () => {
    component.message.set('algo salió mal');
    component.onMonthChange('2026-10');

    expect(component.month()).toBe('2026-10');
    expect(component.message()).toBe('');
  });
});
