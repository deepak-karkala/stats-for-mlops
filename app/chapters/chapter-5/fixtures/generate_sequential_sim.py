import numpy as np
import pandas as pd

def ttest_ind_manual(a, b):
    """Manual t-test implementation"""
    mean_a, mean_b = a.mean(), b.mean()
    var_a, var_b = a.var(ddof=1), b.var(ddof=1)
    n_a, n_b = len(a), len(b)

    # Pooled standard error
    pooled_se = np.sqrt(var_a / n_a + var_b / n_b)

    # T-statistic
    t_stat = (mean_b - mean_a) / pooled_se if pooled_se > 0 else 0

    # Degrees of freedom (Welch's approximation)
    df = (var_a / n_a + var_b / n_b)**2 / ((var_a / n_a)**2 / (n_a - 1) + (var_b / n_b)**2 / (n_b - 1))

    # Two-tailed p-value approximation using normal distribution
    # For large samples, t-distribution ≈ normal distribution
    p_value = 2 * (1 - 0.5 * (1 + np.tanh(t_stat / np.sqrt(2))))

    return t_stat, p_value

# Set seed for reproducibility
rng = np.random.default_rng(14)

n_steps = 20
N_total = 10000
effect = 0.2  # Effect size (Cohen's d)

# Generate full data for control (A) and treatment (B)
A = rng.normal(0, 1, N_total)
B = rng.normal(effect, 1, N_total)

# Simulate sequential testing
records = []
for i in range(1, n_steps + 1):
    n = int(i * N_total / n_steps)
    t_stat, p_value = ttest_ind_manual(A[:n], B[:n])

    # Calculate effect size and confidence interval
    mean_diff = B[:n].mean() - A[:n].mean()
    pooled_std = np.sqrt((A[:n].var() + B[:n].var()) / 2)
    cohens_d = mean_diff / pooled_std if pooled_std > 0 else 0

    records.append({
        "n": n,
        "p_value": p_value,
        "t_stat": t_stat,
        "mean_diff": mean_diff,
        "cohens_d": cohens_d
    })

df = pd.DataFrame(records)
df.to_csv("sequential_sim.csv", index=False)

print(f"Generated sequential_sim.csv with {len(df)} time points")
print(f"Final p-value: {df['p_value'].iloc[-1]:.4f}")
print(f"Final effect size (Cohen's d): {df['cohens_d'].iloc[-1]:.3f}")
print(f"P-value first crosses 0.05 at n={df[df['p_value'] < 0.05]['n'].iloc[0] if any(df['p_value'] < 0.05) else 'never'}")
