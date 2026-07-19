import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { marked } from "marked";
import {
  BLOG_EDITOR_TOOLBAR,
  calcReadingTime,
  generateSlug,
  todayAsIsoDate,
} from "@m2s2/utils";
import type { ToolbarItem } from "@m2s2/utils";
import type { BlogDraft, BlogPost } from "../../models/blog";

@Component({
  selector: "m2s2-blog-editor",
  templateUrl: "./blog-editor.component.html",
  styleUrls: ["./blog-editor.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class BlogEditorComponent {
  /** Populate fields when editing an existing post. */
  initialPost = input<BlogPost | undefined>(undefined);

  /** Set to the S3 URL after the platform has uploaded the selected cover image. */
  coverImageUrl = input<string | undefined>(undefined);

  /** Emits the assembled draft when the user clicks Publish. */
  publish = output<BlogDraft>();

  /** Emits the assembled draft when the user clicks Export. */
  exportDraft = output<BlogDraft>();

  /** Emits the selected File so the platform can upload it to S3. */
  coverImageSelected = output<File>();

  readonly toolbarItems = BLOG_EDITOR_TOOLBAR;

  readonly title = signal("");
  readonly slug = signal("");
  readonly date = signal(todayAsIsoDate());
  readonly summary = signal("");
  readonly excerpt = signal("");
  readonly tags = signal<string[]>([]);
  readonly readingTime = signal(1);
  readonly content = signal("");
  readonly coverPreviewUrl = signal<string | undefined>(undefined);
  readonly activePane = signal<"write" | "preview">("write");

  existingSeries = input<Array<{ id: string; title: string }>>([]);

  readonly selectedSeriesKey = signal<string>("none");
  readonly seriesId = signal("");
  readonly seriesTitle = signal("");
  readonly seriesPart = signal(1);
  readonly seriesTotal = signal<number | undefined>(undefined);

  tagInput = "";
  slugEdited = false;

  private readonly sanitizer = inject(DomSanitizer);

  @ViewChild("editorTextarea")
  private editorTextarea?: ElementRef<HTMLTextAreaElement>;

  readonly renderedContent = computed<SafeHtml>(() => {
    const html = marked.parse(this.content()) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  readonly canPublish = computed(
    () =>
      this.title().trim().length > 0 &&
      this.summary().trim().length > 0 &&
      this.content().trim().length > 0,
  );

  constructor() {
    // Populate all fields except series key when the post loads.
    effect(() => {
      const post = this.initialPost();
      if (!post) return;
      this.title.set(post.title);
      this.slug.set(post.slug);
      this.date.set(post.date);
      this.summary.set(post.summary);
      this.excerpt.set(post.excerpt ?? "");
      this.tags.set([...post.tags]);
      this.readingTime.set(post.readingTime ?? 1);
      this.content.set(post.content);
      this.coverPreviewUrl.set(post.coverImage);
      this.seriesId.set(post.series?.id ?? "");
      this.seriesTitle.set(post.series?.title ?? "");
      this.seriesPart.set(post.series?.part ?? 1);
      this.seriesTotal.set(post.series?.total);
      this.slugEdited = true;
    });

    // Derive which dropdown item to select. Runs again if existingSeries loads
    // after initialPost so the key resolves correctly either way.
    effect(() => {
      const post = this.initialPost();
      const existing = this.existingSeries();
      if (!post?.series) {
        this.selectedSeriesKey.set("none");
        return;
      }
      const inList = existing.some((s) => s.id === post.series!.id);
      this.selectedSeriesKey.set(inList ? post.series!.id : "__new__");
    });
  }

  onSeriesKeyChange(key: string): void {
    this.selectedSeriesKey.set(key);
    if (key !== "none" && key !== "__new__") {
      const found = this.existingSeries().find((s) => s.id === key);
      if (found) {
        this.seriesId.set(found.id);
        this.seriesTitle.set(found.title);
      }
    }
  }

  onTitleChange(value: string): void {
    this.title.set(value);
    if (!this.slugEdited) {
      this.slug.set(generateSlug(value));
    }
    this.readingTime.set(calcReadingTime(this.content()));
  }

  onContentChange(value: string): void {
    this.content.set(value);
    this.readingTime.set(calcReadingTime(value));
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const tag = generateSlug(this.tagInput);
      if (tag && !this.tags().includes(tag)) {
        this.tags.update((t) => [...t, tag]);
      }
      this.tagInput = "";
    }
    if (event.key === "Backspace" && !this.tagInput && this.tags().length) {
      this.tags.update((t) => t.slice(0, -1));
    }
  }

  removeTag(tag: string): void {
    this.tags.update((t) => t.filter((x) => x !== tag));
  }

  onCoverChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.coverImageSelected.emit(file);
    const reader = new FileReader();
    reader.onload = () => this.coverPreviewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  applyFormat(item: ToolbarItem): void {
    const el = this.editorTextarea?.nativeElement;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const cur = this.content();
    let newContent: string;
    let newCursor: number;

    if (item.wrap) {
      const [before, after] = item.wrap;
      const sel = cur.slice(start, end) || "text";
      newContent = cur.slice(0, start) + before + sel + after + cur.slice(end);
      newCursor = start + before.length + sel.length + after.length;
    } else if (item.prefix) {
      const lineStart = cur.lastIndexOf("\n", start - 1) + 1;
      newContent = cur.slice(0, lineStart) + item.prefix + cur.slice(lineStart);
      newCursor = start + item.prefix.length;
    } else if (item.block) {
      newContent = cur.slice(0, start) + item.block + cur.slice(end);
      newCursor = start + item.block.length;
    } else {
      return;
    }

    this.content.set(newContent);
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = newCursor;
      el.focus();
    }, 0);
  }

  onPublish(): void {
    if (!this.canPublish()) return;
    this.publish.emit(this.assembleDraft());
  }

  onExport(): void {
    if (!this.canPublish()) return;
    this.exportDraft.emit(this.assembleDraft());
  }

  private assembleDraft(): BlogDraft {
    const key = this.selectedSeriesKey();
    const total = this.seriesTotal();
    let series: BlogDraft["series"];
    if (key === "__new__") {
      const id = this.seriesId().trim();
      series = id
        ? {
            id,
            title: this.seriesTitle().trim() || id,
            part: this.seriesPart(),
            ...(total !== undefined ? { total } : {}),
          }
        : undefined;
    } else if (key !== "none") {
      const found = this.existingSeries().find((s) => s.id === key);
      series = found
        ? {
            id: found.id,
            title: found.title,
            part: this.seriesPart(),
            ...(total !== undefined ? { total } : {}),
          }
        : undefined;
    }
    return {
      title: this.title(),
      slug: this.slug() || generateSlug(this.title()),
      date: this.date(),
      summary: this.summary(),
      excerpt: this.excerpt() || undefined,
      tags: this.tags(),
      readingTime: this.readingTime(),
      content: this.content(),
      coverImage: this.coverImageUrl() ?? this.coverPreviewUrl(),
      series,
    };
  }
}
