export type Project = {
  slug: string;
  title: string;
  company: string;
  year: string;
  summary: string;
  problem: string;
  approach: string;
  stack: string[];
  outcome: string;
};

export const projects: Project[] = [
  {
    slug: "weghachiai-reconciliation",
    title: "Multi-Agent Revenue Assurance Platform",
    company: "WeghachiAI Ltd.",
    year: "Current",
    summary:
      "Four-agent AI platform for oil-and-gas revenue assurance, aligned to NUPRC/NCDMB requirements and running read-only on client ERP systems.",
    problem:
      "Oil-and-gas revenue assurance has to satisfy NUPRC and NCDMB regulatory requirements, and any AI system touching client ERP data must be trustworthy enough for a regulated industry.",
    approach:
      "Designed a four-agent pipeline (ingestion, matching, root-cause analysis, compliance mapping), deployed as a read-only overlay on client ERP systems inside a client-controlled cloud region.",
    stack: ["Multi-agent AI", "Python", "AWS", "IAM", "ERP integration"],
    outcome:
      "Responsible AI built in: human-verified findings, IAM-enforced read-only access, synthetic-canary recall testing, frozen-baseline drift detection, and acknowledgment-required alerting.",
  },
  {
    slug: "alamoiq-holding",
    title: "AI Holding Company & Venture Incubation",
    company: "AlamoIQ Inc.",
    year: "Current",
    summary:
      "Delaware C-Corp that licenses AI model architectures for energy-sector logistics and audit, and incubates portfolio AI ventures.",
    problem:
      "AI products for different markets and regulators need shared technical direction and consistent governance, not a separate rulebook per venture.",
    approach:
      "Set technical direction and AI governance standards for every portfolio product; incubating ventures including a West African children's AI/ML education platform.",
    stack: ["AI governance", "Model licensing", "Venture incubation"],
    outcome: "One set of AI governance standards applied consistently across portfolio products.",
  },
  {
    slug: "handshake-rlhf",
    title: "RLHF & Model Alignment",
    company: "Handshake AI / UHD Fellowship",
    year: "2025",
    summary:
      "Trained and evaluated large language models through reinforcement learning from human feedback, focused on alignment and response quality.",
    problem:
      "Large language models need expert human feedback to give aligned, high-quality answers on software engineering tasks.",
    approach:
      "Brought software engineering expertise to RLHF training and evaluation, judging model responses for alignment and quality.",
    stack: ["RLHF", "LLM alignment", "Model evaluation", "Python"],
    outcome: "Selected for the fellowship's Software Engineering Expert track.",
  },
];
