# MRPL Sovereign AI Workbench — Demo User Credentials

This directory contains pre-configured test credentials for evaluating and testing the Sovereign AI Workbench across various departmental roles and permission levels.

---

## 🔑 Quick Credentials Reference Table

| Employee Name | Email / Username | Password | Role | Department | Employee ID |
|:---|:---|:---|:---|:---|:---|
| **Rina Sharma** | `rina@mrpl.co.in` | `demo123` | **Inspector** | Quality Inspection | `MRPL/QI/2891` |
| **Dev Nair** | `dev@mrpl.co.in` | `demo123` | **Engineer** | Process Engineering | `MRPL/PE/1247` |
| **Meena Kulkarni** | `meena@mrpl.co.in` | `demo123` | **Admin Staff** | Administration | `MRPL/ADM/3056` |
| **Arjun Patel** | `arjun@mrpl.co.in` | `demo123` | **IT Admin** | IT & Cybersecurity | `MRPL/IT/0421` |
| **System Admin** | `test123@gmail.com` | `password123` | **IT Admin** | IT & Cybersecurity | `MRPL/ADMIN/0001` |

---

## 🎯 Role-Based Workflow Test Cases

### 1. Quality Inspector (`rina@mrpl.co.in`)
- **Primary Use Case:** Reviewing pressure vessel inspection sheets, ultrasonic thickness readings, checking OISD-117 and IS 2825 regulatory compliance, generating formal approval notes.
- **Sample Prompt:**
  > *"Review this inspection report and prepare an approval note citing relevant SOP clauses."*
- **Deliverables Generated:** `Approval_Note_CDU_2891.docx`, `Inspection_Assessment.xlsx`

---

### 2. Process Engineer (`dev@mrpl.co.in`)
- **Primary Use Case:** Executing Python mass-balance simulations, calculating crude distillation unit (CDU) stream yields and energy efficiencies in an isolated local sandbox.
- **Sample Prompt:**
  > *"Write and test a Python mass-balance calculation script for CDU unit."*
- **Deliverables Generated:** `mass_balance_cdu.py`, `execution_log.txt`

---

### 3. Admin Staff (`meena@mrpl.co.in`)
- **Primary Use Case:** Synthesizing board meeting minutes, departmental reports, and operational summaries into professional 5-slide executive presentation decks.
- **Sample Prompt:**
  > *"Summarize board meeting minutes into a 5-slide executive PowerPoint."*
- **Deliverables Generated:** `MRPL_Board_Meeting_Summary.pptx`

---

### 4. IT & Cybersecurity Admin (`arjun@mrpl.co.in`)
- **Primary Use Case:** Monitoring zero-egress air-gap boundaries, inspecting SHA-256 immutable audit ledger chains, and auditing local model GPU tensor weights.
- **Features to Explore:**
  - **Egress Monitor:** Real-time iptables/eBPF boundary checks & blocked external calls.
  - **Audit Trail:** Append-only hash-chain verification for compliance.
  - **Model Pool:** Inspect loaded on-premise local GPU models (`LLaMA-3.1-70B`, `Qwen2.5-Coder`, `PaddleOCR`).

---

## 🔒 Security & Data Confidentiality Notice
All accounts operate strictly in an **air-gapped, on-premise GPU environment**. No login data or prompts are transmitted outside the internal refinery subnet (`192.168.10.0/24`).
