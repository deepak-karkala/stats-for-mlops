import pandas as pd
import numpy as np

# Set seed
rng = np.random.default_rng(23)

# Generate 30 days of data
days = pd.date_range("2025-09-01", periods=30)

events = []
for i, d in enumerate(days):
    # PSI gradually increases
    psi = 0.05 + i * 0.008 + rng.normal(0, 0.005)

    # RMSE correlates with PSI
    rmse = 1.8 + 4 * psi + rng.normal(0, 0.1)

    # Determine guardrail status
    status = "ok"

    # Check thresholds
    if psi > 0.25 or rmse > 2.7:
        # Breach threshold - warn or rollback
        status = "rollback" if rng.random() < 0.4 else "warn"

    # Recovery after addressing issues (when PSI drops back down)
    if i > 15 and psi < 0.15 and i > 0:
        prev_status = events[-1][3] if events else "ok"
        if prev_status in ["rollback", "warn"]:
            status = "recovered"

    events.append((d, psi, rmse, status))

# Create dataframe
df = pd.DataFrame(events, columns=["date", "psi", "rmse", "status"])

# Ensure we have some variety in statuses
status_counts = df['status'].value_counts()

# Save to CSV
df.to_csv("guardrail_events.csv", index=False)

print(f"Generated guardrail_events.csv with {len(df)} events")
print(f"\nStatus distribution:")
print(status_counts)
print(f"\nFirst event: {df.iloc[0]['date']} - {df.iloc[0]['status']}")
print(f"Last event: {df.iloc[-1]['date']} - {df.iloc[-1]['status']}")
