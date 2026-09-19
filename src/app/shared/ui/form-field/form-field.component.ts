import { Component, input } from '@angular/core';

/**
 * Shared form-field container (WU01). Projects the control via `<ng-content>`
 * and renders the optional label plus either the error or the hint message.
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent {
  /** Optional label rendered above the projected control. */
  readonly label = input<string>();

  /** Error message; takes precedence over `hint` when both are set. */
  readonly error = input<string>();

  /** Helper text rendered below the projected control. */
  readonly hint = input<string>();
}
