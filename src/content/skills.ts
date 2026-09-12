export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "AI Systems & Alignment",
    items: [
      "Multi-agent AI system architecture",
      "LLM alignment & RLHF",
      "Prompt engineering & evaluation",
      "Model evaluation",
    ],
  },
  {
    category: "Responsible AI & Governance",
    items: [
      "Governance framework design",
      "Human-in-the-loop verification",
      "Audit trails",
      "IAM-enforced access control",
      "Recall testing & drift detection",
    ],
  },
  {
    category: "Regulatory Compliance",
    items: [
      "NUPRC / NCDMB (Nigerian oil & gas)",
      "NDPA (Nigerian data protection)",
      "COPPA (U.S. children's privacy)",
      "DPDP (Indian data protection)",
    ],
  },
  {
    category: "Leadership & Business",
    items: [
      "Cross-border delivery (U.S. & West Africa)",
      "Team leadership",
      "Investor relations",
      "Term-sheet negotiation",
      "Advisory-board & equity structuring",
    ],
  },
  {
    category: "Technical Stack",
    items: [
      "Python",
      "SQL",
      "TypeScript / React",
      "AWS cloud AI deployment",
      "LangChain / LangGraph",
      "Hugging Face",
    ],
  },
];
