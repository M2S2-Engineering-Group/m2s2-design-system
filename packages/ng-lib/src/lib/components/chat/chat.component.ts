import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  TemplateRef,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgTemplateOutlet } from "@angular/common";
import { Observable } from "rxjs";
import { ChatMessage } from "../../models/chat";

@Component({
  selector: "m2s2-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NgTemplateOutlet],
  host: { "[style.bottom]": "bottomStyle()" },
})
export class ChatComponent {
  sendMessage =
    input.required<(messages: ChatMessage[]) => Observable<string>>();
  title = input("Architecture Advisor");
  subtitle = input(
    "Ask anything about software architecture, cloud design, or engineering decisions.",
  );
  placeholder = input("Ask a question...");
  maxMessages = input(6);
  ctaLabel = input("Start a Conversation");
  ctaUrl = input("/contact");
  userAvatarUrl = input<string>();
  assistantAvatarUrl = input<string>();
  welcomeMessage = input<string>();
  avoidElement = input<HTMLElement | null>(null);
  /**
   * Optional extra content rendered in the header, below the title/subtitle.
   * Pass a plain string for simple text, or a TemplateRef for arbitrary
   * markup (e.g. a consumer-defined tab switcher) — this component has no
   * opinion on what it contains.
   */
  headerContent = input<string | TemplateRef<unknown>>();

  /**
   * Whether the panel is open. Self-managed by default (toggled via the FAB
   * button) — pass `[(open)]` to also control it from the host, e.g. to
   * force a specific instance open when switching between multiple chat
   * instances via `headerContent`.
   */
  readonly open = model(false);
  readonly messages = signal<ChatMessage[]>([]);
  readonly sendState = signal<"idle" | "sending" | "error">("idle");
  private readonly extraBottom = signal(0);

  readonly bottomStyle = computed(() => {
    const extra = this.extraBottom();
    return extra ? `calc(var(--space-6) + ${extra}px)` : "var(--space-6)";
  });

  draft = "";

  private observer?: IntersectionObserver;
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  constructor() {
    effect(() => {
      this.observer?.disconnect();
      const el = this.avoidElement();
      if (!el) {
        this.extraBottom.set(0);
        return;
      }

      // Immediate read so the FAB is positioned correctly before the observer fires.
      const rect = el.getBoundingClientRect();
      this.extraBottom.set(
        Math.max(0, Math.round(window.innerHeight - rect.top)),
      );

      // IntersectionObserver keeps it correct as the user scrolls.
      // NgZone.run() is required because IntersectionObserver fires outside Angular's zone.
      this.observer = new IntersectionObserver(
        ([entry]) => {
          const visible = entry.isIntersecting
            ? Math.round(window.innerHeight - entry.boundingClientRect.top)
            : 0;
          this.ngZone.run(() => this.extraBottom.set(Math.max(0, visible)));
        },
        { threshold: Array.from({ length: 11 }, (_, i) => i / 10) },
      );
      this.observer.observe(el);
    });
    this.destroyRef.onDestroy(() => this.observer?.disconnect());

    // Seeds the welcome message on any open transition — self-toggled via
    // the FAB, or forced open externally via `[open]` (e.g. a host switching
    // between multiple chat instances) — not just the FAB click path.
    effect(() => {
      if (this.open() && this.messages().length === 0) {
        const welcome = this.welcomeMessage();
        if (welcome) {
          this.messages.set([{ role: "assistant", content: welcome }]);
        }
      }
    });
  }

  readonly userCount = computed(
    () => this.messages().filter((m) => m.role === "user").length,
  );
  readonly limitReached = computed(
    () => this.userCount() >= this.maxMessages(),
  );

  isTemplateRef(
    value: string | TemplateRef<unknown>,
  ): value is TemplateRef<unknown> {
    return value instanceof TemplateRef;
  }

  @ViewChild("messageList") private messageList?: ElementRef<HTMLElement>;

  toggle(): void {
    this.open.update((v) => !v);
  }

  submit(): void {
    const text = this.draft.trim();
    if (!text || this.sendState() === "sending" || this.limitReached()) return;

    this.draft = "";
    const updated: ChatMessage[] = [
      ...this.messages(),
      { role: "user", content: text },
    ];
    this.messages.set(updated);
    this.sendState.set("sending");
    this.scrollToBottom();

    this.sendMessage()(updated).subscribe({
      next: (reply) => {
        this.messages.update((msgs) => [
          ...msgs,
          { role: "assistant", content: reply },
        ]);
        this.sendState.set("idle");
        this.scrollToBottom();
      },
      error: () => this.sendState.set("error"),
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageList) {
        this.messageList.nativeElement.scrollTop =
          this.messageList.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
