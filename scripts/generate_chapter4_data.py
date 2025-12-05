#!/usr/bin/env python3
"""
Generate Chapter 4: A/B Testing data fixtures.

Generates:
1. ab_test_results.csv - A/B test outcomes (control vs treatment)
2. srm_check.csv - Sample ratio mismatch chi-square results
3. power_curve.csv - Statistical power vs sample size
"""

import numpy as np
import pandas as pd
import os
from pathlib import Path
import math

# Set seed for reproducibility
np.random.seed(42)

# Create output directory
output_dir = Path(__file__).parent.parent / "public" / "chapters" / "chapter-4" / "fixtures"
output_dir.mkdir(parents=True, exist_ok=True)

print(f"Generating Chapter 4 data in {output_dir}...")

# ============================================================================
# 1. A/B Test Results (Control vs Treatment)
# ============================================================================
print("\n1. Generating ab_test_results.csv...")

# Simulate revenue per ride
n_control = 5000
n_treatment = 5000

# Control: mean $12.50, std $3.20
control_revenue = np.random.normal(12.50, 3.20, n_control)

# Treatment: mean $13.10 (5% lift), std $3.20
treatment_revenue = np.random.normal(13.10, 3.20, n_treatment)

# Create combined dataset
ab_data = []
for i, rev in enumerate(control_revenue):
    ab_data.append({
        'variant': 'control',
        'revenue_per_ride': rev,
        'conversion': 1 if np.random.random() < 0.12 else 0,  # 12% baseline conversion
        'ride_id': f'control_{i}'
    })

for i, rev in enumerate(treatment_revenue):
    ab_data.append({
        'variant': 'treatment',
        'revenue_per_ride': rev,
        'conversion': 1 if np.random.random() < 0.128 else 0,  # 1.3% lift in conversion
        'ride_id': f'treatment_{i}'
    })

ab_df = pd.DataFrame(ab_data)

# Calculate metrics
control_mean = ab_df[ab_df['variant'] == 'control']['revenue_per_ride'].mean()
treatment_mean = ab_df[ab_df['variant'] == 'treatment']['revenue_per_ride'].mean()
control_std = ab_df[ab_df['variant'] == 'control']['revenue_per_ride'].std()
treatment_std = ab_df[ab_df['variant'] == 'treatment']['revenue_per_ride'].std()

print(f"  Control mean: ${control_mean:.2f} (σ={control_std:.2f})")
print(f"  Treatment mean: ${treatment_mean:.2f} (σ={treatment_std:.2f})")
print(f"  Lift: {((treatment_mean - control_mean) / control_mean * 100):.2f}%")

# Write summary stats (row per variant)
summary_stats = pd.DataFrame([
    {
        'variant': 'control',
        'n': n_control,
        'mean_revenue': control_mean,
        'std_revenue': control_std,
        'conversion_rate': ab_df[ab_df['variant'] == 'control']['conversion'].mean(),
    },
    {
        'variant': 'treatment',
        'n': n_treatment,
        'mean_revenue': treatment_mean,
        'std_revenue': treatment_std,
        'conversion_rate': ab_df[ab_df['variant'] == 'treatment']['conversion'].mean(),
    }
])
summary_stats.to_csv(output_dir / 'ab_test_results.csv', index=False)
print(f"  Wrote: ab_test_results.csv")

# ============================================================================
# 2. Sample Ratio Mismatch (SRM) Check
# ============================================================================
print("\n2. Generating srm_check.csv...")

# Expected: 50-50 split
expected_counts = [0.5, 0.5]
observed_counts = np.array([n_control, n_treatment], dtype=float)
total = observed_counts.sum()
expected_abs = np.array(expected_counts) * total

# Chi-square test
chi2_stat = np.sum((observed_counts - expected_abs) ** 2 / expected_abs)

print(f"  Observed: {n_control} control, {n_treatment} treatment")
print(f"  Expected: {expected_abs[0]:.0f} control, {expected_abs[1]:.0f} treatment")
print(f"  Chi2 statistic: {chi2_stat:.4f}")

srm_data = pd.DataFrame([
    {
        'group': 'control',
        'observed_count': int(n_control),
        'expected_count': int(expected_abs[0]),
        'ratio': n_control / total,
    },
    {
        'group': 'treatment',
        'observed_count': int(n_treatment),
        'expected_count': int(expected_abs[1]),
        'ratio': n_treatment / total,
    },
    {
        'group': 'chi2_result',
        'observed_count': chi2_stat,
        'expected_count': 3.841,  # Critical value for α=0.05, df=1
        'ratio': 1.0 if chi2_stat < 3.841 else 0.0,  # Pass if chi2 < critical
    }
])
srm_data.to_csv(output_dir / 'srm_check.csv', index=False)
print(f"  Wrote: srm_check.csv")

# ============================================================================
# 3. Power Curve (Power vs Sample Size)
# ============================================================================
print("\n3. Generating power_curve.csv...")

# Power analysis: detecting effect size of 0.625 (5% lift on $12.50)
baseline_mean = 12.50
baseline_std = 3.20
effect_size_absolute = 0.05 * baseline_mean  # 5% lift = $0.625
effect_size_cohen = effect_size_absolute / baseline_std  # Cohen's d ≈ 0.195

# Simple power estimation using normal approximation
# Power ≈ Φ(d√(n/2) - z_{1-α/2})
# where Φ is CDF of normal, d is Cohen's d, z is critical value

def normal_cdf(x):
    """Approximate CDF of standard normal distribution"""
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))

def estimate_power(n_per_group, effect_size_d, alpha=0.05):
    """Estimate power for two-sample t-test"""
    z_alpha = 1.96  # Critical z-value for two-tailed α=0.05
    # Non-centrality parameter
    lambda_nc = effect_size_d * math.sqrt(n_per_group / 2)
    # Power approximation
    power = normal_cdf(lambda_nc - z_alpha)
    return power

sample_sizes = np.logspace(1, 3.5, 40).astype(int)  # 10 to ~3000
alpha = 0.05

power_data = []

for n_per_group in sample_sizes:
    power_val = estimate_power(n_per_group, effect_size_cohen, alpha)

    power_data.append({
        'sample_size_per_group': n_per_group,
        'total_sample_size': 2 * n_per_group,
        'power': max(0, min(1, power_val)),  # Clamp to [0, 1]
        'alpha': alpha,
        'effect_size_cohens_d': round(effect_size_cohen, 4),
    })

power_df = pd.DataFrame(power_data)
power_df.to_csv(output_dir / 'power_curve.csv', index=False)

print(f"  Power curve created with {len(power_df)} sample size points")
print(f"  Sample sizes range: {power_df['sample_size_per_group'].min()} to {power_df['sample_size_per_group'].max()}")
print(f"  Power ranges: {power_df['power'].min():.1%} to {power_df['power'].max():.1%}")
print(f"  80% power achieved at n ≈ {power_df[power_df['power'] >= 0.80]['sample_size_per_group'].iloc[0] if (power_df['power'] >= 0.80).any() else 'N/A'} per group")
print(f"  Wrote: power_curve.csv")

print("\n✅ All Chapter 4 fixture files generated successfully!")
print(f"   - ab_test_results.csv")
print(f"   - srm_check.csv")
print(f"   - power_curve.csv")
