import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  inject,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JsonPipe, NgClass } from '@angular/common';

import { CompaniesService } from '../../../../services/companies.service';
import { Company } from '../../../../models';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-company-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, JsonPipe],
  templateUrl: './company-modal.component.html',
  styleUrl: './company-modal.component.scss',
})
export class CompanyModalComponent {
  @Input() company: Company | undefined;
  @Output() onSaveForm = new EventEmitter<Company>();
  fb = inject(FormBuilder);
  companiesService = inject(CompaniesService);
  utilsService = inject(UtilsService);

  btnClose = viewChild<ElementRef<HTMLButtonElement>>('btnClose');
  companyForm = this.fb.nonNullable.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required, Validators.minLength(3)]],
    account: ['', [Validators.required, Validators.minLength(3)]],
    cif: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(11)],
    ],
  });

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.company) return;
    // this.companyForm.patchValue(this.company);
    this.companyForm.reset(this.company);
  }

  onSubmit() {
    this.companyForm.markAllAsTouched();
    if (this.companyForm.invalid) return console.log('Invalid Form'); // agregar mensaje de error

    let dataForm = structuredClone(this.companyForm.value);

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
    const newCompany = this.companiesService.createCompany(company); // TODO: agregar spinner mientras procesa la info
    this.onSaveForm.emit(newCompany);
    this.companyForm.reset();
    // enviar mensaje de exito!
    this.btnClose()?.nativeElement.click();
  }

  updateCompany(company: Company) {
    this.companiesService.updateCompany(company); // TODO: agregar spinner mientras procesa la info
    this.onSaveForm.emit(company);
    this.companyForm.reset();
    // enviar mensaje de exito!
    this.btnClose()?.nativeElement.click();
  }
}
