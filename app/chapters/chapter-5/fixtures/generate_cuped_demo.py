import numpy as np
import pandas as pd

# Set seed for reproducibility
rng = np.random.default_rng(13)

N = 5000

# Generate pre-period metric (X) - baseline revenue
X = rng.normal(100, 10, N)

# Generate post-period metric (Y) with controllable correlation
# We'll create data for multiple correlation levels
rho = 0.7  # correlation coefficient
Y = 50 + 0.5 * X + rng.normal(0, (1 - rho**2)**0.5 * 10, N)

# Create dataframe
df = pd.DataFrame({
    "pre_metric": X,
    "post_metric": Y,
    "user_id": range(1, N + 1)
})

# Save to CSV
df.to_csv("cuped_demo.csv", index=False)
print(f"Generated cuped_demo.csv with {N} rows")
print(f"Correlation: {np.corrcoef(X, Y)[0,1]:.3f}")
print(f"Pre-metric mean: {X.mean():.2f}, std: {X.std():.2f}")
print(f"Post-metric mean: {Y.mean():.2f}, std: {Y.std():.2f}")
