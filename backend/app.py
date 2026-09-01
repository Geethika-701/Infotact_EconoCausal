from flask import Flask, jsonify
from flask_cors import CORS

import pandas as pd
import numpy as np


# ==========================================
# FLASK APP
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# HOME
# ==========================================

@app.route("/")
def home():

    return "EconoCausal API is running successfully!"


# ==========================================
# RESULTS API
# ==========================================

@app.route("/api/results")
def get_results():

    try:

        df = pd.read_csv(
            "data/ite_results.csv"
        )

        return jsonify({

            "customers":
                int(len(df)),

            "average_treatment_effect":
                float(df["ITE"].mean()),

            "max_ite":
                float(df["ITE"].max()),

            "min_ite":
                float(df["ITE"].min())

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# TOP CUSTOMERS API
# ==========================================

@app.route("/api/top-customers")
def get_top_customers():

    try:

        df = pd.read_csv(
            "data/ite_results.csv"
        )

        df = df.sort_values(

            by="ITE",

            ascending=False

        ).head(10)

        return jsonify(
            df.to_dict(
                orient="records"
            )
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# UPLIFT DATA API
# ==========================================

@app.route("/api/uplift")
def get_uplift():

    try:

        df = pd.read_csv(
            "data/uplift_results.csv"
        )

        return jsonify(
            df.to_dict(
                orient="records"
            )
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# QINI DATA API
# ==========================================

@app.route("/api/qini")
def get_qini():

    try:

        df = pd.read_csv(
            "data/uplift_results.csv"
        )

        # --------------------------------------
        # REQUIRED COLUMNS
        # --------------------------------------

        required_columns = [

            "ITE",
            "treatment",
            "purchased"

        ]

        for column in required_columns:

            if column not in df.columns:

                return jsonify({

                    "error":
                        f"{column} column missing"

                }), 400


        # --------------------------------------
        # SORT BY ITE
        # --------------------------------------

        df = df.sort_values(

            by="ITE",

            ascending=False

        ).reset_index(drop=True)


        # --------------------------------------
        # CONVERT TO NUMPY
        # --------------------------------------

        treatment = (

            df["treatment"]

            .astype(int)

            .to_numpy()

        )

        outcome = (

            df["purchased"]

            .astype(float)

            .to_numpy()

        )


        # --------------------------------------
        # NUMBER OF CUSTOMERS
        # --------------------------------------

        n = len(df)


        # --------------------------------------
        # TREATED / CONTROL
        # --------------------------------------

        treated = treatment == 1

        control = treatment == 0


        # --------------------------------------
        # CUMULATIVE COUNTS
        # --------------------------------------

        cumulative_treatment = np.cumsum(
            treated
        )

        cumulative_control = np.cumsum(
            control
        )


        # --------------------------------------
        # CUMULATIVE OUTCOMES
        # --------------------------------------

        cumulative_treated_outcome = np.cumsum(

            outcome * treated

        )

        cumulative_control_outcome = np.cumsum(

            outcome * control

        )


        # --------------------------------------
        # TREATMENT RATE
        # --------------------------------------

        treated_rate = np.divide(

            cumulative_treated_outcome,

            cumulative_treatment,

            out=np.zeros(
                n,
                dtype=float
            ),

            where=cumulative_treatment != 0

        )


        # --------------------------------------
        # CONTROL RATE
        # --------------------------------------

        control_rate = np.divide(

            cumulative_control_outcome,

            cumulative_control,

            out=np.zeros(
                n,
                dtype=float
            ),

            where=cumulative_control != 0

        )


        # --------------------------------------
        # UPLIFT
        # --------------------------------------

        uplift = (

            treated_rate -
            control_rate

        )


        # --------------------------------------
        # QINI
        # --------------------------------------

        treatment_control_ratio = np.divide(

            cumulative_treatment,

            cumulative_control,

            out=np.zeros(
                n,
                dtype=float
            ),

            where=cumulative_control != 0

        )


        qini = (

            cumulative_treated_outcome

            -

            (
                cumulative_control_outcome
                *
                treatment_control_ratio
            )

        )


        # --------------------------------------
        # POPULATION %
        # --------------------------------------

        population = (

            np.arange(
                1,
                n + 1
            )

            /

            n

            *

            100

        )


        # --------------------------------------
        # RANDOM BASELINE
        # --------------------------------------

        final_qini = float(
            qini[-1]
        )


        random_line = (

            final_qini

            *

            np.arange(
                1,
                n + 1
            )

            /

            n

        )


        # --------------------------------------
        # RETURN
        # --------------------------------------

        return jsonify({

            "population":
                population.tolist(),

            "uplift":
                uplift.tolist(),

            "qini":
                qini.tolist(),

            "random":
                random_line.tolist(),

            "final_qini":
                final_qini

        })


    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    app.run(

        debug=True,

        port=5000

    )