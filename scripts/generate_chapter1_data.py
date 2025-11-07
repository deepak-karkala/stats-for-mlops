#!/usr/bin/env python3
"""
Generate CSV fixtures for Chapter 1: rides_baseline.csv and rides_today.csv
"""
import numpy as np
import pandas as pd
from pathlib import Path

# Set up output directory (public is served by Next.js)
output_dir = Path(__file__).parent.parent / "public" / "chapters" / "chapter-1" / "fixtures"
output_dir.mkdir(parents=True, exist_ok=True)

# Random seed for reproducibility
rng = np.random.default_rng(7)

# Generate baseline data (September 2025)
N0 = 5000
trip0 = np.clip(rng.normal(6.5, 2.0, N0), 0.5, None)
surge0 = np.clip(rng.lognormal(mean=0.05, sigma=0.15, size=N0), 1.0, None)
fare0 = np.clip(35 + trip0*3.2 + rng.normal(0, 5, N0), 5, None)

df0 = pd.DataFrame({
    "ride_id": [f"b_{i}" for i in range(N0)],
    "timestamp": pd.date_range("2025-09-01", periods=N0, freq="min"),
    "pickup_zone": rng.choice([f"Z{i:03d}" for i in range(40)], size=N0),
    "dropoff_zone": rng.choice([f"Z{i:03d}" for i in range(40)], size=N0),
    "trip_distance_km": trip0,
    "surge_multiplier": surge0,
    "fare_amount": fare0,
})

# Generate today data (October 2025) - with drift
N1 = 4800
trip1 = np.clip(rng.normal(7.2, 2.3, N1), 0.5, None)
surge1 = np.clip(rng.lognormal(mean=0.08, sigma=0.18, size=N1), 1.0, None)
fare1 = np.clip(36 + trip1*3.4 + rng.normal(0, 6, N1), 5, None)

df1 = pd.DataFrame({
    "ride_id": [f"t_{i}" for i in range(N1)],
    "timestamp": pd.date_range("2025-10-01", periods=N1, freq="min"),
    "pickup_zone": rng.choice([f"Z{i:03d}" for i in range(40)], size=N1),
    "dropoff_zone": rng.choice([f"Z{i:03d}" for i in range(40)], size=N1),
    "trip_distance_km": trip1,
    "surge_multiplier": surge1,
    "fare_amount": fare1,
})

# Write CSV files
baseline_path = output_dir / "rides_baseline.csv"
today_path = output_dir / "rides_today.csv"

df0.to_csv(baseline_path, index=False)
df1.to_csv(today_path, index=False)

print(f"✓ Generated {baseline_path} ({len(df0)} rows)")
print(f"✓ Generated {today_path} ({len(df1)} rows)")
print(f"\nBaseline stats (trip_distance_km): mean={df0['trip_distance_km'].mean():.2f}, std={df0['trip_distance_km'].std():.2f}")
print(f"Today stats (trip_distance_km): mean={df1['trip_distance_km'].mean():.2f}, std={df1['trip_distance_km'].std():.2f}")
