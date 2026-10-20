/*
  This is the only file you need to edit for most portfolio updates.
  Replace the clearly marked placeholders as your story and projects grow.
*/
window.PORTFOLIO_CONTENT = {
  name: "Will W.",
  status: "Building practical finance tools",
  title: "Real estate strategy, analytics & product",
  tagline: "I turn complex real estate, valuation, and portfolio questions into clear recommendations, useful tools, and coordinated execution.",
  githubUrl: "https://github.com/willw-builds",

  about: [
    "I’m a project and strategy professional with eight years of experience across real estate, valuation, analytics, and cross-functional delivery. I like work that starts with a complicated question and ends with a clear recommendation, a useful tool, or a better process.",
    "My background includes valuation and portfolio management at Revantage, real estate strategy and transactions work at EY-Parthenon, and valuation analytics at Popp Hutcheson. I also spent six months at Equifax working on capital markets data products, commercial pricing, data governance, and external data partnerships.",
    "I’m strongest when the work calls for financial analysis, stakeholder coordination, executive communication, and steady follow-through. My toolkit includes advanced Excel, SQL, Power BI, Bloomberg, and AI automation tools including ChatGPT and Codex, Gemini, Claude Code, and Microsoft Copilot.",
    "I hold an MS in Computer Science from Georgia Tech, an MS in Finance and Real Estate from Texas A&M, and a BS in Accounting from the University of Wyoming. I’m also a Certified Scrum Product Owner and hold Google credentials in analytics and generative AI.",
  ],

  experience: [
    {
      period: "Sep 2025 to Feb 2026",
      organization: "Equifax",
      role: "Product Manager, Capital Markets and Ignite Product",
      summary: "A six-month product role supporting capital markets data products used by institutional asset managers.",
      bullets: [
        "Supported product lifecycle decisions across commercial pricing, regulatory requirements, and data governance.",
        "Coordinated with third-party data providers and external partners, including ICE and the Federal Reserve, and presented recommendations, risks, and next steps to senior management.",
      ],
    },
    {
      period: "Feb 2023 to Feb 2025",
      organization: "Revantage, a Blackstone company",
      role: "Senior Associate, Portfolio Management and Technical Analytics",
      summary: "Supported valuation and portfolio management for private real estate investment vehicles, using analytics to inform investment decisions.",
      bullets: [
        "Modeled expense allocations and portfolio profitability to support budget-conscious real estate and investment decisions.",
        "Translated complex portfolio information into recommendations on fund structures and the rationalization of individual sub-funds for investment committees.",
        "Partnered with training and cross-functional teams to create investment content and reporting materials for print and digital delivery.",
        "Represented the analytics team with senior stakeholders, providing financial guidance and resolving follow-up questions.",
      ],
    },
    {
      period: "Aug 2021 to Feb 2023",
      organization: "EY-Parthenon",
      role: "Senior Consultant, Strategy and Transactions",
      summary: "Advised clients on real estate strategy and corporate real estate topics, turning complex needs into practical recommendations.",
      bullets: [
        "Conducted market and competitive research to identify opportunities for financial institutions to move faster, operate more efficiently, and improve the customer experience.",
        "Managed prioritization and stakeholder alignment across business, technical, and compliance teams on transformation roadmaps.",
        "Connected analytical findings to clear strategic choices and executable next steps.",
      ],
    },
    {
      period: "Jul 2018 to Aug 2021",
      organization: "Popp Hutcheson",
      role: "Real Estate Valuation Consultant",
      summary: "Built valuation analytics and reporting systems that helped clients plan, forecast, and make better real estate decisions.",
      bullets: [
        "Built real estate investment forecasting analytics in Power BI, contributing to a 5% improvement in client retention.",
        "Led stakeholder conversations and user research to understand complex analytical needs and improve the usefulness of client deliverables.",
        "Created automated reporting infrastructure and forecasting dashboards for planning and ongoing analytical support.",
      ],
    },
  ],

  credentials: [
    {
      label: "Education",
      items: [
        "MS, Computer Science · Georgia Tech · 2023 · GPA 3.8/4.0",
        "MS, Finance and Real Estate · Texas A&M · 2018",
        "BS, Accounting · University of Wyoming · 2017",
      ],
    },
    {
      label: "Credentials",
      items: [
        "Certified Scrum Product Owner (CSPO)",
        "Google Analytics",
        "Google Generative AI Leader",
      ],
    },
    {
      label: "Core toolkit",
      items: [
        "Advanced Excel, SQL, Power BI, PowerPoint, Bloomberg",
        "Financial analysis, forecasting, and market research",
        "Stakeholder management, vendor coordination, and executive reporting",
      ],
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
