import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from backend.utils.preprocessing import load_data, preprocess_data
#from preprocessing import load_data, preprocess_data


# Create output folder for charts
PROJECT_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = PROJECT_ROOT / "backend" / "data"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# Load and preprocess data
df = preprocess_data(load_data())


# --------------------------------------------------
# 1. Basic information
# --------------------------------------------------

print("=" * 60)
print("ECONOCausal - EDA")
print("=" * 60)

print("\nDataset shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nStatistical summary:")
print(df.describe())


# --------------------------------------------------
# 2. Interest Rate vs Index Price
# --------------------------------------------------

plt.figure(figsize=(8, 5))

sns.scatterplot(
    data=df,
    x="interest_rate",
    y="index_price"
)

plt.title("Interest Rate vs Index Price")
plt.xlabel("Interest Rate")
plt.ylabel("Index Price")
plt.tight_layout()

plt.savefig(OUTPUT_DIR / "interest_vs_index.png")
plt.show()


# --------------------------------------------------
# 3. Unemployment Rate vs Index Price
# --------------------------------------------------

plt.figure(figsize=(8, 5))

sns.scatterplot(
    data=df,
    x="unemployment_rate",
    y="index_price"
)

plt.title("Unemployment Rate vs Index Price")
plt.xlabel("Unemployment Rate")
plt.ylabel("Index Price")
plt.tight_layout()

plt.savefig(OUTPUT_DIR / "unemployment_vs_index.png")
plt.show()


# --------------------------------------------------
# 4. Index Price over Time
# --------------------------------------------------

plt.figure(figsize=(10, 5))

sns.lineplot(
    data=df,
    x="date",
    y="index_price",
    marker="o"
)

plt.title("Index Price Over Time")
plt.xlabel("Date")
plt.ylabel("Index Price")
plt.xticks(rotation=45)
plt.tight_layout()

plt.savefig(OUTPUT_DIR / "index_price_trend.png")
plt.show()


# --------------------------------------------------
# 5. Correlation Matrix
# --------------------------------------------------

numeric_columns = [
    "interest_rate",
    "unemployment_rate",
    "index_price"
]

correlation = df[numeric_columns].corr()

print("\nCorrelation Matrix:")
print(correlation)

plt.figure(figsize=(7, 5))

sns.heatmap(
    correlation,
    annot=True,
    cmap="coolwarm",
    fmt=".2f"
)

plt.title("Economic Variables Correlation")
plt.tight_layout()

plt.savefig(OUTPUT_DIR / "correlation_matrix.png")
plt.show()


print("\nEDA completed successfully!")
print(f"Charts saved in: {OUTPUT_DIR}")