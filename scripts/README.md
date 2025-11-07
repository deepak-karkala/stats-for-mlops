# Data Generation Scripts

This directory contains scripts to generate CSV fixtures for the chapter examples.

## Prerequisites

Install Python dependencies:

```bash
pip3 install numpy pandas
```

## Available Scripts

### Chapter 1: Baseline & Drift Detection

Generates `rides_baseline.csv` and `rides_today.csv` with realistic ride-sharing data showing distribution drift.

**Run:**
```bash
npm run generate:ch1
# or
python3 scripts/generate_chapter1_data.py
```

**Output:**
- `public/chapters/chapter-1/fixtures/rides_baseline.csv` (5,000 rows)
- `public/chapters/chapter-1/fixtures/rides_today.csv` (4,800 rows)

**Features:**
- `ride_id`: Unique identifier
- `timestamp`: Ride timestamp
- `pickup_zone`: Pickup location (Z000-Z039)
- `dropoff_zone`: Dropoff location (Z000-Z039)
- `trip_distance_km`: Trip distance with intentional drift (baseline: μ=6.5, today: μ=7.2)
- `surge_multiplier`: Dynamic pricing multiplier
- `fare_amount`: Total fare

The "today" dataset includes drift in trip distances to demonstrate PSI and KS test functionality.

## Future Scripts

As you implement more chapters, add generation scripts here:
- `generate_chapter2_data.py` - Covariate drift examples
- `generate_chapter3_data.py` - Concept drift examples
- `generate_chapter4_data.py` - A/B test data
- etc.
