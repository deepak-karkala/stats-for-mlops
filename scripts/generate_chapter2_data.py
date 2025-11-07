#!/usr/bin/env python3
"""
Generate CSV fixtures for Chapter 2: rides_rainstorm.csv
Uses baseline from Chapter 1 and generates rainstorm data with shifted distributions.
"""
import numpy as np
import pandas as pd
from pathlib import Path

# Set up output directory (public is served by Next.js)
output_dir = Path(__file__).parent.parent / "public" / "chapters" / "chapter-2" / "fixtures"
output_dir.mkdir(parents=True, exist_ok=True)

# Input baseline from Chapter 1
baseline_path = Path(__file__).parent.parent / "public" / "chapters" / "chapter-1" / "fixtures" / "rides_baseline.csv"

# Random seed for reproducibility
rng = np.random.default_rng(9)

# Load baseline
print(f"Loading baseline from {baseline_path}...")
df_baseline = pd.read_csv(baseline_path)
N = len(df_baseline)

print(f"Generating rainstorm data ({N} rows)...")

# Rainstorm: fewer short trips, more long ones, higher surge
# Mean distance increases from 6.5 to 7.8 (heavier right tail)
trip_rainstorm = np.clip(rng.normal(7.8, 2.5, N), 0.3, None)
surge_rainstorm = np.clip(rng.lognormal(mean=0.12, sigma=0.20, size=N), 1.0, None)
fare_rainstorm = np.clip(38 + trip_rainstorm * 3.5 + rng.normal(0, 6, N), 5, None)

# Create rainstorm dataset
df_rainstorm = df_baseline.copy()
df_rainstorm["trip_distance_km"] = trip_rainstorm
df_rainstorm["surge_multiplier"] = surge_rainstorm
df_rainstorm["fare_amount"] = fare_rainstorm

# Write rainstorm CSV
rainstorm_file = output_dir / "rides_rainstorm.csv"
df_rainstorm.to_csv(rainstorm_file, index=False)
print(f"✅ Wrote {rainstorm_file}")

# Print summary stats
print("\nDistribution Summary:")
print(f"{'Metric':<25} {'Baseline':<12} {'Rainstorm':<12}")
print("-" * 50)
for col in ["trip_distance_km", "surge_multiplier", "fare_amount"]:
    baseline_mean = df_baseline[col].mean()
    rainstorm_mean = df_rainstorm[col].mean()
    print(f"{col:<25} {baseline_mean:<12.3f} {rainstorm_mean:<12.3f}")

print("\nDone!")
