# Technical Requirements Document (TRD)

**Project:** Sovereign On-Premise Agentic AI Workbench (SIH26117)
**Team:** Metamorphosis
**Version:** 1.0
**Companion to:** PRD.md, DESIGN.md

---

## 1. Scope

This TRD defines the technical stack, interfaces, data contracts, and non-functional engineering requirements needed to implement the PRD. It maps directly to the architecture shown in the team's technical-approach slide: Client Layer → Gateway Layer → Orchestration Layer → Model & Tool Layer → Data Layer → Isolation Layer.

## 2. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend / Web UI | React + Tailwind (or shadcn/ui) | Chat interface + task dashboard (live status, steps, tools, deliverables). |
| API Gateway | FastAPI (Python) | Auth/RBAC, request logging, rate limiting. |
| Orchestration | LangGraph (or custom agent loop) | Plan → Route → Act → Observe → Deliver state machine. |
| Model Serving | vLLM (primary, high-throughput) + Ollama (secondary/lightweight local runtime) | Multi-model pool; hot-swappable via config. |
| Vector DB / RAG | Qdrant | Hybrid semantic + keyword search over SOPs/manuals. |
| Embeddings | BGE-M3 (multilingual, dense) | Local embedding generation, no external API calls. |
| OCR / Vision | PaddleOCR + a local vision-language model in the model pool | Scanned PDFs, handwriting, drawings, photos. |
| Sandbox Execution | Docker (per-job ephemeral container) | Network-disabled, resource-capped code execution. |
| Object Storage | Local object store (e.g., MinIO) or filesystem-backed store | Generated documents, uploaded source files. |
| Relational / Audit DB | PostgreSQL | Users, roles, task metadata, audit logs, traces. |
| Containerization | Docker / docker-compose (Kubernetes optional for scale-out) | Isolation Layer; per-service network policy. |
| Document Generation | python-docx, openpyxl, python-pptx, PDF toolchain | Structured output artifacts. |

## 3. System Interfaces

### 3.1 External Interfaces
- **None by design.** The system has no required outbound internet dependency at runtime. All model weights, embedding models, and OCR models are pre-downloaded/baked into the deployment image during setup (offline install), not fetched at runtime.

### 3.2 Internal Interfaces

| Interface | Protocol | Description |
|---|---|---|
| Web UI ↔ API Gateway | HTTPS (internal TLS) + WebSocket | Chat requests, streamed task status/step updates. |
| API Gateway ↔ Orchestrator | Internal REST/gRPC | Authenticated task submission, plan/step callbacks. |
| Orchestrator ↔ Model Pool | Internal REST (OpenAI-compatible schema recommended for vLLM) | Model inference calls, per sub-task. |
| Orchestrator ↔ Tool Layer | Internal REST / function-call schema | Sandbox executor, doc generator, OCR/vision, RAG retriever. |
| Orchestrator ↔ Data Layer | SQL (Postgres), Vector API (Qdrant), Object Store API | Persistence of tasks, embeddings, documents, audit logs. |
| Isolation Layer | Docker network policies, firewall rules | Enforces no-default-route + egress monitoring across all layers. |

## 4. Core Data Model (high level)

```
User (id, name, role, department)
Role (id, name, permissions[])
Task (id, user_id, prompt, status, created_at, plan[])
PlanStep (id, task_id, step_no, type[route|act|observe], model_used, tool_used, input, output, timestamp)
Document (id, task_id, type[docx|xlsx|pptx|pdf|code], storage_path, version, created_at)
KnowledgeSource (id, name, collection, access_roles[], ingested_at)
Embedding (id, knowledge_source_id, vector, chunk_text, metadata)
AuditLogEntry (id, task_id, actor, action, resource, timestamp, hash)
EgressLogEntry (id, timestamp, source_service, destination, allowed[bool])
```

## 5. Agent Execution Loop (technical contract)

The orchestrator implements a 5-stage loop per task, matching the deck's flow:

1. **Receive & Decompose** — parse user request (+ any uploaded files) into an ordered list of sub-tasks.
2. **Route** — a **Task Classifier / Model Router** assigns each sub-task to the best-fit model in the pool (e.g., `general-reasoning`, `code`, `vision`) based on task-type heuristics (rule-based first pass; classifier model as fallback/refinement).
3. **Act** — execute the sub-task: call the selected model, and/or invoke a tool (sandbox executor, OCR/vision, RAG retriever, document generator).
4. **Observe** — validate output (schema checks, sandbox exit codes, confidence thresholds on OCR/vision); decide whether to retry, re-plan, or proceed.
5. **Deliver** — once all sub-tasks are observed as complete, compile final artifact(s) and return to the user with an audit-linked summary.

Loop repeats steps 2–4 until the task is marked complete or a max-iteration/timeout guard is hit (to avoid runaway agent loops).

## 6. Model Routing Logic (MVP)

- **Router type:** Hybrid — deterministic rules (file type, requested action keywords: "code", "summarize", "extract", "calculate") + a lightweight local classifier model for ambiguous cases.
- **Model pool config (example):**
  - `general` — a mid-sized instruction-tuned open-weight model for reasoning, summarization, drafting.
  - `code` — a code-specialized open-weight model for generation/debugging.
  - `vision` — a multimodal open-weight model for OCR-assisted document/image understanding.
- **Extensibility contract:** each model is registered in a `model_registry.yaml` with fields `{name, endpoint, modality[], task_tags[], context_window, quantization}`. Adding a model requires only a new registry entry + restart of the routing service — no code change.

## 7. Tool Layer Contracts

| Tool | Input | Output | Isolation |
|---|---|---|---|
| Sandbox Executor | code (str), language, optional input files | stdout/stderr, exit code, produced files | Ephemeral Docker container, `--network none`, CPU/mem/time limits |
| Doc Generator | structured content (JSON/markdown) + target format | .docx/.xlsx/.pptx/.pdf file | Runs in-process or in a sibling container; writes only to object store |
| OCR / Vision | image/PDF bytes | extracted text, tables, bounding boxes, confidence scores | Local model inference only |
| RAG Retriever | query text, collection scope (per RBAC) | ranked chunks + source citations | Vector search restricted to caller's permitted collections |

## 8. Security & Isolation Requirements

- **No default route:** All containers/services deploy with no default outbound gateway; only explicit internal service-to-service rules are allowed via firewall/Docker network policy.
- **Egress monitoring:** A lightweight network monitor (e.g., eBPF-based or iptables logging) records all connection attempts; any attempt to reach outside the defined internal CIDR is logged and, in the demo, visibly flagged (expected: zero such attempts).
- **RBAC:** Enforced at the API Gateway and at the RAG retriever (collection-level ACLs) and Document Generator (department-level write scopes).
- **Audit immutability:** Audit log entries are append-only (e.g., hash-chained or write-once table) so they cannot be silently altered.
- **Secrets/config:** No API keys for external LLM providers are present anywhere in the system by design.
- **Data at rest:** Object store and Postgres volumes encrypted (LUKS/disk-level or app-level encryption) — required for production; optional stretch for hackathon demo.

## 9. Performance & Resource Requirements

| Component | Minimum (demo) | Target (pilot deployment) |
|---|---|---|
| GPU | 1x mid-range GPU (e.g., 16–24GB VRAM), quantized models | 1–2x higher-VRAM GPUs or GPU cluster for 120B-class models |
| Concurrent users | 1–3 (demo) | 10–50 (department pilot) |
| Model pool size | 2–3 models loaded (quantized/swap as needed) | Configurable pool, model-serving auto-scaling via vLLM |
| End-to-end demo task latency | Acceptable for live demo (a few minutes for multi-page multimodal task) | SLA-defined per deployment |

## 10. Deployment Requirements

- Packaged via `docker-compose.yml` covering: web-ui, api-gateway, orchestrator, model-serving (vLLM/Ollama), qdrant, postgres, object-store, sandbox-runner, egress-monitor.
- Single-command bring-up for demo (`docker compose up`), with a setup script to pre-load model weights and seed sample SOP/manual documents into the RAG store.
- No Kubernetes requirement for MVP; architecture should not preclude a later Helm chart for multi-node scale-out.

## 11. Testing Requirements

- **Unit tests:** router logic, tool contracts, document generation formatting.
- **Integration tests:** full agent loop against sample multimodal task (scanned PDF → docx).
- **Security tests:** attempt outbound calls from every container; verify all are blocked and logged.
- **Load/resource tests:** concurrent task submission on target GPU to validate demo-scale performance.
