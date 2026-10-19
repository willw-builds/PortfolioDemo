/*
  This is the only file you need to edit for most portfolio updates.
  Replace the clearly marked placeholders as your story and projects grow.
*/
window.PORTFOLIO_CONTENT = {
  name: "Will W.",
  status: "Building in public",
  title: "Product-minded developer",
  tagline: "Building practical web experiences and AI-powered prototypes. Learning in public, one useful project at a time.",
  githubUrl: "https://github.com/willw-builds",

  about: [
    "I’m interested in the space where product thinking, design, and technology meet. I like turning loosely formed ideas into clear, useful experiences that people can actually try.",
    "Right now, I’m building small web and AI projects to sharpen my craft, learn faster, and develop a point of view through practice.",
    "This portfolio is a living record of that process. As the work grows, the story here will grow with it.",
  ],

  experience: [
    {
      period: "Add dates",
      organization: "Your most recent organization",
      role: "Your role or area of focus",
      summary: "Add one sentence explaining the team, product, or problem space.",
      bullets: [
        "Describe a meaningful outcome, not just a responsibility.",
        "Add a concrete example of how you worked with others.",
        "Include a metric when you have one and can support it.",
      ],
      placeholder: true,
    },
    {
      period: "Add dates",
      organization: "An earlier chapter",
      role: "Previous role, education, or independent work",
      summary: "Use this space to make your path understandable to someone meeting you for the first time.",
      bullets: ["What did you learn here?", "What changed because of your work?"],
      placeholder: true,
    },
  ],

  projects: [
    {
      status: "Live prototype · Build",
      title: "CRE Underwriting Workbench",
      description: "An auditable acquisition model that turns synthetic property assumptions into NOI, debt metrics, five-year cash flows, returns, and sensitivity analysis.",
      tags: ["CRE", "Underwriting", "Scenario modeling", "Vanilla JS"],
      primaryLabel: "Open workbench",
      primaryUrl: "projects/cre-underwriting/",
      secondaryLabel: "View source",
      secondaryUrl: "https://github.com/willw-builds/PortfolioDemo/tree/main/projects/cre-underwriting",
      number: "01",
    },
    {
      status: "Live prototype · Review",
      title: "Financial Model QA Agent",
      description: "A privacy-preserving spreadsheet reviewer that flags formula errors, broken patterns, risky hard-codes, and magnitude anomalies with cell-level evidence.",
      tags: ["Excel QA", "Deterministic checks", "Browser-local", "SheetJS"],
      primaryLabel: "Run QA sample",
      primaryUrl: "projects/model-qa/",
      secondaryLabel: "View source",
      secondaryUrl: "https://github.com/willw-builds/PortfolioDemo/tree/main/projects/model-qa",
      number: "02",
    },
    {
      status: "Live + iterating",
      title: "Personal portfolio system",
      description: "A privacy-conscious portfolio built from scratch with a custom illustrated identity and a flexible structure for publishing working prototypes.",
      tags: ["HTML", "CSS", "JavaScript", "AI-assisted"],
      primaryLabel: "View live site",
      primaryUrl: "https://willw-builds.github.io/PortfolioDemo/",
      secondaryLabel: "View on GitHub",
      secondaryUrl: "https://github.com/willw-builds/PortfolioDemo",
      number: "03",
    },
  ],

  agents: [
    {
      authorship: "Original system",
      title: "Daily + Weekly Review System",
      description: "A set of evidence-first PM agents that turns meetings, commitments, backlog state, and calendar context into daily action queues and weekly accountability reviews.",
      capabilities: ["Action-item attribution", "Completion evidence", "Weekly planning", "Review guardrails"],
    },
    {
      authorship: "Original agent",
      title: "Portfolio Navigator",
      description: "A portfolio-health agent for surfacing strategy alignment, cross-team dependencies, stalled work, and risks that are difficult to see from a single team view.",
      capabilities: ["Strategy mapping", "Risk radar", "Dependency review", "Leadership briefing"],
    },
    {
      authorship: "Adapted toolkit",
      title: "PM Workflow Agents",
      description: "Existing agent patterns I adapted and configured for context processing, inbox operations, and spec-to-PR workflows. Presented as adaptations rather than original inventions.",
      capabilities: ["Context processing", "Inbox triage", "Spec-to-PR", "Workflow configuration"],
      adapted: true,
    },
  ],

  notes: [
    {
      date: "Coming soon",
      title: "What I learned from my first public build",
      description: "A natural first note: the decisions, surprises, and lessons behind this site.",
      url: "#notes",
      placeholder: true,
    },
    {
      date: "Add a date",
      title: "Your next idea worth sharing",
      description: "Keep it short. A sharp observation is more memorable than a long summary.",
      url: "#notes",
      placeholder: true,
    },
  ],
};
