"""
FastAPI Backend — SIH 2026 Prototype
Sovereign On-Premise Agentic AI Workbench
Hardcoded data — no real models, no database
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
import time
import asyncio
import random
from datetime import datetime

app = FastAPI(
    title="MRPL Sovereign AI Workbench — API",
    description="On-Premise Agentic AI Workbench for MRPL | SIH26117",
    version="1.0.0-prototype",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── HARDCODED DATA ───────────────────────────────────────────────────────────

USERS = {
    "rina@mrpl.co.in": {
        "id": "u1", "name": "Rina Sharma", "nameHindi": "रीना शर्मा",
        "username": "rina@mrpl.co.in", "password": "demo123",
        "role": "Inspector", "department": "Quality Inspection",
        "employeeId": "MRPL/QI/2891", "avatar": "RS",
        "permissions": {
            "collections": ["inspection-sops", "safety-manuals"],
            "tools": ["ocr", "rag", "docgen"],
            "models": ["general", "vision"],
        }
    },
    "dev@mrpl.co.in": {
        "id": "u2", "name": "Dev Nair", "nameHindi": "देव नायर",
        "username": "dev@mrpl.co.in", "password": "demo123",
        "role": "Engineer", "department": "Process Engineering",
        "employeeId": "MRPL/PE/1247", "avatar": "DN",
        "permissions": {
            "collections": ["engineering-sops", "design-manuals"],
            "tools": ["rag", "docgen", "sandbox"],
            "models": ["general", "code", "vision"],
        }
    },
    "meena@mrpl.co.in": {
        "id": "u3", "name": "Meena Kulkarni", "nameHindi": "मीना कुलकर्णी",
        "username": "meena@mrpl.co.in", "password": "demo123",
        "role": "Admin Staff", "department": "Administration",
        "employeeId": "MRPL/ADM/3056", "avatar": "MK",
        "permissions": {
            "collections": ["admin-correspondence", "admin-sops"],
            "tools": ["rag", "docgen"],
            "models": ["general"],
        }
    },
    "arjun@mrpl.co.in": {
        "id": "u4", "name": "Arjun Patel", "nameHindi": "अर्जुन पटेल",
        "username": "arjun@mrpl.co.in", "password": "demo123",
        "role": "IT Admin", "department": "IT & Cybersecurity",
        "employeeId": "MRPL/IT/0421", "avatar": "AP",
        "permissions": {
            "collections": ["*"],
            "tools": ["egress-monitor", "audit-viewer", "model-registry"],
            "models": [],
        }
    },
}

MODEL_POOL = [
    {
        "id": "m1", "name": "General Reasoning",
        "model": "llama3.1:8b-instruct-q4_K_M",
        "status": "active",
        "task_tags": ["summarize", "draft", "reason", "explain"],
        "vram": "5.2 GB", "calls": 134, "avg_latency": "2.4s",
        "serving": "Ollama", "endpoint": "http://ollama:11434/v1",
    },
    {
        "id": "m2", "name": "Code Specialist",
        "model": "qwen2.5-coder:7b-q4_K_M",
        "status": "active",
        "task_tags": ["code", "debug", "calculate"],
        "vram": "4.8 GB", "calls": 89, "avg_latency": "1.9s",
        "serving": "Ollama", "endpoint": "http://ollama:11434/v1",
    },
    {
        "id": "m3", "name": "Vision / Multimodal",
        "model": "llava:13b-v1.6-q4_K_M",
        "status": "active",
        "task_tags": ["ocr-assist", "image-understand", "multimodal"],
        "vram": "8.1 GB", "calls": 42, "avg_latency": "3.8s",
        "serving": "Ollama", "endpoint": "http://ollama:11434/v1",
    },
]

KNOWLEDGE_COLLECTIONS = [
    {"id": "kc1", "name": "Inspection SOPs", "documents": 47, "chunks": 2341,
     "roles": ["Inspector", "IT Admin"], "last_updated": "2026-09-01", "size": "12.4 MB"},
    {"id": "kc2", "name": "Safety Manuals", "documents": 23, "chunks": 1789,
     "roles": ["Inspector", "Engineer", "IT Admin"], "last_updated": "2026-08-28", "size": "8.7 MB"},
    {"id": "kc3", "name": "Engineering SOPs", "documents": 61, "chunks": 4102,
     "roles": ["Engineer", "IT Admin"], "last_updated": "2026-09-05", "size": "19.2 MB"},
    {"id": "kc4", "name": "Admin Correspondence", "documents": 134, "chunks": 891,
     "roles": ["Admin Staff", "IT Admin"], "last_updated": "2026-09-08", "size": "4.1 MB"},
]

TASKS = [
    {
        "id": "task-001", "title": "Inspection Report → Approval Note",
        "status": "completed", "user": "Rina Sharma", "role": "Inspector",
        "created": "2026-09-09 10:23", "completed": "2026-09-09 10:26",
        "models_used": ["Vision / Multimodal", "General Reasoning"],
        "tools_used": ["OCR/Vision", "RAG Retriever", "Doc Generator"],
        "deliverables": ["approval_note_CDU-2891.docx"],
        "egress_attempts": 0,
        "steps": [
            {"stage": "Plan", "status": "done", "note": "Decomposed into 4 sub-tasks: OCR, RAG search, draft, generate .docx"},
            {"stage": "Route", "status": "done", "note": "Vision model → OCR; General model → reasoning & drafting"},
            {"stage": "Act", "status": "done", "note": "PaddleOCR extracted 3 pages, 2 tables. RAG retrieved 5 SOP clauses (IS 2825, OISD-117)."},
            {"stage": "Observe", "status": "done", "note": "OCR confidence: 0.91. Schema checks passed. All citations verified."},
            {"stage": "Deliver", "status": "done", "note": "Generated approval_note_CDU-2891.docx with audit appendix."},
        ],
    },
    {
        "id": "task-002", "title": "Python mass-balance script → sandbox test",
        "status": "completed", "user": "Dev Nair", "role": "Engineer",
        "created": "2026-09-09 11:45", "completed": "2026-09-09 11:48",
        "models_used": ["Code Specialist"],
        "tools_used": ["Sandbox Executor"],
        "deliverables": ["mass_balance.py", "execution_log.txt"],
        "egress_attempts": 0,
        "steps": [
            {"stage": "Plan", "status": "done", "note": "Write mass-balance script, execute in sandbox, verify output"},
            {"stage": "Route", "status": "done", "note": "Code model assigned for all code sub-tasks"},
            {"stage": "Act", "status": "done", "note": "Code drafted. Sandbox iteration 1: exit code 0."},
            {"stage": "Observe", "status": "done", "note": "Exit code 0. Output matches expected mass-balance equation."},
            {"stage": "Deliver", "status": "done", "note": "mass_balance.py + execution_log.txt generated."},
        ],
    },
    {
        "id": "task-003", "title": "Board Meeting Minutes → PPT Summary",
        "status": "in-progress", "user": "Meena Kulkarni", "role": "Admin Staff",
        "created": "2026-09-09 14:02", "completed": None,
        "models_used": ["Vision / Multimodal", "General Reasoning"],
        "tools_used": ["OCR/Vision", "Doc Generator"],
        "deliverables": [],
        "egress_attempts": 0,
        "steps": [
            {"stage": "Plan", "status": "done", "note": "OCR slides, summarize content, generate 5-slide PPT"},
            {"stage": "Route", "status": "done", "note": "Vision model → OCR; General model → summarize"},
            {"stage": "Act", "status": "active", "note": "Processing slide 3/8... OCR in progress."},
            {"stage": "Observe", "status": "pending", "note": "Waiting for OCR completion"},
            {"stage": "Deliver", "status": "pending", "note": "Pending"},
        ],
    },
]

AUDIT_LOG = [
    {"id": "al001", "time": "10:23:01", "actor": "rina@mrpl.co.in", "action": "TASK_CREATED", "resource": "task-001", "task_id": "task-001"},
    {"id": "al002", "time": "10:23:04", "actor": "orchestrator", "action": "MODEL_CALL", "resource": "llava:13b (OCR extract)", "task_id": "task-001"},
    {"id": "al003", "time": "10:23:41", "actor": "orchestrator", "action": "TOOL_CALL", "resource": "rag-retriever (inspection-sops)", "task_id": "task-001"},
    {"id": "al004", "time": "10:24:12", "actor": "orchestrator", "action": "MODEL_CALL", "resource": "llama3.1:8b (draft approval note)", "task_id": "task-001"},
    {"id": "al005", "time": "10:25:58", "actor": "orchestrator", "action": "TOOL_CALL", "resource": "doc-generator (docx)", "task_id": "task-001"},
    {"id": "al006", "time": "10:26:03", "actor": "orchestrator", "action": "TASK_COMPLETE", "resource": "approval_note_CDU-2891.docx", "task_id": "task-001"},
    {"id": "al007", "time": "11:45:12", "actor": "dev@mrpl.co.in", "action": "TASK_CREATED", "resource": "task-002", "task_id": "task-002"},
    {"id": "al008", "time": "11:45:16", "actor": "orchestrator", "action": "MODEL_CALL", "resource": "qwen2.5-coder:7b (code generation)", "task_id": "task-002"},
    {"id": "al009", "time": "11:46:02", "actor": "orchestrator", "action": "TOOL_CALL", "resource": "sandbox-executor (python3)", "task_id": "task-002"},
    {"id": "al010", "time": "11:46:14", "actor": "orchestrator", "action": "TASK_COMPLETE", "resource": "mass_balance.py", "task_id": "task-002"},
]

EGRESS_LOG = [
    {"time": "10:23:04", "source": "orchestrator", "destination": "ollama:11434 (internal)", "allowed": True, "cidr": "192.168.10.0/24"},
    {"time": "10:23:41", "source": "orchestrator", "destination": "qdrant:6333 (internal)", "allowed": True, "cidr": "192.168.10.0/24"},
    {"time": "10:24:12", "source": "orchestrator", "destination": "ollama:11434 (internal)", "allowed": True, "cidr": "192.168.10.0/24"},
    {"time": "10:25:58", "source": "tool-docgen", "destination": "minio:9000 (internal)", "allowed": True, "cidr": "192.168.10.0/24"},
    {"time": "11:45:16", "source": "orchestrator", "destination": "ollama:11434 (internal)", "allowed": True, "cidr": "192.168.10.0/24"},
    {"time": "11:46:02", "source": "orchestrator", "destination": "sandbox-runner (internal)", "allowed": True, "cidr": "192.168.10.0/24"},
]

SYSTEM_STATUS = {
    "egress_external_count": 0,
    "egress_internal_count": len(EGRESS_LOG),
    "external_attempts_blocked": 0,
    "uptime_seconds": 51720,
    "models_loaded": 3,
    "active_users": 2,
    "total_tasks": 3,
    "completed_tasks": 2,
    "network_cidr": "192.168.10.0/24",
    "sovereignty_status": "CONFIRMED",
}

# Rich simulated domain responses for MRPL workflows
MOCK_RESPONSES = {
    "sop_clauses": """### 📋 Pressure Vessel Inspection — Verified SOP Clauses

**Knowledge Base:** `inspection-sops` · `safety-manuals` (Local Qdrant DB)  
**Verification:** All clauses cross-referenced against active MRPL standards and OISD guidelines.

---

#### 📌 Relevant Regulatory & Standard Operating Clauses

| Standard / Document | Clause ID | Requirement Summary | Criticality | Compliance Status |
|:---|:---|:---|:---:|:---:|
| **OISD-STD-117** | **§4.3.1** | External visual & ultrasonic thickness gauging every 24 months | 🔴 High | ✅ Compliant (Current: 18 mo) |
| **IS 2825:1969** | **§6.1.4** | Hydrostatic pressure testing at $1.5 \\times$ Maximum Allowable Working Pressure | 🔴 Critical | ✅ Certified (18.5 bar test) |
| **MRPL SOP-QI-22** | **§2.4.2** | Dual Non-Destructive Testing (NDT) radiograph on primary weld seams | 🟡 Medium | ✅ 100% Weld Inspection Clear |
| **ASME Sec VIII Div 1** | **UG-99** | Hydrostatic test hold time minimum 30 minutes with zero pressure drop | 🔴 Critical | ✅ Pressure Drop: 0.00 bar |
| **MRPL SOP-SAF-09** | **§1.8** | Confined space entry permit and continuous VOC monitoring prior to entry | 🟡 Safety | ✅ Gas Free Certificate Attached |

---

#### 🔍 Key Inspection Protocols
- **Corrosion Allowance**: Minimum allowable shell thickness is **14.2 mm** (Measured: **16.8 mm**, Remaining Life: **14.5 yrs**).
- **Safety Relief Valve (SRV)**: Bench calibrated at **12.0 bar** on 2026-08-15 (Tag: `SRV-CDU-042`).
- **Surface Condition**: Zero pitting or circumferential cracking detected along nozzle welds.

---

> 🔒 **Sovereignty Note:** Retrieved from local air-gapped vector store. Zero external network egress.""",

    "inspection": """### 📄 Executive Approval Note — Unit Inspection Review

**Reference No:** `MRPL/QI/APR/2026-2891`  
**Subject:** Technical Approval for Continued Operation of Crude Distillation Unit (CDU-II)  
**Inspector:** Rina Sharma (Quality Inspection Dept.)

---

#### 📊 Inspection Assessment Summary

| Component | Measured Value | Allowable Limit | Test Method | Outcome |
|:---|:---:|:---:|:---:|:---:|
| **Shell Thickness** | `16.8 mm` | `Min 14.2 mm` | Ultrasonic Gauge (UTM) | ✅ Acceptable |
| **Top Dish Head** | `15.1 mm` | `Min 13.5 mm` | UTM (Grid A-F) | ✅ Acceptable |
| **Nozzle Neck N-1** | `12.4 mm` | `Min 10.8 mm` | Dye Penetrant (DPT) | ✅ No Defects |
| **Operating Pressure** | `8.4 bar` | `Max 12.0 bar` | Digital Transducer | ✅ Normal Range |
| **Operating Temp** | `342 °C` | `Max 380 °C` | Thermocouple Array | ✅ Stable |

---

#### 📝 Executive Observations & Sign-Off Recommendation
1. **Structural Integrity**: The pressure vessel complies fully with **OISD-117** and **MRPL SOP-QI-22** parameters.
2. **Next Inspection Due**: Scheduled for **September 2028** (24-month statutory interval).
3. **Approval Status**: **APPROVED FOR CONTINUED SERVICE** subject to standard quarterly monitoring.

---

> 📦 **Generated Deliverables**: Official Approval Note (`.docx`) and Compliance Spreadsheet (`.xlsx`) prepared below.""",

    "code": """### 🐍 CDU Mass Balance Calculation & Sandbox Execution

**Engine:** Local Python 3.11 Sandbox (`--network=none`, isolated container)  
**Model:** Code Specialist (`qwen2.5-coder:7b-q4_K_M`)

```python
# MRPL Crude Distillation Unit (CDU-II) Mass Balance Script
# Author: Dev Nair | Process Engineering Dept.

def compute_cdu_mass_balance(crude_feed_kg_h, yields_kg_h, flaring_losses_kg_h):
    total_products = sum(yields_kg_h.values())
    total_outflow = total_products + flaring_losses_kg_h
    mass_imbalance = crude_feed_kg_h - total_outflow
    yield_efficiency = (total_products / crude_feed_kg_h) * 100
    
    return {
        "feed_rate_kg_h": crude_feed_kg_h,
        "total_yield_kg_h": total_products,
        "losses_kg_h": flaring_losses_kg_h,
        "imbalance_kg_h": round(mass_imbalance, 2),
        "efficiency_pct": round(yield_efficiency, 2),
        "status": "BALANCED" if abs(mass_imbalance) < (0.005 * crude_feed_kg_h) else "DISCREPANCY"
    }

# Input Parameters (Real-time refinery telemetry)
feed_in = 450000.0  # 450 T/h
products = {
    "LPG": 13500.0,
    "Light Naphtha": 49500.0,
    "Heavy Naphtha": 67500.0,
    "Kerosene / ATF": 58500.0,
    "High Speed Diesel (HSD)": 180000.0,
    "Reduced Crude Oil (RCO)": 76500.0
}
losses = 4500.0  # Offgas + flaring

result = compute_cdu_mass_balance(feed_in, products, losses)
print("MASS BALANCE RESULT:", result)
```

#### ⚡ Sandbox Execution Telemetry
```
[SANDBOX] Container: docker.internal/sandbox-runner:latest
[SANDBOX] Network isolation: ACTIVE (Egress socket blocked)
[SANDBOX] Execution Time: 34ms | Memory: 14.8 MB | Exit Code: 0
```

#### 📊 Stream Breakdown & Yield Percentage

| Stream Name | Mass Flow (kg/h) | Yield Share (%) | Quality Grade |
|:---|:---:|:---:|:---:|
| **Crude Feed (Inflow)** | `450,000` | `100.00%` | Arab Heavy / Maya Blend |
| **High Speed Diesel (HSD)** | `180,000` | `40.00%` | BS-VI Compliant (10 ppm S) |
| **Reduced Crude Oil (RCO)** | `76,500` | `17.00%` | Vacuum Unit Feed |
| **Heavy Naphtha** | `67,500` | `15.00%` | Reformer Feed |
| **Kerosene / ATF** | `58,500` | `13.00%` | Aviation Turbine Fuel |
| **Light Naphtha** | `49,500` | `11.00%` | Petrochemical Feed |
| **LPG** | `13,500` | `3.00%` | Domestic Bottling |
| **Total Outflow + Losses** | `450,000` | **99.00% Net Yield** | ✅ Mass Balanced (0.00% Discrepancy) |

---

> 📦 **Artifacts Available:** `cdu_mass_balance.py` script and `execution_log.txt` generated.""",

    "presentation": """### 📊 Executive PowerPoint Brief — Board Meeting Summary

**Document:** Board of Directors Review Meeting Minutes  
**Output:** 5-Slide Executive Presentation Outline (`.pptx`)

---

#### 📑 Slide Deck Structure & Content Outline

| Slide # | Slide Title | Key Content & Strategic Highlights | Visual Element |
|:---:|:---|:---|:---|
| **01** | **Executive Summary & Operational Throughput** | • Crude processing: **16.2 MMTPA** (108% capacity utilization)<br>• Zero statutory non-compliances recorded in Q2 | 📊 Gauge Chart |
| **02** | **Refinery Financial Performance** | • Gross Refining Margin (GRM): **$9.85 / bbl**<br>• Net Profit: **₹1,420 Cr** (+14% YoY increase) | 📈 Trend Line |
| **03** | **Health, Safety & Environmental Record** | • Lost Time Injury Frequency (LTIF): **0.00**<br>• SOx/NOx emissions 18% below OISD upper threshold | 🛡️ Shield Metric |
| **04** | **Strategic Expansion & Green Energy** | • 2G Ethanol Bio-Refinery project completion at 84%<br>• Green Hydrogen electrolyzer pilot commissioned | 🌿 Roadmap Timeline |
| **05** | **Action Items & Board Approvals Required** | • CAPEX sanction for Desalter Upgrade (CDU-III)<br>• Adoption of on-premise AI automation guidelines | ✅ Sign-off Matrix |

---

> 📦 **Deliverable:** Full executive presentation generated: `MRPL_Board_Meeting_Summary.pptx`.""",

    "default": """### 💡 Sovereign AI Analysis & Response

**Model:** `llama3.1:8b-instruct` (Running on Local GPU Cluster)  
**Security:** Zero external data transmission · 100% On-Premise Execution

---

#### 📌 Overview & Findings
Your inquiry has been processed against authorized MRPL operational datasets and departmental reference archives.

1. **Policy & Compliance Alignment**: The request complies with MRPL internal operational guidelines, cybersecurity governance protocols, and Miniratna PSU administrative procedures.
2. **Actionable Recommendations**:
   - Verify specific equipment and departmental tags (`MRPL/QI`, `MRPL/PE`, `MRPL/ADM`).
   - All generated drafts and calculations must be formally validated by the designated supervising authority prior to external dissemination.
3. **Audit Readiness**: This interaction has been securely committed to the tamper-proof local audit hash-chain.

---

> 🛡️ **Air-Gapped Guarantee:** Confined strictly to the internal network (`192.168.10.0/24`). Zero egress calls."""
}


# ─── AUTH ─────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str

def get_current_user(x_user_id: str = Header(default=None)):
    if x_user_id and x_user_id in USERS:
        return USERS[x_user_id]
    return None


@app.post("/api/auth/login")
async def login(req: LoginRequest):
    user = USERS.get(req.username)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    safe_user = {k: v for k, v in user.items() if k != "password"}
    return {"success": True, "user": safe_user, "token": f"mock_token_{user['id']}"}


@app.get("/api/auth/me")
async def me(user = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {k: v for k, v in user.items() if k != "password"}


# ─── TASKS ─────────────────────────────────────────────────────────────────────

@app.get("/api/tasks")
async def list_tasks(user_id: Optional[str] = None):
    if user_id:
        user = USERS.get(user_id)
        if user and user["role"] != "IT Admin":
            return [t for t in TASKS if t["user"] == user["name"]]
    return TASKS


@app.get("/api/tasks/{task_id}")
async def get_task(task_id: str):
    task = next((t for t in TASKS if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# ─── AGENT CHAT ───────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    user_id: str
    task_id: Optional[str] = None
    file_name: Optional[str] = None

@app.post("/api/chat")
async def chat(req: ChatRequest):
    """Simulate realistic multimodal on-premise agentic workflow latency."""
    # Authentic on-premise GPU model inference + RAG + verification latency
    actual_latency = random.uniform(4.8, 6.2)
    await asyncio.sleep(actual_latency)

    msg_lower = req.message.lower()

    if any(k in msg_lower for k in ["clause", "pressure vessel", "oisd-117", "is 2825", "find relevant sop"]):
        response = MOCK_RESPONSES["sop_clauses"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Analyzed query: RAG knowledge search on pressure vessel SOPs"},
            {"stage": "Route", "status": "done", "note": "Dispatched to Qdrant vector DB + LLaMA-3-70B model"},
            {"stage": "Act", "status": "done", "note": "Retrieved 5 standard clauses from OISD-117 and IS 2825"},
            {"stage": "Observe", "status": "done", "note": "Validated compliance criteria against active MRPL standards"},
            {"stage": "Deliver", "status": "done", "note": "Compiled comprehensive SOP matrix and checklist"},
        ]
        deliverables = ["SOP_Compliance_Report_OISD117.docx"]
        model_used = "Llama-3.1-70B-Instruct"

    elif any(k in msg_lower for k in ["inspection", "approval", "review this inspection", "approval note"]):
        response = MOCK_RESPONSES["inspection"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Decomposed workflow into Vision OCR → RAG Search → Draft Note"},
            {"stage": "Route", "status": "done", "note": "Vision Engine (PaddleOCR) + General Reasoning (LLaMA-3.1)"},
            {"stage": "Act", "status": "done", "note": "OCR: Extracted 3 pages & UTM readings; RAG: 5 clauses matched"},
            {"stage": "Observe", "status": "done", "note": "Corrosion rate verified within allowable limits (16.8mm > 14.2mm)"},
            {"stage": "Deliver", "status": "done", "note": "Generated approval_note_CDU-2891.docx with audit appendix"},
        ]
        deliverables = ["Approval_Note_CDU_2891.docx", "Inspection_Assessment.xlsx"]
        model_used = "Llama-3.1-70B + Vision Multimodal"

    elif any(k in msg_lower for k in ["code", "python", "script", "calculate", "mass-balance", "mass balance"]):
        response = MOCK_RESPONSES["code"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Draft Python mass-balance script → Run in local Docker sandbox"},
            {"stage": "Route", "status": "done", "note": "Code Specialist model (Qwen2.5-Coder:7B) assigned"},
            {"stage": "Act", "status": "done", "note": "Script executed in air-gapped container: Exit Code 0, 34ms"},
            {"stage": "Observe", "status": "done", "note": "Mass balance confirmed within 0.00% tolerance (450 T/h in/out)"},
            {"stage": "Deliver", "status": "done", "note": "Generated mass_balance_cdu.py and execution log"},
        ]
        deliverables = ["mass_balance_cdu.py", "execution_log.txt"]
        model_used = "Qwen2.5-Coder:7B [On-Premise]"

    elif any(k in msg_lower for k in ["presentation", "powerpoint", "slides", "board meeting", "summarize"]):
        response = MOCK_RESPONSES["presentation"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Synthesize minutes into 5-slide executive presentation"},
            {"stage": "Route", "status": "done", "note": "General Reasoning + Document Generator tools"},
            {"stage": "Act", "status": "done", "note": "Extracted key financial (GRM $9.85/bbl), safety (0 LTIF) metrics"},
            {"stage": "Observe", "status": "done", "note": "Slide content structured and validated against MRPL template"},
            {"stage": "Deliver", "status": "done", "note": "Generated MRPL_Board_Meeting_Summary.pptx deck"},
        ]
        deliverables = ["MRPL_Board_Meeting_Summary.pptx"]
        model_used = "Llama-3.1-70B-Instruct"

    else:
        response = MOCK_RESPONSES["default"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Prompt analyzed and security boundaries verified"},
            {"stage": "Route", "status": "done", "note": "Routed to on-premise General Reasoning model"},
            {"stage": "Act", "status": "done", "note": "Queried local knowledge base and synthesized answer"},
            {"stage": "Observe", "status": "done", "note": "Checked regulatory and safety policies"},
            {"stage": "Deliver", "status": "done", "note": "Output verified and formatted for officer review"},
        ]
        deliverables = []
        model_used = "Llama-3.1-8B-Instruct"

    return {
        "response": response,
        "steps": steps,
        "deliverables": deliverables,
        "egress_calls": 0,
        "model_used": model_used,
        "latency_ms": int(actual_latency * 1000),
        "task_id": req.task_id or f"task-{int(time.time())}",
    }


# ─── MODELS ───────────────────────────────────────────────────────────────────

@app.get("/api/models")
async def list_models():
    return MODEL_POOL

@app.get("/api/models/registry")
async def model_registry():
    return {
        "registry_version": "1.0",
        "last_updated": "2026-09-09T10:00:00",
        "models": MODEL_POOL,
    }


# ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────

@app.get("/api/knowledge")
async def list_collections(user_id: Optional[str] = None):
    if user_id:
        user = USERS.get(user_id)
        if user and user["role"] != "IT Admin":
            role = user["role"]
            return [kc for kc in KNOWLEDGE_COLLECTIONS if role in kc["roles"]]
    return KNOWLEDGE_COLLECTIONS


# ─── EGRESS / SOVEREIGNTY ─────────────────────────────────────────────────────

@app.get("/api/egress/summary")
async def egress_summary():
    return {
        "total_connection_attempts": len(EGRESS_LOG),
        "external_attempts": 0,
        "internal_calls": len(EGRESS_LOG),
        "sovereign": True,
        "last_checked": datetime.now().isoformat(),
        "network_cidr": "192.168.10.0/24",
        "message": "All traffic confined to internal subnet. Zero external calls.",
    }

@app.get("/api/egress/log")
async def egress_log():
    return EGRESS_LOG

@app.get("/api/system/status")
async def system_status():
    return SYSTEM_STATUS


# ─── AUDIT TRAIL ──────────────────────────────────────────────────────────────

@app.get("/api/audit")
async def audit_log(task_id: Optional[str] = None):
    if task_id:
        return [e for e in AUDIT_LOG if e.get("task_id") == task_id]
    return AUDIT_LOG


# ─── HEALTH ───────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "MRPL Sovereign AI Workbench",
        "version": "1.0.0-prototype",
        "mode": "hardcoded-demo",
        "egress": "ZERO_EXTERNAL",
        "timestamp": datetime.now().isoformat(),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
