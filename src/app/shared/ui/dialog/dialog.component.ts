import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

/**
 * Standalone wrapper around the native `<dialog>` element (REQ-007/008).
 *
 * - `open` signal input drives `showModal()` / `close()` through an effect.
 * - Esc, the native `close` event and a backdrop click all funnel through the
 *   `closeRequest` output so the owning component can reset its selection.
 * - Focus trap, Esc handling and focus-return to the trigger are native
 *   dialog behaviors (REQ-008); body scroll is locked globally via
 *   `body:has(dialog[open])` in `styles.scss`.
 */
@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class AppDialogComponent {
  open = input(false);
  closeRequest = output<void>();

  protected dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  protected sync = effect(() => {
    const dialog = this.dlg().nativeElement;
    if (this.open()) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  });

  onDismiss(): void {
    this.closeRequest.emit();
  }

  onBackdrop(event: MouseEvent): void {
    // Clicks on the ::backdrop surface target the dialog element itself;
    // clicks inside the panel target inner elements and must not close.
    if (event.target === this.dlg().nativeElement) {
      this.closeRequest.emit();
    }
  }
}