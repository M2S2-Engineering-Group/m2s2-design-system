<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { marked } from "marked";
import type { BlogDraft, BlogPost } from "@m2s2/models";
import {
  BLOG_EDITOR_TOOLBAR,
  calcReadingTime,
  generateSlug,
  todayAsIsoDate,
} from "@m2s2/utils";
import type { ToolbarItem } from "@m2s2/utils";

const props = withDefaults(
  defineProps<{
    /** Populate fields when editing an existing post. */
    initialPost?: BlogPost;
    /** Set to the S3 URL after the platform has uploaded the selected cover image. */
    coverImageUrl?: string;
    /** Existing series to show in the dropdown. Platform fetches these from the blog index. */
    existingSeries?: Array<{ id: string; title: string }>;
  }>(),
  {
    initialPost: undefined,
    coverImageUrl: undefined,
    existingSeries: () => [],
  },
);

const emit = defineEmits<{
  /** Emits the assembled draft when the user clicks Publish. */
  publish: [draft: BlogDraft];
  /** Emits the assembled draft when the user clicks Export. */
  exportDraft: [draft: BlogDraft];
  /** Emits the selected File so the platform can upload it to S3. */
  coverImageSelected: [file: File];
}>();

const title = ref(props.initialPost?.title ?? "");
const slug = ref(props.initialPost?.slug ?? "");
const date = ref(props.initialPost?.date ?? todayAsIsoDate());
const summary = ref(props.initialPost?.summary ?? "");
const excerpt = ref(props.initialPost?.excerpt ?? "");
const tags = ref<string[]>([...(props.initialPost?.tags ?? [])]);
const readingTime = ref(props.initialPost?.readingTime ?? 1);
const content = ref(props.initialPost?.content ?? "");
const coverPreview = ref<string | undefined>(props.initialPost?.coverImage);
const tagInput = ref("");
const activePane = ref<"write" | "preview">("write");
const slugEdited = ref(!!props.initialPost);
const textareaEl = ref<HTMLTextAreaElement | null>(null);
const selectedSeriesKey = ref("none");
const seriesId = ref(props.initialPost?.series?.id ?? "");
const seriesTitle = ref(props.initialPost?.series?.title ?? "");
const seriesPart = ref(props.initialPost?.series?.part ?? 1);
const seriesTotal = ref<number | undefined>(props.initialPost?.series?.total);

// Populate all fields when the post changes.
watch(
  () => props.initialPost,
  (post) => {
    if (!post) return;
    title.value = post.title;
    slug.value = post.slug;
    date.value = post.date;
    summary.value = post.summary;
    excerpt.value = post.excerpt ?? "";
    tags.value = [...post.tags];
    readingTime.value = post.readingTime ?? 1;
    content.value = post.content;
    coverPreview.value = post.coverImage;
    seriesId.value = post.series?.id ?? "";
    seriesTitle.value = post.series?.title ?? "";
    seriesPart.value = post.series?.part ?? 1;
    seriesTotal.value = post.series?.total;
    slugEdited.value = true;
  },
);

// Derive which dropdown item is selected. Re-runs if existingSeries loads after initialPost.
watch(
  [() => props.initialPost, () => props.existingSeries],
  ([post, existing]) => {
    if (!post?.series) {
      selectedSeriesKey.value = "none";
      return;
    }
    const inList = existing.some(
      (s: { id: string }) => s.id === post.series!.id,
    );
    selectedSeriesKey.value = inList ? post.series!.id : "__new__";
  },
);

const renderedHtml = computed(() => marked.parse(content.value) as string);
const canPublish = computed(
  () =>
    title.value.trim().length > 0 &&
    summary.value.trim().length > 0 &&
    content.value.trim().length > 0,
);
const previewUrl = computed(() => coverPreview.value ?? props.coverImageUrl);

function onSeriesKeyChange(e: Event) {
  const key = (e.target as HTMLSelectElement).value;
  selectedSeriesKey.value = key;
  if (key !== "none" && key !== "__new__") {
    const found = props.existingSeries.find((s) => s.id === key);
    if (found) {
      seriesId.value = found.id;
      seriesTitle.value = found.title;
    }
  }
}

function onTitleChange(e: Event) {
  title.value = (e.target as HTMLInputElement).value;
  if (!slugEdited.value) slug.value = generateSlug(title.value);
  readingTime.value = calcReadingTime(content.value);
}

function onContentChange(e: Event) {
  content.value = (e.target as HTMLTextAreaElement).value;
  readingTime.value = calcReadingTime(content.value);
}

function onTagKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    const tag = generateSlug(tagInput.value);
    if (tag && !tags.value.includes(tag)) tags.value = [...tags.value, tag];
    tagInput.value = "";
  }
  if (e.key === "Backspace" && !tagInput.value && tags.value.length) {
    tags.value = tags.value.slice(0, -1);
  }
}

function removeTag(tag: string) {
  tags.value = tags.value.filter((t) => t !== tag);
}

function onCoverChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  emit("coverImageSelected", file);
  const reader = new FileReader();
  reader.onload = () => {
    coverPreview.value = reader.result as string;
  };
  reader.readAsDataURL(file);
}

function applyFormat(item: ToolbarItem) {
  const el = textareaEl.value;
  if (!el) return;

  const start = el.selectionStart;
  const end = el.selectionEnd;
  const cur = content.value;
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

  content.value = newContent;
  setTimeout(() => {
    el.selectionStart = el.selectionEnd = newCursor;
    el.focus();
  }, 0);
}

function assembleDraft(): BlogDraft {
  let series: BlogDraft["series"];
  const total = seriesTotal.value;
  if (selectedSeriesKey.value === "__new__") {
    const id = seriesId.value.trim();
    series = id
      ? {
          id,
          title: seriesTitle.value.trim() || id,
          part: seriesPart.value,
          ...(total !== undefined ? { total } : {}),
        }
      : undefined;
  } else if (selectedSeriesKey.value !== "none") {
    const found = props.existingSeries.find(
      (s) => s.id === selectedSeriesKey.value,
    );
    series = found
      ? {
          id: found.id,
          title: found.title,
          part: seriesPart.value,
          ...(total !== undefined ? { total } : {}),
        }
      : undefined;
  }
  return {
    title: title.value,
    slug: slug.value || generateSlug(title.value),
    date: date.value,
    summary: summary.value,
    excerpt: excerpt.value || undefined,
    tags: tags.value,
    readingTime: readingTime.value,
    content: content.value,
    coverImage: props.coverImageUrl ?? coverPreview.value,
    series,
  };
}

function onPublish() {
  if (!canPublish.value) return;
  emit("publish", assembleDraft());
}

function onExport() {
  if (!canPublish.value) return;
  emit("exportDraft", assembleDraft());
}
</script>

<template>
  <div class="be-root">
    <!-- ── Metadata ──────────────────────────────────────────────────────── -->
    <section class="be-meta">
      <div class="be-field be-field--full">
        <label class="be-label">Title <span class="be-required">*</span></label>
        <input
          class="be-input"
          type="text"
          :value="title"
          placeholder="Post title…"
          @input="onTitleChange"
        />
      </div>

      <div class="be-field">
        <label class="be-label">Slug</label>
        <input
          v-model="slug"
          class="be-input"
          type="text"
          placeholder="post-slug"
          @input="slugEdited = true"
        />
      </div>

      <div class="be-field">
        <label class="be-label" for="be-date">Date</label>
        <input
          id="be-date"
          v-model="date"
          class="be-input be-input--date"
          type="date"
        />
      </div>

      <div class="be-field be-field--full">
        <label class="be-label"
          >Summary <span class="be-required">*</span></label
        >
        <textarea
          v-model="summary"
          class="be-input be-input--textarea"
          rows="2"
          placeholder="Short description shown in blog listings…"
        />
      </div>

      <div class="be-field be-field--full">
        <label class="be-label"
          >Excerpt <span class="be-optional">(optional)</span></label
        >
        <textarea
          v-model="excerpt"
          class="be-input be-input--textarea"
          rows="2"
          placeholder="Longer teaser for social previews…"
        />
      </div>

      <div class="be-field">
        <label class="be-label">Tags</label>
        <div class="be-tags">
          <span v-for="tag in tags" :key="tag" class="be-tag">
            {{ tag }}
            <button
              type="button"
              class="be-tag__remove"
              :aria-label="`Remove tag ${tag}`"
              @click="removeTag(tag)"
            >
              ×
            </button>
          </span>
          <input
            v-model="tagInput"
            class="be-tag-input"
            type="text"
            placeholder="Add tag, press Enter…"
            @keydown="onTagKeydown"
          />
        </div>
      </div>

      <div class="be-field">
        <label class="be-label" for="be-reading-time">Reading time (min)</label>
        <input
          id="be-reading-time"
          v-model.number="readingTime"
          class="be-input be-input--narrow"
          type="number"
          min="1"
        />
      </div>

      <div class="be-field be-field--cover">
        <label class="be-label">Cover Image</label>
        <div class="be-cover">
          <img
            v-if="previewUrl"
            class="be-cover__preview"
            :src="previewUrl"
            alt="Cover preview"
          />
          <label class="be-cover__pick">
            {{ previewUrl ? "Replace" : "Choose image" }}
            <input
              type="file"
              accept="image/*"
              hidden
              @change="onCoverChange"
            />
          </label>
        </div>
      </div>

      <div class="be-field-group-label">
        Series <span class="be-optional">(optional)</span>
      </div>

      <div class="be-field be-field--full">
        <label class="be-label" for="be-series">Series</label>
        <select
          id="be-series"
          class="be-input be-input--select"
          :value="selectedSeriesKey"
          @change="onSeriesKeyChange"
        >
          <option value="none">— None —</option>
          <option v-for="s in existingSeries" :key="s.id" :value="s.id">
            {{ s.title }}
          </option>
          <option value="__new__">+ New series…</option>
        </select>
      </div>

      <template v-if="selectedSeriesKey === '__new__'">
        <div class="be-field">
          <label class="be-label">Series ID</label>
          <input
            v-model="seriesId"
            class="be-input"
            type="text"
            placeholder="e.g. go-backend"
          />
        </div>
        <div class="be-field">
          <label class="be-label">Series Title</label>
          <input
            v-model="seriesTitle"
            class="be-input"
            type="text"
            placeholder="e.g. Go Backend Series"
          />
        </div>
      </template>

      <div
        v-if="selectedSeriesKey !== 'none'"
        class="be-field be-field--narrow-pair"
      >
        <div>
          <label class="be-label">Part</label>
          <input
            v-model.number="seriesPart"
            class="be-input be-input--narrow"
            type="number"
            min="1"
          />
        </div>
        <div>
          <label class="be-label"
            >Total Parts <span class="be-optional">(optional)</span></label
          >
          <input
            class="be-input be-input--narrow"
            type="number"
            min="1"
            :value="seriesTotal"
            placeholder="auto"
            @input="
              seriesTotal = ($event.target as HTMLInputElement).value
                ? +($event.target as HTMLInputElement).value
                : undefined
            "
          />
          <span class="be-hint"
            >Leave blank to derive from published post count</span
          >
        </div>
      </div>
    </section>

    <!-- ── Editor ────────────────────────────────────────────────────────── -->
    <section class="be-editor">
      <div class="be-toolbar" role="toolbar" aria-label="Formatting">
        <!-- Mobile pane toggle — hidden on desktop via CSS -->
        <div class="be-pane-toggle" role="group" aria-label="Editor mode">
          <button
            type="button"
            class="be-pane-toggle__btn"
            :class="{ 'be-pane-toggle__btn--active': activePane === 'write' }"
            @click="activePane = 'write'"
          >
            Write
          </button>
          <button
            type="button"
            class="be-pane-toggle__btn"
            :class="{
              'be-pane-toggle__btn--active': activePane === 'preview',
            }"
            @click="activePane = 'preview'"
          >
            Preview
          </button>
        </div>

        <div class="be-toolbar__tools">
          <button
            v-for="item in BLOG_EDITOR_TOOLBAR"
            :key="item.label"
            type="button"
            class="be-toolbar__btn"
            :title="item.label"
            :aria-label="item.label"
            @click="applyFormat(item)"
          >
            {{ item.icon }}
          </button>
        </div>
      </div>

      <div class="be-panes">
        <div
          class="be-pane be-pane--write"
          :class="{ 'be-pane--hidden': activePane === 'preview' }"
        >
          <div class="be-pane__label">Markdown</div>
          <textarea
            ref="textareaEl"
            class="be-pane__textarea"
            :value="content"
            placeholder="Write your post in markdown…"
            spellcheck="true"
            @input="onContentChange"
          />
        </div>

        <div
          class="be-pane be-pane--preview"
          :class="{ 'be-pane--hidden': activePane === 'write' }"
        >
          <div class="be-pane__label">Preview</div>
          <!-- content is authored by the admin user — trusted HTML -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="be-pane__preview prose" v-html="renderedHtml" />
        </div>
      </div>
    </section>

    <!-- ── Footer ────────────────────────────────────────────────────────── -->
    <footer class="be-footer">
      <span class="be-footer__meta">~{{ readingTime }} min read</span>
      <div class="be-footer__actions">
        <button
          type="button"
          class="be-export"
          :disabled="!canPublish"
          @click="onExport"
        >
          Export
        </button>
        <button
          type="button"
          class="be-publish"
          :disabled="!canPublish"
          @click="onPublish"
        >
          Publish Post
        </button>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
@use "packages/tokens/src/components/blog-editor";
</style>
