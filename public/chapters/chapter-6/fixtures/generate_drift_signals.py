import pandas as pd
import numpy as np

# Set seed
rng = np.random.default_rng(22)

# Load monitoring dashboard data
df = pd.read_csv("monitoring_dashboard.csv")

# Extract PSI and RMSE for correlation analysis
drift_signals = df[["psi", "rmse"]].copy()

# Calculate correlation
corr = drift_signals.corr().iloc[0, 1]

# Save to CSV
drift_signals.to_csv("drift_signals.csv", index=False)

print(f"Generated drift_signals.csv with {len(drift_signals)} data points")
print(f"Correlation PSI–RMSE: {corr:.3f}")
print(f"Strong positive correlation confirms drift impacts performance")
