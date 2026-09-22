import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideFileDown } from '@lucide/angular';

import { ReportsService } from '../../../../services/reports.service';
import {
  AppBtnDirective,
  AppCardDirective,
  AppCardBodyDirective,
  AppFilterLabelDirective,
  AppInputDirective,
} from '../../../../shared/ui';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    FormsModule,
    LucideFileDown,
    AppBtnDirective,
    AppCardDirective,
    AppCardBodyDirective,
    AppFilterLabelDirective,
    AppInputDirective,
  ],
  templateUrl: './reports.component.html',
})
export class ReportsComponent {
  private readonly reportsService = inject(ReportsService);

  month = signal(ReportsComponent.currentMonth());
  downloading = signal(false);
  message = signal('');

  onMonthChange(value: string) {
    this.month.set(value);
    this.message.set('');
  }

  downloadXlsx() {
    const month = this.month();
    if (!month || this.downloading()) return;

    this.downloading.set(true);
    this.message.set('');

    this.reportsService.getMonthlyReport(month, 'xlsx').subscribe({
      next: (blob) => {
        this.downloading.set(false);
        this.triggerDownload(blob, `reporte-${month}.xlsx`);
      },
      error: (err) => {
        this.downloading.set(false);
        this.message.set(this.errorMessage(err.status));
      },
    });
  }

  private errorMessage(status: number): string {
    if (status === 400) return 'El mes debe tener formato YYYY-MM y ser válido';
    if (status === 501) return 'Formato no disponible aún. Probá con XLSX.';
    return 'No se pudo generar el reporte';
  }

  private triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  private static currentMonth(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
  }
}
