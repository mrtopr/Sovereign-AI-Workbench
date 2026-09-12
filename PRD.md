# Product Requirements Document (PRD)

**Project:** Sovereign On-Premise Agentic AI Workbench using Open-Weight Multimodal LLMs for Confidential Industrial Work
**Problem Statement ID:** SIH26117
**Team:** Metamorphosis
**Organization:** Mangalore Refinery and Petrochemicals Limited (MRPL)
**Theme:** Smart Automation | **Category:** Software
**Version:** 1.0

---

## 1. Purpose

Employees at refineries, PSUs, and defence-linked manufacturing units routinely handle confidential material — P&IDs, financials, vendor negotiations, unreleased designs, inspection reports — that cannot legally or contractually be sent to cloud AI tools like Claude or ChatGPT. As a result, staff either do this work manually (slow, error-prone) or leak confidential data into public tools (a compliance risk).

This product is a **self-hosted, air-gapped, agentic AI workbench** that gives industrial users a Claude/Codex-like assistant experience — planning, tool use, multimodal understanding, document generation — running entirely on the organization's own GPU server, with zero external network calls.

## 2. Goals and Non-Goals

### 2.1 Goals
- Provide a single on-prem workbench that plans and executes multi-step tasks end-to-end (not single-shot chat).
- Support **multiple open-weight LLMs simultaneously**, auto-selecting the best model per sub-task (reasoning vs. coding vs. vision).
- Handle **multimodal input**: scanned PDFs, handwritten notes, engineering drawings, photographs, via on-device OCR/vision.
- Ground all answers in the organization's own SOPs, manuals, and correspondence via a local RAG pipeline — no external retrieval.
- Produce **real deliverables**: Word/Excel/PPT files, working code (executed in a sandbox), calculations with shown steps — not just chat text.
- Guarantee and **prove** sovereignty: no packet leaves the organization's network, demonstrated via audit logs and a live network monitor.
- Be usable by **non-technical staff** (inspectors, engineers, PSU admin staff), not just developers.

### 2.2 Non-Goals (for hackathon/MVP scope)
- Not building new foundation models — only orchestrating existing open-weight models (e.g., in the Llama/Qwen/DeepSeek family, sized to available hardware).
- Not targeting full production-grade HA/multi-datacenter deployment — MVP targets a single workstation/server with a mid-range GPU.
- Not handling classified/defence-grade cryptographic accreditation (CC/FIPS certification) in this phase — architecture should not preclude it later.
- Not replacing enterprise SSO/IAM — RBAC in MVP is self-contained, with hooks for future LDAP/AD integration.

## 3. Background & Problem Statement (from SIH26117)

> Refineries, PSUs, defence-linked manufacturing units and government offices generate a lot of routine but sensitive knowledge work... None of this can go through cloud AI assistants... Company policy keeps this data on premises, so people either do the work manually resulting in productivity loss, or they quietly paste confidential material into public tools anyway.

Key requirements called out by the problem statement:
1. 100% on-premise, air-gapped — no data leaves the organization.
2. Backend not locked to one model; multiple open-weight models supported and auto-selected per task; new models addable without redesign.
3. Agentic behavior: plan, act, use tools (file read/write, sandboxed code execution, spreadsheet work, internal document search), iterate to completion.
4. Multimodal: text, scanned PDFs, handwriting, drawings, photographs via on-device OCR/vision.
5. Real deliverables: Word/PPT/Excel files, working code, calculations with steps shown.
6. Grounded in local knowledge base (manuals, SOPs, past correspondence) via local connector — nothing external.
7. Demonstrable proof of sovereignty via logs or a visible network monitor showing zero external calls.

## 4. Target Users / Personas

| Persona | Role | Primary Need |
|---|---|---|
| **Inspector (Rina)** | Field/plant inspector | Upload scanned inspection reports (often handwritten), get a structured, SOP-grounded approval note drafted automatically. |
| **Process Engineer (Dev)** | Refinery process engineer | Run calculations with visible steps, generate Excel models, review P&ID excerpts. |
| **PSU Admin Staff (Meena)** | Non-technical office staff | Summarize board notes, draft correspondence, generate PPT decks — without touching code. |
| **IT/Security Admin (Arjun)** | Org IT/compliance officer | Configure RBAC, review audit logs, verify egress monitor shows zero external traffic, add/remove models. |
| **Developer/Internal Tools Team** | In-house software team | Use the workbench for internal tool code generation/debugging in a sandboxed environment. |

## 5. User Stories

1. *As an inspector*, I upload a scanned, partly handwritten inspection report and receive a structured approval-note draft in Word format, citing the relevant SOP clauses.
2. *As a process engineer*, I ask the assistant to compute a mass-balance calculation; it shows each computational step and generates an Excel sheet with the working.
3. *As admin staff*, I ask for a summary of a scanned board presentation into a 5-slide PPT; the assistant OCRs the images, drafts content, and produces the .pptx.
4. *As a developer*, I ask the assistant to write and debug a Python script against sample data; it plans, writes code, executes it in an isolated sandbox, and iterates until it passes.
5. *As an IT admin*, I view a live dashboard showing all outbound network attempts (there should be none) and a full audit trail of every agent action, tool call, and file produced.
6. *As an IT admin*, I add a new open-weight model to the model pool via config, without redeploying the whole system, and the router immediately becomes able to route tasks to it.
7. *As any user*, I ask a question referencing an internal SOP; the assistant retrieves the relevant passage from the local knowledge base (not the open web) and cites it in its answer.

## 6. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | System shall accept natural-language task requests via a web chat UI. | P0 |
| FR-2 | System shall decompose a task into an execution plan (Plan → Route → Act → Observe → Deliver loop). | P0 |
| FR-3 | System shall maintain a pool of ≥2 locally hosted open-weight models (e.g., one general-reasoning, one code-specialized, one vision-capable) and route each sub-task to the most appropriate model automatically. | P0 |
| FR-4 | System shall support adding a new model to the pool via configuration only (no code redeploy). | P1 |
| FR-5 | System shall perform OCR/vision extraction on uploaded scanned PDFs, images, and photographs of handwriting/drawings, entirely on-device. | P0 |
| FR-6 | System shall execute code in an isolated, network-restricted sandbox and return results/errors back into the agent loop. | P0 |
| FR-7 | System shall perform Retrieval-Augmented Generation (RAG) over an organization-controlled local knowledge base (SOPs, manuals, correspondence) with citation of source documents. | P0 |
| FR-8 | System shall generate deliverable files: .docx, .xlsx, .pptx, .pdf, and source-code files. | P0 |
| FR-9 | System shall enforce Role-Based Access Control on knowledge base collections, tools, and models. | P0 |
| FR-10 | System shall log every agent action, tool call, model call, and generated artifact to an immutable audit trail. | P0 |
| FR-11 | System shall expose a live/queryable egress-monitoring view proving zero outbound network calls beyond the local subnet. | P0 |
| FR-12 | System shall support multi-user, multi-session concurrent use on a single server. | P1 |
| FR-13 | System shall allow a human-in-the-loop review/approval step before finalizing high-stakes deliverables (e.g., approval notes). | P1 |
| FR-14 | System shall version and store all generated artifacts with links back to the originating task and audit entry. | P2 |

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Sovereignty** | Zero external network calls at any point during operation; verifiable via network monitor/logs. Fully functional in an air-gapped network. |
| **Security** | RBAC on all resources; encrypted data at rest (org data, embeddings, audit logs); container-level isolation for code execution; no default outbound route. |
| **Auditability** | Every plan step, tool call, model invocation, and output is logged with timestamp, user, and inputs/outputs (or hashes thereof for large payloads). |
| **Performance** | Demo-scale: response for a single-document agentic task (upload → approval note) completes in an operator-acceptable time on a single mid-range GPU (e.g., ≤ a few minutes for a multi-page scanned report). |
| **Reliability** | Agent loop must detect failures (tool errors, model timeouts) and retry/re-plan rather than silently failing. |
| **Usability** | UI usable by non-technical staff; no CLI required for end users. |
| **Extensibility** | New models, tools, and document connectors addable via configuration/plugin pattern. |
| **Portability** | Deployable via containers (Docker) on a single workstation/server; scalable later to a GPU cluster. |

## 8. Success Metrics (for demo/evaluation)

- Zero external network calls recorded during a full end-to-end demo (verified live).
- At least 2 distinct open-weight models used within a single agent run, correctly routed by task type.
- A multimodal task (scanned/handwritten inspection report → approval note in .docx) completed end-to-end with SOP citations.
- A coding task written, executed, and verified in the sandbox with visible pass/fail output.
- Full audit trail reconstructable for the entire demo session.
- Positive usability feedback from a non-technical persona walkthrough.

## 9. Assumptions & Constraints

- Demo hardware: single workstation/server with a mid-range GPU; smaller quantized open-weight models used if 120B-class hardware is unavailable.
- Dataset for demo: open-source/publicly available sample documents (sample scanned PDFs, sample P&IDs from open datasets) — no proprietary MRPL data required.
- No proprietary/classified data will be used in the hackathon demonstration.

## 10. Out of Scope Risks (tracked, not solved, in MVP)

- Full enterprise SSO/AD integration.
- Formal security certification (CC, FIPS, etc.).
- Massive concurrent-user scale (100s of simultaneous users).
