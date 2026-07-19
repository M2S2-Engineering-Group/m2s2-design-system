import { render, screen, fireEvent } from "@testing-library/angular";
import { axe } from "jest-axe";
import { BlogEditorComponent } from "./blog-editor.component";

const renderEditor = (inputs: Record<string, unknown> = {}) =>
  render(BlogEditorComponent, { inputs });

const fillRequiredFields = async (fixture: {
  componentInstance: BlogEditorComponent;
  detectChanges: () => void;
}) => {
  fireEvent.input(screen.getByPlaceholderText("Post title…"), {
    target: { value: "My Post" },
  });
  fixture.detectChanges();
  fireEvent.input(
    screen.getByPlaceholderText("Short description shown in blog listings…"),
    { target: { value: "Great summary" } },
  );
  fixture.detectChanges();
  fireEvent.input(screen.getByPlaceholderText("Write your post in markdown…"), {
    target: { value: "Body content." },
  });
  fixture.detectChanges();
};

describe("BlogEditorComponent", () => {
  describe("title and slug", () => {
    it("renders the title input", async () => {
      await renderEditor();
      expect(screen.getByPlaceholderText("Post title…")).toBeInTheDocument();
    });

    it("auto-generates the slug from the title", async () => {
      const { fixture } = await renderEditor();
      fireEvent.input(screen.getByPlaceholderText("Post title…"), {
        target: { value: "Hello World Post" },
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.slug()).toBe("hello-world-post");
    });

    it("strips special characters when generating the slug", async () => {
      const { fixture } = await renderEditor();
      fireEvent.input(screen.getByPlaceholderText("Post title…"), {
        target: { value: "Héllo & Wörld!" },
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.slug()).toBe("hllo-wrld");
    });

    it("stops auto-generating the slug once the user manually edits it", async () => {
      const { fixture } = await renderEditor();
      const slugInput = screen.getByPlaceholderText("post-slug");
      fireEvent.input(slugInput, { target: { value: "my-custom-slug" } });
      fixture.detectChanges();
      fireEvent.input(screen.getByPlaceholderText("Post title…"), {
        target: { value: "Completely Different Title" },
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.slug()).toBe("my-custom-slug");
    });
  });

  describe("tags", () => {
    it("adds a tag when Enter is pressed", async () => {
      const { fixture } = await renderEditor();
      const tagInput = screen.getByPlaceholderText("Add tag, press Enter…");
      fireEvent.input(tagInput, { target: { value: "angular" } });
      fixture.componentInstance.tagInput = "angular";
      fireEvent.keyDown(tagInput, { key: "Enter" });
      fixture.detectChanges();
      expect(screen.getByText("angular")).toBeInTheDocument();
    });

    it("adds a tag when comma is pressed", async () => {
      const { fixture } = await renderEditor();
      const tagInput = screen.getByPlaceholderText("Add tag, press Enter…");
      fixture.componentInstance.tagInput = "testing";
      fireEvent.keyDown(tagInput, { key: "," });
      fixture.detectChanges();
      expect(screen.getByText("testing")).toBeInTheDocument();
    });

    it("does not add a duplicate tag", async () => {
      const { fixture } = await renderEditor();
      const tagInput = screen.getByPlaceholderText("Add tag, press Enter…");
      fixture.componentInstance.tagInput = "angular";
      fireEvent.keyDown(tagInput, { key: "Enter" });
      fixture.detectChanges();
      fixture.componentInstance.tagInput = "angular";
      fireEvent.keyDown(tagInput, { key: "Enter" });
      fixture.detectChanges();
      const tagEls = document.querySelectorAll(".be-tag");
      expect(tagEls).toHaveLength(1);
    });

    it("removes a tag when its remove button is clicked", async () => {
      const { fixture } = await renderEditor();
      const tagInput = screen.getByPlaceholderText("Add tag, press Enter…");
      fixture.componentInstance.tagInput = "angular";
      fireEvent.keyDown(tagInput, { key: "Enter" });
      fixture.detectChanges();
      fireEvent.click(screen.getByRole("button", { name: "Remove tag" }));
      fixture.detectChanges();
      expect(screen.queryByText("angular")).not.toBeInTheDocument();
    });

    it("removes the last tag when Backspace is pressed in an empty tag input", async () => {
      const { fixture } = await renderEditor();
      const tagInput = screen.getByPlaceholderText("Add tag, press Enter…");
      fixture.componentInstance.tagInput = "angular";
      fireEvent.keyDown(tagInput, { key: "Enter" });
      fixture.detectChanges();
      fixture.componentInstance.tagInput = "testing";
      fireEvent.keyDown(tagInput, { key: "Enter" });
      fixture.detectChanges();
      fixture.componentInstance.tagInput = "";
      fireEvent.keyDown(tagInput, { key: "Backspace" });
      fixture.detectChanges();
      expect(screen.queryByText("testing")).not.toBeInTheDocument();
      expect(screen.getByText("angular")).toBeInTheDocument();
    });
  });

  describe("publish button", () => {
    it("disables Publish when title is empty", async () => {
      await renderEditor();
      expect(
        screen.getByRole("button", { name: "Publish Post" }),
      ).toBeDisabled();
    });

    it("disables Publish when summary is empty", async () => {
      const { fixture } = await renderEditor();
      fireEvent.input(screen.getByPlaceholderText("Post title…"), {
        target: { value: "A title" },
      });
      fixture.detectChanges();
      expect(
        screen.getByRole("button", { name: "Publish Post" }),
      ).toBeDisabled();
    });

    it("enables Publish when title, summary, and content are all filled", async () => {
      const { fixture } = await renderEditor();
      fireEvent.input(screen.getByPlaceholderText("Post title…"), {
        target: { value: "A title" },
      });
      fixture.detectChanges();
      fireEvent.input(
        screen.getByPlaceholderText(
          "Short description shown in blog listings…",
        ),
        { target: { value: "A summary" } },
      );
      fixture.detectChanges();
      fireEvent.input(
        screen.getByPlaceholderText("Write your post in markdown…"),
        {
          target: { value: "Some content here." },
        },
      );
      fixture.detectChanges();
      expect(
        screen.getByRole("button", { name: "Publish Post" }),
      ).not.toBeDisabled();
    });
  });

  describe("series dropdown", () => {
    it("shows only None and New series options when no existingSeries are provided", async () => {
      await renderEditor();
      const select = screen.getByRole("combobox");
      const options = Array.from(
        select.querySelectorAll<HTMLOptionElement>("option"),
      ).map((o) => o.textContent?.trim());
      expect(options).toEqual(["— None —", "+ New series…"]);
    });

    it("shows existing series options in the dropdown", async () => {
      await renderEditor({
        existingSeries: [
          { id: "go-backend", title: "Go Backend Series" },
          { id: "angular-deep", title: "Angular Deep Dives" },
        ],
      });
      const select = screen.getByRole("combobox");
      const options = Array.from(
        select.querySelectorAll<HTMLOptionElement>("option"),
      ).map((o) => o.textContent?.trim());
      expect(options).toContain("Go Backend Series");
      expect(options).toContain("Angular Deep Dives");
    });

    it("hides Part and Total inputs when series is None", async () => {
      await renderEditor();
      expect(screen.queryByLabelText("Part")).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Total Parts/)).not.toBeInTheDocument();
    });

    it("shows Part and Total inputs after selecting New series", async () => {
      const { fixture } = await renderEditor();
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "__new__" },
      });
      fixture.detectChanges();
      expect(screen.getByLabelText("Part")).toBeInTheDocument();
      expect(screen.getByLabelText(/Total Parts/)).toBeInTheDocument();
    });

    it("shows Part and Total inputs after selecting an existing series", async () => {
      const { fixture } = await renderEditor({
        existingSeries: [{ id: "go-backend", title: "Go Backend Series" }],
      });
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "go-backend" },
      });
      fixture.detectChanges();
      expect(screen.getByLabelText("Part")).toBeInTheDocument();
      expect(screen.getByLabelText(/Total Parts/)).toBeInTheDocument();
    });

    it("hides the series ID and title text inputs when an existing series is selected", async () => {
      const { fixture } = await renderEditor({
        existingSeries: [{ id: "go-backend", title: "Go Backend Series" }],
      });
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "go-backend" },
      });
      fixture.detectChanges();
      expect(
        screen.queryByPlaceholderText("e.g. go-backend"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByPlaceholderText("e.g. Go Backend Series"),
      ).not.toBeInTheDocument();
    });

    it("shows the series ID and title text inputs when New series is selected", async () => {
      const { fixture } = await renderEditor();
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "__new__" },
      });
      fixture.detectChanges();
      expect(
        screen.getByPlaceholderText("e.g. go-backend"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("e.g. Go Backend Series"),
      ).toBeInTheDocument();
    });
  });

  describe("publish output", () => {
    it("emits publish without series when series is set to None", async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.publish.subscribe(spy);
      await fillRequiredFields(fixture);
      fireEvent.click(screen.getByRole("button", { name: "Publish Post" }));
      expect(spy).toHaveBeenCalledTimes(1);
      const draft = spy.mock.calls[0][0];
      expect(draft.title).toBe("My Post");
      expect(draft.summary).toBe("Great summary");
      expect(draft.content).toBe("Body content.");
      expect(draft.series).toBeUndefined();
    });

    it("emits publish with series when New series is selected and fields are filled", async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.publish.subscribe(spy);
      await fillRequiredFields(fixture);
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "__new__" },
      });
      fixture.detectChanges();
      fireEvent.input(screen.getByPlaceholderText("e.g. go-backend"), {
        target: { value: "go-backend" },
      });
      fixture.detectChanges();
      fireEvent.input(screen.getByPlaceholderText("e.g. Go Backend Series"), {
        target: { value: "Go Backend Series" },
      });
      fixture.detectChanges();
      fireEvent.click(screen.getByRole("button", { name: "Publish Post" }));
      const draft = spy.mock.calls[0][0];
      expect(draft.series).toEqual({
        id: "go-backend",
        title: "Go Backend Series",
        part: 1,
      });
    });

    it("uses series ID as series title when New series title is left blank", async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.publish.subscribe(spy);
      await fillRequiredFields(fixture);
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "__new__" },
      });
      fixture.detectChanges();
      fireEvent.input(screen.getByPlaceholderText("e.g. go-backend"), {
        target: { value: "my-series" },
      });
      fixture.detectChanges();
      fireEvent.click(screen.getByRole("button", { name: "Publish Post" }));
      const draft = spy.mock.calls[0][0];
      expect(draft.series?.title).toBe("my-series");
    });

    it("emits publish with the correct series when an existing series is selected", async () => {
      const { fixture } = await renderEditor({
        existingSeries: [{ id: "go-backend", title: "Go Backend Series" }],
      });
      const spy = jest.fn();
      fixture.componentInstance.publish.subscribe(spy);
      await fillRequiredFields(fixture);
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "go-backend" },
      });
      fixture.detectChanges();
      fireEvent.click(screen.getByRole("button", { name: "Publish Post" }));
      const draft = spy.mock.calls[0][0];
      expect(draft.series?.id).toBe("go-backend");
      expect(draft.series?.title).toBe("Go Backend Series");
    });

    it("emits no series when New series is selected but ID is left blank", async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.publish.subscribe(spy);
      await fillRequiredFields(fixture);
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "__new__" },
      });
      fixture.detectChanges();
      fireEvent.click(screen.getByRole("button", { name: "Publish Post" }));
      const draft = spy.mock.calls[0][0];
      expect(draft.series).toBeUndefined();
    });
  });

  describe("export output", () => {
    it("emits exportDraft with the assembled draft", async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.exportDraft.subscribe(spy);
      fireEvent.input(screen.getByPlaceholderText("Post title…"), {
        target: { value: "Export Me" },
      });
      fixture.detectChanges();
      fireEvent.input(
        screen.getByPlaceholderText(
          "Short description shown in blog listings…",
        ),
        { target: { value: "Summary text" } },
      );
      fixture.detectChanges();
      fireEvent.input(
        screen.getByPlaceholderText("Write your post in markdown…"),
        {
          target: { value: "Content body." },
        },
      );
      fixture.detectChanges();
      fireEvent.click(screen.getByRole("button", { name: "Export" }));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].title).toBe("Export Me");
    });

    it("does not emit exportDraft when required fields are missing", async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.exportDraft.subscribe(spy);
      fireEvent.click(screen.getByRole("button", { name: "Export" }));
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("cover image", () => {
    it("emits coverImageSelected with the chosen File", async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.coverImageSelected.subscribe(spy);
      const file = new File(["data"], "cover.jpg", { type: "image/jpeg" });
      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      Object.defineProperty(input, "files", {
        value: [file],
        configurable: true,
      });
      fireEvent.change(input);
      expect(spy).toHaveBeenCalledWith(file);
    });
  });

  describe("initial post population", () => {
    it("pre-fills all fields when initialPost is provided", async () => {
      const { fixture } = await renderEditor({
        initialPost: {
          slug: "existing-post",
          title: "Existing Post",
          date: "2024-01-01",
          summary: "Existing summary",
          tags: ["rust"],
          content: "Existing content",
          series: { id: "my-series", title: "My Series", part: 3, total: 6 },
        },
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.title()).toBe("Existing Post");
      expect(fixture.componentInstance.summary()).toBe("Existing summary");
      expect(fixture.componentInstance.seriesPart()).toBe(3);
    });

    it("selects New series in the dropdown when the post series is not in existingSeries", async () => {
      const { fixture } = await renderEditor({
        initialPost: {
          slug: "existing-post",
          title: "Existing Post",
          date: "2024-01-01",
          summary: "Summary",
          tags: [],
          content: "Content",
          series: { id: "my-series", title: "My Series", part: 1, total: 3 },
        },
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.selectedSeriesKey()).toBe("__new__");
    });

    it("selects the matching existing series in the dropdown when found in existingSeries", async () => {
      const { fixture } = await renderEditor({
        initialPost: {
          slug: "existing-post",
          title: "Existing Post",
          date: "2024-01-01",
          summary: "Summary",
          tags: [],
          content: "Content",
          series: { id: "my-series", title: "My Series", part: 2, total: 3 },
        },
        existingSeries: [{ id: "my-series", title: "My Series" }],
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.selectedSeriesKey()).toBe("my-series");
    });

    it("sets selectedSeriesKey to none when the post has no series", async () => {
      const { fixture } = await renderEditor({
        initialPost: {
          slug: "existing-post",
          title: "Existing Post",
          date: "2024-01-01",
          summary: "Summary",
          tags: [],
          content: "Content",
        },
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.selectedSeriesKey()).toBe("none");
    });
  });

  describe("accessibility", () => {
    it("has no violations in default empty state", async () => {
      const { container } = await renderEditor();
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations with new series fields visible", async () => {
      const { container, fixture } = await renderEditor();
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "__new__" },
      });
      fixture.detectChanges();
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
