# Implementation Plan

**Project:** Sovereign On-Premise Agentic AI Workbench (SIH26117)
**Team:** Metamorphosis
**Version:** 1.0

---

## 1. Guiding Principle

Build **bottom-up on the Isolation and Data layers first** (so sovereignty is provable from day one), then the Model Pool and Tool Layer, then the Orchestrator, then the UI — finishing with the flagship end-to-end demo flow. This order de-risks the hardest/most novel parts (multi-model routing, agent loop, sovereignty proof) early, leaving UI polish for the end.

## 2. Phased Plan

### Phase 0 — Setup (Day 0–1)
- [ ] Provision target workstation/server with GPU; confirm VRAM budget, pick quantized model sizes accordingly.
- [ ] Stand up `docker-compose.yml` skeleton: postgres, qdrant, object-store, empty service stubs for gateway/orchestrator/model-serving.
- [ ] Define and commit `model_registry.yaml` and `tool_registry.yaml` schemas.
- [ ] Set up private Docker network with **no default outbound route**; confirm via a manual `curl` test from inside a container that internet access fails.

**Exit criteria:** `docker compose up` boots all stub services; a container inside the network cannot reach the public internet.

### Phase 1 — Isolation & Audit Foundation (Day 1–3)
- [ ] Implement Postgres schema: users, roles, tasks, plan_steps, documents, audit_log, egress_log.
- [ ] Implement Egress Monitor (iptables logging or eBPF-based) writing to `egress_log`.
- [ ] Build a minimal "Sovereignty Panel" endpoint (`GET /egress/summary`) returning live counts.
- [ ] Implement audit-log write path (append-only) with a helper used by all other services.

**Exit criteria:** Any outbound attempt from any container is captured and queryable within seconds; audit log entries are immutable/append-only.

### Phase 2 — Model Pool (Day 3–6)
- [ ] Deploy vLLM with a general-purpose open-weight model (quantized to fit target GPU).
- [ ] Deploy Ollama (or second vLLM instance) with a code-specialized model.
- [ ] Deploy/wire a vision-capable open-weight model for multimodal understanding.
- [ ] Normalize all three behind an internal OpenAI-compatible API surface.
- [ ] Populate `model_registry.yaml` with real endpoints/task tags; write a loader that hot-reloads on change.

**Exit criteria:** Can independently call each of the 3 models via a uniform internal API; adding a 4th dummy model via config alone is demonstrated.

### Phase 3 — Tool Layer (Day 5–9, parallel with Phase 2 tail)
- [ ] **Sandbox Executor:** ephemeral Docker-in-Docker (or gVisor/firecracker if time allows) runner, `--network none`, resource/time limits, structured JSON result contract.
- [ ] **OCR/Vision tool:** integrate PaddleOCR for text/table extraction; wire confidence scoring.
- [ ] **Doc Generator:** implement .docx, .xlsx, .pptx generation from a structured content schema (start with .docx for the flagship demo, then extend).
- [ ] **RAG pipeline:** ingestion script (chunk → BGE-M3 embed → Qdrant upsert with collection/access_roles metadata); retriever endpoint with RBAC filtering.
- [ ] Seed Qdrant with sample open-source/public SOP-like documents and sample scanned P&IDs (per PRD dataset assumption — no proprietary data).

**Exit criteria:** Each tool independently callable and unit-tested against sample inputs; RAG returns cited, RBAC-scoped chunks.

### Phase 4 — Orchestrator / Agent Loop (Day 8–13)
- [ ] Implement the Plan → Route → Act → Observe → Deliver state machine (LangGraph or custom).
- [ ] Implement Task Classifier / Model Router (rule-based first, classifier fallback).
- [ ] Wire Orchestrator to Model Pool and Tool Layer via their registries.
- [ ] Implement Observe-stage validators (schema checks, sandbox exit codes, OCR confidence thresholds) and retry/re-plan logic with max-iteration guard.
- [ ] Persist every plan step + audit entry per stage transition.

**Exit criteria:** A scripted task (e.g., "summarize this SOP and draft a note") runs through the full loop end-to-end via API, producing a deliverable and a full audit trail, with zero egress recorded.

### Phase 5 — Gateway & RBAC (Day 10–13, parallel with Phase 4 tail)
- [ ] FastAPI gateway: auth (simple username/password or token-based for MVP), RBAC middleware, rate limiting.
- [ ] Wire role → collection/tool/model permission mapping (per DESIGN.md §5).
- [ ] Request logging integrated with audit trail.

**Exit criteria:** Two demo users with different roles get different retrieval/tool access, enforced and logged.

### Phase 6 — Web UI (Day 12–17)
- [ ] Chat interface with file upload.
- [ ] Task Dashboard: live plan-step tracker (Plan/Route/Act/Observe/Deliver), model/tool-in-use indicator.
- [ ] Sovereignty Panel widget (live egress count = 0).
- [ ] Deliverables panel with download links.
- [ ] Human-in-the-loop review/approve UI for high-stakes outputs (e.g., approval notes).

**Exit criteria:** A non-technical user can complete the flagship flow through the UI alone, with visible step-by-step progress.

### Phase 7 — Flagship Demo Flow Hardening (Day 16–19)
- [ ] End-to-end test: scanned inspection report (sample/public dataset) → OCR → RAG search → reasoning → .docx approval note with citations.
- [ ] End-to-end test: coding task → sandbox execution → iterate-to-fix → verified working code deliverable.
- [ ] End-to-end test: multimodal deck → OCR → summarize → generated .pptx.
- [ ] Load/latency pass on target demo GPU; trim model sizes/quantization if needed to hit acceptable demo latency.

**Exit criteria:** All three flagship flows run reliably and repeatably on demo hardware.

### Phase 8 — Security & Sovereignty Verification (Day 18–20)
- [ ] Deliberately attempt outbound calls from every service/container; confirm all blocked and logged.
- [ ] Full audit-trail reconstruction test for a complete session (every model call, tool call, and file traceable).
- [ ] RBAC boundary tests (user cannot access another role's collection/tool).
- [ ] Add a live network-traffic visualization (e.g., simple packet-count graph) to the dashboard for the judges' demo, showing zero external egress in real time.

**Exit criteria:** Judges/evaluators can watch the live network monitor during the entire demo and see zero external calls, matching the "Key Proof of Sovereignty" requirement in the problem statement.

### Phase 9 — Polish, Docs, Pitch Prep (Day 20–22)
- [ ] Finalize architecture diagram, demo script, and README/setup guide (single-command bring-up).
- [ ] Record fallback demo video in case of live-demo environment issues.
- [ ] Rehearse the 3 flagship flows against the judging rubric (feasibility, innovation, impact — per deck slides 3–5).

## 3. Team Role Allocation (suggested)

| Workstream | Owns |
|---|---|
| Infra/Isolation & Audit | Phases 0, 1, 8 |
| Model Serving/Routing | Phase 2, part of Phase 4 |
| Tool Layer (Sandbox/OCR/DocGen/RAG) | Phase 3 |
| Orchestrator/Agent Logic | Phase 4 |
| Gateway/RBAC | Phase 5 |
| Frontend | Phase 6 |
| Integration/QA/Demo | Phases 7–9 (all hands) |

## 4. Risk Tracking (linked to PRD/TRD risks)

| Risk | Mitigation | Phase |
|---|---|---|
| GPU VRAM insufficient for multiple models | Use quantized models, load/unload on demand, smaller models per registry | 2 |
| OCR accuracy on messy scans/handwriting | Confidence thresholds + human-review flag in Observe stage | 3, 4 |
| Agent loop runaway/hallucination | Max-iteration guard, schema validators, RAG-grounded citations | 4 |
| Accidental egress misconfiguration | No-default-route by design + continuous egress monitor + Phase 8 red-team test | 0, 1, 8 |
| Non-technical usability gap | Task Dashboard step visualization, human-in-the-loop approval, early UX testing with a non-dev teammate | 6 |

## 5. Definition of Done (Hackathon MVP)

- All P0 functional requirements from PRD §6 implemented and demoed.
- All three flagship flows (inspection→note, coding, multimodal summarize) working end-to-end on demo hardware.
- Live sovereignty proof (egress monitor) visible throughout demo.
- Full audit trail available for the demo session.
- Single-command deployment (`docker compose up`) reproducible from a clean environment.
