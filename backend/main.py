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
    "test123@gmail.com": {
        "id": "u5", "name": "System Admin", "nameHindi": "सिस्टम एडमिन",
        "username": "test123@gmail.com", "password": "password123",
        "role": "IT Admin", "department": "IT & Cybersecurity",
        "employeeId": "MRPL/ADMIN/0001", "avatar": "SA",
        "permissions": {
            "collections": ["*"],
            "tools": ["egress-monitor", "audit-viewer", "model-registry", "rag", "ocr", "docgen", "sandbox"],
            "models": ["general", "code", "vision"],
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
        "id": "task-001",
        "title": "CDU-2891 Ultrasonic Thickness (UTM) & OISD-117 Approval",
        "status": "completed",
        "user": "Rina Sharma",
        "role": "Inspector",
        "created": "2026-09-09 10:23",
        "completed": "2026-09-09 10:26",
        "models_used": ["Vision / Multimodal", "General Reasoning"],
        "tools_used": ["OCR/Vision", "RAG Retriever", "Doc Generator"],
        "deliverables": ["approval_note_CDU-2891.docx", "corrosion_rate_analysis.pdf"],
        "egress_attempts": 0,
        "steps": [
            {"stage": "Plan", "status": "done", "note": "Decomposed into 4 sub-tasks: UTM Scan OCR, RAG search, draft note, generate .docx"},
            {"stage": "Route", "status": "done", "note": "Vision model → NDT/UTM scan OCR; General model → compliance reasoning"},
            {"stage": "Act", "status": "done", "note": "Extracted 18 nozzle scan points. RAG retrieved OISD-STD-117 §4.3 & IS 2825:1969."},
            {"stage": "Observe", "status": "done", "note": "Min thickness: 11.2mm (exceeds 9.5mm limit). Corrosion rate: 0.12 mm/yr. Valid for 36 months."},
            {"stage": "Deliver", "status": "done", "note": "Generated approval_note_CDU-2891.docx with compliance matrix appendix."},
        ],
    },
    {
        "id": "task-002",
        "title": "CDU / VDU Hydrocarbon Mass Balance & Cut Yield Simulation",
        "status": "completed",
        "user": "Dev Nair",
        "role": "Engineer",
        "created": "2026-09-09 11:45",
        "completed": "2026-09-09 11:48",
        "models_used": ["Code Specialist"],
        "tools_used": ["Sandbox Executor"],
        "deliverables": ["cdu_mass_balance.py", "yield_reconciliation_log.txt"],
        "egress_attempts": 0,
        "steps": [
            {"stage": "Plan", "status": "done", "note": "Formulate mass balance equations for Arab Extra Light blend, execute in secure sandbox"},
            {"stage": "Route", "status": "done", "note": "Code Specialist model assigned for thermodynamic calculation script"},
            {"stage": "Act", "status": "done", "note": "Script drafted & executed. Processed 15,000 MT/day throughput across 6 product streams."},
            {"stage": "Observe", "status": "done", "note": "Unaccounted loss: 0.13% (within 0.3% OISD benchmark). Recovery efficiency: 99.87%."},
            {"stage": "Deliver", "status": "done", "note": "cdu_mass_balance.py + yield_reconciliation_log.txt ready."},
        ],
    },
    {
        "id": "task-003",
        "title": "HCU High-Pressure Separator HAZOP & ESD Trip Matrix Review",
        "status": "completed",
        "user": "Dev Nair",
        "role": "Engineer",
        "created": "2026-09-09 13:10",
        "completed": "2026-09-09 13:14",
        "models_used": ["General Reasoning"],
        "tools_used": ["RAG Retriever", "Doc Generator"],
        "deliverables": ["hcu_hazop_esd_audit.pdf"],
        "egress_attempts": 0,
        "steps": [
            {"stage": "Plan", "status": "done", "note": "Audit ESD Cause & Effect logic against OISD-152 & API RP 521 blowdown safety"},
            {"stage": "Route", "status": "done", "note": "General model assigned for safety integrity level (SIL) reasoning"},
            {"stage": "Act", "status": "done", "note": "Cross-referenced 24 trip interlocks with Hydrocracker SOP-HCU-09."},
            {"stage": "Observe", "status": "done", "note": "Zero bypasses detected. 2oo3 voting logic verified for PSHH-4012 (158 kg/cm²g)."},
            {"stage": "Deliver", "status": "done", "note": "Delivered certified compliance sign-off document."},
        ],
    },
    {
        "id": "task-004",
        "title": "Q2 Operational Review & Gross Refining Margin (GRM) Board Deck",
        "status": "in-progress",
        "user": "Meena Kulkarni",
        "role": "Admin Staff",
        "created": "2026-09-09 14:02",
        "completed": None,
        "models_used": ["Vision / Multimodal", "General Reasoning"],
        "tools_used": ["OCR/Vision", "Doc Generator"],
        "deliverables": [],
        "egress_attempts": 0,
        "steps": [
            {"stage": "Plan", "status": "done", "note": "Extract crude intake charts, calculate GRM ($10.42/bbl), generate 6-slide executive PPT"},
            {"stage": "Route", "status": "done", "note": "Vision model → chart OCR; General model → GRM narrative synthesis"},
            {"stage": "Act", "status": "active", "note": "Processing crude throughput and product slate breakdown... (Slide 4/6)"},
            {"stage": "Observe", "status": "pending", "note": "Validating distillate crack spreads against Platts benchmark"},
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

    "hazop": """### 🛡️ Hydrocracker Unit (HCU) — Emergency Shutdown (ESD) & HAZOP Protocol

**Knowledge Base:** `safety-manuals` · `engineering-sops` (Local Qdrant DB)  
**Refinery Section:** Unit-41 (High-Pressure Hydrocracker & Fractionation)  
**Standard:** OISD-GDN-169 & MRPL Emergency Operating Procedure (EOP-HCU-04)

---

#### 🚨 ESD Interlock Matrix & Action Sequence

| Trip Tag | Initiating Condition | Setpoint Threshold | Automated System Action | Operator Verification Requirement |
|:---|:---|:---:|:---|:---|
| **ESD-4101** | Reactor High Differential Pressure $(\\Delta P)$ | `> 4.5 bar` | Automated depressurization to High Pressure Flare | Verify emergency quench valve `XV-4102` open |
| **ESD-4102** | Recycle Gas Compressor Surge | `> 98% RPM` | Trip turbine driver; open anti-surge bypass | Check spillback control valve `FCV-4188` 100% open |
| **ESD-4103** | Furnace Tube Skin Temperature | `> 625 °C` | Main fuel gas isolation via double block & bleed | Confirm steam purge initiation into radiant box |
| **ESD-4104** | High-Pressure Separator Level Low | `< 15%` | Close heavy gas oil bottom outlet valve | Prevent high-pressure gas blowby to low-pressure stripper |

---

#### 📋 Post-Trip Protocol & Recovery Procedures
1. **Quench Gas Injection**: Ensure cold hydrogen quench valves (`Q-1` through `Q-4`) stabilize bed temperatures below **380 °C**.
2. **Flare Header Monitoring**: Verify zero liquid carryover into the flare knockout drum (`TK-802`).
3. **Log & Audit Entry**: Event time-stamped and recorded in the immutable sovereign safety ledger (SHA-256 block committed).

---

> 📦 **Generated Deliverable:** `HCU_Emergency_Shutdown_SOP.docx` formatted for control room operations.""",

    "desalter": """### 🛢️ Crude Desalter & Tank Farm Quality Assessment

**Unit:** Desalter D-101A / Tank Farm TK-401A  
**Crude Feed:** Arab Heavy & Kuwait Export Crude Blend (API Gravity: **27.8°**, Sulfur: **2.65 wt%**)  
**Analytical Standard:** ASTM D3230 (Salt Content) & ASTM D4007 (BS&W)

---

#### 📊 Analytical Quality Metrics & Performance

| Parameter | Laboratory Reading | MRPL Target Spec | Unit | Operational Assessment |
|:---|:---:|:---:|:---:|:---:|
| **Salt Content (Inlet Feed)** | `28.4` | `—` | PTB (lb/1000 bbl) | Raw crude baseline from jetty |
| **Salt Content (Desalted Outlet)** | `2.1` | `< 3.0` | PTB | ✅ 92.6% Desalting Efficiency |
| **Basic Sediment & Water (BS&W)** | `0.18%` | `< 0.25%` | vol % | ✅ Within allowable limits |
| **Wash Water Ratio** | `5.8%` | `5.0 – 6.5%` | vol % on crude | ✅ Optimum wash dispersion |
| **Demulsifier Injection Rate** | `14.2` | `12.0 – 16.0` | ppm | ✅ Emulsion breaking stable |
| **Desalter Grid Voltage** | `22.5` | `20.0 – 24.0` | kV AC (Electrostatic) | ✅ Electrostatic grid active |

---

#### 💡 Process Engineering Recommendations
- **Corrosion Mitigation**: Low effluent salt ensures crude furnace tube fouling rate remains under **0.02 mm/year**.
- **Effluent Brine Treatment**: Oil-in-water carryover in desalter brine measured at **42 ppm** (compliant with ETP inlet criteria < 60 ppm).

---

> 📦 **Generated Deliverable:** `Desalter_Salinity_Quality_Report.xlsx` compiled for Refinery Technical Services.""",

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

    "default": """### 💡 Sovereign AI Analysis & Refinery Operations Guidance

**Model:** `llama3.1:70b-instruct` (Running on Local GPU Cluster)  
**Security:** Zero external data transmission · 100% On-Premise Execution

---

#### 📌 Technical Assessment & Recommendations
Your inquiry has been processed against authorized MRPL operational datasets, engineering manuals, and refinery reference archives:

1. **Standard & Code Alignment**:
   - Operations align with **OISD-117 / OISD-118** (Pressure Vessels & Piping) and **API 510 / API 570** codes.
   - Refinery process parameters adhere to **MRPL SOP-QI-22** and environmental emission thresholds.

2. **Actionable Engineering Next Steps**:
   - Cross-verify equipment tags (`CDU-II`, `VDU`, `HCU-41`, `CCR-20`, `SRV-042`).
   - For mass-balance discrepancies or thickness deviations exceeding corrosion allowances, initiate formal Technical Query (TQ) with the Process Engineering team.

3. **Immutable Compliance Record**:
   - All query logs and tensor operations are committed to the tamper-proof local SHA-256 audit ledger.

---

> 🛡️ **Air-Gapped Guarantee:** Confined strictly to the internal refinery network (`192.168.10.0/24`). Zero egress calls."""
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
    # Authentic on-premise GPU model inference + RAG + verification latency (12s)
    actual_latency = random.uniform(11.8, 12.4)
    await asyncio.sleep(actual_latency)

    msg_lower = req.message.lower()

    if any(k in msg_lower for k in ["clause", "pressure vessel", "oisd-117", "is 2825", "find relevant sop", "asme"]):
        response = MOCK_RESPONSES["sop_clauses"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Analyzed query: RAG knowledge search on pressure vessel SOPs"},
            {"stage": "Route", "status": "done", "note": "Dispatched to Qdrant vector DB + LLaMA-3-70B model"},
            {"stage": "Act", "status": "done", "note": "Retrieved 5 standard clauses from OISD-117 and IS 2825"},
            {"stage": "Observe", "status": "done", "note": "Validated compliance criteria against active MRPL standards"},
            {"stage": "Deliver", "status": "done", "note": "Compiled comprehensive SOP matrix and checklist"},
        ]
        deliverables = ["SOP_Compliance_Report_OISD117.docx"]
        model_used = "Llama-3.1-70B-Instruct [On-Premise]"

    elif any(k in msg_lower for k in ["inspection", "approval", "review this inspection", "approval note", "utm", "reactor"]):
        response = MOCK_RESPONSES["inspection"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Decomposed workflow into Vision OCR → RAG Search → Draft Note"},
            {"stage": "Route", "status": "done", "note": "Vision Engine (PaddleOCR) + General Reasoning (LLaMA-3.1-70B)"},
            {"stage": "Act", "status": "done", "note": "OCR: Extracted 3 pages & UTM readings; RAG: 5 clauses matched"},
            {"stage": "Observe", "status": "done", "note": "Corrosion rate verified within allowable limits (16.8mm > 14.2mm)"},
            {"stage": "Deliver", "status": "done", "note": "Generated approval_note_CDU-2891.docx with audit appendix"},
        ]
        deliverables = ["approval_note_CDU-2891.docx", "Inspection_Assessment.xlsx"]
        model_used = "Llama-3.1-70B + Vision Multimodal"

    elif any(k in msg_lower for k in ["code", "python", "script", "calculate", "mass-balance", "mass balance", "cdu", "crude assay"]):
        response = MOCK_RESPONSES["code"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Draft Python mass-balance script → Run in local Docker sandbox"},
            {"stage": "Route", "status": "done", "note": "Code Specialist model (Qwen2.5-Coder:7B) assigned"},
            {"stage": "Act", "status": "done", "note": "Script executed in air-gapped container: Exit Code 0, 34ms"},
            {"stage": "Observe", "status": "done", "note": "Mass balance confirmed within 0.00% tolerance (450 T/h in/out)"},
            {"stage": "Deliver", "status": "done", "note": "Generated mass_balance_cdu.py and execution log"},
        ]
        deliverables = ["CDU_Mass_Balance_Simulation.py", "execution_log.txt"]
        model_used = "Qwen2.5-Coder:7B [On-Premise]"

    elif any(k in msg_lower for k in ["hazop", "shutdown", "emergency", "esd", "hcu", "interlock"]):
        response = MOCK_RESPONSES["hazop"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Queried refinery Emergency Operating Procedures (EOP) repository"},
            {"stage": "Route", "status": "done", "note": "Dispatched to Process Safety & HAZOP reasoning model"},
            {"stage": "Act", "status": "done", "note": "Extracted trip matrix and automated interlock action steps"},
            {"stage": "Observe", "status": "done", "note": "Verified safety thresholds against OISD-GDN-169 standards"},
            {"stage": "Deliver", "status": "done", "note": "Generated Hydrocracker emergency shutdown protocol document"},
        ]
        deliverables = ["HCU_Emergency_Shutdown_SOP.docx"]
        model_used = "Llama-3.1-70B-Instruct [On-Premise]"

    elif any(k in msg_lower for k in ["desalter", "salt", "ptb", "bs&w", "tank", "tk-401"]):
        response = MOCK_RESPONSES["desalter"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Retrieved laboratory assay readings for Tank Farm TK-401A"},
            {"stage": "Route", "status": "done", "note": "Routed to Refinery Quality Control & ASTM analytical model"},
            {"stage": "Act", "status": "done", "note": "Computed desalting efficiency (92.6%) and chemical dosing curve"},
            {"stage": "Observe", "status": "done", "note": "Checked BS&W (0.18%) and effluent brine compliance"},
            {"stage": "Deliver", "status": "done", "note": "Generated technical desalter assessment report"},
        ]
        deliverables = ["Desalter_Salinity_Quality_Report.xlsx"]
        model_used = "Llama-3.1-70B-Instruct [On-Premise]"

    elif any(k in msg_lower for k in ["presentation", "powerpoint", "slides", "board meeting", "summarize", "grm"]):
        response = MOCK_RESPONSES["presentation"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Synthesize minutes into 5-slide executive presentation"},
            {"stage": "Route", "status": "done", "note": "General Reasoning + Document Generator tools"},
            {"stage": "Act", "status": "done", "note": "Extracted key financial (GRM $9.85/bbl), safety (0 LTIF) metrics"},
            {"stage": "Observe", "status": "done", "note": "Slide content structured and validated against MRPL template"},
            {"stage": "Deliver", "status": "done", "note": "Generated MRPL_Executive_Performance_Brief.pptx deck"},
        ]
        deliverables = ["MRPL_Executive_Performance_Brief.pptx"]
        model_used = "Llama-3.1-70B-Instruct [On-Premise]"

    else:
        response = MOCK_RESPONSES["default"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Prompt analyzed and security boundaries verified"},
            {"stage": "Route", "status": "done", "note": "Routed to on-premise General Reasoning model"},
            {"stage": "Act", "status": "done", "note": "Queried local knowledge base and synthesized refinery operational answer"},
            {"stage": "Observe", "status": "done", "note": "Checked regulatory and safety policies (OISD / API)"},
            {"stage": "Deliver", "status": "done", "note": "Output verified and formatted for refinery officer review"},
        ]
        deliverables = []
        model_used = "Llama-3.1-70B-Instruct [On-Premise]"

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
