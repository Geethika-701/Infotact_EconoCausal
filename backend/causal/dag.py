import pandas as pd
from pathlib import Path

from dowhy import CausalModel


# --------------------------------------------------
# Project paths
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_FILE = (
    PROJECT_ROOT
    / "backend"
    / "data"
    / "retail_campaign.csv"
)


# --------------------------------------------------
# Load dataset
# --------------------------------------------------

df = pd.read_csv(DATA_FILE)


print("=" * 60)
print("EconoCausal - Week 1")
print("DoWhy Causal DAG")
print("=" * 60)


print("\nDataset shape:")
print(df.shape)


print("\nColumns:")
print(df.columns.tolist())


# --------------------------------------------------
# Define causal variables
# --------------------------------------------------

treatment = "treatment"

outcome = "purchased"

confounders = [
    "age",
    "income",
    "past_purchases",
    "website_visits"
]


# --------------------------------------------------
# Create DoWhy model
# --------------------------------------------------

model = CausalModel(
    data=df,
    treatment=treatment,
    outcome=outcome,
    common_causes=confounders
)


# --------------------------------------------------
# Display causal variables
# --------------------------------------------------

print("\nTreatment:")
print(treatment)


print("\nOutcome:")
print(outcome)


print("\nConfounders:")

for variable in confounders:
    print("-", variable)


# --------------------------------------------------
# Display causal graph
# --------------------------------------------------

print("\nCausal Graph:")

graph = model.view_model()

print(graph)


# --------------------------------------------------
# Identify causal effect
# --------------------------------------------------

identified_estimand = model.identify_effect(
    proceed_when_unidentifiable=True
)


print("\nIdentified Causal Estimand:")
print(identified_estimand)