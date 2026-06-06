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
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import type { BlogDraft, BlogPost } from '../../models/blog';

interface ToolbarItem {
  label: string;
  icon: string;
  wrap?: [string, string];
  prefix?: string;
  block?: string;
}

const TOOLBAR: ToolbarItem[] = [
  { label: 'Heading 2',     icon: 'H2',  prefix: '## ' },
  { label: 'Heading 3',     icon: 'H3',  prefix: '### ' },
  { label: 'Bold',          icon: 'B',   wrap: ['**', '**'] },
  { label: 'Italic',        icon: 'I',   wrap: ['*', '*'] },
  { label: 'Inline code',   icon: '`',   wrap: ['`', '`'] },
  { label: 'Code block',    icon: '{ }', block: '\n```\n\n```\n' },
  { label: 'Blockquote',    icon: '❝',   prefix: '> ' },
  { label: 'Link',          icon: '⇗',   wrap: ['[', '](url)'] },
  { label: 'Image',         icon: '⬚',   block: '![alt text](image-url)\n' },
  { label: 'Bullet list',   icon: '•–',  prefix: '- ' },
  { label: 'Numbered list', icon: '1.',  prefix: '1. ' },
  { label: 'Divider',       icon: '—',   block: '\n---\n\n' },
];

@Component({
  selector: 'm2s2-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss'],
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

  /** Emits the selected File so the platform can upload it to S3. */
  coverImageSelected = output<File>();

  readonly toolbarItems = TOOLBAR;

  readonly title       = signal('');
  readonly slug        = signal('');
  readonly date        = signal(todayIso());
  readonly summary     = signal('');
  readonly excerpt     = signal('');
  readonly tags        = signal<string[]>([]);
  readonly readingTime = signal(1);
  readonly content     = signal('');
  readonly coverPreviewUrl = signal<string | undefined>(undefined);
  readonly activePane      = signal<'write' | 'preview'>('write');

  tagInput = '';
  slugEdited = false;

  private readonly sanitizer = inject(DomSanitizer);

  @ViewChild('editorTextarea') private editorTextarea?: ElementRef<HTMLTextAreaElement>;

  readonly renderedContent = computed<SafeHtml>(() => {
    const html = marked.parse(this.content()) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  readonly canPublish = computed(() =>
    this.title().trim().length > 0 &&
    this.summary().trim().length > 0 &&
    this.content().trim().length > 0,
  );

  constructor() {
    effect(() => {
      const post = this.initialPost();
      if (!post) return;
      this.title.set(post.title);
      this.slug.set(post.slug);
      this.date.set(post.date);
      this.summary.set(post.summary);
      this.excerpt.set(post.excerpt ?? '');
      this.tags.set([...post.tags]);
      this.readingTime.set(post.readingTime ?? 1);
      this.content.set(post.content);
      this.coverPreviewUrl.set(post.coverImage);
      this.slugEdited = true;
    });
  }

  onTitleChange(value: string): void {
    this.title.set(value);
    if (!this.slugEdited) {
      this.slug.set(toSlug(value));
    }
    this.readingTime.set(calcReadingTime(this.content()));
  }

  onContentChange(value: string): void {
    this.content.set(value);
    this.readingTime.set(calcReadingTime(value));
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const tag = this.tagInput.trim().replace(/,/g, '').toLowerCase();
      if (tag && !this.tags().includes(tag)) {
        this.tags.update(t => [...t, tag]);
      }
      this.tagInput = '';
    }
    if (event.key === 'Backspace' && !this.tagInput && this.tags().length) {
      this.tags.update(t => t.slice(0, -1));
    }
  }

  removeTag(tag: string): void {
    this.tags.update(t => t.filter(x => x !== tag));
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
    const end   = el.selectionEnd;
    const cur   = this.content();
    let newContent: string;
    let newCursor: number;

    if (item.wrap) {
      const [before, after] = item.wrap;
      const sel = cur.slice(start, end) || 'text';
      newContent = cur.slice(0, start) + before + sel + after + cur.slice(end);
      newCursor  = start + before.length + sel.length + after.length;
    } else if (item.prefix) {
      const lineStart = cur.lastIndexOf('\n', start - 1) + 1;
      newContent = cur.slice(0, lineStart) + item.prefix + cur.slice(lineStart);
      newCursor  = start + item.prefix.length;
    } else if (item.block) {
      newContent = cur.slice(0, start) + item.block + cur.slice(end);
      newCursor  = start + item.block.length;
    } else {
      return;
    }

    this.content.set(newContent);
    setTimeout(() => { el.selectionStart = el.selectionEnd = newCursor; el.focus(); }, 0);
  }

  onPublish(): void {
    if (!this.canPublish()) return;
    this.publish.emit({
      title:       this.title(),
      slug:        this.slug() || toSlug(this.title()),
      date:        this.date(),
      summary:     this.summary(),
      excerpt:     this.excerpt() || undefined,
      tags:        this.tags(),
      readingTime: this.readingTime(),
      content:     this.content(),
      coverImage:  this.coverImageUrl() ?? this.coverPreviewUrl(),
    });
  }
}

function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
