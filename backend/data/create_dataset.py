import numpy as np
import pandas as pd
from pathlib import Path


# --------------------------------------------------
# Reproducibility
# --------------------------------------------------

np.random.seed(42)


# --------------------------------------------------
# Number of customers
# --------------------------------------------------

N = 1000


# --------------------------------------------------
# Generate customer characteristics
# --------------------------------------------------

customer_id = np.arange(1, N + 1)

age = np.random.randint(18, 66, N)

income = np.random.randint(20000, 100001, N)

past_purchases = np.random.poisson(4, N)

past_purchases = np.clip(past_purchases, 0, 15)

website_visits = np.random.poisson(5, N)

website_visits = np.clip(website_visits, 0, 20)


# --------------------------------------------------
# Treatment assignment
# --------------------------------------------------

# Probability of receiving a discount depends partly
# on customer characteristics.

treatment_probability = (
    0.30
    + 0.002 * (age - 40)
    + 0.000003 * (income - 50000)
    + 0.02 * past_purchases
)

treatment_probability = np.clip(
    treatment_probability,
    0.10,
    0.90
)

treatment = np.random.binomial(
    1,
    treatment_probability
)


# --------------------------------------------------
# Discount amount
# --------------------------------------------------

discount = np.where(
    treatment == 1,
    np.random.choice([5, 10, 15, 20], N),
    0
)


# --------------------------------------------------
# Purchase probability
# --------------------------------------------------

base_probability = (
    -2.5
    + 0.02 * past_purchases
    + 0.08 * website_visits
    + 0.00001 * income
    - 0.01 * age
)


# Treatment effect
treatment_effect = (
    0.8 * treatment
    + 0.04 * discount
)


logistic_probability = (
    1 / (1 + np.exp(-(
        base_probability + treatment_effect
    )))
)


logistic_probability = np.clip(
    logistic_probability,
    0.02,
    0.98
)


# --------------------------------------------------
# Purchase outcome
# --------------------------------------------------

purchased = np.random.binomial(
    1,
    logistic_probability
)


# --------------------------------------------------
# Create dataframe
# --------------------------------------------------

df = pd.DataFrame({
    "customer_id": customer_id,
    "age": age,
    "income": income,
    "past_purchases": past_purchases,
    "website_visits": website_visits,
    "discount": discount,
    "treatment": treatment,
    "purchased": purchased
})


# --------------------------------------------------
# Save dataset
# --------------------------------------------------

output_path = Path(__file__).parent / "retail_campaign.csv"

df.to_csv(output_path, index=False)


print("=" * 60)
print("MOCK RETAIL DATASET CREATED")
print("=" * 60)

print("\nDataset shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())

print("\nTreatment distribution:")
print(df["treatment"].value_counts())

print("\nPurchase distribution:")
print(df["purchased"].value_counts())

print("\nSaved to:")
print(output_path)