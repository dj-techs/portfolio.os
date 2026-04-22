export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "AI / ML & GenAI",
    items: [
      "RLHF",
      "SFT",
      "Preference Modeling",
      "RAG",
      "Prompt Engineering",
      "LLM Fine-Tuning",
      "Agentic Workflows",
      "Applied NLP",
      "Model Evaluation",
      "MLOps",
      "Benchmark Design",
    ],
  },
  {
    category: "Frameworks & Libraries",
    items: [
      "TensorFlow",
      "PyTorch",
      "LangGraph",
      "LangChain",
      "Hugging Face",
      "Scikit-learn",
      "NumPy",
      "Pandas",
      "FastAPI",
      "Node.js",
    ],
  },
  {
    category: "LLMs",
    items: ["Claude (Anthropic)", "GPT-4o", "Gemini", "Llama 3.1", "Mistral"],
  },
  {
    category: "Programming Languages",
    items: [
      "Python",
      "SQL",
      "JavaScript / TypeScript",
      "React",
      "Java",
      "Swift",
      "C#",
      "PHP",
      "HTML / CSS",
    ],
  },
  {
    category: "Cloud & Infrastructure",
    items: [
      "AWS (SageMaker, EC2, S3, Lambda, CloudWatch)",
      "Azure",
      "Datadog",
    ],
  },
  {
    category: "Databases & Vector Stores",
    items: ["Vector DB", "Milvus", "Pinecone", "MySQL", "DB2"],
  },
  {
    category: "Dev Tools",
    items: [
      "GitHub Copilot",
      "Claude Code",
      "Cursor",
      "GitHub Codespaces",
      "VS Code",
      "Xcode",
      ".NET",
    ],
  },
  {
    category: "Methodologies",
    items: ["Agile / Scrum", "CI/CD", "Waterfall", "Applied AI Engineering"],
  },
];
