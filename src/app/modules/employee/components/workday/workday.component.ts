import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { RecordService } from '../../../../services/record.service';
import { Company, Record } from '../../../../models';
import { CompaniesService } from '../../../../services/companies.service';
import { UtilsService } from '../../../../services/utils.service';
import { Observable } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-workday',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, DatePipe, JsonPipe],
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
  incidentForm = this.fb.control('', [Validators.minLength(3)]);

  constructor() {}

  ngOnInit(): void {
    // si hay jornada laboral iniciada
    // si no hay jornada laboral iniciada
    // traer lista de empresas
    this.companiesService.getCompanies().subscribe((companies) => {
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

  // iniciar jornada
  startWorkday() {
    // llamar a la api para registrar la jornada
    this.companyIdForm.markAllAsTouched();
    if (!this.companyIdForm.valid)
      return console.log('No se ha seleccionado una empresa');

    this.getLocation()
      .catch((error) => console.log(error))
      .then((position: any) => {
        // this.googlemapurl = `https://maps.google.com/?q=${this.position.coords.latitude},${this.position.coords.longitude}`;
        // llamar a la api para registrar la jornada
        const newRecord: Partial<Record> = {
          companyId: this.companyIdForm.value!,
          startTimestamp: new Date().getTime(),
          geoStart: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
        };
        this.recordService.newRecord(newRecord).subscribe((record: any) => {
          console.log(record);
          const company = this.companies?.find(
            (company) => company.id == record.companyId
          );
          record.companyName = company?.name ?? '';
          this.record = record as Record;
        });
        this.message = undefined;
      });
  }

  // finalizar jornada
  endWorkday() {
    // llamar a la api para registrar la jornada
    this.incidentForm.markAllAsTouched();
    if (!this.incidentForm.valid)
      return console.log('No se ha registrado el incidente');

    this.getLocation()
      .catch((error) => console.log(error))
      .then((position: any) => {
        const updatedRecord = {
          ...this.record,
          endTimestamp: new Date().getTime(),
          geoEnd: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          incident: this.incidentForm.value ?? '',
        };
        this.recordService
          .updateRecordByEmployee(updatedRecord)
          .subscribe((record) => {
            console.log('Jornada finalizada');
            console.log(record);
            this.record = record as Record;
          });
      });
  }

  isValid(control: FormControl) {
    return control.errors && control.touched;
  }
}
