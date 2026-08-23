import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

from backend.utils.preprocessing import load_data, preprocess_data


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = PROJECT_ROOT / "backend" / "data"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# Load and preprocess data
df = preprocess_data(load_data())


print("=" * 60)
print("WEEK 3 - BASIC DATA VISUALIZATION")
print("=" * 60)


# --------------------------------------------------
# 1. LINE CHART
# --------------------------------------------------

plt.figure(figsize=(10, 5))

plt.plot(
    df["date"],
    df["index_price"],
    marker="o"
)

plt.title("Index Price Trend Over Time")
plt.xlabel("Date")
plt.ylabel("Index Price")
plt.xticks(rotation=45)

plt.tight_layout()
plt.savefig(OUTPUT_DIR / "line_index_price.png")
plt.show()


# --------------------------------------------------
# 2. BAR CHART
# --------------------------------------------------

monthly_average = (
    df.groupby("month")["index_price"]
    .mean()
)

plt.figure(figsize=(8, 5))

plt.bar(
    monthly_average.index,
    monthly_average.values
)

plt.title("Average Index Price by Month")
plt.xlabel("Month")
plt.ylabel("Average Index Price")

plt.tight_layout()
plt.savefig(OUTPUT_DIR / "bar_monthly_index.png")
plt.show()


# --------------------------------------------------
# 3. PIE CHART
# --------------------------------------------------

year_counts = df["year"].value_counts().sort_index()

plt.figure(figsize=(7, 7))

plt.pie(
    year_counts.values,
    labels=year_counts.index,
    autopct="%1.1f%%"
)

plt.title("Distribution of Observations by Year")

plt.tight_layout()
plt.savefig(OUTPUT_DIR / "pie_year_distribution.png")
plt.show()


# --------------------------------------------------
# 4. SCATTER PLOT
# Interest Rate vs Index Price
# --------------------------------------------------

plt.figure(figsize=(8, 5))

plt.scatter(
    df["interest_rate"],
    df["index_price"]
)

plt.title("Interest Rate vs Index Price")
plt.xlabel("Interest Rate")
plt.ylabel("Index Price")

plt.tight_layout()
plt.savefig(OUTPUT_DIR / "scatter_interest_index.png")
plt.show()


# --------------------------------------------------
# 5. SCATTER PLOT
# Unemployment Rate vs Index Price
# --------------------------------------------------

plt.figure(figsize=(8, 5))

plt.scatter(
    df["unemployment_rate"],
    df["index_price"]
)

plt.title("Unemployment Rate vs Index Price")
plt.xlabel("Unemployment Rate")
plt.ylabel("Index Price")

plt.tight_layout()
plt.savefig(OUTPUT_DIR / "scatter_unemployment_index.png")
plt.show()


print("\nAll Week 3 charts created successfully!")

print("\nCharts saved in:")
print(OUTPUT_DIR)