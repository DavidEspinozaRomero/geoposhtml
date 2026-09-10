import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';

import { Company, Record } from '../../../../models';
import { RecordService } from '../../../../services/record.service';
import { CompaniesService } from '../../../../services/companies.service';
import { UtilsService } from '../../../../services/utils.service';
import { Auth } from '../../../../services/auth';

import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-workday',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, DatePipe],
  templateUrl: './workday.component.html',
  styleUrl: './workday.component.scss',
})
export class WorkdayComponent implements OnInit {
  fb = inject(FormBuilder);
  recordService = inject(RecordService);
  companiesService = inject(CompaniesService);
  utilsService = inject(UtilsService);
  auth = inject(Auth);

  record = signal<Record | undefined>(undefined);
  today = new Date();
  message = signal<string | undefined>(undefined);
  companies = signal<Company[] | undefined>(undefined);

  companyIdForm = this.fb.control('', [Validators.required]);
  incidentForm = this.fb.control(null, [Validators.minLength(3)]);

  private get employeeId(): number {
    return this.auth.currentUser?.employeeId ?? 0;
  }

  ngOnInit(): void {
    if (!this.employeeId) {
      this.message.set('No se pudo identificar el empleado');
      return;
    }

    this.recordService.getActiveWorkdayByEmployee(this.employeeId).subscribe({
      next: (record) => {
        if (record?.id) {
          this.record.set(record);
        }
      },
    });

    // Backend uses 1=Mon...7=Sun, JS getDay() uses 0=Sun...6=Sat
    const backendDay = this.today.getDay() === 0 ? 7 : this.today.getDay();
    this.companiesService.getCompaniesByEmployeeWorkday(this.employeeId, backendDay).subscribe({
      next: (companies) => this.companies.set(companies),
    });
  }

  getLocation() {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            this.message.set('Por favor activa tu geolocalización');
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            this.message.set('No se pudo obtener la geolocalización. Por favor reintente');
          } else if (error.code === error.TIMEOUT) {
            this.message.set('El tiempo se ha agotado. Por favor reintente');
          } else {
            this.message.set('Error de geolocalización. Por favor reintente');
          }
          reject(error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 },
      );
    });
  }

  startWorkday() {
    this.companyIdForm.markAllAsTouched();
    if (!this.companyIdForm.valid) return;

    this.getLocation()
      .catch(() => undefined as unknown as GeolocationPosition)
      .then((position: GeolocationPosition) => {
        const body = {
          employeeId: this.employeeId,
          companyId: +this.companyIdForm.value!,
          geoStart: {
            accuracy: position.coords.accuracy,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp ?? Date.now(),
          },
        };
        this.recordService.startWorkday(body).subscribe({
          next: (record) => {
            const company = this.companies()!.find(
              (c) => String(c.id) === String(record.companyId),
            );
            record.companyName = company?.name ?? '';
            this.record.set(record);
            this.message.set(undefined);
          },
        });
      });
  }

  endWorkday() {
    this.incidentForm.markAllAsTouched();
    if (!this.incidentForm.valid) return;

    this.getLocation()
      .catch(() => undefined as unknown as GeolocationPosition)
      .then((position: GeolocationPosition) => {
        const body = {
          geoEnd: {
            accuracy: position.coords.accuracy,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp ?? Date.now(),
          },
          incident: this.incidentForm.value ?? '',
        };

        this.recordService.endWorday(this.record()!.id, body).subscribe({
          next: (res) => this.record.update((r) => ({ ...r!, ...res })),
        });
      });
  }

  getGoogleMapUrl(geo: { latitude: number; longitude: number }): string {
    return this.utilsService.getGoogleMapUrl(geo);
  }

  getDiffTime(startTimestamp: number, endTimestamp: number): string {
    return this.utilsService.getDiffTime(startTimestamp, endTimestamp);
  }

  isValid(control: FormControl) {
    return control.errors && control.touched;
  }
}
