import { DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { RecordService } from '../../../../services/record.service';
import { Company, Record } from '../../../../models';
import { CompaniesService } from '../../../../services/companies.service';
import { UtilsService } from '../../../../services/utils.service';

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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

  record?: Record;
  today = new Date();
  googlemapurl?: string;
  message?: string;
  position?: GeolocationPosition;
  companies?: Company[];

  companyIdForm = this.fb.control('', [Validators.required]);
  incidentForm = this.fb.control(null, [Validators.minLength(3)]);

  constructor() {}

  ngOnInit(): void {
    // si hay jornada laboral iniciada
    this.recordService.getActiveWorkdayByEmployee(22).subscribe((record) => {
      this.record = record;
    });

    this.companiesService
      .getCompaniesByEmployeeWorkday(22, this.today.getDay())
      .subscribe((companies) => {
        this.companies = companies;
      });
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          this.position = undefined;
          console.log(error);
          if (error.code == error.PERMISSION_DENIED) {
            this.message = 'Porfavor activa tu geolocalización';
          } else if (error.code == error.POSITION_UNAVAILABLE) {
            this.message =
              'Nose pudo obtener la geolocalización. Porfavor Renintente';
          } else if (error.code == error.TIMEOUT) {
            this.message = 'El tiempo se acabado. Porfavor Reintente';
          } else {
            this.message = 'Error de geolocalización. Porfavor Reintente';
          }
          reject(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 30000,
        }
      );
    });
  }

  startWorkday() {
    this.companyIdForm.markAllAsTouched();
    if (!this.companyIdForm.valid)
      return console.log('No se ha seleccionado una empresa');

    this.getLocation()
      .catch((error) => console.log(error))
      .then((position: any) => {
        const startWorday: Partial<Record> = {
          employeeId: 22,
          companyId: +this.companyIdForm.value!,
          geoStart: {
            accuracy: position.coords.accuracy,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.coords.timestamp ?? new Date().getTime(),
          },
        };
        this.recordService.startWorkday(startWorday).subscribe((record) => {
          const company = this.companies?.find(
            (company) => company.id == record.companyId
          );
          record.companyName = company?.name ?? '';
          this.record = record;
        });
        this.message = undefined;
      });
  }

  endWorkday() {
    this.incidentForm.markAllAsTouched();
    if (!this.incidentForm.valid)
      return console.log('No se ha registrado el incidente');

    this.getLocation()
      .catch((error) => console.log(error))
      .then((position: any) => {
        const endWorday = {
          geoEnd: {
            accuracy: position.coords.accuracy,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.coords.timestamp ?? new Date().getTime(),
          },
          incident: this.incidentForm.value ?? '',
        };

        this.recordService
          .endWorday(this.record!.id, endWorday)
          .subscribe((record) => {
            this.record = { ...this.record, ...record };
          });
      });
  }

  resetWorkday() {
    this.record = undefined;
  }

  getDiffTime(startTimestamp: number, endTimestamp: number): string {
    return this.utilsService.getDiffTime(startTimestamp, endTimestamp);
  }
  isValid(control: FormControl) {
    return control.errors && control.touched;
  }
}
