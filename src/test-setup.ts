/**
 * Global test setup for the Vitest runner (via @angular/build:unit-test).
 *
 * jsdom (30.x) ships HTMLDialogElement without the modal methods
 * (`showModal` / `close`), a long-standing gap confirmed by the
 * tailwind-migration foundation spike (T-102). These stubs replicate the
 * minimal observable behavior the AppDialogComponent and its consumers rely
 * on in unit tests:
 *
 *  - `showModal()`  reflects the `open` attribute (dialog becomes modal)
 *  - `close()`      removes the `open` attribute and fires a `close` event,
 *                   matching the native behavior the `(close)` binding hears
 *
 * Both stubs define the method only when the environment does not provide it,
 * so the file stays runtime-safe on real browser globals and on future jsdom
 * versions that implement the API.
 */
function stubDialogMethods(): void {
  const proto = HTMLDialogElement.prototype;

  if (typeof proto.showModal !== 'function') {
    proto.showModal = function showModal(this: HTMLDialogElement): void {
      if (this.open) return;
      this.setAttribute('open', '');
    };
  }

  if (typeof proto.close !== 'function') {
    proto.close = function close(this: HTMLDialogElement): void {
      if (!this.open) return;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
}

stubDialogMethods();