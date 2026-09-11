import { Component, OnInit, inject, signal } from '@angular/core';
import { UpperCasePipe, NgClass } from '@angular/common';
import { LucideCircleX } from '@lucide/angular';

import { Company, Employee, Workday, WorkdaysResponse } from '../../../../models';
import { EmployeesService } from '../../../../services/employees.service';
import { CompaniesService } from '../../../../services/companies.service';
import { WordaysService } from '../../../../services/wordays.service';

@Component({
  selector: 'app-workday',
  standalone: true,
  imports: [NgClass, UpperCasePipe, LucideCircleX],
  templateUrl: './workday.component.html',
  styleUrl: './workday.component.scss',
})
export class WorkdayComponent implements OnInit {
  employeesService = inject(EmployeesService);
  companiesService = inject(CompaniesService);
  wordaysService = inject(WordaysService);

  employees = signal<Employee[]>([]);
  employee = signal<Employee | undefined>(undefined);
  companies = signal<Company[]>([]);
  day = new Date().getDay();
  loading = signal(false);

  ngOnInit(): void {
    this.initApis();
  }

  initApis() {
    this.employeesService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
      },
    });

    this.companiesService.getCompanies().subscribe({
      next: (companies) => {
        this.companies.set(companies);
      },
    });
  }

  getEmployee(target: HTMLSelectElement) {
    const employeeID = target.value;
    const found = this.employees().find((e) => employeeID == e.id);
    if (!found) return;
    if (!found.workdays) {
      this.getAndFillWorkdays(+employeeID, found);
    } else {
      this.employee.set(found);
    }
  }

  getAndFillWorkdays(employeeID: number, emp: Employee) {
    this.wordaysService.getWordaysByEmployee(employeeID).subscribe({
      next: (workdaysByEmployee: WorkdaysResponse[]) => {
        emp.workdays = Array(7)
          .fill(0)
          .map((_, i) => {
            const workdaysByDay = workdaysByEmployee.filter((w) => w.day === i);
            return {
              day: i,
              companies: workdaysByDay.map((w) => ({
                id: w.id,
                companyID: w.companyID,
              })),
              companiesIDs: workdaysByDay.map((w) => w.companyID),
            };
          });
        this.employee.set({ ...emp });
      },
    });
  }

  getCompanyById(id: number) {
    return this.companies().find((c) => Number(c.id) === id)?.name ?? '404';
  }

  addCompany(target: HTMLSelectElement, workday: Workday) {
    const companyID = +target.value;
    if (!workday.companiesIDs?.includes(companyID)) {
      workday.companiesIDs?.push(companyID);
    }
    target.value = '';
  }

  removeCompany(workday: Workday, companyID: number) {
    const found = workday.companies?.find((c) => c.companyID == companyID);

    if (found) {
      this.wordaysService.deleteWorday(found.id!).subscribe({
        next: () => {
          const companyidx = workday.companies?.indexOf(found) ?? -1;
          const idx = workday.companiesIDs?.indexOf(companyID) ?? -1;
          if (idx === -1 || companyidx === -1) return;
          workday.companiesIDs?.splice(idx, 1);
          workday.companies?.splice(companyidx, 1);
          this.employee.update((e) => (e ? { ...e } : undefined));
        },
      });
    } else {
      const idx = workday.companiesIDs?.indexOf(companyID) ?? -1;
      if (idx === -1) return;
      workday.companiesIDs?.splice(idx, 1);
    }
  }

  onSubmit() {
    const emp = this.employee();
    const clone = structuredClone(emp);
    const workdays = clone?.workdays?.filter((w) => w.companiesIDs!.length > 0);
    if (!workdays?.length) return;

    const workdaysFiltered = workdays
      .map((workday) => {
        if (workday.companies?.length == 0) {
          const { day, companiesIDs } = workday;
          return { day, companyIds: companiesIDs };
        }

        const companiesIds = workday.companies?.map((c) => c.companyID);
        const companyIds = workday.companiesIDs?.filter((val) => !companiesIds?.includes(val));

        if (!companyIds?.length) return;

        return {
          day: workday.day,
          companyIds,
        };
      })
      .filter((x) => x != undefined);

    if (workdaysFiltered.length === 0) return;

    const json = {
      employeeId: emp?.id,
      workdays: workdaysFiltered,
    };

    this.createWorkdaysByEmployee(json);
  }

  createWorkdaysByEmployee(json: Record<string, unknown>) {
    this.loading.set(true);
    this.wordaysService.createWorkdaysByEmployee(json).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
