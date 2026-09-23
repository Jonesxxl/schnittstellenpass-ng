import { Component, input } from '@angular/core';

/**
 * Image area from the design. Shows the image once a source is set, otherwise
 * a placeholder whose outline follows the current text colour, so it works on
 * light and dark sections alike. The parent must be positioned.
 */
@Component({
  selector: 'app-image-slot',
  host: { class: 'absolute inset-0 block' },
  template: `
    @if (src(); as source) {
      <img [src]="source" [alt]="alt()" loading="lazy" decoding="async" class="h-full w-full object-cover" />
    } @else {
      <div class="placeholder" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <span>{{ placeholder() }}</span>
      </div>
    }
  `,
  // Matches the empty state of the design tool's image slot
  styles: `
    .placeholder {
      position: relative;
      display: flex;
      height: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px;
      text-align: center;
      font: 13px/1.3 system-ui, -apple-system, sans-serif;
      background: rgba(127, 127, 127, 0.08);
    }
    .placeholder::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 1.5px dashed currentColor;
      opacity: 0.35;
      pointer-events: none;
    }
    .placeholder svg {
      opacity: 0.45;
    }
    .placeholder span {
      max-width: 90%;
      font-weight: 500;
      letter-spacing: 0.01em;
      opacity: 0.75;
    }
  `})
export class ImageSlotComponent {
  readonly src = input<string | null | undefined>();
  readonly alt = input('');
  readonly placeholder = input('');
}
