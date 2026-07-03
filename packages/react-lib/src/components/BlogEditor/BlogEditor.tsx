import { useCallback, useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import type { BlogDraft, BlogPost } from '@m2s2/models';
import { BLOG_EDITOR_TOOLBAR, calcReadingTime, generateSlug, todayAsIsoDate } from '@m2s2/utils';
import type { ToolbarItem } from '@m2s2/utils';
import './BlogEditor.scss';

export interface BlogEditorProps {
  /** Populate fields when editing an existing post. */
  initialPost?: BlogPost;
  /** Set to the S3 URL after the platform has uploaded the selected cover image. */
  coverImageUrl?: string;
  /** Existing series to show in the dropdown. Platform fetches these from the blog index. */
  existingSeries?: Array<{ id: string; title: string }>;
  /** Called with the assembled draft when the user clicks Publish. */
  onPublish?: (draft: BlogDraft) => void;
  /** Called with the selected File so the platform can upload it to S3. */
  onCoverImageSelected?: (file: File) => void;
}

const NO_SERIES: Array<{ id: string; title: string }> = [];

export function BlogEditor({
  initialPost,
  coverImageUrl,
  existingSeries = NO_SERIES,
  onPublish,
  onCoverImageSelected,
}: BlogEditorProps) {
  const [title,             setTitleRaw]          = useState(initialPost?.title ?? '');
  const [slug,              setSlug]              = useState(initialPost?.slug  ?? '');
  const [date,              setDate]              = useState(initialPost?.date  ?? todayAsIsoDate());
  const [summary,           setSummary]           = useState(initialPost?.summary  ?? '');
  const [excerpt,           setExcerpt]           = useState(initialPost?.excerpt  ?? '');
  const [tags,              setTags]              = useState<string[]>(initialPost?.tags ?? []);
  const [readingTime,       setReadingTime]       = useState(initialPost?.readingTime ?? 1);
  const [content,           setContentRaw]        = useState(initialPost?.content ?? '');
  const [coverPreview,      setCoverPreview]      = useState<string | undefined>(initialPost?.coverImage);
  const [tagInput,          setTagInput]          = useState('');
  const [selectedSeriesKey, setSelectedSeriesKey] = useState('none');
  const [seriesId,          setSeriesId]          = useState(initialPost?.series?.id    ?? '');
  const [seriesTitle,       setSeriesTitle]       = useState(initialPost?.series?.title ?? '');
  const [seriesPart,        setSeriesPart]        = useState(initialPost?.series?.part  ?? 1);
  const [seriesTotal,       setSeriesTotal]       = useState(initialPost?.series?.total ?? 1);

  const slugEdited  = useRef(!!initialPost);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Populate all fields when the post changes.
  useEffect(() => {
    if (!initialPost) return;
    setTitleRaw(initialPost.title);
    setSlug(initialPost.slug);
    setDate(initialPost.date);
    setSummary(initialPost.summary);
    setExcerpt(initialPost.excerpt ?? '');
    setTags([...initialPost.tags]);
    setReadingTime(initialPost.readingTime ?? 1);
    setContentRaw(initialPost.content);
    setCoverPreview(initialPost.coverImage);
    setSeriesId(initialPost.series?.id    ?? '');
    setSeriesTitle(initialPost.series?.title ?? '');
    setSeriesPart(initialPost.series?.part  ?? 1);
    setSeriesTotal(initialPost.series?.total ?? 1);
    slugEdited.current = true;
  }, [initialPost]);

  // Derive which dropdown item is selected. Re-runs if existingSeries loads after initialPost.
  useEffect(() => {
    if (!initialPost?.series) {
      setSelectedSeriesKey('none');
      return;
    }
    const inList = existingSeries.some(s => s.id === initialPost.series!.id);
    setSelectedSeriesKey(inList ? initialPost.series!.id : '__new__');
  }, [initialPost, existingSeries]);

  const setTitle = useCallback((value: string) => {
    setTitleRaw(value);
    if (!slugEdited.current) setSlug(generateSlug(value));
    setReadingTime(calcReadingTime(content));
  }, [content]);

  const setContent = useCallback((value: string) => {
    setContentRaw(value);
    setReadingTime(calcReadingTime(value));
  }, []);

  const renderedHtml = marked.parse(content) as string;
  const canPublish = title.trim().length > 0 && summary.trim().length > 0 && content.trim().length > 0;

  function onSeriesKeyChange(key: string) {
    setSelectedSeriesKey(key);
    if (key !== 'none' && key !== '__new__') {
      const found = existingSeries.find(s => s.id === key);
      if (found) {
        setSeriesId(found.id);
        setSeriesTitle(found.title);
      }
    }
  }

  function onTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = generateSlug(tagInput);
      if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
      setTagInput('');
    }
    if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags(prev => prev.slice(0, -1));
    }
  }

  function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onCoverImageSelected?.(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function applyFormat(item: ToolbarItem) {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const cur   = content;
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

    setContentRaw(newContent);
    setTimeout(() => { el.selectionStart = el.selectionEnd = newCursor; el.focus(); }, 0);
  }

  function handlePublish() {
    if (!canPublish) return;
    let series: BlogDraft['series'];
    if (selectedSeriesKey === '__new__') {
      const id = seriesId.trim();
      series = id ? { id, title: seriesTitle.trim() || id, part: seriesPart, total: seriesTotal } : undefined;
    } else if (selectedSeriesKey !== 'none') {
      const found = existingSeries.find(s => s.id === selectedSeriesKey);
      series = found ? { id: found.id, title: found.title, part: seriesPart, total: seriesTotal } : undefined;
    }
    onPublish?.({
      title,
      slug:        slug || generateSlug(title),
      date,
      summary,
      excerpt:     excerpt || undefined,
      tags,
      readingTime,
      content,
      coverImage:  coverImageUrl ?? coverPreview,
      series,
    });
  }

  const previewUrl = coverPreview ?? coverImageUrl;

  return (
    <div className="be-root">

      {/* ── Metadata ────────────────────────────────────────────────────── */}
      <section className="be-meta">

        <div className="be-field be-field--full">
          <label className="be-label">Title <span className="be-required">*</span></label>
          <input
            className="be-input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post title…"
          />
        </div>

        <div className="be-field">
          <label className="be-label">Slug</label>
          <input
            className="be-input"
            type="text"
            value={slug}
            onChange={e => { setSlug(e.target.value); slugEdited.current = true; }}
            placeholder="post-slug"
          />
        </div>

        <div className="be-field">
          <label className="be-label" htmlFor="be-date">Date</label>
          <input
            id="be-date"
            className="be-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="be-field be-field--full">
          <label className="be-label">Summary <span className="be-required">*</span></label>
          <textarea
            className="be-input be-input--textarea"
            rows={2}
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="Short description shown in blog listings…"
          />
        </div>

        <div className="be-field be-field--full">
          <label className="be-label">Excerpt <span className="be-optional">(optional)</span></label>
          <textarea
            className="be-input be-input--textarea"
            rows={2}
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="Longer teaser for social previews…"
          />
        </div>

        <div className="be-field">
          <label className="be-label">Tags</label>
          <div className="be-tags">
            {tags.map(tag => (
              <span key={tag} className="be-tag">
                {tag}
                <button
                  type="button"
                  className="be-tag__remove"
                  onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                  aria-label={`Remove tag ${tag}`}
                >×</button>
              </span>
            ))}
            <input
              className="be-tag-input"
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={onTagKeyDown}
              placeholder="Add tag, press Enter…"
            />
          </div>
        </div>

        <div className="be-field">
          <label className="be-label" htmlFor="be-reading-time">Reading time (min)</label>
          <input
            id="be-reading-time"
            className="be-input be-input--narrow"
            type="number"
            min={1}
            value={readingTime}
            onChange={e => setReadingTime(Number(e.target.value))}
          />
        </div>

        <div className="be-field be-field--cover">
          <label className="be-label">Cover Image</label>
          <div className="be-cover">
            {previewUrl && (
              <img className="be-cover__preview" src={previewUrl} alt="Cover preview" />
            )}
            <label className="be-cover__pick">
              {previewUrl ? 'Replace' : 'Choose image'}
              <input type="file" accept="image/*" onChange={onCoverChange} hidden />
            </label>
          </div>
        </div>

        <div className="be-field-group-label">Series <span className="be-optional">(optional)</span></div>

        <div className="be-field be-field--full">
          <label className="be-label" htmlFor="be-series">Series</label>
          <select
            id="be-series"
            className="be-input be-input--select"
            value={selectedSeriesKey}
            onChange={e => onSeriesKeyChange(e.target.value)}
          >
            <option value="none">— None —</option>
            {existingSeries.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
            <option value="__new__">+ New series…</option>
          </select>
        </div>

        {selectedSeriesKey === '__new__' && (
          <>
            <div className="be-field">
              <label className="be-label">Series ID</label>
              <input
                className="be-input"
                type="text"
                value={seriesId}
                onChange={e => setSeriesId(e.target.value)}
                placeholder="e.g. go-backend"
              />
            </div>
            <div className="be-field">
              <label className="be-label">Series Title</label>
              <input
                className="be-input"
                type="text"
                value={seriesTitle}
                onChange={e => setSeriesTitle(e.target.value)}
                placeholder="e.g. Go Backend Series"
              />
            </div>
          </>
        )}

        {selectedSeriesKey !== 'none' && (
          <div className="be-field be-field--narrow-pair">
            <div>
              <label className="be-label" htmlFor="series-part">Part</label>
              <input
                id="series-part"
                className="be-input be-input--narrow"
                type="number"
                min={1}
                value={seriesPart}
                onChange={e => setSeriesPart(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="be-label" htmlFor="series-total">Total Parts</label>
              <input
                id="series-total"
                className="be-input be-input--narrow"
                type="number"
                min={1}
                value={seriesTotal}
                onChange={e => setSeriesTotal(Number(e.target.value))}
              />
            </div>
          </div>
        )}

      </section>

      {/* ── Editor ──────────────────────────────────────────────────────── */}
      <section className="be-editor">

        <div className="be-toolbar" role="toolbar" aria-label="Formatting">
          {BLOG_EDITOR_TOOLBAR.map(item => (
            <button
              key={item.label}
              type="button"
              className="be-toolbar__btn"
              title={item.label}
              aria-label={item.label}
              onClick={() => applyFormat(item)}
            >{item.icon}</button>
          ))}
        </div>

        <div className="be-panes">
          <div className="be-pane be-pane--write">
            <div className="be-pane__label">Markdown</div>
            <textarea
              ref={textareaRef}
              className="be-pane__textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your post in markdown…"
              spellCheck
            />
          </div>

          <div className="be-pane be-pane--preview">
            <div className="be-pane__label">Preview</div>
            {/* content is authored by the admin user — trusted HTML */}
            <div className="be-pane__preview prose" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
          </div>
        </div>

      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="be-footer">
        <span className="be-footer__meta">~{readingTime} min read</span>
        <button
          type="button"
          className="be-publish"
          disabled={!canPublish}
          onClick={handlePublish}
        >Publish Post</button>
      </footer>

    </div>
  );
}
