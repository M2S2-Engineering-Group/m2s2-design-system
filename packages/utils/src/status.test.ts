import { describe, it, expect } from "vitest";
import { getStatusLabel } from "./status";

const LABELS: Record<string, string> = {
  received: "Received",
  reviewing: "Reviewing",
  in_conversation: "In Conversation",
  closed: "Closed",
};

describe("getStatusLabel", () => {
  it('returns "All" for the "all" key regardless of labels', () => {
    expect(getStatusLabel("all", LABELS)).toBe("All");
    expect(getStatusLabel("all", {})).toBe("All");
  });

  it("returns the mapped label for a known status", () => {
    expect(getStatusLabel("received", LABELS)).toBe("Received");
    expect(getStatusLabel("in_conversation", LABELS)).toBe("In Conversation");
  });

  it("falls back to the raw status string for unknown keys", () => {
    expect(getStatusLabel("pending_review", LABELS)).toBe("pending_review");
  });

  it("falls back to raw status when labels map is empty", () => {
    expect(getStatusLabel("received", {})).toBe("received");
  });
});
