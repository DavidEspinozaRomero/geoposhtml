import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { UpperCasePipe, NgClass } from '@angular/common';

import { Company, Employee, Workday, WorkdaysResponse } from '../../../../models';
import { EmployeesService } from '../../../../services/employees.service';
import { CompaniesService } from '../../../../services/companies.service';
import { WordaysService } from '../../../../services/wordays.service';

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
  wordaysService = inject(WordaysService);
  private readonly cdr = inject(ChangeDetectorRef);
  employees: Employee[] = [];
  employee: Employee | undefined;
  companies: Company[] = [];
  // comapany: Company | undefined;
  day = new Date().getDay();

  config = {
    loading: false,
  };

  ngOnInit(): void {
    this.initApis();
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
        this.cdr.detectChanges();
      });

    this.companiesService
      .getCompanies()
      .subscribe((companies) => {
        this.companies = companies;
      })
      .add(() => {
        // agregar loader
        this.cdr.detectChanges();
      });
  }

  getWorkdaysByEmployee(employeeID: number) {
    this.wordaysService
      .getWordaysByEmployee(employeeID)
      .subscribe()
      .add(() => {
        this.cdr.detectChanges();
      });
  }

  // getEmployee(employee: Employee) {
  getEmployee(target: HTMLSelectElement) {
    const employeeID = target.value;
    const employee = this.employees.find((employee) => employeeID == employee.id);
    if (!employee) return;
    if (!employee.workdays) this.getAndFillWorkdays(+employeeID, employee);
    this.employee = employee;
  }

  getAndFillWorkdays(employeeID: number, employee: Employee) {
    let workdaysByEmployee: WorkdaysResponse[];
    this.wordaysService
      .getWordaysByEmployee(employeeID)
      .subscribe((workdays) => {
        workdaysByEmployee = workdays;
      })
      .add(() => {
        employee.workdays = Array(7)
          .fill(0)
          .map((_, i) => {
            const workdaysByDay = workdaysByEmployee.filter((workday) => workday.day === i);
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
        this.cdr.detectChanges();
      });
  }

  getCompanyById(id: number) {
    return this.companies.find((company) => Number(company.id) === id)?.name ?? '404';
  }

  addCompany(target: HTMLSelectElement, workday: Workday) {
    const companyID = +target.value;

    if (!workday.companiesIDs?.includes(companyID)) {
      workday.companiesIDs?.push(companyID);
    }
    target.value = '';
  }
  removeCompany(workday: Workday, companyID: number) {
    // TODO: mostrar modal de confirmacion
    const found = workday.companies?.find((company) => company.companyID == companyID);

    if (found) {
      this.wordaysService
        .deleteWorday(found.id!)
        .subscribe()
        .add(() => {
          const companyidx = workday.companies?.indexOf(found) ?? -1;
          const idx = workday.companiesIDs?.indexOf(companyID) ?? -1;
          if (idx === -1 || companyidx === -1) {
            return;
          }
          workday.companiesIDs?.splice(idx, 1);
          workday.companies?.splice(companyidx, 1);
        });
    } else {
      const idx = workday.companiesIDs?.indexOf(companyID) ?? -1;
      if (idx === -1) {
        return;
      }
      workday.companiesIDs?.splice(idx, 1);
    }
  }

  onSubmit() {
    const employee = structuredClone(this.employee);
    const workdays = employee?.workdays?.filter((workday) => workday.companiesIDs!.length > 0);
    if (!workdays?.length) return; // no hay nuevas asignaciones

    const workdaysFiltered = workdays
      .map((workday) => {
        if (workday.companies?.length == 0) {
          const { day, companiesIDs } = workday;
          return { day, companyIds: companiesIDs };
        }

        const companiesIds = workday.companies?.map((company) => company.companyID);
        const companyIds = workday.companiesIDs?.filter((val) => !companiesIds?.includes(val));

        if (!companyIds?.length) return;

        return {
          day: workday.day,
          companyIds,
        };
      })
      .filter((x) => x != undefined);

    if (workdaysFiltered.length === 0) {
      return;
    }

    const json = {
      employeeId: employee?.id,
      workdays: workdaysFiltered,
    };

    this.createWorkdaysByEmployee(json);
  }

  createWorkdaysByEmployee(json: Record<string, unknown>) {
    this.config.loading = true;
    this.wordaysService
      .createWorkdaysByEmployee(json)
      .subscribe()
      .add(() => {
        this.config.loading = false;
      });
  }
}
