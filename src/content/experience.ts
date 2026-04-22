export type Role = {
  company: string;
  title: string;
  location?: string;
  start: string;
  end: string | null; // null = present
  bullets: string[];
};

export const experience: Role[] = [
  {
    company: "Invisible Technologies",
    title: "Machine Learning Specialist",
    location: "New York, NY (Remote)",
    start: "Dec 2025",
    end: null,
    bullets: [
      "Lead structured evaluation of Virtual Agent performance using standardized ML metrics — Task Completion Rate and Conversational Naturalness across large-scale JSON data logs.",
      "Design and iterate on complex reasoning tasks to transition LLMs from baseline solutions to optimized, production-ready workflows.",
      "Architect evaluation scripts and reference implementations for new benchmark tasks, identifying SOTA datasets and analyzing frontier research papers.",
      "Perform advanced LLM debugging — probing for failures in optimization, fairness, regularization, and transformer architecture; produce detailed failure-mode documentation for applied NLP systems.",
      "Deliver structured SFT feedback and refined training data, measurably improving accuracy, reliability, and utility of AI model outputs at scale.",
    ],
  },
  {
    company: "Handshake AI · University of Houston-Downtown",
    title: "AI Trainer (RLHF) — Handshake AI Fellow",
    location: "San Francisco, CA (Remote)",
    start: "Nov 2025",
    end: null,
    bullets: [
      "Design and execute end-to-end RLHF pipelines, applying software engineering depth to optimize LLM reasoning, debugging capabilities, and architectural decision-making across Python, JavaScript, and SQL.",
      "Develop high-quality Supervised Fine-Tuning (SFT) datasets and preference pairs aligning model outputs with industry-standard software engineering best practices and safety guardrails.",
      "Selected as a Software Engineering Expert within the UHD Fellowship program, specializing in RLHF methodology and model alignment.",
      "Synthesize code-quality evaluations across multiple programming paradigms, driving measurable improvements in LLM code generation, refactoring, and debugging.",
    ],
  },
  {
    company: "Outlier",
    title: "Senior GenAI / AI Developer & Prompt Engineer",
    location: "Oakland, CA (Remote)",
    start: "May 2024",
    end: "Dec 2025",
    bullets: [
      "Led a team of advanced AI developers designing and deploying scalable GenAI solutions on AWS (SageMaker, Lambda, S3) using Python, TensorFlow, LangChain, FastAPI, and React.",
      "Engineered high-performance RAG pipelines with Pandas and vector databases, significantly improving retrieval accuracy and LLM-driven application throughput for enterprise clients.",
      "Built responsive full-stack interfaces (React + TypeScript + FastAPI) delivering seamless, high-performance AI-powered enterprise applications.",
      "Orchestrated fine-tuned LLM integrations into production systems via FastAPI, boosting operational efficiency and enabling novel AI-driven business workflows.",
      "Directed cross-functional Agile teams (Developers, Data Analysts, BI Specialists) to deliver LLM-powered solutions with measurable ROI.",
    ],
  },
  {
    company: "Fishbowl Software",
    title: "Senior AI/ML Engineer & Solutions Architect (AI Consultant)",
    location: "Orem, UT (Remote)",
    start: "Oct 2022",
    end: "Apr 2024",
    bullets: [
      "Designed and deployed a production rule-based chatbot using decision trees integrated with LLM APIs — reduced customer service response times by ~30% for routine inventory queries.",
      "Integrated a predictive LLM API into an inventory management platform, enabling data-driven reorder recommendations that significantly minimized stock-out events.",
      "Architected the end-to-end ML solution from requirements to deployment, delivering a maintainable, observable system aligned to business KPIs.",
    ],
  },
  {
    company: "Reserv",
    title: "AI Solutions Architect (AI Consultant)",
    location: "New York, NY (Remote)",
    start: "May 2021",
    end: "Dec 2021",
    bullets: [
      "Implemented a predictive maintenance scheduling system via LLM API integration into a property maintenance application — reduced unexpected equipment failures by ~15%.",
      "Built CI/CD pipeline for continuous ingestion and analysis of historical maintenance data, enabling real-time equipment failure prediction with automated alerting.",
    ],
  },
  {
    company: "TechnipFMC",
    title: "Mechanical Designer III (Python Automation)",
    location: "Houston, TX",
    start: "Apr 2013",
    end: "Mar 2018",
    bullets: [
      "Integrated NXOpen and TeamCenter using Python and PySpark, streamlining engineering project management workflows and reducing manual overhead for cross-functional teams.",
      "Created high-fidelity 3D models and performed finite element analysis (FEA), collaborating across disciplines to deliver precise, compliant engineering solutions.",
      "Managed and optimized the enterprise CAD software license portfolio (SaaS/CAE tools), ensuring compliance and maximizing cost efficiency.",
    ],
  },
];
