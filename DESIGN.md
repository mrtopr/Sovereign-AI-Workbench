# System Design Document

**Project:** Sovereign On-Premise Agentic AI Workbench (SIH26117)
**Team:** Metamorphosis
**Version:** 1.0
**Companion to:** PRD.md, TRD.md

---

## 1. Design Goals

- Translate the deck's layered architecture (Client → Gateway → Orchestration → Model & Tool → Data → Isolation) into concrete services, contracts, and flows.
- Keep every layer independently swappable (models, tools, storage) to satisfy the "no vendor/model lock-in" requirement.
- Make sovereignty **provable**, not just asserted — the design must produce visible evidence (logs, dashboard) of zero egress.

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ CLIENT LAYER                                                     │
│  Web UI (Chat + Task Dashboard: live status, steps, deliverables)│
└───────────────────────────────┬───────────────────────────────┘
                                │ HTTPS / WebSocket (internal)
┌───────────────────────────────▼───────────────────────────────┐
│ GATEWAY LAYER                                                 │
│  Auth / RBAC   |   Request Logging & Rate Limiting            │
└───────────────────────────────┬───────────────────────────────┘
┌───────────────────────────────▼───────────────────────────────┐
│ ORCHESTRATION LAYER                                           │
│  Agent Orchestrator (Plan → Route → Act → Observe → Deliver)  │
│  Task Classifier / Model Router                               │
└──────────┬───────────────────────────────────────┬────────────┘
           │                                        │
┌──────────▼────────────────┐          ┌────────────▼────────────┐
│ MODEL POOL (vLLM / Ollama) │          │ TOOL LAYER               │
│  General | Code | Vision   │          │  Sandbox Executor        │
│  Model     Model   Model   │          │  Doc Generator            │
│                             │          │  OCR / Vision             │
│                             │          │  RAG Retriever            │
└──────────┬────────────────┘          └────────────┬────────────┘
           │                                          │
┌──────────▼──────────────────────────────────────────▼───────────┐
│ DATA LAYER                                                         │
│  Vector DB (Qdrant, embeddings)  |  Object Store (documents)       │
│  Audit DB (Postgres: logs & traces)                                │
└──────────────────────────────────┬───────────────────────────────┘
┌──────────────────────────────────▼───────────────────────────────┐
│ ISOLATION LAYER                                                     │
│  No Default Route (air-gapped)  |  Egress Monitoring & Firewall     │
│  Container Isolation                                                │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Component Design

### 3.1 Web UI (Client Layer)
- Single-page app; chat pane + a **Task Dashboard** panel showing the live agent trace: current plan step, model/tool in use, intermediate outputs, and a running "0 external calls" counter sourced from the egress monitor.
- File upload widget for scanned PDFs/images.
- Deliverable panel: download links for generated .docx/.xlsx/.pptx/.pdf/code artifacts, each linked to its audit trail entry.

### 3.2 API Gateway
- FastAPI service; single entry point for all client traffic.
- Responsibilities: authentication, RBAC enforcement (role → allowed collections/tools/models), request/response logging, rate limiting per user.
- Issues a `task_id` per user request and hands off to the Orchestrator asynchronously; streams status back over WebSocket.

### 3.3 Agent Orchestrator
- Implements the 5-stage loop (see TRD §5) as a state machine (LangGraph graph or equivalent custom implementation).
- State persisted per task in Postgres so a task can be inspected/resumed and so every transition is auditable.
- On each **Route** stage, calls the **Task Classifier / Model Router** to pick the model for that sub-task.
- On each **Act** stage, dispatches to either a model-pool endpoint or a tool-layer endpoint, based on sub-task type.
- On each **Observe** stage, applies validators (schema/format checks for structured output, exit-code checks for sandbox, confidence thresholds for OCR) and decides: proceed / retry / re-plan / fail-with-explanation.
- Enforces a max-iteration guard to prevent infinite agent loops.

### 3.4 Task Classifier / Model Router
- First pass: deterministic rules keyed on input modality (image/PDF → vision path), requested verb ("write code", "debug" → code model; "summarize", "draft", "explain" → general model).
- Fallback: a lightweight local classifier (can be a small open-weight model or a simple prompt-based router call to the general model) for ambiguous requests.
- Reads `model_registry.yaml` at startup (and on hot-reload) to know which models exist and what task tags they support — this is the extensibility hook (FR-4).

### 3.5 Model Pool
- Served via **vLLM** for the primary high-throughput models and/or **Ollama** for lighter local runtimes, depending on hardware and model size.
- Each model exposed behind a uniform internal OpenAI-compatible endpoint so the Orchestrator doesn't need model-specific client code.
- Quantized model variants used when full-precision weights don't fit target GPU (per PRD assumption on hardware).

### 3.6 Tool Layer
- **Sandbox Executor:** spins up an ephemeral, network-disabled Docker container per code-execution request; captures stdout/stderr/exit code/produced files; tears down container after execution or timeout.
- **Doc Generator:** takes structured content from the Orchestrator and renders it into .docx (python-docx), .xlsx (openpyxl), .pptx (python-pptx), or .pdf, following organization-style templates where configured.
- **OCR / Vision:** PaddleOCR for text/table extraction from scans; the vision model in the Model Pool handles higher-level understanding of drawings/photos (e.g., "what does this P&ID symbol represent").
- **RAG Retriever:** hybrid semantic (Qdrant + BGE-M3 embeddings) + keyword search, scoped to the collections the requesting user's role can access.

### 3.7 Data Layer
- **Qdrant** stores embeddings for ingested SOPs/manuals/correspondence, each vector tagged with `collection` and `access_roles` for RBAC filtering at query time.
- **Object Store** holds raw uploaded files and generated deliverables, versioned, path-linked from Postgres records.
- **Postgres (Audit DB)** stores users/roles, task/plan-step records, and the append-only audit log + egress log.

### 3.8 Isolation Layer
- All services deployed in a private Docker network with **no default route to the internet**.
- Explicit allow-list of internal service-to-service connections only (e.g., orchestrator → vLLM, orchestrator → Qdrant); everything else denied by default.
- **Egress Monitor**: a sidecar/daemon (iptables logging or eBPF) that records every connection attempt across all containers into `EgressLogEntry`; surfaced live in the Web UI dashboard as the "proof of sovereignty" view called out in the problem statement.
- Sandbox Executor containers get an additional, stricter policy (`--network none`) since they run less-trusted, dynamically generated code.

## 4. Key Flows

### 4.1 Flagship Demo Flow — Inspection Report → Approval Note
1. **Upload:** Inspector uploads a scanned inspection report (PDF/image) via Web UI.
2. **Vision:** OCR/vision tool extracts text, tables, and figures; low-confidence regions flagged for human review.
3. **RAG Search:** Orchestrator queries the RAG Retriever against the SOP/manual collection for rules relevant to the extracted findings.
4. **Reasoning:** General-purpose model analyzes findings against retrieved SOP clauses, drafts structured content (with citations).
5. **Approval Note:** Doc Generator renders the structured content into a .docx approval note, including an audit-trail appendix (sources cited, models used, timestamps).
6. Human-in-the-loop: reviewer approves/edits before the note is finalized (FR-13).

### 4.2 Coding Task Flow
1. User describes a script/tool need.
2. Router assigns to the code model.
3. Code model drafts code; Sandbox Executor runs it against any provided sample data.
4. Observe stage checks exit code/output; on failure, Orchestrator re-prompts the code model with the error (iterate-to-fix loop) up to a retry limit.
5. Final working code + execution log returned as deliverable.

### 4.3 Multimodal Summarization Flow (e.g., board deck → PPT summary)
1. Scanned slides uploaded.
2. Vision/OCR extracts text and layout per slide.
3. General model summarizes/restructures content.
4. Doc Generator produces a new .pptx.

## 5. RBAC Model (design detail)

| Role | Knowledge Collections | Tools | Models |
|---|---|---|---|
| Inspector | Inspection SOPs, Safety Manuals | OCR/Vision, RAG, Doc Generator | general, vision |
| Engineer | Engineering SOPs, Design Manuals | RAG, Doc Generator, Sandbox Executor | general, code, vision |
| Admin Staff | Correspondence, Admin SOPs | RAG, Doc Generator | general |
| IT/Security Admin | All (read for audit) | Egress Monitor, Audit Viewer, Model Registry | n/a (config-only) |

Each role's permissions are enforced both at the API Gateway (coarse: which endpoints callable) and at the RAG Retriever / Doc Generator (fine: which collections/templates accessible).

## 6. Auditability & Proof-of-Sovereignty Design

- Every **PlanStep** row records: task, step number, stage (route/act/observe), model or tool used, input reference (hash/pointer, not always full payload, for large files), output reference, timestamp.
- Every **EgressLogEntry** records: timestamp, source service/container, attempted destination, allowed (true/false). In correct operation, all destination attempts are internal-subnet only.
- Web UI dashboard renders a live "Sovereignty Panel": running count of external-call attempts (target: always 0), and a link to the full audit trail for the current task — this directly satisfies the problem statement's "Key Proof of Sovereignty" requirement.

## 7. Extensibility Design

- **New model:** add entry to `model_registry.yaml` (`name`, `endpoint`, `modality`, `task_tags`, `context_window`) → router picks it up on reload. No orchestrator code change required.
- **New tool:** implement the tool's REST contract (input/output JSON schema) and register it in `tool_registry.yaml`; Orchestrator's Act stage dispatches by tool name.
- **New knowledge source:** run the ingestion pipeline (chunk → embed via BGE-M3 → upsert to Qdrant with `collection` + `access_roles` metadata); no schema change needed.

## 8. Failure Handling & Resilience

- Model timeout → Orchestrator retries once on the same model, then falls back to an alternate model with overlapping task tags (if configured), else surfaces a clear error to the user with the partial trace.
- Sandbox non-zero exit → error fed back into the code model prompt for a bounded number of self-correction iterations.
- OCR low-confidence region → flagged in the output and surfaced to the human reviewer rather than silently guessed.
- Max-iteration guard on the agent loop to prevent runaway execution/cost.

## 9. UI/UX Notes

- Task Dashboard should visualize the 5-stage loop (Plan/Route/Act/Observe/Deliver) as a step tracker, consistent with the deck's iconography, so non-technical users can see *what the AI is doing* at each moment — this builds trust, directly supporting the "Trust & Compliance" and "Adoption" goals in the PRD.
- Deliverables are always downloadable in native office formats (not just rendered in-chat), since the problem statement explicitly requires real Word/PPT/Excel outputs.
