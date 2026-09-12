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
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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

# Simulated mock responses
MOCK_RESPONSES = {
    "inspection": """**Agentic Workflow Initiated — Inspection Report Processing**

**Stage 1 — OCR/Vision Extraction**
→ Scanning document with PaddleOCR + Vision model (llava:13b) [ON-PREMISE]
→ Extracted: 3 pages, 2 tables, 1 handwritten annotation section
→ OCR Confidence: 91%

**Stage 2 — RAG Knowledge Search**
→ Querying local Qdrant vector database (inspection-sops, safety-manuals collections)
→ Retrieved 5 relevant SOP clauses:
  • OISD-117 §4.3 — Inspection frequency for pressure vessels
  • IS 2825:1969 §6.1 — Acceptance criteria for weld quality
  • MRPL SOP-QI-22 §2.4 — CDU inspection sign-off procedure

**Stage 3 — AI Reasoning & Drafting**
→ Model: llama3.1:8b-instruct [ON-PREMISE GPU]
→ Analyzing findings against retrieved SOP clauses
→ Drafting structured approval note with citations

**Stage 4 — Document Generation**
→ Generating approval_note_CDU-2891.docx
→ Appending audit trail: sources, models, timestamps

✅ **Approval Note Ready** — Requires human review before finalization.
*0 external calls made. All processing on MRPL GPU server.*""",

    "code": """**Code Specialist Model Assigned (qwen2.5-coder:7b)**

```python
# Mass Balance Calculation — Generated by MRPL AI Workbench
def calculate_mass_balance(feed_rate, product_yields, losses):
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
```

**Sandbox Execution (--network none):**
```
✅ Exit Code: 0
Output: {'feed_rate_kg_h': 5000, 'efficiency_pct': 96.4}
```

Deliverables: mass_balance.py + execution_log.txt ready for download.
*0 external calls. Sandbox: network-disabled Docker container.*""",

    "default": """**Processing on MRPL Sovereign AI Workbench**

Request routed to General Reasoning model (llama3.1:8b) running on local GPU.

Based on your role permissions, accessing:
- Authorized knowledge collections (local Qdrant vector DB)
- Available tools (RAG retriever, document generator)

Searching internal knowledge base for relevant SOPs and manuals...
*All processing on-premise. Egress monitor: 0 external calls.*""",
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
    """Simulate agentic workflow with hardcoded responses."""
    await asyncio.sleep(1.5)  # Simulate model inference latency

    msg_lower = req.message.lower()
    if any(k in msg_lower for k in ["inspection", "report", "approval", "sop", "oisd"]):
        response = MOCK_RESPONSES["inspection"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Decomposed into OCR → RAG → Draft → DocGen"},
            {"stage": "Route", "status": "done", "note": "Vision (OCR) + General (reasoning) models selected"},
            {"stage": "Act", "status": "done", "note": "OCR: 3 pages extracted. RAG: 5 SOP clauses retrieved."},
            {"stage": "Observe", "status": "done", "note": "Confidence 91%. Schema validated."},
            {"stage": "Deliver", "status": "done", "note": "approval_note.docx generated with audit appendix."},
        ]
        deliverables = ["approval_note.docx"]
    elif any(k in msg_lower for k in ["code", "python", "script", "calculate", "debug"]):
        response = MOCK_RESPONSES["code"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Write code → sandbox execute → verify"},
            {"stage": "Route", "status": "done", "note": "Code Specialist model (qwen2.5-coder:7b) assigned"},
            {"stage": "Act", "status": "done", "note": "Code generated. Sandbox execution: exit code 0."},
            {"stage": "Observe", "status": "done", "note": "Output verified against expected values."},
            {"stage": "Deliver", "status": "done", "note": "mass_balance.py + execution_log.txt generated."},
        ]
        deliverables = ["mass_balance.py", "execution_log.txt"]
    else:
        response = MOCK_RESPONSES["default"]
        steps = [
            {"stage": "Plan", "status": "done", "note": "Request analyzed"},
            {"stage": "Route", "status": "done", "note": "General model assigned"},
            {"stage": "Act", "status": "done", "note": "RAG search + model inference complete"},
            {"stage": "Observe", "status": "done", "note": "Output validated"},
            {"stage": "Deliver", "status": "done", "note": "Response compiled"},
        ]
        deliverables = []

    return {
        "response": response,
        "steps": steps,
        "deliverables": deliverables,
        "egress_calls": 0,
        "model_used": "llama3.1:8b-instruct",
        "latency_ms": 1500,
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
