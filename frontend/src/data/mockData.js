// Centralized hardcoded data for prototype

export const DEMO_USERS = [
  {
    id: 'u1',
    name: 'Rina Sharma',
    nameHindi: 'रीना शर्मा',
    username: 'rina@mrpl.co.in',
    password: 'demo123',
    role: 'Inspector',
    department: 'Quality Inspection',
    employeeId: 'MRPL/QI/2891',
    avatar: 'RS',
  },
  {
    id: 'u2',
    name: 'Dev Nair',
    nameHindi: 'देव नायर',
    username: 'dev@mrpl.co.in',
    password: 'demo123',
    role: 'Engineer',
    department: 'Process Engineering',
    employeeId: 'MRPL/PE/1247',
    avatar: 'DN',
  },
  {
    id: 'u3',
    name: 'Meena Kulkarni',
    nameHindi: 'मीना कुलकर्णी',
    username: 'meena@mrpl.co.in',
    password: 'demo123',
    role: 'Admin Staff',
    department: 'Administration',
    employeeId: 'MRPL/ADM/3056',
    avatar: 'MK',
  },
  {
    id: 'u4',
    name: 'Arjun Patel',
    nameHindi: 'अर्जुन पटेल',
    username: 'arjun@mrpl.co.in',
    password: 'demo123',
    role: 'IT Admin',
    department: 'IT & Cybersecurity',
    employeeId: 'MRPL/IT/0421',
    avatar: 'AP',
  },
];

export const SYSTEM_STATUS = {
  egressCount: 0,
  externalAttempts: 0,
  internalCalls: 347,
  uptime: '14h 22m',
  modelsLoaded: 3,
  activeUsers: 2,
  totalTasks: 18,
  completedTasks: 16,
};

export const MODEL_POOL = [
  {
    id: 'm1',
    name: 'General Reasoning',
    model: 'llama3.1:8b-instruct-q4_K_M',
    status: 'active',
    taskTags: ['summarize', 'draft', 'reason', 'explain'],
    vram: '5.2 GB',
    calls: 134,
    avgLatency: '2.4s',
    serving: 'Ollama',
  },
  {
    id: 'm2',
    name: 'Code Specialist',
    model: 'qwen2.5-coder:7b-q4_K_M',
    status: 'active',
    taskTags: ['code', 'debug', 'calculate'],
    vram: '4.8 GB',
    calls: 89,
    avgLatency: '1.9s',
    serving: 'Ollama',
  },
  {
    id: 'm3',
    name: 'Vision / Multimodal',
    model: 'llava:13b-v1.6-q4_K_M',
    status: 'active',
    taskTags: ['ocr-assist', 'image-understand', 'multimodal'],
    vram: '8.1 GB',
    calls: 42,
    avgLatency: '3.8s',
    serving: 'Ollama',
  },
];

export const KNOWLEDGE_COLLECTIONS = [
  {
    id: 'kc1',
    name: 'Inspection SOPs',
    nameHindi: 'निरीक्षण SOPs',
    documents: 47,
    chunks: 2341,
    roles: ['Inspector', 'IT Admin'],
    lastUpdated: '2026-09-01',
    size: '12.4 MB',
  },
  {
    id: 'kc2',
    name: 'Safety Manuals',
    nameHindi: 'सुरक्षा मैनुअल',
    documents: 23,
    chunks: 1789,
    roles: ['Inspector', 'Engineer', 'IT Admin'],
    lastUpdated: '2026-08-28',
    size: '8.7 MB',
  },
  {
    id: 'kc3',
    name: 'Engineering SOPs',
    nameHindi: 'इंजीनियरिंग SOPs',
    documents: 61,
    chunks: 4102,
    roles: ['Engineer', 'IT Admin'],
    lastUpdated: '2026-09-05',
    size: '19.2 MB',
  },
  {
    id: 'kc4',
    name: 'Admin Correspondence',
    nameHindi: 'प्रशासनिक पत्राचार',
    documents: 134,
    chunks: 891,
    roles: ['Admin Staff', 'IT Admin'],
    lastUpdated: '2026-09-08',
    size: '4.1 MB',
  },
];

export const DEMO_TASKS = [
  {
    id: 'task-001',
    title: 'Inspection Report → Approval Note',
    status: 'completed',
    user: 'Rina Sharma',
    role: 'Inspector',
    created: '2026-09-09 10:23',
    completed: '2026-09-09 10:26',
    modelsUsed: ['Vision / Multimodal', 'General Reasoning'],
    toolsUsed: ['OCR/Vision', 'RAG Retriever', 'Doc Generator'],
    deliverables: ['approval_note_CDU-2891.docx'],
    egressAttempts: 0,
    steps: [
      { stage: 'Plan', status: 'done', note: 'Decomposed into 4 sub-tasks: OCR, RAG search, draft, generate .docx' },
      { stage: 'Route', status: 'done', note: 'Vision model → OCR; General model → reasoning & drafting' },
      { stage: 'Act', status: 'done', note: 'PaddleOCR extracted 3 pages, 2 tables. RAG retrieved 5 SOP clauses (IS 2825, OISD-117).' },
      { stage: 'Observe', status: 'done', note: 'OCR confidence: 0.91. Schema checks passed. All citations verified.' },
      { stage: 'Deliver', status: 'done', note: 'Generated approval_note_CDU-2891.docx with audit appendix. Human review requested.' },
    ],
    auditEntries: [
      { time: '10:23:01', actor: 'rina@mrpl.co.in', action: 'TASK_CREATED', resource: 'task-001' },
      { time: '10:23:04', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'llava:13b (OCR extract)' },
      { time: '10:23:41', actor: 'orchestrator', action: 'TOOL_CALL', resource: 'rag-retriever (inspection-sops)' },
      { time: '10:24:12', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'llama3.1:8b (draft approval note)' },
      { time: '10:25:58', actor: 'orchestrator', action: 'TOOL_CALL', resource: 'doc-generator (docx)' },
      { time: '10:26:03', actor: 'orchestrator', action: 'TASK_COMPLETE', resource: 'approval_note_CDU-2891.docx' },
    ],
  },
  {
    id: 'task-002',
    title: 'Python mass-balance script → sandbox test',
    status: 'completed',
    user: 'Dev Nair',
    role: 'Engineer',
    created: '2026-09-09 11:45',
    completed: '2026-09-09 11:48',
    modelsUsed: ['Code Specialist'],
    toolsUsed: ['Sandbox Executor'],
    deliverables: ['mass_balance.py', 'execution_log.txt'],
    egressAttempts: 0,
    steps: [
      { stage: 'Plan', status: 'done', note: 'Write mass-balance script, execute in sandbox, verify output' },
      { stage: 'Route', status: 'done', note: 'Code model assigned for all code sub-tasks' },
      { stage: 'Act', status: 'done', note: 'Code drafted. Sandbox iteration 1: exit code 0. Output verified.' },
      { stage: 'Observe', status: 'done', note: 'Exit code 0. Output matches expected mass-balance equation.' },
      { stage: 'Deliver', status: 'done', note: 'mass_balance.py + execution_log.txt generated.' },
    ],
    auditEntries: [
      { time: '11:45:12', actor: 'dev@mrpl.co.in', action: 'TASK_CREATED', resource: 'task-002' },
      { time: '11:45:16', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'qwen2.5-coder:7b (code generation)' },
      { time: '11:46:02', actor: 'orchestrator', action: 'TOOL_CALL', resource: 'sandbox-executor (python3)' },
      { time: '11:46:14', actor: 'orchestrator', action: 'TASK_COMPLETE', resource: 'mass_balance.py' },
    ],
  },
  {
    id: 'task-003',
    title: 'Board Meeting Minutes → PPT Summary',
    status: 'in-progress',
    user: 'Meena Kulkarni',
    role: 'Admin Staff',
    created: '2026-09-09 14:02',
    completed: null,
    modelsUsed: ['Vision / Multimodal', 'General Reasoning'],
    toolsUsed: ['OCR/Vision', 'Doc Generator'],
    deliverables: [],
    egressAttempts: 0,
    steps: [
      { stage: 'Plan', status: 'done', note: 'OCR slides, summarize content, generate 5-slide PPT' },
      { stage: 'Route', status: 'done', note: 'Vision model → OCR; General model → summarize' },
      { stage: 'Act', status: 'active', note: 'Processing slide 3/8... OCR in progress.' },
      { stage: 'Observe', status: 'pending', note: 'Waiting for OCR completion' },
      { stage: 'Deliver', status: 'pending', note: 'Pending' },
    ],
    auditEntries: [
      { time: '14:02:44', actor: 'meena@mrpl.co.in', action: 'TASK_CREATED', resource: 'task-003' },
      { time: '14:02:49', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'llava:13b (OCR slides 1-2)' },
      { time: '14:03:11', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'llava:13b (OCR slide 3 - in progress)' },
    ],
  },
];

export const EGRESS_LOG = [
  { time: '10:23:04', source: 'orchestrator', destination: 'ollama:11434 (internal)', allowed: true },
  { time: '10:23:41', source: 'orchestrator', destination: 'qdrant:6333 (internal)', allowed: true },
  { time: '10:24:12', source: 'orchestrator', destination: 'ollama:11434 (internal)', allowed: true },
  { time: '10:25:58', source: 'tool-docgen', destination: 'minio:9000 (internal)', allowed: true },
  { time: '11:45:16', source: 'orchestrator', destination: 'ollama:11434 (internal)', allowed: true },
  { time: '11:46:02', source: 'orchestrator', destination: 'sandbox-runner (internal)', allowed: true },
  { time: '14:02:49', source: 'orchestrator', destination: 'ollama:11434 (internal)', allowed: true },
  { time: '14:03:11', source: 'orchestrator', destination: 'ollama:11434 (internal)', allowed: true },
];

export const CHAT_HISTORY = {
  'task-001': [
    { role: 'user', text: 'Please review this inspection report for CDU Unit 2891 and prepare an approval note citing relevant SOP clauses.', attachment: 'CDU_Inspection_Report_2891.pdf' },
    { role: 'assistant', text: '**Processing your inspection report.**\n\nI\'ve started the agentic workflow:\n1. **OCR Extraction** — Extracting text and tables from the scanned PDF (3 pages detected)\n2. **RAG Search** — Searching Inspection SOPs & Safety Manuals for relevant clauses\n3. **Drafting** — Generating structured approval note\n4. **Document** — Generating .docx with audit appendix\n\n*All processing is happening on MRPL servers. Zero external calls made.*', isProcessing: false },
    { role: 'assistant', text: '✅ **Approval Note Ready**\n\nThe approval note for **CDU Unit 2891** has been generated with the following citations:\n- **OISD-117 §4.3** — Inspection frequency for pressure vessels\n- **IS 2825:1969 §6.1** — Acceptance criteria for weld quality\n- **MRPL SOP-QI-22 §2.4** — Sign-off requirements for CDU inspections\n\n**OCR Confidence:** 91% — All regions above threshold.\n\nThe document is ready for your review. Please approve or request changes before finalization.', isProcessing: false },
  ],
};

export const MOCK_AI_RESPONSES = [
  {
    trigger: ['inspection', 'report', 'approval'],
    response: `**Agentic Workflow Initiated — Inspection Report Processing**

I'll process this in 4 stages:

**Stage 1 — OCR/Vision Extraction**
→ Scanning uploaded document using on-device PaddleOCR + Vision model
→ Extracting text, tables, and handwritten annotations

**Stage 2 — RAG Knowledge Search**
→ Searching local SOP database for relevant regulatory clauses
→ OISD, IS standards, and MRPL internal SOPs being queried

**Stage 3 — AI Reasoning & Drafting**
→ General reasoning model analyzing findings against SOP requirements
→ Drafting structured approval note with citations

**Stage 4 — Document Generation**
→ Generating .docx with official MRPL formatting + audit appendix

*⚡ Running entirely on MRPL's on-premise GPU server. No data leaves the organization.*`,
  },
  {
    trigger: ['code', 'python', 'script', 'calculate'],
    response: `**Coding Task Assigned to Code Specialist Model**

\`\`\`python
# Mass Balance Calculation — CDU Unit
# Generated by Qwen2.5-Coder on MRPL AI Workbench

def calculate_mass_balance(feed_rate, product_yields, losses):
    """Calculate mass balance for distillation unit."""
    total_products = sum(product_yields.values())
    total_out = total_products + losses
    imbalance = feed_rate - total_out
    efficiency = (total_products / feed_rate) * 100
    return {
        'feed_rate_kg_h': feed_rate,
        'total_products_kg_h': total_products,
        'losses_kg_h': losses,
        'imbalance_kg_h': imbalance,
        'efficiency_pct': round(efficiency, 2)
    }
\`\`\`

**Sandbox Execution Result:**
\`\`\`
✅ Exit Code: 0
Output: {'feed_rate_kg_h': 5000, 'total_products_kg_h': 4820, 
         'losses_kg_h': 142, 'imbalance_kg_h': 38, 'efficiency_pct': 96.4}
\`\`\`

Script and execution log ready for download.`,
  },
  {
    trigger: ['summarize', 'summary', 'meeting', 'minutes', 'ppt'],
    response: `**Multimodal Summarization Workflow Started**

Processing your document through the Vision + General model pipeline:

1. **Vision OCR** — Extracting text from all pages/slides
2. **Content Analysis** — Identifying key discussion points, decisions, and action items  
3. **Restructuring** — Creating a concise 5-point summary
4. **PPT Generation** — Building .pptx with official MRPL template

📋 **Preliminary Summary Detected:**
- Q2 Operational Performance Review
- Crude throughput: 3.69 MMTPA (98.2% capacity utilization)
- Maintenance schedule for Unit 4 discussed
- Budget allocation for digital initiatives approved
- Next review scheduled for October 2026

Generating formatted PowerPoint presentation...`,
  },
  {
    trigger: ['sop', 'manual', 'procedure', 'clause'],
    response: `**RAG Knowledge Base Search — Local SOPs**

Searching across your accessible knowledge collections:
- ✅ Inspection SOPs (47 documents, 2,341 chunks)
- ✅ Safety Manuals (23 documents, 1,789 chunks)

**Top Retrieved Clauses:**

> **OISD-117 §4.3** — *Inspection of Pressure Vessels*
> "All pressure vessels in service shall be subjected to internal inspection at intervals not exceeding three years..."

> **IS 2825:1969 §6.1** — *Weld Quality Acceptance*
> "Butt welds shall be examined by radiographic testing. Acceptance criteria: no cracks, no complete lack of fusion..."

> **MRPL SOP-QI-22 §2.4** — *CDU Inspection Sign-Off*
> "Inspector shall prepare a written report within 48 hours of inspection completion, referencing applicable OISD standards..."

*All results retrieved from local Qdrant vector database. No external search performed.*`,
  },
];

export const getDefaultResponse = (query) => {
  const lower = query.toLowerCase();
  for (const item of MOCK_AI_RESPONSES) {
    if (item.trigger.some(t => lower.includes(t))) {
      return item.response;
    }
  }
  return `**Processing your request on MRPL AI Workbench**

I'm analyzing your query using the on-premise general reasoning model (Llama 3.1 8B).

Based on your role permissions, I have access to:
- Your authorized knowledge collections (SOPs, manuals)
- Available tools (based on your role)
- Local model pool (no external API calls)

Could you provide more specific details about what you need? For example:
- Upload a document for analysis
- Describe a calculation you need performed
- Specify which SOP or standard you're referencing

*All processing happens on MRPL's sovereign GPU server. Egress monitor shows 0 external calls.*`;
};
