/*
  This is the only file you need to edit for most portfolio updates.
  Replace the clearly marked placeholders as your story and projects grow.
*/
window.PORTFOLIO_CONTENT = {
  name: "Will W.",
  status: "Building practical finance tools",
  title: "Portfolio strategy, analytics & product",
  tagline: "I turn complex portfolio, valuation, and financial workflow questions into clear recommendations, useful tools, and coordinated execution.",
  githubUrl: "https://github.com/willw-builds",

  about: [
    "I work at the intersection of portfolio strategy, private markets, financial technology, and product management. Over the past eight years, I’ve helped teams turn portfolio data, valuation questions, and market research into clearer product and business decisions.",
    "I’m now using that experience to build practical tools for finance and investment professionals. The projects on this site show how I think: start with a real workflow problem, make the logic clear, and build something people can test for themselves.",
  ],

  experience: [
    {
      label: "Real assets and valuation",
      title: "Built from hands-on analytical work",
      summary: "My background covers valuation, portfolio management, investment analytics, and strategy work across real assets, private markets, and professional services.",
    },
    {
      label: "Product management",
      title: "Connecting users, business, and technology",
      summary: "I’ve worked on product strategy, roadmaps, portfolio reporting, and capital markets data products, including a brief product role at Equifax.",
    },
    {
      label: "How I work",
      title: "Clear analysis, steady follow-through",
      summary: "I bring financial analysis, stakeholder coordination, executive communication, and enough technical depth to turn a product idea into a working prototype.",
    },
  ],

  projects: [
    {
      status: "Live prototype · Build",
      title: "CRE Underwriting Workbench",
      description: "An auditable acquisition model that turns synthetic property assumptions into NOI, debt metrics, five-year cash flows, returns, and sensitivity analysis.",
      tags: ["Real assets", "Underwriting", "Scenario modeling", "Vanilla JS"],
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
      status: "Trial prototype · Plan",
      title: "Private Markets Portfolio Planner",
      description: "A fund-level pacing tool that connects TVPI, DPI, RVPI, uncalled commitments, an illustrative J-curve, and forward scenarios in one transparent view.",
      tags: ["Private markets", "Portfolio strategy", "Fund pacing", "Product case study"],
      primaryLabel: "Open planner",
      primaryUrl: "projects/private-markets-planner/",
      secondaryLabel: "View source",
      secondaryUrl: "https://github.com/willw-builds/PortfolioDemo/tree/main/projects/private-markets-planner",
      number: "03",
    },
  ],

  agents: [
    {
      authorship: "Original system",
      title: "Daily + Weekly Review System",
      description: "A set of product management agents that turns meetings, commitments, backlog state, and calendar context into daily action queues and weekly accountability reviews.",
      capabilities: ["Action-item attribution", "Completion evidence", "Weekly planning", "Review guardrails"],
    },
    {
      authorship: "Original agent",
      title: "Portfolio Navigator",
      description: "A product portfolio agent for surfacing strategy alignment, cross-team dependencies, stalled work, and risks that are difficult to see from a single team view.",
      capabilities: ["Strategy mapping", "Risk radar", "Dependency review", "Leadership briefing"],
    },
    {
      authorship: "Adapted toolkit",
      title: "Product Workflow Agents",
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
