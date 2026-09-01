import pandas as pd
import numpy as np

# ==========================================
# 1. LOAD DATA
# ==========================================

df = pd.read_csv("data/retail_campaign.csv")

ite_df = pd.read_csv("data/ite_results.csv")

print("Dataset loaded successfully.")
print("Number of customers:", len(df))


# ==========================================
# 2. CHECK ITE DATA
# ==========================================

if "ITE" not in ite_df.columns:
    raise ValueError(
        "ITE column not found in data/ite_results.csv"
    )

if len(df) != len(ite_df):
    raise ValueError(
        "retail_campaign.csv and ite_results.csv "
        "must contain the same number of rows."
    )


# ==========================================
# 3. ADD ITE
# ==========================================

df["ITE"] = ite_df["ITE"].to_numpy()


# ==========================================
# 4. CHECK REQUIRED COLUMNS
# ==========================================

required_columns = [
    "customer_id",
    "treatment",
    "purchased",
    "ITE"
]

for column in required_columns:

    if column not in df.columns:

        raise ValueError(
            f"Missing required column: {column}"
        )


# ==========================================
# 5. CONVERT DATA TYPES
# ==========================================

df["treatment"] = (
    pd.to_numeric(
        df["treatment"],
        errors="coerce"
    )
    .fillna(0)
    .astype(int)
)

df["purchased"] = (
    pd.to_numeric(
        df["purchased"],
        errors="coerce"
    )
    .fillna(0)
    .astype(float)
)

df["ITE"] = (
    pd.to_numeric(
        df["ITE"],
        errors="coerce"
    )
    .fillna(0)
)


# ==========================================
# 6. SORT BY ITE
# ==========================================

df = df.sort_values(
    by="ITE",
    ascending=False
).reset_index(drop=True)


# ==========================================
# 7. CUSTOMER RANK
# ==========================================

df["customers_targeted"] = np.arange(
    1,
    len(df) + 1
)


# ==========================================
# 8. TREATMENT / CONTROL
# ==========================================

treatment = df["treatment"].to_numpy()

outcome = df["purchased"].to_numpy()

treated = treatment == 1

control = treatment == 0


# ==========================================
# 9. CUMULATIVE COUNTS
# ==========================================

cum_treated = np.cumsum(treated)

cum_control = np.cumsum(control)


# ==========================================
# 10. CUMULATIVE PURCHASES
# ==========================================

cum_treated_purchases = np.cumsum(
    outcome * treated
)

cum_control_purchases = np.cumsum(
    outcome * control
)


# ==========================================
# 11. TREATED PURCHASE RATE
# ==========================================

treated_rate = np.divide(

    cum_treated_purchases,

    cum_treated,

    out=np.zeros(
        len(df),
        dtype=float
    ),

    where=cum_treated != 0
)


# ==========================================
# 12. CONTROL PURCHASE RATE
# ==========================================

control_rate = np.divide(

    cum_control_purchases,

    cum_control,

    out=np.zeros(
        len(df),
        dtype=float
    ),

    where=cum_control != 0
)


# ==========================================
# 13. UPLIFT
# ==========================================

uplift = (
    treated_rate -
    control_rate
)


# ==========================================
# 14. QINI
# ==========================================

treatment_control_ratio = np.divide(

    cum_treated,

    cum_control,

    out=np.zeros(
        len(df),
        dtype=float
    ),

    where=cum_control != 0
)


qini = (

    cum_treated_purchases

    -

    (
        cum_control_purchases
        *
        treatment_control_ratio
    )

)


# ==========================================
# 15. RANDOM BASELINE
# ==========================================

final_qini = float(qini[-1])

random_baseline = np.linspace(

    0,

    final_qini,

    len(df)

)


# ==========================================
# 16. CREATE OUTPUT DATA
# ==========================================

curve_data = pd.DataFrame({

    "customer_id":
        df["customer_id"].to_numpy(),

    "ITE":
        df["ITE"].to_numpy(),

    "treatment":
        df["treatment"].to_numpy(),

    "purchased":
        df["purchased"].to_numpy(),

    "customers_targeted":
        df["customers_targeted"].to_numpy(),

    "uplift":
        uplift,

    "qini":
        qini,

    "random_baseline":
        random_baseline

})


# ==========================================
# 17. SAVE RESULTS
# ==========================================

curve_data.to_csv(

    "data/uplift_results.csv",

    index=False

)


# ==========================================
# 18. DISPLAY RESULTS
# ==========================================

print()
print("==========================================")
print("UPLIFT ANALYSIS COMPLETED")
print("==========================================")

print()

print("Top 10 customers based on ITE:")

print(

    curve_data[
        [
            "customer_id",
            "ITE",
            "treatment",
            "purchased"
        ]
    ]
    .head(10)
    .to_string(index=False)

)

print()

print(
    "Final Qini:",
    final_qini
)

print()

print(
    "Uplift results saved successfully!"
)

print(
    "File: data/uplift_results.csv"
)