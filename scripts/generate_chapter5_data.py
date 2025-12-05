#!/usr/bin/env python3
"""
Generate fixtures for Chapter 5:
 - cuped_demo.csv
 - sequential_sim.csv
"""

from pathlib import Path
import numpy as np
import pandas as pd


def generate_cuped_demo(output_dir: Path, n: int = 1200, rho: float = 0.7):
    """
    Create a bivariate-normal sample with the desired correlation between pre/post metrics.
    Pre metric ~ N(0,1); Post metric ~ N(0,1) with correlation rho.
    """
    cov = [[1.0, rho], [rho, 1.0]]
    mean = [0.0, 0.0]
    rng = np.random.default_rng(11)
    pre_post = rng.multivariate_normal(mean, cov, size=n)
    df = pd.DataFrame(pre_post, columns=["pre_metric", "post_metric"])
    path = output_dir / "cuped_demo.csv"
    df.to_csv(path, index=False)
    print(f"✅ Wrote {path} ({len(df)} rows, target rho={rho})")


def generate_sequential_sim(output_dir: Path, n_total: int = 10000, steps: int = 20, effect: float = 0.2):
    """
    Simulate a sequential t-test where treatment has a small lift (Cohen's d = effect).
    Returns cumulative p-values every step.
    """
    rng = np.random.default_rng(14)
    control = rng.normal(0, 1, n_total)
    treatment = rng.normal(effect, 1, n_total)

    records = []
    for i in range(1, steps + 1):
        n = int(i * n_total / steps)
        # Welch's t-test approximation (using scipy formula manually to avoid dependency)
        c_slice = control[:n]
        t_slice = treatment[:n]
        diff = t_slice.mean() - c_slice.mean()
        var_c = c_slice.var(ddof=1)
        var_t = t_slice.var(ddof=1)
        se = np.sqrt(var_c / n + var_t / n)
        t_stat = diff / se if se > 0 else 0
        # approximate two-sided p-value using normal CDF
        from math import erf, sqrt

        p_val = 2 * (1 - 0.5 * (1 + erf(abs(t_stat) / sqrt(2))))
        records.append({"n": n, "p_value": p_val})

    df = pd.DataFrame(records)
    path = output_dir / "sequential_sim.csv"
    df.to_csv(path, index=False)
    print(f"✅ Wrote {path} ({len(df)} rows, final n={n_total})")


def main():
    output_dir = Path(__file__).parent.parent / "public" / "chapters" / "chapter-5" / "fixtures"
    output_dir.mkdir(parents=True, exist_ok=True)

    generate_cuped_demo(output_dir)
    generate_sequential_sim(output_dir)


if __name__ == "__main__":
    main()
