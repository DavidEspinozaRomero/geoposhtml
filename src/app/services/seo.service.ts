import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  private readonly siteUrl = 'https://jornadago.netlify.app';

  updateMeta(opts: { title?: string; description?: string; path?: string }): void {
    if (opts.title) {
      this.title.setTitle(opts.title);
    }

    if (opts.description) {
      this.meta.updateTag({ name: 'description', content: opts.description });
    }

    const url = opts.path ? `${this.siteUrl}${opts.path}` : this.siteUrl;

    if (opts.title) {
      this.meta.updateTag({ property: 'og:title', content: opts.title });
      this.meta.updateTag({ name: 'twitter:title', content: opts.title });
    }

    if (opts.description) {
      this.meta.updateTag({ property: 'og:description', content: opts.description });
      this.meta.updateTag({ name: 'twitter:description', content: opts.description });
    }

    this.meta.updateTag({ property: 'og:url', content: url });
  }
}
