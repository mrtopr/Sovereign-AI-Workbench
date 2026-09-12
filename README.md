<div align="center">

# 🛡️ Sovereign AI Workbench

### On-Premise Agentic AI for Confidential Industrial Work

**SIH Problem Statement ID: SIH26117**
**Team: Metamorphosis | Organization: MRPL (Mangalore Refinery and Petrochemicals Limited)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docs.docker.com/compose/)

</div>

---

## 📌 Overview

Employees at refineries, PSUs, and defence-linked manufacturing units routinely handle **confidential material** — P&IDs, financial data, vendor negotiations, unreleased designs, inspection reports — that **cannot legally or contractually be sent to cloud AI tools** like ChatGPT or Claude.

The **Sovereign AI Workbench** is a self-hosted, air-gapped, agentic AI platform that gives industrial users a Claude/Codex-like assistant experience — planning, tool use, multimodal understanding, document generation — **running entirely on the organization's own GPU server, with zero external network calls**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔒 **100% On-Premise** | No data ever leaves the organization's network. Verified via a live egress monitor. |
| 🤖 **Agentic Execution** | Plan → Route → Act → Observe → Deliver loop for multi-step tasks, not just single-shot chat. |
| 🧠 **Multi-Model Pool** | Multiple open-weight LLMs (reasoning, code, vision) auto-selected per sub-task. New models added via config — no code redeploy. |
| 🖼️ **Multimodal Input** | Scanned PDFs, handwritten notes, engineering drawings, and photos processed via on-device OCR/vision. |
| 📄 **Real Deliverables** | Generates `.docx`, `.xlsx`, `.pptx`, `.pdf`, and source-code files — not just chat text. |
| 📚 **Local RAG** | Retrieval-Augmented Generation over organization's SOPs, manuals, and correspondence via a local Qdrant vector store. |
| 🧾 **Immutable Audit Trail** | Every agent action, tool call, model invocation, and output is logged with timestamp and user ID. |
| 🔐 **RBAC** | Role-based access control on knowledge-base collections, tools, and models. |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                    Client Layer                        │
│           React + Vite Web UI (Chat + Dashboard)       │
└─────────────────────┬──────────────────────────────────┘
                      │ HTTPS / WebSocket
┌─────────────────────▼──────────────────────────────────┐
│                   Gateway Layer                        │
│         FastAPI — Auth, RBAC, Rate Limiting            │
└─────────────────────┬──────────────────────────────────┘
                      │ Internal REST
┌─────────────────────▼──────────────────────────────────┐
│               Orchestration Layer                      │
│     LangGraph Agent Loop (Plan → Route → Act →         │
│                 Observe → Deliver)                     │
└──────┬──────────────┬───────────────┬──────────────────┘
       │              │               │
 ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼────────────────┐
 │ Model Pool│  │ Tool Layer│  │     Data Layer        │
 │ vLLM /   │  │ Sandbox   │  │ Qdrant (RAG)          │
 │ Ollama   │  │ Doc Gen   │  │ PostgreSQL (Audit)    │
 │ (≥2 LLMs)│  │ OCR/Vision│  │ MinIO (Object Store)  │
 └───────────┘  └───────────┘  └──────────────────────┘
       │              │               │
┌──────▼──────────────▼───────────────▼──────────────────┐
│                  Isolation Layer                       │
│     Docker Network Policies + Egress Monitor           │
│          (enforces zero outbound traffic)              │
└────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
Sovereign-AI-Workbench/
├── backend/                    # FastAPI gateway + orchestration
│   ├── main.py                 # App entrypoint
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # React + Vite web UI
│   ├── src/
│   │   ├── pages/              # Route-level pages
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React context providers
│   │   ├── services/           # API client layer
│   │   └── data/               # Static/seed data
│   ├── public/                 # Static assets
│   ├── index.html
│   └── package.json
│
├── models/                     # Place downloaded model weights here (git-ignored)
├── qdrant_storage/             # Qdrant vector DB data (git-ignored)
├── postgres_data/              # PostgreSQL volume (git-ignored)
├── minio_data/                 # MinIO object store volume (git-ignored)
├── logs/                       # Runtime logs (git-ignored)
├── audit_logs/                 # Immutable audit trail (git-ignored)
├── uploads/                    # User-uploaded files (git-ignored)
├── output/                     # Generated deliverable files (git-ignored)
│
├── PRD.md                      # Product Requirements Document
├── TRD.md                      # Technical Requirements Document
├── DESIGN.md                   # System Design
├── IMPLEMENTATION_PLAN.md      # Implementation Plan
└── README.md                   # You are here
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.11+ |
| Node.js | 20+ |
| Docker & Docker Compose | Latest |
| GPU (recommended) | 16–24 GB VRAM (mid-range) |
| CUDA | 12.x (for GPU inference) |

### 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/sovereign-ai-workbench.git
cd sovereign-ai-workbench
```

### 2. Download Model Weights

Place your open-weight model files into the `models/` directory (git-ignored). Supported runtimes:
- **vLLM** — for high-throughput serving
- **Ollama** — for lightweight local runtime

```bash
# Example: pull a model via Ollama
ollama pull llama3.2
ollama pull qwen2.5-coder
```

### 3. Backend Setup (Development)

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Frontend Setup (Development)

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`.

### 5. Full Stack via Docker Compose *(coming soon)*

```bash
# Bring up all services (API, orchestrator, model server, Qdrant, Postgres, MinIO, egress monitor)
docker compose up
```

> **Air-gap note:** In a true air-gapped deployment, pre-bake all model weights and container images into the deployment image during setup. No runtime internet access is required.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite 8, Recharts, Lucide React |
| **API Gateway** | FastAPI + Uvicorn, Pydantic v2 |
| **Orchestration** | LangGraph (custom Plan→Route→Act→Observe→Deliver loop) |
| **Model Serving** | vLLM (primary) + Ollama (secondary) |
| **Vector DB / RAG** | Qdrant + BGE-M3 embeddings |
| **OCR / Vision** | PaddleOCR + local vision-language model |
| **Code Sandbox** | Ephemeral Docker containers (`--network none`) |
| **Document Generation** | python-docx, openpyxl, python-pptx |
| **Relational / Audit DB** | PostgreSQL |
| **Object Store** | MinIO (or filesystem-backed) |
| **Containerization** | Docker / Docker Compose |

---

## 📋 Functional Requirements Summary

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Natural-language task requests via web chat UI | P0 |
| FR-2 | Multi-step task planning and execution (agent loop) | P0 |
| FR-3 | Pool of ≥2 local open-weight models with auto-routing | P0 |
| FR-4 | Add new models via config only (no code redeploy) | P1 |
| FR-5 | On-device OCR/vision for scanned PDFs & handwriting | P0 |
| FR-6 | Isolated, network-restricted code sandbox | P0 |
| FR-7 | Local RAG over org knowledge base with citations | P0 |
| FR-8 | Deliverable file generation (.docx, .xlsx, .pptx, .pdf) | P0 |
| FR-9 | Role-Based Access Control | P0 |
| FR-10 | Immutable audit trail for every action | P0 |
| FR-11 | Live egress monitor proving zero outbound calls | P0 |
| FR-12 | Multi-user, multi-session concurrent use | P1 |
| FR-13 | Human-in-the-loop review step for high-stakes deliverables | P1 |

---

## 🔒 Sovereignty Guarantee

The system is designed with a **zero-external-call contract**:

- All model weights, embedding models, and OCR models are pre-downloaded during setup — never fetched at runtime.
- Containers run with **no default outbound network route**.
- An egress monitor records all connection attempts; any attempt to reach outside the internal CIDR is **logged and flagged**.
- During demo, the egress monitor is expected to show **zero external calls**.

---

## 📐 Data Model (High Level)

```
User       (id, name, role, department)
Role       (id, name, permissions[])
Task       (id, user_id, prompt, status, created_at, plan[])
PlanStep   (id, task_id, step_no, type, model_used, tool_used, input, output, timestamp)
Document   (id, task_id, type, storage_path, version, created_at)
KnowledgeSource (id, name, collection, access_roles[], ingested_at)
AuditLogEntry   (id, task_id, actor, action, resource, timestamp, hash)
EgressLogEntry  (id, timestamp, source_service, destination, allowed)
```

---

## 🎯 Success Metrics (Demo/Evaluation)

- [ ] Zero external network calls during a full end-to-end demo (verified live via egress monitor)
- [ ] ≥2 distinct open-weight models used within a single agent run, correctly routed by task type
- [ ] Multimodal task: scanned/handwritten inspection report → `.docx` approval note with SOP citations
- [ ] Coding task: written, executed in sandbox, and verified with visible pass/fail output
- [ ] Full audit trail reconstructable for the entire demo session
- [ ] Non-technical persona can complete a task without CLI access

---

## 👥 Team

**Team Metamorphosis** — SIH 2026

---

## 📄 Docs

- [PRD.md](PRD.md) — Product Requirements Document
- [TRD.md](TRD.md) — Technical Requirements Document
- [DESIGN.md](DESIGN.md) — System Design
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — Implementation Plan

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
