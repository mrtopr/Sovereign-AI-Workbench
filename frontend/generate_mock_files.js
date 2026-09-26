const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const BASE_DIRS = [
  path.join(rootDir, 'mock_files'),
  path.join(rootDir, 'frontend', 'public', 'mock_files'),
  path.join(rootDir, 'backend', 'mock_files'),
];

BASE_DIRS.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

const FILES = {
  // 1. PYTHON SCRIPTS
  'cdu_mass_balance.py': `#!/usr/bin/env python3
# ==============================================================================
# MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
# SOVEREIGN AI WORKBENCH — PROCESS ENGINEERING MODULE
# Target Unit: Crude Distillation Unit (CDU-II)
# Execution Mode: Air-Gapped Local Sandbox (Zero Egress)
# ==============================================================================

import json
from dataclasses import dataclass
from typing import Dict

@dataclass
class CrudeAssayFeed:
    crude_name: str
    feed_rate_bpd: float
    feed_rate_mt_h: float
    density_15c_kg_m3: float
    api_gravity: float
    sulfur_wt_pct: float
    salt_content_ptb: float

def execute_cdu_mass_balance(feed: CrudeAssayFeed):
    daily_feed_mass_mt = feed.feed_rate_mt_h * 24.0
    
    cut_fractions = {
        "Fuel Gas + LPG (C1-C4)": 0.038,
        "Light Naphtha (IBP - 90°C)": 0.082,
        "Heavy Naphtha (90°C - 140°C)": 0.134,
        "Kerosene / ATF (140°C - 240°C)": 0.185,
        "High Speed Diesel (HSD, 240°C - 370°C)": 0.312,
        "Vacuum Gas Oil (VGO from VDU)": 0.165,
        "Short Residue / Bitumen (>535°C)": 0.081
    }
    
    products_mt = {cut: round(daily_feed_mass_mt * frac, 2) for cut, frac in cut_fractions.items()}
    total_recovered_mt = sum(products_mt.values())
    loss_mt = round(daily_feed_mass_mt - total_recovered_mt, 2)
    loss_pct = round((loss_mt / daily_feed_mass_mt) * 100, 3)
    
    return {
        "crude": feed.crude_name,
        "throughput_mt_day": daily_feed_mass_mt,
        "products_mt_day": products_mt,
        "total_recovery_mt_day": round(total_recovered_mt, 2),
        "unaccounted_loss_pct": loss_pct,
        "oisd_status": "CONVERGED_COMPLIANT" if abs(loss_pct) <= 0.3 else "FLAGGED_DISCREPANCY"
    }

if __name__ == "__main__":
    feed = CrudeAssayFeed(
        crude_name="Arab Heavy + Basrah Medium Blend",
        feed_rate_bpd=110000.0,
        feed_rate_mt_h=625.0,
        density_15c_kg_m3=875.4,
        api_gravity=30.1,
        sulfur_wt_pct=2.45,
        salt_content_ptb=2.8
    )
    res = execute_cdu_mass_balance(feed)
    print(json.dumps(res, indent=2))
`,

  // 2. LOGS
  'execution_log.txt': `================================================================================
MRPL SOVEREIGN AI WORKBENCH — CONTAINER EXECUTION TELEMETRY LOG
Target: CDU-II Hydrocarbon Mass Balance Reconciler
Execution Node: sovereign-node-gpu01 (NVIDIA H100 80GB On-Premise)
Network Isolation: STRICT AIR-GAP (iptables: DROP all out-bound except 192.168.10.0/24)
================================================================================

[00.001s] [INIT] Container sandbox created: mrpl-sandbox-pve-runner:v2.4
[00.012s] [AUTH] Verified officer token for user: dev@mrpl.co.in (Role: Engineer)
[00.024s] [INGEST] Loaded crude assay dataset: Arab Heavy Blend (Feedrate: 625 T/h)
[00.056s] [MODEL] Dispatched to Qwen2.5-Coder:7B-Instruct (Local VRAM: 4.8 GB)
[00.108s] [COMPUTE] Solving non-linear mass and thermodynamic enthalpy balances...
[00.142s] [BALANCE] Feed: 15,000 MT/day | Sum of Cuts: 14,955 MT/day | Loss: 45 MT/day
[00.158s] [VERIFY] Relative imbalance delta: 0.300% (Strict OISD convergence achieved)
[00.189s] [OISD] Compliance rule engine checked against OISD-118 & API 510
[00.210s] [AUDIT] SHA-256 block committed: a78d34e901f4c6e992b4512d7c089aef4123568901234
[00.225s] [CLEANUP] Sandbox memory wiped. Ephemeral container destroyed.
[00.231s] [STATUS] EXIT CODE: 0 (SUCCESS)

Zero external DNS lookups. Zero egress packets transmitted.
`,

  'yield_reconciliation_log.txt': `================================================================================
MRPL PROCESS ENGINEERING — CDU-II YIELD RECONCILIATION AUDIT
Date: 2026-09-26 | Shift: Morning (06:00 - 14:00 hrs)
Target Unit: CDU-II / VDU-II | Crude Blend: Arab Heavy / Kuwait Blend
================================================================================

STREAM FLOW RECONCILIATION:
- Feed Crude Intake (Tag: FT-1001)       : 625.0 MT/h (15,000 MT/Day)
- LPG & Offgas Yield (Tag: FT-1012)      : 570.0 MT/Day (3.80 wt%)
- Light Naphtha (Tag: FT-1018)           : 1,230.0 MT/Day (8.20 wt%)
- Heavy Naphtha / CCR Feed (Tag: FT-1024): 2,010.0 MT/Day (13.40 wt%)
- ATF / Jet Fuel Grade (Tag: FT-1031)    : 2,775.0 MT/Day (18.50 wt%)
- BS-VI Diesel / HSD (Tag: FT-1045)      : 4,680.0 MT/Day (31.20 wt%)
- Vacuum Gas Oil (VGO) (Tag: FT-2005)    : 2,475.0 MT/Day (16.50 wt%)
- Vacuum Residue / Bitumen (Tag: FT-2012): 1,215.0 MT/Day (8.10 wt%)

MASS BALANCE VERIFICATION:
Total Feed Inflow   : 15,000.00 MT/Day
Total Product Outflow: 14,955.00 MT/Day
Unaccounted Loss    : 45.00 MT/Day (0.30%) [Within OISD Limit of 0.35%]

Engineers In Charge: Dev Nair (PE/1247) & Meena Kulkarni (ADM/3056)
Audit Certified: YES
`,

  // 3. CSV / EXCEL SPREADSHEETS
  'Desalter_Salinity_Quality_Report.xlsx': `MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
LABORATORY ASSAY & DESALTER QUALITY COMPLIANCE LOG
Report ID: MRPL-LAB-DS101-2026-SEP
Crude Type: Arab Heavy (60%) + Basrah Medium (40%) Blend
Standard: ASTM D3230 (Salt in Crude) & ASTM D4007 (BS&W)

Time,Sample Point,Salt Content (PTB),Salt Content (mg/L),BS&W (vol %),Wash Water Ratio (%),Demulsifier Dosage (ppm),Grid Voltage (kV),Current (A),Compliance Status
06:00,Raw Crude Header (TK-401A),38.4,109.8,0.85,0.0,0.0,0.0,0.0,BASELINE INLET
08:00,Desalter D-101A Outlet,2.6,7.4,0.11,5.8,18.5,32.0,24.1,PASSED (Target < 3.5 PTB)
10:00,Desalter D-101A Outlet,2.4,6.9,0.10,6.0,19.0,32.0,23.8,PASSED (Target < 3.5 PTB)
12:00,Desalter D-101B Outlet,2.8,8.0,0.13,5.7,18.0,31.5,24.6,PASSED (Target < 3.5 PTB)
14:00,Desalter D-101B Outlet,2.5,7.1,0.12,5.9,18.5,32.0,24.0,PASSED (Target < 3.5 PTB)
16:00,Combined Desalted Feed to CDU,2.5,7.1,0.11,5.8,18.5,32.0,24.2,PASSED (Optimal)
18:00,Effluent Brine to ETP,42.0 (Oil in Water ppm),—,—,—,—,—,—,PASSED (ETP Limit < 50 ppm)

SUMMARY METRICS:
Average Desalting Efficiency: 93.49%
Average Water & Sediment Removal: 87.05%
Corrosion Risk to Atmospheric Furnace: MINIMAL (< 0.02 mm/year)
Authorized Quality Chemist: Rina Sharma (QI/2891)
Chief Process Manager: Dev Nair (PE/1247)
Digital Signature SHA-256: 8f94a2e15bc7d0e44b89310c14f09a632190bbcd8321045ef92a8315cb8712a0
`,

  'Inspection_Assessment.xlsx': `MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
STATUTORY PRESSURE VESSEL UTM INSPECTION AUDIT SHEET
Equipment Tag: CDU-V1001 (Main Distillation Column)
Standard: OISD-STD-117 §4.3 & IS 2825:1969
Material: Carbon Steel SA-516 Gr 70 | Nominal Thickness: 14.00 mm | Minimum Required: 9.50 mm

Grid No,Elevation (m),Nozzle / Shell Section,Nominal Thick (mm),Measured Thick (mm),Corrosion Allowance (mm),Corrosion Rate (mm/yr),Remaining Life (yrs),Status
G-01,2.40,Bottom Boot Section,14.00,12.80,4.50,0.08,41.25,PASSED
G-02,5.80,Tray #04 Flash Zone,14.00,11.90,4.50,0.14,17.14,PASSED
G-03,8.20,Tray #08 Heavy Diesel Draw,14.00,12.20,4.50,0.11,24.54,PASSED
G-04,11.50,Tray #14 Feed Nozzle Junction,14.00,11.20,4.50,0.12,14.16,PASSED (Critical Region)
G-05,14.80,Tray #20 Kerosene Draw,14.00,12.60,4.50,0.09,34.44,PASSED
G-06,18.20,Tray #26 Heavy Naphtha Draw,14.00,12.90,4.50,0.07,48.57,PASSED
G-07,22.00,Tray #32 Light Naphtha Section,14.00,13.10,4.50,0.06,60.00,PASSED
G-08,25.60,Top Dome Overhead Vapor Outlet,14.00,13.20,4.50,0.05,74.00,PASSED

INSPECTION SUMMARY:
Lowest Observed Thickness: 11.20 mm (Tray #14 Nozzle)
Allowable Minimum (t_min): 9.50 mm
Calculated Corrosion Margin: +1.70 mm
Authorized Service Extension: 36 Months (Next Inspection: September 2029)
Lead Inspector: Rina Sharma (MRPL/QI/2891)
`,

  // 4. DOCX & PDF DOCUMENTS
  'approval_note_CDU-2891.docx': `================================================================================
MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
QUALITY INSPECTION & PROCESS SAFETY DIVISION
================================================================================

FORM MRPL-NDT-04: STATUTORY VESSEL INSPECTION & APPROVAL NOTE
Document Ref: MRPL/QI/2026/AP-2891
Date: ${timestamp}
Equipment Tag: CDU Column Vessel V-1001
Operating Unit: Crude Distillation Unit (CDU-II)
Inspecting Authority: Rina Sharma, Senior Quality Inspector (MRPL/QI/2891)
Approval Scope: 36-Month Operational Service Recertification

1. EXECUTIVE SUMMARY & SERVICE FITNESS EVALUATION
Comprehensive non-destructive testing (NDT), ultrasonic thickness measurement (UTM), 
and visual inspection of Crude Distillation Column V-1001 were completed during the 
scheduled turnaround. All readings across 18 radial grid zones indicate the structural 
integrity of the shell, tray support rings, and feed nozzle connections exceed statutory 
design thresholds prescribed under OISD-STD-117, IS 2825:1969, and ASME Section VIII Div 1.

2. TECHNICAL MEASUREMENT DATA & CORROSION ANALYSIS
• Material of Construction: Carbon Steel SA-516 Grade 70
• Original Nominal Thickness: 14.00 mm
• Minimum Required Design Thickness (t_min): 9.50 mm (UG-32 design equation)
• Lowest Measured Thickness: 11.20 mm (Tray #14 Feed Nozzle Junction)
• Maximum Measured Corrosion Rate: 0.12 mm/year (over last 72 months)
• Calculated Remaining Service Life:
      Remaining Life = (11.20 mm - 9.50 mm) / 0.12 mm/yr = 14.16 Years
• Maximum Allowable Working Pressure (MAWP): 4.8 kg/cm²g @ 365°C
• Operating Pressure: 3.8 kg/cm²g (Operating within safe margin of 79.1% MAWP)

3. STATUTORY COMPLIANCE & CODE MATRIX
[PASSED] OISD-STD-117 §4.3.1 — Pressure Vessel Inspection Interval Verification
[PASSED] IS 2825:1969 §6.1 — Radiographic and Ultrasonic Weld Seam Integrity
[PASSED] API 510 §6.4 — Remaining Corrosion Life Exceeds Statutory 3-Year Cycle
[PASSED] MRPL SOP-QI-22 §2.4 — Pre-Startup Vessel Re-Pressurization Authorization

4. INSPECTOR RECOMMENDATIONS & SIGN-OFF
1. Column Vessel V-1001 is certified for continuous safe operation for a 36-month period.
2. Next statutory NDT inspection due date: September 2029.

Lead Quality Inspector:  Rina Sharma (MRPL/QI/2891)         [SIGNED & SEALED]
Chief Process Manager:   Dev Nair (MRPL/PE/1247)            [COUNTERSIGNED]
Digital Verification Hash: SHA256-4c91b7e289df10034a70198bc523910c
================================================================================
`,

  'corrosion_rate_analysis.pdf': `================================================================================
MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
METALLURGY & CORROSION AUDIT REPORT — VESSEL V-1001
================================================================================
Ref: MRPL/MET/2026/CR-042
Component: Crude Distillation Unit Flash Zone & Heavy Diesel Trays

1. NON-DESTRUCTIVE TESTING OVERVIEW:
- Technique: High-Resolution Ultrasonic Thickness Gauging (UTM)
- Probe: Dual Element 5.0 MHz Transducer with High-Temp Delay Line
- Calibration Block: 5-Step Carbon Steel SA-516 Gr 70 Block (2.5mm to 20mm)

2. CORROSION TREND ANALYSIS:
- Baseline Thickness (2018 Turnaround) : 12.16 mm
- Mid-Term Inspection (2022 Turnaround): 11.68 mm
- Current Inspection (2026 Turnaround) : 11.20 mm
- Total Metal Loss over 8 Years        : 0.96 mm
- Long-Term Corrosion Rate             : 0.120 mm/year
- Short-Term Corrosion Rate (2022-26)  : 0.120 mm/year

3. METALLURGICAL VERDICT:
Corrosion morphology is uniform with zero localized naphthenic acid attack (NAC) 
or ammonium chloride salt pitting. Remaining shell wall thickness provides a 14.16 year 
operating lifespan. Recertification granted for 36 months under OISD-117.

Metallurgical Lead: Rina Sharma (MRPL/QI/2891)
`,

  'SOP_Compliance_Report_OISD117.docx': `================================================================================
MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
STATUTORY COMPLIANCE & SAFETY AUDIT DOSSIER
================================================================================
Document Ref: MRPL/AUD/2026/OISD-117-REV03
Standard: OISD-STD-117 (Inspection of Unfired Pressure Vessels) & IS 2825:1969
Inspection Unit: Crude Distillation (CDU-II) & Vacuum Distillation (VDU-II) Columns

1. MANDATORY REGULATORY CLAUSES & CODE AUDIT
- OISD-STD-117 §4.3.1 (Inspection Frequency): 24-month cycle verified. (PASSED)
- IS 2825:1969 §6.1.4 (Hydrostatic Pressure Testing): 1.5x MAWP test held 30 min. (CERTIFIED)
- ASME Section VIII Div 1 UG-32: Shell thickness 11.20mm > 9.50mm design minimum. (PASSED)

2. TECHNICAL SIGN-OFF
Column is authorized for 36-month continuous operational run until September 2029.

Audit Officer: Rina Sharma (MRPL/QI/2891)
Chief Inspector: Dev Nair (MRPL/PE/1247)
Ledger Hash: SHA256-d7a840912ef38910bcca4579124a90
================================================================================
`,

  'HCU_Emergency_Shutdown_SOP.docx': `================================================================================
MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
PROCESS SAFETY & HAZARD OPERABILITY (HAZOP) DIVISION
================================================================================
STANDARD OPERATING PROCEDURE: HCU EMERGENCY SHUTDOWN (ESD)
Document Ref: MRPL-EOP-HCU-41-2026
Standard: OISD-GDN-169, API RP 521, and IEC 61508 / SIL-3

1. UNIT PARAMETERS
Unit: Hydrocracker Loop 400 (High-Pressure Separator V-4001 & Reactor Beds R-4001/2)
Design Pressure: 175.0 kg/cm²g | Normal Operating Pressure: 148.0 kg/cm²g
Design Temperature: 425°C      | Normal Operating Temp: 395°C

2. ESD CAUSE & EFFECT INTERLOCK MATRIX
Trip Tag: PSHH-4012 (High-High Pressure in HP Separator @ 158.0 kg/cm²g, 2oo3 Voting)
- Automated Action 1: Close XV-4001 (Reactor Effluent Valve) in 1.8 seconds.
- Automated Action 2: Open BDV-4005 (Emergency Depressurization to Flare) in 2.2 seconds.
- Automated Action 3: Trip HP Feed Pumps P-4001A/B via Interlock I-409.
- Automated Action 4: Open Hydrogen Quench Valves XV-4008/9.

Compliance: SIL-3 Certified (TUV Rheinland #968/EZ-401/24)
Safety Review Officer: Dev Nair (MRPL/PE/1247)
================================================================================
`,

  'hcu_hazop_esd_audit.pdf': `================================================================================
MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
HAZOP & SIL-3 SAFETY INTEGRITY AUDIT REPORT — UNIT 41
================================================================================
Target Node: High-Pressure Separator V-4001 & Cold HP Separator V-4002

FINDINGS:
1. Cause-and-Effect Matrix verified across all 24 trip logic gates.
2. 2-out-of-3 (2oo3) transmitter voting logic (PT-4012A/B/C) validated with zero active bypasses.
3. Dual pilot-operated PSVs (PSV-4001A/B) benchmarked for 165 kg/cm²g relieving capacity.
4. Conforms strictly to OISD-GDN-169 and API RP 521 flare header capacity rules.

Authorized Process Safety Lead: Dev Nair (MRPL/PE/1247)
`,

  'MRPL_Board_Meeting_Summary.pptx': `================================================================================
MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
BOARD OF DIRECTORS — EXECUTIVE PERFORMANCE BRIEFING
================================================================================
Title: Q2 Operational Review & Gross Refining Margin (GRM) Executive Presentation

SLIDE 1: EXECUTIVE HIGHLIGHTS & OPERATIONAL THROUGHPUT
• Crude Throughput: 3.94 MMT (105.2% Capacity Utilization vs Nameplate).
• Distillate Yield: 78.4% (Record Production of BS-VI HSD and Jet A-1).
• Safety Integrity: 0.00 LTIF across 14.2M man-hours.

SLIDE 2: FINANCIAL PERFORMANCE & REFINING MARGINS
• Gross Refining Margin (GRM): $10.42 / bbl (vs Reuters Singapore benchmark $7.80 / bbl).
• Margin Premium: +$2.62 / bbl achieved through heavy/sour crude basket optimization.
• Net Profit (PAT): ₹1,290 Crore.

SLIDE 3: ENERGY OPTIMIZATION & SPECIFIC CONSUMPTION
• Specific Energy Consumption (MBN): 54.2 MBN (Reduction of 1.8 MBN YoY).
• Hydrogen Recovery: 2.8 T/h H2 recovered through PSA revamp.

SLIDE 4: STRATEGIC EXPANSION & DIGITAL SOVEREIGNTY
• 2G Bio-Ethanol Refinery: 86% erection completed.
• On-Premise Sovereign AI Workbench: Air-gapped GPU infrastructure operational.

SLIDE 5: STRATEGIC ACTION ITEMS REQUIRING BOARD SANCTION
1. CAPEX approval of ₹380 Cr for Desalter Modernization.
2. Approval for Long-Term Crude Supply Agreements.

Presented by: Senior Management & Technical Advisory Board
================================================================================
`,

  'MRPL_Executive_Performance_Brief.pptx': `================================================================================
MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL)
EXECUTIVE PERFORMANCE & REFINERY OPERATIONS BRIEF
================================================================================
Period: Q2 FY 2026-27 | Classification: Board Confidential

KEY METRICS SUMMARY:
- Nameplate Capacity: 15.0 MMTPA | Actual Run-Rate: 16.2 MMTPA (108%)
- GRM Average: $10.42 / barrel
- Distillate Slate: 78.4% high value (HSD + ATF)
- Egress Status: 100% On-Premise Sovereign Processing | 0 External Calls
`,

  'Approval_Note_CDU_2891.docx': `FORM MRPL-NDT-04: STATUTORY VESSEL INSPECTION & APPROVAL NOTE
Document Ref: MRPL/QI/2026/AP-2891
Equipment Tag: CDU Column Vessel V-1001
Operating Unit: Crude Distillation Unit (CDU-II)
Inspecting Authority: Rina Sharma, Senior Quality Inspector (MRPL/QI/2891)
Scope: 36-Month Recertification per OISD-117 & IS 2825:1969.
Status: APPROVED & CERTIFIED.
`,

  'CDU_Mass_Balance_Simulation.py': `# MRPL Crude Distillation Unit (CDU-II) Mass Balance Simulation
# Author: Dev Nair | Process Engineering Dept.
feed_rate_mt_h = 625.0
products = {
    "LPG": 23.75, "Light Naphtha": 51.25, "Heavy Naphtha": 83.75,
    "ATF/Kero": 115.62, "HSD": 195.00, "VGO": 103.12, "Residue": 50.62
}
print("Total recovery:", sum(products.values()), "MT/h")
print("Status: OISD-118 Compliant")
`
};

BASE_DIRS.forEach(baseDir => {
  Object.entries(FILES).forEach(([filename, content]) => {
    const filePath = path.join(baseDir, filename);
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf-8');
  });
});

console.log(`Generated ${Object.keys(FILES).length} mock files in ${BASE_DIRS.length} directories.`);
