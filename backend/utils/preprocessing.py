import pandas as pd
from pathlib import Path


# Locate the project data folder
DATA_PATH = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "economic_index.csv"
)


def load_data():
    """Load the economic index dataset."""

    df = pd.read_csv(DATA_PATH)

    return df


def preprocess_data(df):
    """Clean and prepare the dataset."""

    # Remove unnecessary index column
    if "Unnamed: 0" in df.columns:
        df = df.drop(columns=["Unnamed: 0"])

    # Create a proper date column
    df["date"] = pd.to_datetime(
        df["year"].astype(str)
        + "-"
        + df["month"].astype(str)
        + "-01"
    )

    # Sort chronologically
    df = df.sort_values("date").reset_index(drop=True)

    return df


if __name__ == "__main__":

    data = load_data()

    print("Original data:")
    print(data.head())

    processed_data = preprocess_data(data)

    print("\nProcessed data:")
    print(processed_data.head())

    print("\nDataset shape:")
    print(processed_data.shape)

    print("\nMissing values:")
    print(processed_data.isnull().sum())