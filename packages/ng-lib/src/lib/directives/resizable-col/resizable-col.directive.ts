import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  DestroyRef,
  inject,
  input,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent, switchMap, map, takeUntil } from "rxjs";

@Directive({
  selector: "th[m2s2ResizableCol]",
  standalone: true,
})
export class ResizableColDirective implements OnInit {
  minWidth = input<number>(60);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const th = this.el.nativeElement;
    this.renderer.setStyle(th, "position", "relative");
    this.renderer.setStyle(th, "border-right", "1px solid var(--color-border)");

    const handle: HTMLElement = this.renderer.createElement("div");
    Object.assign(handle.style, {
      position: "absolute",
      right: "0",
      top: "0",
      bottom: "0",
      width: "6px",
      cursor: "col-resize",
    });
    this.renderer.appendChild(th, handle);

    fromEvent<PointerEvent>(handle, "pointerdown")
      .pipe(
        switchMap((start) => {
          start.preventDefault();

          const startX = start.clientX;
          // Border-box width at drag start — precise, sub-pixel accurate
          const startWidth = th.getBoundingClientRect().width;
          // Overhead = horizontal padding + borders; used to convert border-box → content-box
          // so the CSS `width` property (content-box) is set correctly without a jump
          const styles = getComputedStyle(th);
          const overhead =
            parseFloat(styles.paddingLeft) +
            parseFloat(styles.paddingRight) +
            parseFloat(styles.borderLeftWidth) +
            parseFloat(styles.borderRightWidth);

          return fromEvent<PointerEvent>(document, "pointermove").pipe(
            map((move) => {
              const borderBoxWidth = Math.max(
                this.minWidth(),
                startWidth + move.clientX - startX,
              );
              return borderBoxWidth - overhead;
            }),
            takeUntil(fromEvent(document, "pointerup")),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((contentWidth) => {
        this.renderer.setStyle(th, "width", `${contentWidth}px`);
      });
  }
}
