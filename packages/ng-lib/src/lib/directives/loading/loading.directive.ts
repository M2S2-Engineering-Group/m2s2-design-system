import {
  Directive,
  ElementRef,
  Renderer2,
  OnDestroy,
  effect,
  inject,
  input,
  DOCUMENT,
} from "@angular/core";

const STYLE_ID = "m2s2-loading-directive-styles";
const SPINNER_CLS = "m2s2-btn-spinner";

// Mirrors the btn-spinner-keyframes + btn-spinner mixins in packages/tokens/src/_mixins.scss.
// Directives cannot use styleUrls and the class must be global, so styles are injected at runtime.
function ensureStyles(doc: Document, renderer: Renderer2): void {
  if (doc.getElementById(STYLE_ID)) return;
  const style = renderer.createElement("style") as HTMLStyleElement;
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes m2s2-spin { to { transform: rotate(360deg); } }
    .${SPINNER_CLS} {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: m2s2-spin 0.6s linear infinite;
      vertical-align: middle;
      margin-right: 6px;
      opacity: 0.8;
      flex-shrink: 0;
    }
  `;
  renderer.appendChild(doc.head, style);
}

@Directive({
  selector: "[m2s2Loading]",
  standalone: true,
  host: {
    "[attr.aria-busy]": "m2s2Loading()",
  },
})
export class LoadingDirective implements OnDestroy {
  m2s2Loading = input<boolean>(false);

  private readonly el = inject(ElementRef<HTMLButtonElement>);
  private readonly renderer = inject(Renderer2);
  private readonly doc = inject(DOCUMENT);

  private spinner: HTMLElement | null = null;

  constructor() {
    ensureStyles(this.doc, this.renderer);

    effect(() => {
      const loading = this.m2s2Loading();
      const host = this.el.nativeElement;

      host.disabled = loading;

      if (loading && !this.spinner) {
        this.spinner = this.renderer.createElement("span");
        this.renderer.addClass(this.spinner, SPINNER_CLS);
        this.renderer.setAttribute(this.spinner, "aria-hidden", "true");
        this.renderer.insertBefore(host, this.spinner, host.firstChild);
      } else if (!loading && this.spinner) {
        this.renderer.removeChild(host, this.spinner);
        this.spinner = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.spinner) {
      this.renderer.removeChild(this.el.nativeElement, this.spinner);
      this.spinner = null;
    }
  }
}
