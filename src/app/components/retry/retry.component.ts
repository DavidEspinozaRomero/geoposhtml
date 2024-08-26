import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-retry',
  standalone: true,
  imports: [],
  templateUrl: './retry.component.html',
  styleUrl: './retry.component.scss',
})
export class RetryComponent {
  @Output() onRetry: EventEmitter<boolean> = new EventEmitter();

  retry() {
    this.onRetry.emit(true);
  }
}
