export type Role = {
  company: string;
  title: string;
  location?: string;
  start?: string; // omitted = start date not published
  end: string | null; // null = present
  bullets: string[];
};

export function formatDates(role: Role): string {
  const end = role.end ?? "Present";
  return role.start ? `${role.start} – ${end}` : end;
}

export const experience: Role[] = [
  {
    company: "AlamoIQ Inc.",
    title: "Founder & Managing Director",
    location: "Houston, TX",
    end: null,
    bullets: [
      "Lead a Delaware C-Corp holding company that licenses AI model architectures for energy-sector logistics and audit applications, and incubates portfolio AI ventures, including a West African children's AI/ML education platform.",
      "Set technical direction and AI governance standards applied consistently across portfolio products.",
    ],
  },
  {
    company: "WeghachiAI Ltd.",
    title: "Founder & Managing Director",
    location: "Lagos & Port Harcourt, Nigeria",
    end: null,
    bullets: [
      "Built a multi-agent AI reconciliation platform for oil-and-gas revenue assurance, aligned to NUPRC/NCDMB regulatory requirements and deployed as a read-only overlay on client ERP systems within a client-controlled cloud region.",
      "Designed the four-agent pipeline (ingestion, matching, root-cause analysis, compliance mapping) and the responsible-AI framework behind it: human-verified findings, IAM-enforced read-only access, synthetic-canary recall testing, frozen-baseline drift detection, and acknowledgment-required alerting.",
      "Led investor engagement and due-diligence conversations (Techstars, Launch Africa Ventures, Antler Nigeria) and structured the company's advisory-board and equity framework.",
    ],
  },
  {
    company: "Invisible Technologies",
    title: "Machine Learning Specialist",
    location: "Remote",
    start: "Dec 2025",
    end: "Jun 2026",
    bullets: [
      "Supported applied machine learning delivery for enterprise AI training and evaluation programs.",
    ],
  },
  {
    company: "Handshake AI (UHD Fellowship)",
    title: "AI Trainer, RLHF & Model Alignment",
    location: "Remote",
    start: "Aug 2025",
    end: "Dec 2025",
    bullets: [
      "Selected as a Software Engineering Expert to train and evaluate large language models via reinforcement learning from human feedback, with a focus on alignment and response quality.",
    ],
  },
  {
    company: "Outlier",
    title: "Generative AI Developer / Prompt Engineer",
    start: "May 2024",
    end: "Jul 2025",
    bullets: [
      "Designed and evaluated prompts and generative AI outputs across client model-training engagements.",
    ],
  },
  {
    company: "Fishbowl Software",
    title: "AI/ML Engineer",
    start: "Oct 2022",
    end: "Apr 2024",
    bullets: ["Built and supported machine learning components within Fishbowl's software products."],
  },
  {
    company: "Reserv",
    title: "AI Solutions Architect",
    start: "May 2021",
    end: "Dec 2021",
    bullets: ["Scoped and architected AI-enabled solutions for insurtech client use cases."],
  },
  {
    company: "TechnipFMC",
    title: "Mechanical Designer III",
    location: "Houston, TX",
    start: "Apr 2013",
    end: "Mar 2018",
    bullets: [
      "Designed exploration & production (E&P) equipment: an engineering foundation in spec-driven, safety-rigorous design that now shapes a disciplined approach to AI product design.",
    ],
  },
];
