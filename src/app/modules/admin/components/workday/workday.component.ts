import { Component, OnInit, inject } from '@angular/core';
import { UpperCasePipe, NgClass, JsonPipe } from '@angular/common';

import {
  Company,
  Employee,
  Workday,
  WorkdaysResponse,
} from '../../../../models';
import { EmployeesService } from '../../../../services/employees.service';
import { CompaniesService } from '../../../../services/companies.service';
import { WordaysService } from '../../../../services/wordays.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-workday',
  standalone: true,
  imports: [NgClass, UpperCasePipe, JsonPipe],
  templateUrl: './workday.component.html',
  styleUrl: './workday.component.scss',
})
export class WorkdayComponent implements OnInit {
  employeesService = inject(EmployeesService);
  companiesService = inject(CompaniesService);
  wordaysService = inject(WordaysService);
  employees: Employee[] = [];
  employee: Employee | undefined;
  companies: Company[] = [];
  // comapany: Company | undefined;
  day = new Date().getDay();

  config = {
    loading: false,
  };

  constructor() {}
  ngOnInit(): void {
    this.initApis();
    this.getWorkdaysByEmployee(17);
  }

  initApis() {
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

  getWorkdaysByEmployee(employeeID: number) {
    this.wordaysService.getWordaysByEmployee(employeeID).subscribe();
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
    if (!employee.workdays) this.getAndFillWorkdays(employeeID, employee);
    this.employee = employee;
  }

  getAndFillWorkdays(employeeID: number, employee: Employee) {
    let workdaysByEmployee: WorkdaysResponse[];
    this.wordaysService
      .getWordaysByEmployee(employeeID)
      .subscribe((workdays) => {
        console.log(workdays);
        workdaysByEmployee = workdays;
      })
      .add(() => {
        employee.workdays = Array(7)
          .fill(0)
          .map((_, i) => {
            const workdaysByDay = workdaysByEmployee.filter(
              (workday) => workday.day === i
            );
            return {
              day: i,
              companies: workdaysByDay.map((workday) => {
                const { companyID, id } = workday;
                return {
                  id,
                  companyID,
                };
              }),
              companiesIDs: workdaysByDay.map((workday) => workday.companyID),
            };
          });
      });
  }

  getCompanyById(id: number) {
    return this.companies.find((company) => +company.id! == id)?.name ?? '404';
  }

  addCompany(target: any, workday: Workday) {
    const companyID = +target.value;

    if (!workday.companiesIDs?.includes(companyID)) {
      workday.companiesIDs?.push(companyID);
    }
    target.value = '';
  }
  removeCompany(workday: Workday, companyID: number) {
    // TODO: mostrar modal de confirmacion
    const found = workday.companies?.find(
      (company) => company.companyID == companyID
    );

    if (found) {
      this.wordaysService
        .deleteWorday(found.id!)
        .subscribe((res) => {})
        .add(() => {
          const companyidx = workday.companies?.indexOf(found) ?? -1;
          const idx = workday.companiesIDs?.indexOf(companyID) ?? -1;
          if (idx == -1 || companyidx == -1) {
            console.log('no existe');
            return;
          }
          workday.companiesIDs?.splice(idx, 1);
          workday.companies?.splice(companyidx, 1);
        });
    } else {
      const idx = workday.companiesIDs?.indexOf(companyID) ?? -1;
      if (idx == -1) {
        console.log('no existe');
        return;
      }
      workday.companiesIDs?.splice(idx, 1);
    }
  }

  onSubmit() {
    let employee = structuredClone(this.employee);
    let workdays = employee?.workdays?.filter(
      (workday) => workday.companiesIDs!.length > 0
    );
    if (!workdays?.length) return; // no hay nuevas asignaciones

    let workdaysFiltered = workdays
      .map((workday) => {
        if (workday.companies?.length == 0) {
          const { day, companiesIDs } = workday;
          return { day, companyIds: companiesIDs };
        }

        const companiesIds = workday.companies?.map(
          (company) => company.companyID
        );
        const companyIds = workday.companiesIDs?.filter(
          (val) => !companiesIds?.includes(val)
        );

        if (!companyIds?.length) return;

        return {
          day: workday.day,
          companyIds,
        };
      })
      .filter((x) => x != undefined);

    if (workdaysFiltered.length === 0) {
      console.log('No hay nuevas asignaciones');
      return;
    }

    const json = {
      employeeId: employee?.id,
      workdays: workdaysFiltered,
    };
    console.log(json);

    this.createWorkdaysByEmployee(json);
  }

  createWorkdaysByEmployee(json: {}) {
    this.config.loading = true;
    this.wordaysService
      .createWorkdaysByEmployee(json)
      .subscribe(() => {})
      .add(() => {
        this.config.loading = false;
      });
  }
}
