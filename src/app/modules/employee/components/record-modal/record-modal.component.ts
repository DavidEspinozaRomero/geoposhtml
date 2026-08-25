import { Component, Input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Record } from '../../../../models';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-record-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './record-modal.component.html',
  styleUrl: './record-modal.component.scss',
})
export class RecordModalComponent {
  @Input() record: Record | undefined;

  utilsService = inject(UtilsService);

  getGoogleMapUrl(geo: { latitude: number; longitude: number }): string {
    return this.utilsService.getGoogleMapUrl(geo);
  }
}
