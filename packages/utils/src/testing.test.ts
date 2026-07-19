import { describe, it, expect } from "vitest";
import {
  makeBlogCardConfig,
  makeBlogPost,
  makeBlogDraft,
  makeBlogPosts,
  makeFeatureCardConfig,
  makeNavbarButton,
  makeNavbarLoginButton,
  makeNavbarConfig,
  makeSectionHeaderConfig,
  makePageHeaderConfig,
  makeCtaConfig,
  makeDialogAction,
  makeM2S2DialogData,
  makeM2S2PanelData,
  makeProcessStep,
  makeProcessSteps,
  makeStatItem,
  makeStatItems,
  makeFooterSocialLink,
  makeFooterConfig,
  makeChatMessage,
  makeChatConversation,
  makeColumnDef,
  makeColumnDefs,
} from "./testing";

describe("blog factories", () => {
  it("makeBlogCardConfig returns valid defaults", () => {
    const c = makeBlogCardConfig();
    expect(c.slug).toBeTruthy();
    expect(c.title).toBeTruthy();
    expect(c.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(c.summary).toBeTruthy();
    expect(c.tags.length).toBeGreaterThan(0);
  });

  it("makeBlogCardConfig applies overrides", () => {
    const c = makeBlogCardConfig({ title: "Custom", readingTime: 7 });
    expect(c.title).toBe("Custom");
    expect(c.readingTime).toBe(7);
  });

  it("makeBlogPost includes content", () => {
    const p = makeBlogPost();
    expect(p.content).toBeTruthy();
  });

  it("makeBlogPost applies overrides", () => {
    const p = makeBlogPost({ slug: "override-slug" });
    expect(p.slug).toBe("override-slug");
  });

  it("makeBlogDraft has required fields", () => {
    const d = makeBlogDraft();
    expect(d.title).toBeTruthy();
    expect(d.readingTime).toBeGreaterThan(0);
    expect(d.content).toBeTruthy();
  });

  it("makeBlogPosts returns the requested count", () => {
    expect(makeBlogPosts(5)).toHaveLength(5);
  });

  it("makeBlogPosts entries have unique slugs", () => {
    const posts = makeBlogPosts(3);
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(3);
  });
});

describe("card factories", () => {
  it("makeFeatureCardConfig returns valid defaults", () => {
    const c = makeFeatureCardConfig();
    expect(c.title).toBeTruthy();
    expect(c.body).toBeTruthy();
  });

  it("makeFeatureCardConfig applies overrides", () => {
    const c = makeFeatureCardConfig({ featured: true, items: ["a", "b"] });
    expect(c.featured).toBe(true);
    expect(c.items).toEqual(["a", "b"]);
  });
});

describe("navbar factories", () => {
  it("makeNavbarConfig returns valid defaults", () => {
    const c = makeNavbarConfig();
    expect(c.brand).toBeTruthy();
    expect(c.brandPath).toBeTruthy();
    expect(Array.isArray(c.buttons)).toBe(true);
  });

  it("makeNavbarButton returns valid defaults", () => {
    const b = makeNavbarButton();
    expect(b.id).toBeTruthy();
    expect(b.title).toBeTruthy();
  });

  it("makeNavbarButton applies overrides", () => {
    const b = makeNavbarButton({ id: "x", requiresAuth: true });
    expect(b.id).toBe("x");
    expect(b.requiresAuth).toBe(true);
  });

  it("makeNavbarLoginButton defaults to empty dropdownItems", () => {
    expect(makeNavbarLoginButton().dropdownItems).toEqual([]);
  });
});

describe("page structure factories", () => {
  it("makeSectionHeaderConfig has a label", () => {
    expect(makeSectionHeaderConfig().label).toBeTruthy();
  });

  it("makePageHeaderConfig has title and subtitle", () => {
    const c = makePageHeaderConfig();
    expect(c.title).toBeTruthy();
    expect(c.subtitle).toBeTruthy();
  });

  it("makeCtaConfig has all required fields", () => {
    const c = makeCtaConfig();
    expect(c.title).toBeTruthy();
    expect(c.body).toBeTruthy();
    expect(c.label).toBeTruthy();
    expect(c.route).toBeTruthy();
  });
});

describe("dialog / panel factories", () => {
  it("makeDialogAction defaults to primary variant", () => {
    expect(makeDialogAction().variant).toBe("primary");
  });

  it("makeM2S2DialogData has title and at least one action", () => {
    const d = makeM2S2DialogData();
    expect(d.title).toBeTruthy();
    expect(d.actions.length).toBeGreaterThan(0);
  });

  it("makeM2S2PanelData defaults to right side", () => {
    expect(makeM2S2PanelData().side).toBe("right");
  });
});

describe("process / stat factories", () => {
  it("makeProcessStep has num, name, desc", () => {
    const s = makeProcessStep();
    expect(s.num).toBeTruthy();
    expect(s.name).toBeTruthy();
    expect(s.desc).toBeTruthy();
  });

  it("makeProcessSteps returns requested count with unique nums", () => {
    const steps = makeProcessSteps(4);
    expect(steps).toHaveLength(4);
    expect(new Set(steps.map((s) => s.num)).size).toBe(4);
  });

  it("makeStatItem has value and label", () => {
    const s = makeStatItem();
    expect(s.value).toBeTruthy();
    expect(s.label).toBeTruthy();
  });

  it("makeStatItems returns requested count", () => {
    expect(makeStatItems(5)).toHaveLength(5);
  });
});

describe("footer factories", () => {
  it("makeFooterSocialLink has type, href, label", () => {
    const l = makeFooterSocialLink();
    expect(l.type).toBeTruthy();
    expect(l.href).toBeTruthy();
    expect(l.label).toBeTruthy();
  });

  it("makeFooterConfig has brandName and at least one link", () => {
    const c = makeFooterConfig();
    expect(c.brandName).toBeTruthy();
    expect(c.links.length).toBeGreaterThan(0);
  });

  it("makeFooterConfig applies overrides", () => {
    const c = makeFooterConfig({ brandName: "M2S2", links: [] });
    expect(c.brandName).toBe("M2S2");
    expect(c.links).toHaveLength(0);
  });
});

describe("chat factories", () => {
  it("makeChatMessage defaults to user role", () => {
    expect(makeChatMessage().role).toBe("user");
  });

  it("makeChatConversation returns user + assistant pair", () => {
    const msgs = makeChatConversation();
    expect(msgs).toHaveLength(2);
    expect(msgs[0].role).toBe("user");
    expect(msgs[1].role).toBe("assistant");
  });
});

describe("data table factories", () => {
  it("makeColumnDef has key and label", () => {
    const c = makeColumnDef();
    expect(c.key).toBeTruthy();
    expect(c.label).toBeTruthy();
  });

  it("makeColumnDefs returns unique keys", () => {
    const cols = makeColumnDefs(4);
    expect(cols).toHaveLength(4);
    expect(new Set(cols.map((c) => c.key)).size).toBe(4);
  });
});
