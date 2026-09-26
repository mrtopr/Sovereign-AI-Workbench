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
  {
    id: 'u5',
    name: 'System Admin',
    nameHindi: 'सिस्टम एडमिन',
    username: 'test123@gmail.com',
    password: 'password123',
    role: 'IT Admin',
    department: 'IT & Cybersecurity',
    employeeId: 'MRPL/ADMIN/0001',
    avatar: 'SA',
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
    title: 'CDU-2891 Ultrasonic Thickness (UTM) & OISD-117 Approval',
    status: 'completed',
    user: 'Rina Sharma',
    role: 'Inspector',
    created: '2026-09-09 10:23',
    completed: '2026-09-09 10:26',
    modelsUsed: ['Vision / Multimodal', 'General Reasoning'],
    toolsUsed: ['OCR/Vision', 'RAG Retriever', 'Doc Generator'],
    deliverables: ['approval_note_CDU-2891.docx', 'corrosion_rate_analysis.pdf'],
    egressAttempts: 0,
    steps: [
      { stage: 'Plan', status: 'done', note: 'Decomposed into 4 sub-tasks: UTM Scan OCR, RAG search, draft note, generate .docx' },
      { stage: 'Route', status: 'done', note: 'Vision model → NDT/UTM scan OCR; General model → compliance reasoning' },
      { stage: 'Act', status: 'done', note: 'Extracted 18 nozzle scan points. RAG retrieved OISD-STD-117 §4.3 & IS 2825:1969.' },
      { stage: 'Observe', status: 'done', note: 'Min thickness: 11.2mm (exceeds 9.5mm limit). Corrosion rate: 0.12 mm/yr. Valid for 36 months.' },
      { stage: 'Deliver', status: 'done', note: 'Generated approval_note_CDU-2891.docx with compliance matrix appendix.' },
    ],
    auditEntries: [
      { time: '10:23:01', actor: 'rina@mrpl.co.in', action: 'TASK_CREATED', resource: 'task-001' },
      { time: '10:23:04', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'llava:13b (UTM scan OCR)' },
      { time: '10:23:41', actor: 'orchestrator', action: 'TOOL_CALL', resource: 'rag-retriever (inspection-sops)' },
      { time: '10:24:12', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'llama3.1:8b (draft approval note)' },
      { time: '10:25:58', actor: 'orchestrator', action: 'TOOL_CALL', resource: 'doc-generator (docx)' },
      { time: '10:26:03', actor: 'orchestrator', action: 'TASK_COMPLETE', resource: 'approval_note_CDU-2891.docx' },
    ],
  },
  {
    id: 'task-002',
    title: 'CDU / VDU Hydrocarbon Mass Balance & Cut Yield Simulation',
    status: 'completed',
    user: 'Dev Nair',
    role: 'Engineer',
    created: '2026-09-09 11:45',
    completed: '2026-09-09 11:48',
    modelsUsed: ['Code Specialist'],
    toolsUsed: ['Sandbox Executor'],
    deliverables: ['cdu_mass_balance.py', 'yield_reconciliation_log.txt'],
    egressAttempts: 0,
    steps: [
      { stage: 'Plan', status: 'done', note: 'Formulate mass balance equations for Arab Extra Light blend, execute in secure sandbox' },
      { stage: 'Route', status: 'done', note: 'Code Specialist model assigned for thermodynamic calculation script' },
      { stage: 'Act', status: 'done', note: 'Script drafted & executed. Processed 15,000 MT/day throughput across 6 product streams.' },
      { stage: 'Observe', status: 'done', note: 'Unaccounted loss: 0.13% (within 0.3% OISD benchmark). Recovery efficiency: 99.87%.' },
      { stage: 'Deliver', status: 'done', note: 'cdu_mass_balance.py + yield_reconciliation_log.txt ready.' },
    ],
    auditEntries: [
      { time: '11:45:12', actor: 'dev@mrpl.co.in', action: 'TASK_CREATED', resource: 'task-002' },
      { time: '11:45:16', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'qwen2.5-coder:7b (mass balance modeling)' },
      { time: '11:46:02', actor: 'orchestrator', action: 'TOOL_CALL', resource: 'sandbox-executor (python3)' },
      { time: '11:46:14', actor: 'orchestrator', action: 'TASK_COMPLETE', resource: 'cdu_mass_balance.py' },
    ],
  },
  {
    id: 'task-003',
    title: 'HCU High-Pressure Separator HAZOP & ESD Trip Matrix Review',
    status: 'completed',
    user: 'Dev Nair',
    role: 'Engineer',
    created: '2026-09-09 13:10',
    completed: '2026-09-09 13:14',
    modelsUsed: ['General Reasoning'],
    toolsUsed: ['RAG Retriever', 'Doc Generator'],
    deliverables: ['hcu_hazop_esd_audit.pdf'],
    egressAttempts: 0,
    steps: [
      { stage: 'Plan', status: 'done', note: 'Audit ESD Cause & Effect logic against OISD-152 & API RP 521 blowdown safety' },
      { stage: 'Route', status: 'done', note: 'General model assigned for safety integrity level (SIL) reasoning' },
      { stage: 'Act', status: 'done', note: 'Cross-referenced 24 trip interlocks with Hydrocracker SOP-HCU-09.' },
      { stage: 'Observe', status: 'done', note: 'Zero bypasses detected. 2oo3 voting logic verified for PSHH-4012 (158 kg/cm²g).' },
      { stage: 'Deliver', status: 'done', note: 'Delivered certified compliance sign-off document.' },
    ],
    auditEntries: [
      { time: '13:10:05', actor: 'dev@mrpl.co.in', action: 'TASK_CREATED', resource: 'task-003' },
      { time: '13:10:15', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'llama3.1:8b (HAZOP analysis)' },
      { time: '13:11:40', actor: 'orchestrator', action: 'TOOL_CALL', resource: 'rag-retriever (safety-manuals)' },
      { time: '13:14:02', actor: 'orchestrator', action: 'TASK_COMPLETE', resource: 'hcu_hazop_esd_audit.pdf' },
    ],
  },
  {
    id: 'task-004',
    title: 'Q2 Operational Review & Gross Refining Margin (GRM) Board Deck',
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
      { stage: 'Plan', status: 'done', note: 'Extract crude intake charts, calculate GRM ($10.42/bbl), generate 6-slide executive PPT' },
      { stage: 'Route', status: 'done', note: 'Vision model → chart OCR; General model → GRM narrative synthesis' },
      { stage: 'Act', status: 'active', note: 'Processing crude throughput and product slate breakdown... (Slide 4/6)' },
      { stage: 'Observe', status: 'pending', note: 'Validating distillate crack spreads against Platts benchmark' },
      { stage: 'Deliver', status: 'pending', note: 'Pending' },
    ],
    auditEntries: [
      { time: '14:02:44', actor: 'meena@mrpl.co.in', action: 'TASK_CREATED', resource: 'task-004' },
      { time: '14:02:49', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'llava:13b (OCR production figures)' },
      { time: '14:03:11', actor: 'orchestrator', action: 'MODEL_CALL', resource: 'llama3.1:8b (GRM financial synthesis)' },
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
    trigger: ['oisd', 'sop', 'clause', 'standard', 'is 2825', 'api 510', 'rule', 'code'],
    response: `### 📋 **Retrieved Standards & Regulatory Clauses — MRPL Sovereign Knowledge Base**

Searched local vector indices: \`inspection-sops\` (47 docs) and \`safety-manuals\` (23 docs)

---

#### 1. **OISD-STD-117 §4.3 — Inspection Frequency & Integrity of Pressure Vessels**
> *"All unfired pressure vessels in hydrocarbon refinery service shall be subjected to internal and comprehensive ultrasonic thickness inspection at intervals not exceeding 36 months, or half the remaining calculated corrosion life, whichever is lower."*
- **Application**: Mandatory for CDU/VDU columns, strippers, and stabilizer vessels.
- **Compliance Criteria**: Wall thickness readings must be recorded across a minimum 8-point radial grid for both top shell and bottom boot sections.

---

#### 2. **IS 2825:1969 §6.1 & ASME Sec VIII Div 1 — Weld Joint Quality & Radiographic Testing (RT)**
> *"Circumferential and longitudinal seam welds subjected to severe sour hydrocarbon service (H₂S > 50 ppm) must exhibit 100% full radiographic inspection with zero permissible linear cracks, incomplete penetration, or lack of fusion."*
- **Acceptance Threshold**: Maximum porosity cluster diameter $\\le 1.5\\text{ mm}$ within any $150\\text{ mm}$ weld length.

---

#### 3. **MRPL SOP-QI-22 §2.4 — Statutory Sign-off Protocol for CDU Column Inspections**
> *"Lead Quality Inspector and Chief Maintenance Manager must countersign Form MRPL-NDT-04 within 48 hours of NDT data acquisition before column vessel re-pressurization and startup."*

---
🔒 *Retrieved entirely from MRPL On-Premise Sovereign Qdrant Database. Zero external network egress.*`,
  },
  {
    trigger: ['cdu', 'vdu', 'mass balance', 'yield', 'distillation', 'cut yield', 'python', 'script', 'calculate'],
    response: `### 🛢️ **CDU Hydrocarbon Yield & Mass Balance Reconciler**

\`\`\`python
# ==============================================================================
# MRPL Sovereign AI Workbench — Process Engineering Module
# Script: cdu_mass_balance_reconciler.py
# Standard: ASTM D2892 TBP Cut Yield & OISD Refinery Benchmarks
# ==============================================================================

import json
from dataclasses import dataclass

@dataclass
class RefineryFeedstock:
    crude_name: str
    feed_rate_bpd: float        # Barrels per Day
    feed_density_kg_m3: float   # kg/m3 at 15°C
    api_gravity: float

def execute_cdu_mass_balance(feed: RefineryFeedstock, loss_allowance_pct: float = 0.25):
    # Metric conversion: 1 barrel ≈ 0.158987 m3
    feed_m3_day = feed.feed_rate_bpd * 0.1589873
    feed_mass_mt_day = (feed_m3_day * feed.feed_density_kg_m3) / 1000.0
    
    # Typical Assay Cut Yields for High-Sulfur Middle East Blend (Arab Extra Light / Kuwait Blend)
    cut_fractions = {
        "Fuel Gas + LPG (C1-C4)": 0.038,
        "Light Naphtha (IBP - 90°C)": 0.082,
        "Heavy Naphtha (90°C - 140°C)": 0.134,
        "Kerosene / ATF (140°C - 240°C)": 0.185,
        "High Speed Diesel (HSD, 240°C - 370°C)": 0.312,
        "Vacuum Gas Oil (VGO from VDU)": 0.165,
        "Short Residue / Bitumen (>535°C)": 0.081
    }
    
    products_mt = {cut: round(feed_mass_mt_day * frac, 2) for cut, frac in cut_fractions.items()}
    total_recovered_mt = sum(products_mt.values())
    unaccounted_loss_mt = feed_mass_mt_day - total_recovered_mt
    loss_pct = (unaccounted_loss_mt / feed_mass_mt_day) * 100
    
    return {
        "crude": feed.crude_name,
        "feed_rate_bpd": feed.feed_rate_bpd,
        "feed_mass_mt_day": round(feed_mass_mt_day, 2),
        "product_yields_mt_day": products_mt,
        "total_recovery_mt_day": round(total_recovered_mt, 2),
        "unaccounted_loss_pct": round(loss_pct, 3),
        "status": "CONVERGED (OISD Compliant)" if loss_pct <= loss_allowance_pct else "FLAGGED_HIGH_LOSS"
    }

# Execution Run on MRPL CDU Unit-II
feed_data = RefineryFeedstock(crude_name="Arab Extra Light Blend", feed_rate_bpd=110000, feed_density_kg_m3=835.0, api_gravity=37.8)
result = execute_cdu_mass_balance(feed_data)
print(json.dumps(result, indent=2))
\`\`\`

#### ⚡ **Isolated Sandbox Execution Output:**
\`\`\`json
{
  "crude": "Arab Extra Light Blend",
  "feed_rate_bpd": 110000,
  "feed_mass_mt_day": 14603.22,
  "product_yields_mt_day": {
    "Fuel Gas + LPG (C1-C4)": 554.92,
    "Light Naphtha (IBP - 90°C)": 1197.46,
    "Heavy Naphtha (90°C - 140°C)": 1956.83,
    "Kerosene / ATF (140°C - 240°C)": 2701.60,
    "High Speed Diesel (HSD, 240°C - 370°C)": 4556.20,
    "Vacuum Gas Oil (VGO from VDU)": 2409.53,
    "Short Residue / Bitumen (>535°C)": 1182.86
  },
  "total_recovery_mt_day": 14559.40,
  "unaccounted_loss_pct": 0.300,
  "status": "CONVERGED (OISD Compliant)"
}
\`\`\`
🔒 *Executed locally inside Docker gVisor sandbox. CPU time: 142ms. Zero egress.*`,
  },
  {
    trigger: ['inspection', 'report', 'approval', 'utm', 'ultrasonic', 'thickness', 'vessel', 'cdu-2891'],
    response: `### 🛡️ **MRPL Statutory Inspection & Compliance Approval Note**

**Document Ref:** \`MRPL/QI/2026/AP-2891\`  
**Unit:** Crude Distillation Unit (CDU-II), Column Vessel \`V-1001\`  
**Inspecting Engineer:** Rina Sharma (QI/2891) | **Review Authority:** Sovereign AI Integrity Agent

---

#### 1. **Ultrasonic Thickness Measurement (UTM) Summary**
- **Nominal Shell Thickness**: $14.00\\text{ mm}$ (Carbon Steel SA-516 Gr 70)
- **Minimum Design Thickness ($t_{\\text{min}}$)**: $9.50\\text{ mm}$ (per ASME Sec VIII Div 1 UG-32)
- **Observed Critical Thickness**: $11.20\\text{ mm}$ at Tray #14 feed nozzle junction
- **Measured Corrosion Rate**: $0.12\\text{ mm/year}$
- **Calculated Remaining Life**:
  $$\\text{Remaining Life} = \\frac{t_{\\text{actual}} - t_{\\text{min}}}{\\text{Corrosion Rate}} = \\frac{11.20 - 9.50}{0.12} = 14.16 \\text{ years}$$

---

#### 2. **Compliance Verification Matrix**
| Standard / Code | Clause | Criterion | Actual Finding | Compliance Status |
| :--- | :--- | :--- | :--- | :--- |
| **OISD-STD-117** | §4.3.1 | Remaining Life $\\ge 3$ yrs | 14.16 years | 🟢 **PASSED** |
| **API 510** | §6.4 | Ultrasonic grid density | 18 points evaluated | 🟢 **PASSED** |
| **IS 2825:1969** | §6.1 | Weld seam integrity | 0 cracks, 0 undercut | 🟢 **PASSED** |

---

#### 3. **Formal Inspector Recommendation & Sign-Off**
> *"Vessel \`V-1001\` is structurally sound and certified for continuous operation at operating pressure $3.8\\text{ kg/cm}^2\\text{g}$ and temperature $365^\\circ\\text{C}$ for the upcoming **36-month operational cycle**. Next inspection due: **September 2029**."*

✅ *Downloadable artifact \`approval_note_CDU-2891.docx\` generated with cryptographic hash.*`,
  },
  {
    trigger: ['hazop', 'hcu', 'esd', 'interlock', 'safety', 'hydrocracker', 'emergency'],
    response: `### ⚠️ **HCU High-Pressure Separator HAZOP & ESD Trip Matrix Audit**

**Target Loop:** Hydrocracker Unit (HCU) Loop 400 — High-Pressure Separator (\`V-4001\`)  
**Design Limits:** Design Pressure: $175\\text{ kg/cm}^2\\text{g}$ | Operating Pressure: $148\\text{ kg/cm}^2\\text{g}$ | Temperature: $415^\\circ\\text{C}$

---

#### 1. **Automated ESD Cause-and-Effect Logic Verification**
\`\`\`mermaid
graph TD
    A[PSHH-4012 Sensor Trip @ 158 kg/cm²g] -->|2oo3 Voting Logic| B(ESD-Level 1 Processor)
    B --> C[Close XV-4001: Reactor Effluent Feed Valve in 1.8s]
    B --> D[Open BDV-4005: Emergency Flare Depressurization Valve in 2.2s]
    B --> E[Trip Feed Pumps P-4001 A/B via Interlock I-409]
    B --> F[Inject HP Quench Gas Hydrogen via XV-4008]
\`\`\`

---

#### 2. **HAZOP Node 4.2 Deviation Analysis (High Pressure Surge)**
- **Cause**: Upstream thermal runaway in 2nd-stage Hydrocracking Catalyst Bed ($R-4002$) or failure of HP level control valve ($LV-4003$).
- **Consequence**: Overpressurization of separator shell exceeding relief rating, potential flange leak.
- **Safeguards Checked**:
  1. Primary: 2-out-of-3 (2oo3) smart pressure transmitters \`PT-4012A/B/C\`.
  2. Secondary: Dual pilot-operated Safety Relief Valves (\`PSV-4001A/B\`) set at $165\\text{ kg/cm}^2\\text{g}$ discharging directly to HP Acid Flare header.
  3. Safety Integrity Level: **SIL-3 Certified** per IEC 61508 / OISD-STD-152.

---

#### 3. **Integrity Audit Verdict**
🟢 **ALL 24 ESD LOGIC GATES VERIFIED.** No unapproved overrides or maintenance bypasses active in DCS.`,
  },
  {
    trigger: ['desalter', 'crude', 'salt', 'bsw', 'water', 'emulsion', 'ptb', 'quality'],
    response: `### 🧪 **Crude Desalter Unit (DS-101) Process & Salt Content Assessment**

**Assay Sample ID:** \`CR-2026-SEP-0881\` | **Feed Crude Blend:** Arab Heavy (60%) + Basrah Medium (40%)  
**Standard Test Method:** ASTM D3230 (Electrometric Salt in Crude) & ASTM D4007 (BS&W)

---

#### 1. **Analytical Performance vs. Design Limits**
| Parameter | Raw Crude Inlet | Desalter Outlet (Treated) | MRPL Target Threshold | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Salt Content (PTB)** | $38.4\\text{ PTB}$ | **$2.8\\text{ PTB}$** ($8.0\\text{ mg/L}$) | $\\le 3.5\\text{ PTB}$ | 🟢 **Compliant** |
| **BS&W (Water & Sediment)** | $0.85\\%\\text{ vol}$ | **$0.12\\%\\text{ vol}$** | $\\le 0.20\\%\\text{ vol}$ | 🟢 **Compliant** |
| **Wash Water Ratio** | — | **$5.8\\%\\text{ on crude}$** | $5.0 - 7.0\\%$ | 🟢 **Optimal** |
| **Demulsifier Dosing** | — | **$18.5\\text{ ppm}$** | $15 - 22\\text{ ppm}$ | 🟢 **Optimal** |
| **Electric Grid Current** | — | **$24.2\\text{ Amps}$ (32 kV)** | $20 - 30\\text{ Amps}$ | 🟢 **Stable** |

---

#### 2. **Process Engineering Observations & Remediation**
- **Corrosion Control in Overhead System**: With desalting efficiency at **$92.71\\%$**, downstream atmospheric column top temperature should maintain water dew point at minimum $+15^\\circ\\text{C}$ margin to prevent ammonium chloride ($NH_4Cl$) salt deposition.
- **Brine Effluent**: Oil-in-water carryover to ETP is $42\\text{ ppm}$ (within $50\\text{ ppm}$ limit).

🔒 *Analyzed on local Sovereign AI Process Engineering Engine.*`,
  },
  {
    trigger: ['grm', 'board', 'ppt', 'deck', 'refining margin', 'throughput', 'presentation', 'executive'],
    response: `### 📊 **MRPL Boardroom Executive Presentation — Q2 Operational Performance**

*Generated using MRPL Sovereign Multimodal Synthesis Engine (Slide Outline & Financial Deck)*

---

#### **Slide 1: Executive Summary & Highlights**
- **Crude Throughput**: **$3.94\\text{ MMT}$** (Capacity Utilization: **$105.2\\%$** against nameplate).
- **Gross Refining Margin (GRM)**: **$\\$10.42\\text{ / bbl}$** vs. Reuters Singapore benchmark of $\\$\\text{7.80 / bbl}$.
- **Distillate Yield**: Record **$78.4\\%$** high-value middle distillates (ATF + BS-VI HSD).

---

#### **Slide 2: Energy & Fuel Loss Index (MBN)**
- Specific Energy Consumption: **$54.2\\text{ MBN}$** (Reduction of $1.8\\text{ MBN}$ YoY).
- Captive Power Plant generation: 100% reliable with zero grid import tripping.

---

#### **Slide 3: High-Sulfur Crude Processing Advantage**
- High-Sulfur / Heavy Crude slate optimized to **$76.2\\%$** of total basket, generating raw material savings of $\\$\\text{1.45 / bbl}$.

---

#### **Slide 4: Zero Egress & Digital Integrity**
- 100% of telemetry, lab LIMS data, and refinery DCS workflows processed strictly within MRPL on-premise AI sovereignty perimeter.

📁 *Deck ready for export: \`MRPL_Q2_Performance_Board_Deck.pptx\`*`,
  },
];

export const getDefaultResponse = (query) => {
  const lower = query.toLowerCase();
  for (const item of MOCK_AI_RESPONSES) {
    if (item.trigger.some(t => lower.includes(t))) {
      return item.response;
    }
  }
  return `### 🛢️ **MRPL Sovereign AI Workbench — Processing Response**

**Query Analyzed**: \`${query}\`  
**Computing Node**: Sovereign AI GPU Cluster (Llama 3.1 8B Instruct — On-Premise)

---

#### 📌 **Refinery Knowledge Context & Retrieval:**
- **Authorized Collections**: \`Inspection SOPs\`, \`Safety Manuals\`, \`Process Engineering SOPs\`
- **Regulatory Framework**: OISD, API 510/570, ASTM standards, MRPL Technical Specifications
- **Data Perimeter**: **Zero External Egress** (Air-gapped on-premise architecture)

#### 💡 **Recommended Operational Commands:**
1. **SOP Search**: *"Retrieve OISD-117 pressure vessel inspection clauses"*
2. **Process Engineering**: *"Calculate CDU yield mass balance for Arab Light crude"*
3. **Safety / HAZOP**: *"Review HCU high-pressure separator ESD trip matrix"*
4. **Lab Assay**: *"Evaluate crude desalter salt content (PTB) & BS&W analysis"*

*Need detailed calculations or specific document drafting? Please provide unit numbers or upload scanned inspection logs.*`;
};
