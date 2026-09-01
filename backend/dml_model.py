import pandas as pd

from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from econml.dml import LinearDML


# ==========================================
# 1. LOAD DATA
# ==========================================

df = pd.read_csv("data/retail_campaign.csv")

print("Dataset shape:", df.shape)


# ==========================================
# 2. DEFINE TREATMENT
# ==========================================

T = df["treatment"]


# ==========================================
# 3. DEFINE OUTCOME
# ==========================================

Y = df["purchased"]


# ==========================================
# 4. DEFINE FEATURES / CONFOUNDERS
# ==========================================

X = df[
    [
        "age",
        "income",
        "past_purchases",
        "website_visits",
        "discount"
    ]
]


# ==========================================
# 5. MACHINE LEARNING MODELS
# ==========================================

# Outcome model
model_y = RandomForestRegressor(
    n_estimators=100,
    min_samples_leaf=10,
    random_state=42
)


# Treatment model
# Treatment is binary, so use Classifier
model_t = RandomForestClassifier(
    n_estimators=100,
    min_samples_leaf=10,
    random_state=42
)


# ==========================================
# 6. ECONML DOUBLE MACHINE LEARNING
# ==========================================

dml = LinearDML(
    model_y=model_y,
    model_t=model_t,
    discrete_treatment=True,
    random_state=42
)


# ==========================================
# 7. TRAIN MODEL
# ==========================================

print("\nTraining EconML Double Machine Learning model...")

dml.fit(
    Y,
    T,
    X=X
)

print("DML model trained successfully!")


# ==========================================
# 8. ESTIMATE INDIVIDUAL TREATMENT EFFECT
# ==========================================

ite = dml.effect(X)


# ==========================================
# 9. CREATE RESULTS TABLE
# ==========================================

results = pd.DataFrame({
    "customer_id": df["customer_id"],
    "treatment": df["treatment"],
    "purchased": df["purchased"],
    "ITE": ite
})


# ==========================================
# 10. DISPLAY RESULTS
# ==========================================

print("\nIndividual Treatment Effects:")
print(results.head(10).to_string(index=False))


# ==========================================
# 11. AVERAGE TREATMENT EFFECT
# ==========================================

ate = ite.mean()

print("\nAverage Treatment Effect:")
print(ate)

print("\nAverage Treatment Effect (%):")
print(ate * 100)


# ==========================================
# 12. SAVE RESULTS
# ==========================================

results.to_csv(
    "data/ite_results.csv",
    index=False
)

print("\nITE results saved successfully!")
print("File: data/ite_results.csv")