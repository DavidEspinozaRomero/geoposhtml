import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  inject,
  viewChild,
  OnChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

import { CompaniesService } from '../../../../services/companies.service';
import { Company } from '../../../../models';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-company-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './company-modal.component.html',
  styleUrl: './company-modal.component.scss',
})
export class CompanyModalComponent implements OnChanges {
  @Input() company: Company | undefined;
  @Output() saveForm = new EventEmitter<Company>();
  fb = inject(FormBuilder);
  companiesService = inject(CompaniesService);
  utilsService = inject(UtilsService);
  btnClose = viewChild<ElementRef<HTMLButtonElement>>('btnClose');

  companyForm = this.fb.nonNullable.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required, Validators.minLength(3)]],
    account: ['', [Validators.required, Validators.minLength(3)]],
    cif: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
  });

  config = {
    loading: false,
    success: false,
    showSpinner: false,
  };

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.company) return;
    // this.companyForm.patchValue(this.company);
    this.companyForm.reset(this.company);
  }

  onSubmit() {
    this.companyForm.markAllAsTouched();
    if (this.companyForm.invalid) return;

    const dataForm = structuredClone(this.companyForm.value);

    const company: Company = {
      id: dataForm.id,
      name: dataForm.name!,
      address: dataForm.address!,
      account: dataForm.account!,
      cif: dataForm.cif!,
    };

    if (!dataForm.id) {
      this.createCompany(company);
      return;
    }
    this.updateCompany(company);
  }

  createCompany(company: Company) {
    this.config.loading = true;
    const { id: _id, ...companyRest } = company;
    this.companiesService
      .createCompany(companyRest)
      .subscribe((newCompany) => {
        this.saveForm.emit(newCompany);
      })
      .add(() => {
        this.config.loading = false;
        this.companyForm.reset();
        this.btnClose()?.nativeElement.click();
      });
    // TODO:  enviar mensaje de exito!
  }

  updateCompany(company: Company) {
    this.config.loading = true;
    this.companiesService
      .updateCompany(company)
      .subscribe((updatedCompany) => {
        this.saveForm.emit(updatedCompany);
      })
      .add(() => {
        this.config.loading = false;
        this.companyForm.reset();
        this.btnClose()?.nativeElement.click();
      }); // TODO: enviar mensaje de exito!
  }
}
