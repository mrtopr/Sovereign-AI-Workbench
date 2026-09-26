#!/usr/bin/env python3
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
