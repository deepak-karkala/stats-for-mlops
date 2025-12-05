#!/usr/bin/env python3
"""
Generate CSV fixtures for Chapter 3: concept drift detection
Creates rides_concept_drift.csv, eta_model_performance.csv, residual_heatmap.csv
"""
import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta

# Set up output directory
output_dir = Path(__file__).parent.parent / "public" / "chapters" / "chapter-3" / "fixtures"
output_dir.mkdir(parents=True, exist_ok=True)

# Input baseline from Chapter 1
baseline_path = Path(__file__).parent.parent / "public" / "chapters" / "chapter-1" / "fixtures" / "rides_baseline.csv"

# Random seed for reproducibility
rng = np.random.default_rng(11)

print(f"Loading baseline from {baseline_path}...")
df_baseline = pd.read_csv(baseline_path)
N = len(df_baseline)

# ====== 1. Create rides_concept_drift.csv ======
# Concept drift: same trip distances but different relationship to ETA
# Model was trained on: ETA ≈ 5 + 0.9*distance + noise
# But new reality: ETA ≈ 6 + 1.2*distance + more_noise (traffic patterns changed)

print(f"Generating concept drift data ({N} rows)...")

# Baseline: model predictions (what trained model predicts)
pred_eta_min = 5 + 0.9 * df_baseline["trip_distance_km"] + rng.normal(0, 1, N)
actual_eta_min_baseline = 5 + 0.9 * df_baseline["trip_distance_km"] + rng.normal(0, 1, N)

# Concept drift: actual ETA changed (traffic patterns changed)
actual_eta_min_drift = 6 + 1.2 * df_baseline["trip_distance_km"] + rng.normal(0, 1.5, N)

df_concept_drift = df_baseline.copy()
df_concept_drift["pred_eta_min"] = np.maximum(pred_eta_min, 1)  # Ensure positive
df_concept_drift["actual_eta_min"] = np.maximum(actual_eta_min_drift, 1)

concept_drift_file = output_dir / "rides_concept_drift.csv"
df_concept_drift.to_csv(concept_drift_file, index=False)
print(f"✅ Wrote {concept_drift_file}")

# ====== 2. Create eta_model_performance.csv ======
# Rolling daily RMSE and MAE metrics
print("Generating rolling performance metrics...")

df_concept_drift["date"] = pd.date_range("2025-09-01", periods=N, freq="min")
df_concept_drift["day"] = df_concept_drift["date"].dt.date

def compute_rmse(actual, pred):
    return np.sqrt(np.mean((actual - pred) ** 2))

def compute_mae(actual, pred):
    return np.mean(np.abs(actual - pred))

daily_metrics = []
for day, group in df_concept_drift.groupby("day"):
    rmse = compute_rmse(group["actual_eta_min"].values, group["pred_eta_min"].values)
    mae = compute_mae(group["actual_eta_min"].values, group["pred_eta_min"].values)
    bias = np.mean(group["pred_eta_min"].values - group["actual_eta_min"].values)
    daily_metrics.append({
        "date": str(day),
        "rmse": rmse,
        "mae": mae,
        "bias": bias,
    })

df_performance = pd.DataFrame(daily_metrics)
performance_file = output_dir / "eta_model_performance.csv"
df_performance.to_csv(performance_file, index=False)
print(f"✅ Wrote {performance_file}")

# ====== 3. Create residual_heatmap.csv ======
# Residuals by city zone and hour of day
print("Generating residual heatmap data...")

# Generate zone and hour metadata
zones = [f"Z{i:03d}" for i in range(10)]
hours = list(range(24))

# Create residual matrix
residual_records = []
for zone in zones:
    for hour in hours:
        # Generate some residuals for this zone/hour combination
        residuals = rng.normal(0.5, 1.2, 20)  # Slight positive bias (under-predictions)
        avg_residual = np.mean(residuals)
        residual_records.append({
            "city_zone": zone,
            "hour_of_day": hour,
            "residual_min": avg_residual,
        })

df_heatmap = pd.DataFrame(residual_records)
heatmap_file = output_dir / "residual_heatmap.csv"
df_heatmap.to_csv(heatmap_file, index=False)
print(f"✅ Wrote {heatmap_file}")

# Print summary
print("\nPerformance Summary:")
print(f"{'Date':<15} {'RMSE':<8} {'MAE':<8} {'Bias':<8}")
print("-" * 40)
for _, row in df_performance.iterrows():
    print(f"{row['date']:<15} {row['rmse']:<8.3f} {row['mae']:<8.3f} {row['bias']:<8.3f}")

print("\nDone!")
