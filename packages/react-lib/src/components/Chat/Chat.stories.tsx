import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { ChatMessage } from "@m2s2/models";
import { Chat } from "./Chat";

const fakeResponses: Record<number, string> = {
  1: "Good question. The answer depends on your read/write ratio and query patterns. If you're doing a lot of relational queries with joins, Postgres will serve you better. If you need horizontal write scalability and your data is genuinely document-shaped, then a document store makes sense. Most teams reach for NoSQL before they've actually outgrown Postgres — I'd start relational and migrate only when you have a concrete reason.",
  2: "For a team of 5 engineers, I'd keep it simple: a monorepo with clear module boundaries. Microservices sound appealing but they add operational complexity — separate deployments, network calls, distributed tracing — that a small team will feel immediately. Get to product-market fit first, then extract services where you actually feel the pain.",
  3: "Lambda cold starts are real but usually overstated. For most API workloads they're under 500ms and only affect the first request after idle. Where they actually matter: latency-sensitive endpoints, websocket connections, or anything that needs sub-100ms p99. For those cases, provision concurrency or use a container-based compute. For everything else, don't optimize prematurely.",
  4: "Trunk-based development with short-lived feature branches is the approach I default to. Long-lived branches create merge debt and slow teams down. The key is keeping PRs small — ideally a single concern, reviewable in under 15 minutes. Pair that with feature flags for incomplete work and you get the best of both worlds.",
  5: "That's getting into specifics that really depend on your team size, traffic patterns, and operational maturity. This is exactly the kind of conversation worth having in depth — there's no one-size-fits-all answer here.",
  6: "You've hit the limit of what I can cover well in a chat. The next useful step is a real conversation where we can dig into your specific situation, constraints, and goals. Happy to set something up.",
};

async function mockSendMessage(messages: ChatMessage[]): Promise<string> {
  await new Promise((resolve) =>
    setTimeout(resolve, 1200 + Math.random() * 800),
  );
  const userCount = messages.filter((m) => m.role === "user").length;
  return fakeResponses[userCount] ?? fakeResponses[6];
}

const meta: Meta<typeof Chat> = {
  title: "Components/Chat",
  component: Chat,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Fixed bottom-right chat widget. The panel opens on toggle, supports a configurable message cap, and surfaces a CTA when the limit is reached. Pass `sendMessage` to connect to any backend.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{ minHeight: "100vh", background: "var(--color-bg, #0a0a0f)" }}
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Chat>;

export const Default: Story = {
  args: {
    sendMessage: mockSendMessage,
    title: "Architecture Advisor",
    ctaUrl: "/contact",
    ctaLabel: "Start a Conversation",
  },
};

export const WithAvatars: Story = {
  args: {
    sendMessage: mockSendMessage,
    title: "Architecture Advisor",
    assistantAvatarUrl: "https://placehold.co/36x36/7c3aed/ffffff?text=M2",
    userAvatarUrl: "https://placehold.co/36x36/334155/ffffff?text=You",
    ctaUrl: "/contact",
    ctaLabel: "Start a Conversation",
  },
};

export const WithStringHeaderContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A plain string passed to `headerContent` renders as simple text below the subtitle.",
      },
    },
  },
  args: {
    sendMessage: mockSendMessage,
    title: "Architecture Advisor",
    headerContent: "Now serving both General and MARC² personas",
    ctaUrl: "/contact",
    ctaLabel: "Start a Conversation",
  },
};

function TwoPersonaSwitcher() {
  const [activePersona, setActivePersonaState] = useState<"general" | "marc">(
    "general",
  );
  const [generalOpen, setGeneralOpen] = useState(false);
  const [marcOpen, setMarcOpen] = useState(false);

  function setActivePersona(persona: "general" | "marc") {
    setActivePersonaState(persona);
    if (persona === "general") {
      setGeneralOpen(true);
    } else {
      setMarcOpen(true);
    }
  }

  const tabs = (
    <div style={{ display: "flex", gap: 8, marginTop: "var(--space-2)" }}>
      <button
        onClick={() => setActivePersona("general")}
        style={{
          fontSize: 12,
          padding: "2px 10px",
          borderRadius: 999,
          border: "1px solid var(--color-primary)",
          cursor: "pointer",
          background:
            activePersona === "general"
              ? "var(--color-primary)"
              : "transparent",
          color:
            activePersona === "general" ? "#fff" : "var(--color-on-surface)",
        }}
      >
        Assistant
      </button>
      <button
        onClick={() => setActivePersona("marc")}
        style={{
          fontSize: 12,
          padding: "2px 10px",
          borderRadius: 999,
          border: "1px solid var(--color-primary)",
          cursor: "pointer",
          background:
            activePersona === "marc" ? "var(--color-primary)" : "transparent",
          color: activePersona === "marc" ? "#fff" : "var(--color-on-surface)",
        }}
      >
        MARC²
      </button>
    </div>
  );

  return (
    <>
      <div style={{ display: activePersona === "general" ? "" : "none" }}>
        <Chat
          sendMessage={mockSendMessage}
          title="M²S² Assistant"
          welcomeMessage="Hi! I'm the M²S² Assistant. Ask me about our services, past work, or how M²S² can help — and if you've got a technical architecture question, switch to the MARC² tab above."
          ctaUrl="/contact"
          ctaLabel="Start a Conversation"
          headerContent={tabs}
          open={generalOpen}
          onOpenChange={setGeneralOpen}
        />
      </div>
      <div style={{ display: activePersona === "marc" ? "" : "none" }}>
        <Chat
          sendMessage={mockSendMessage}
          title="MARC²"
          welcomeMessage="Hey! I'm MARC², the M²S² Architecture Consultant. I'm trained on Michael's engineering experience and can help you think through architecture decisions, technology choices, cloud design, AI integration, and more. What are you working on?"
          ctaUrl="/contact"
          ctaLabel="Start a Conversation"
          headerContent={tabs}
          open={marcOpen}
          onOpenChange={setMarcOpen}
        />
      </div>
    </>
  );
}

export const WithElementHeaderContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`headerContent` accepts any `ReactNode` and renders it as-is — the component has no opinion on what it contains. This story demonstrates the actual production pattern (see `m2s2-platform`'s `app.component.tsx`-equivalent wiring): **two independent `Chat` instances**, one per persona, sharing one tab-switcher element. Clicking a tab shows the target instance and forces it open via the controlled `open`/`onOpenChange` props, while the hidden instance stays mounted — via a `display` wrapper, not a conditional unmount — so its conversation history survives the switch.",
      },
    },
  },
  render: () => <TwoPersonaSwitcher />,
};

export const NearLimit: Story = {
  name: "Near Limit (message 5 of 6)",
  args: {
    sendMessage: mockSendMessage,
    maxMessages: 6,
  },
  play: async ({ canvasElement: _ }) => {
    // pre-seeded — open the panel to see the near-limit nudge
  },
};
