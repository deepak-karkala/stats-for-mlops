import numpy as np
import pandas as pd

# Set seed for reproducibility
rng = np.random.default_rng(21)

# Generate 30 days of monitoring data
days = pd.date_range("2025-09-01", periods=30)

# PSI gradually increases over time (drift emerging)
psi = np.clip(np.linspace(0.05, 0.3, 30) + rng.normal(0, 0.01, 30), 0, 1)

# RMSE correlates with PSI (higher drift → higher error)
rmse = 1.8 + 4 * psi + rng.normal(0, 0.1, 30)

# Bias (residual direction) stays relatively stable
bias = rng.normal(0, 0.2, 30)

# Volume varies randomly around 10k predictions/day
volume = rng.integers(8000, 12000, 30)

# Create dataframe
df = pd.DataFrame({
    "date": days,
    "psi": psi,
    "rmse": rmse,
    "bias": bias,
    "volume": volume
})

# Save to CSV
df.to_csv("monitoring_dashboard.csv", index=False)

print(f"Generated monitoring_dashboard.csv with {len(df)} days")
print(f"PSI range: {psi.min():.3f} to {psi.max():.3f}")
print(f"RMSE range: {rmse.min():.2f} to {rmse.max():.2f}")
print(f"Average daily volume: {volume.mean():.0f}")
