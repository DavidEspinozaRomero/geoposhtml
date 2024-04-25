import { Component, OnInit, inject } from '@angular/core';
import { UpperCasePipe, NgClass } from '@angular/common';

import { EmployeesService } from '../../../../services/employees.service';
import { CompaniesService } from '../../../../services/companies.service';
import { Company, Employee, Workday } from '../../../../models';

@Component({
  selector: 'app-workday',
  standalone: true,
  imports: [NgClass, UpperCasePipe],
  templateUrl: './workday.component.html',
  styleUrl: './workday.component.scss',
})
export class WorkdayComponent implements OnInit {
  employeesService = inject(EmployeesService);
  companiesService = inject(CompaniesService);
  employees: Employee[] = [];
  employee: Employee | undefined;
  companies: Company[] = [];
  // comapany: Company | undefined;
  day = new Date().getDay();

  constructor() {}
  ngOnInit(): void {
    // agregar un ForkJoin para traer todos los datos
    this.employeesService
      .getEmployees()
      .subscribe((employees) => {
        this.employees = employees;
      })
      .add(() => {
        // agregar loader
      });

    this.companiesService
      .getCompanies()
      .subscribe((companies) => {
        this.companies = companies;
      })
      .add(() => {
        // agregar loader
      });
  }

  // getEmployee(employee: Employee) {
  getEmployee(target: any) {
    const employeeID = target.value;
    const employee = this.employees.find(
      (employee) => employeeID == employee.id
    );
    if (!employee) {
      console.log('no existe empleado seleccionado');
      return;
    }
    this.employee = employee;
  }

  getCompanyById(id: string) {
    return this.companies.find((company) => company.id == id)?.name ?? '404';
  }

  addCompany(target: any, workday: Workday) {
    const companyID = target.value;
    if (workday.companiesIDs?.includes(companyID)) {
      console.log('ya existe');
      return;
    } // TODO: mostrar mensaje de error ya existe
    workday.companiesIDs?.push(companyID);
  }
  removeCompany(workday: Workday, companyID: string) {
    const idx = workday.companiesIDs?.indexOf(companyID) ?? -1;
    if (idx == -1) {
      console.log('no existe');
      return;
    }
    workday.companiesIDs?.splice(idx, 1);
  }

  saveWorkdays() {
    console.log(this.employee);

    // TODO: crear una flag para saber si es nuevo/editado o no
    // constuir el objeto Json
    let employee = structuredClone(this.employee);
    // employee?.workdays = employee?.workdays?.filter((workday) => {
    //   return workday?.companiesIDs?.length > 0;
    // });

    // LLamar al servicio para actualizar los datos
  }
}
