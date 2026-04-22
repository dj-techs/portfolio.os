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
    slug: "fishbowl-chatbot",
    title: "Rule-based + LLM Customer Service Chatbot",
    company: "Fishbowl Software",
    year: "2022–2024",
    summary:
      "Hybrid decision-tree + LLM chatbot that cut customer response times ~30% on routine inventory queries.",
    problem:
      "High volume of repetitive customer-service tickets for routine inventory questions was blocking higher-value human interactions.",
    approach:
      "Designed a hybrid architecture: deterministic decision-tree routing for known-intent queries, with LLM API fall-through for long-tail/unclear intents. End-to-end ML lifecycle from requirements through production observability.",
    stack: ["Python", "LLM APIs", "FastAPI", "Decision Trees", "MLOps"],
    outcome: "~30% reduction in customer service response times.",
  },
  {
    slug: "reserv-predictive-maintenance",
    title: "Predictive Maintenance Scheduling",
    company: "Reserv",
    year: "2021",
    summary:
      "LLM-driven predictive maintenance system integrated into a property maintenance app — reduced unexpected equipment failures ~15%.",
    problem:
      "Unexpected equipment failures in property maintenance caused tenant disruption and reactive-only repair costs.",
    approach:
      "Integrated an LLM API with a historical maintenance data pipeline via CI/CD, enabling continuous ingestion, analysis, and real-time failure prediction with automated alerting.",
    stack: ["LLM APIs", "CI/CD", "Python", "Automated Alerting"],
    outcome: "~15% decrease in unexpected equipment failures.",
  },
  {
    slug: "outlier-rag-pipelines",
    title: "Enterprise RAG Pipelines on AWS",
    company: "Outlier",
    year: "2024–2025",
    summary:
      "High-performance RAG pipelines + React/TypeScript/FastAPI frontends for enterprise GenAI on AWS.",
    problem:
      "Enterprise clients needed accurate, low-latency retrieval grounding for LLM-powered workflows across heterogeneous document stores.",
    approach:
      "Built RAG pipelines with Pandas + vector DBs, fine-tuned LLM integrations exposed via FastAPI, deployed to SageMaker/Lambda/S3. Directed cross-functional Agile teams and shipped responsive full-stack UIs.",
    stack: [
      "Python",
      "TensorFlow",
      "LangChain",
      "FastAPI",
      "React",
      "TypeScript",
      "AWS SageMaker",
      "Vector DB",
    ],
    outcome:
      "Significantly improved retrieval accuracy and throughput for multiple enterprise clients.",
  },
  {
    slug: "handshake-rlhf",
    title: "RLHF Pipelines for Software Engineering",
    company: "Handshake AI / UHD Fellowship",
    year: "2025–present",
    summary:
      "End-to-end RLHF pipelines and SFT datasets aligning LLMs with software engineering best practices and safety guardrails.",
    problem:
      "LLM code generation quality varies widely across paradigms and often produces unsafe or non-idiomatic patterns under real engineering constraints.",
    approach:
      "Designed preference pairs and SFT datasets spanning Python, JavaScript, and SQL; synthesized multi-paradigm code-quality evaluations to drive measurable gains in generation, refactoring, and debugging.",
    stack: ["RLHF", "SFT", "Preference Modeling", "Python", "JavaScript", "SQL"],
    outcome:
      "Measurable improvements in LLM code generation, refactoring, and debugging performance.",
  },
  {
    slug: "technipfmc-nxopen",
    title: "CAD Automation (NXOpen + TeamCenter)",
    company: "TechnipFMC",
    year: "2013–2018",
    summary:
      "Python + PySpark integrations across NXOpen and TeamCenter — streamlined engineering workflows and cut manual overhead.",
    problem:
      "Engineering project management involved repetitive manual steps across NXOpen and TeamCenter, creating friction for cross-functional teams.",
    approach:
      "Wrote Python + PySpark integrations automating common workflows; produced high-fidelity 3D models with FEA to validate compliant solutions.",
    stack: ["Python", "PySpark", "NXOpen", "TeamCenter", "FEA"],
    outcome:
      "Reduced manual overhead and improved cross-functional throughput; optimized CAD license portfolio for compliance and cost.",
  },
];
