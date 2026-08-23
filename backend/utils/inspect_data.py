import pandas as pd
from pathlib import Path


# Project root/data folder
DATA_DIR = Path(__file__).resolve().parents[2] / "data"


def inspect_file(file_path):
    print("\n" + "=" * 60)
    print(f"FILE: {file_path.name}")
    print("=" * 60)

    try:
        # Read CSV files
        if file_path.suffix.lower() == ".csv":
            df = pd.read_csv(file_path)

        # Read Excel files
        elif file_path.suffix.lower() in [".xlsx", ".xls"]:
            df = pd.read_excel(file_path)

        else:
            print("Unsupported file type")
            return

        print("\nShape:")
        print(df.shape)

        print("\nColumns:")
        print(df.columns.tolist())

        print("\nData Types:")
        print(df.dtypes)

        print("\nMissing Values:")
        print(df.isnull().sum())

        print("\nDuplicate Rows:")
        print(df.duplicated().sum())

        print("\nFirst 5 Rows:")
        print(df.head())

        print("\nStatistical Summary:")
        print(df.describe(include="all"))

    except Exception as e:
        print(f"\nError reading {file_path.name}: {e}")


# Inspect every file in the data folder
for file in DATA_DIR.iterdir():
    if file.is_file():
        inspect_file(file)