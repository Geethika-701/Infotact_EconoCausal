import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import "./App.css";


const API = "http://127.0.0.1:5000";


function App() {

  // ==========================================
  // STATE
  // ==========================================

  const [budget, setBudget] =
    useState(3250);

  const [fileName, setFileName] =
    useState("retail_campaign.csv");

  const [results, setResults] =
    useState(null);

  const [topCustomers, setTopCustomers] =
    useState([]);

  const [upliftData, setUpliftData] =
    useState([]);

  const [qiniData, setQiniData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [analysisRunning, setAnalysisRunning] =
    useState(false);

  const [analysisComplete, setAnalysisComplete] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const loadDashboardData = async () => {

    try {

      setLoading(true);

      setError("");


      const [

        resultsResponse,

        customersResponse,

        upliftResponse,

        qiniResponse

      ] = await Promise.all([

        fetch(`${API}/api/results`),

        fetch(`${API}/api/top-customers`),

        fetch(`${API}/api/uplift`),

        fetch(`${API}/api/qini`)

      ]);


      if (!resultsResponse.ok) {

        throw new Error(
          "Could not load results"
        );

      }


      if (!customersResponse.ok) {

        throw new Error(
          "Could not load customers"
        );

      }


      const resultsData =
        await resultsResponse.json();


      const customersData =
        await customersResponse.json();


      let upliftResult = [];


      if (upliftResponse.ok) {

        upliftResult =
          await upliftResponse.json();

      }


      let qiniResult = null;


      if (qiniResponse.ok) {

        qiniResult =
          await qiniResponse.json();

      }


      setResults(resultsData);

      setTopCustomers(customersData);

      setUpliftData(upliftResult);

      setQiniData(qiniResult);

      setAnalysisComplete(true);

    }

    catch (err) {

      console.error(err);

      setError(

        "Unable to connect to backend. " +
        "Make sure Flask is running on port 5000."

      );

    }

    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {

    loadDashboardData();

  }, []);


  // ==========================================
  // FILE UPLOAD
  // ==========================================

  const handleFile = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setFileName(
        file.name
      );

    }

  };


  // ==========================================
  // RUN ANALYSIS
  // ==========================================

  const runAnalysis = async () => {

    setAnalysisRunning(true);

    setError("");


    await new Promise(

      (resolve) =>
        setTimeout(resolve, 1000)

    );


    await loadDashboardData();


    setAnalysisRunning(false);

    setAnalysisComplete(true);

  };


  // ==========================================
  // FORMAT PERCENTAGE
  // ==========================================

  const formatPercentage = (value) => {

    if (
      value === undefined ||
      value === null ||
      Number.isNaN(Number(value))
    ) {

      return "0.00%";

    }


    return `${Number(value).toFixed(2)}%`;

  };


  // ==========================================
  // ITE GRAPH DATA
  // ==========================================

  const iteValues = topCustomers

    .map(
      (customer) =>
        Number(customer.ITE)
    )

    .filter(
      (value) =>
        !Number.isNaN(value)
    );


  let graphValues = iteValues;


  if (upliftData.length > 0) {

    const possibleITE =
      upliftData

        .map(
          (row) =>
            Number(row.ITE)
        )

        .filter(
          (value) =>
            !Number.isNaN(value)
        );


    if (
      possibleITE.length > 0
    ) {

      graphValues =
        possibleITE;

    }

  }


  // ==========================================
  // CUSTOMER ID
  // ==========================================

  const getCustomerId = (
    customer,
    index
  ) => {

    return (

      customer.Customer_ID ??

      customer.customer_id ??

      customer.CustomerID ??

      customer.customerId ??

      customer.id ??

      index + 1

    );

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="app">


      {/* ====================================
          HEADER
      ==================================== */}

      <header className="header">

        <div className="brand">

          <div className="logo">
            EC
          </div>

          <div>

            <h1>
              EconoCausal
            </h1>

            <p>
              Dynamic Pricing via Double Machine Learning
            </p>

          </div>

        </div>


        <nav>

          <a className="active">
            Dashboard
          </a>

          <a>
            Results
          </a>

        </nav>

      </header>


      {/* ====================================
          HERO
      ==================================== */}

      <section className="hero">

        <div>

          <span className="badge">
            CAUSAL AI PLATFORM
          </span>


          <h2>

            Dynamic Pricing &amp;

            <span>
              {" "}Causal Analytics
            </span>

          </h2>


          <p>

            Optimize your marketing decisions
            with machine learning and causal
            inference.

          </p>

        </div>


        <div className="hero-icon">
          📈
        </div>

      </section>


      <main className="dashboard">


        {/* ====================================
            ERROR
        ==================================== */}

        {error && (

          <div
            style={{
              background: "#fff1f2",
              color: "#be123c",
              border:
                "1px solid #fecdd3",
              padding: "14px 18px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontSize: "13px",
              fontWeight: "600"
            }}
          >

            ⚠️ {error}

          </div>

        )}


        {/* ====================================
            UPLOAD
        ==================================== */}

        <section className="card upload-card">

          <div className="card-title">

            <div className="title-icon blue">
              📁
            </div>

            <div>

              <h3>
                Historical Campaign Data
              </h3>

              <p>
                Upload your campaign dataset to begin analysis
              </p>

            </div>

          </div>


          <label className="upload-box">

            <input
              type="file"
              accept=".csv"
              onChange={handleFile}
            />


            <div className="upload-icon">
              ☁️
            </div>


            <strong>
              Drag &amp; Drop CSV here
            </strong>


            <span>
              or <b>Browse Files</b>
            </span>


            <div className="file-selected">

              ✓ {fileName}

            </div>

          </label>

        </section>


        {/* ====================================
            BUDGET
        ==================================== */}

        <section className="card budget-card">

          <div className="card-title">

            <div className="title-icon green">
              💰
            </div>

            <div>

              <h3>
                Budget Constraints
              </h3>

              <p>
                Set the maximum marketing budget
              </p>

            </div>

          </div>


          <div className="budget-value">

            <span>
              Maximum Marketing Budget
            </span>

            <strong>
              ${budget.toLocaleString()}
            </strong>

          </div>


          <input
            className="budget-slider"
            type="range"
            min="1000"
            max="10000"
            step="250"
            value={budget}
            onChange={(e) =>
              setBudget(
                Number(e.target.value)
              )
            }
          />


          <div className="range-labels">

            <span>
              $1,000
            </span>

            <span>
              $10,000
            </span>

          </div>


          <div className="current-budget">

            <span>
              Current Budget
            </span>

            <strong>
              ${budget.toLocaleString()}
            </strong>

          </div>

        </section>


        {/* ====================================
            KPI CARDS
        ==================================== */}

        <section className="kpi-grid">


          <div className="kpi-card sales">

            <div className="kpi-top">

              <span className="kpi-icon">
                👥
              </span>

              <span className="trend">
                Dataset
              </span>

            </div>


            <p>
              Customers
            </p>


            <h3>

              {loading
                ? "..."
                : results?.customers?.toLocaleString() ??
                  "0"}

            </h3>


            <small>
              Historical campaign records
            </small>

          </div>


          <div className="kpi-card uplift">

            <div className="kpi-top">

              <span className="kpi-icon">
                🎯
              </span>

              <span className="trend">
                ITE
              </span>

            </div>


            <p>
              Average Treatment Effect
            </p>


            <h3>

              {loading
                ? "..."
                : formatPercentage(
                    results?.average_treatment_effect
                  )}

            </h3>


            <small>
              Average individual treatment effect
            </small>

          </div>


          <div className="kpi-card budget">

            <div className="kpi-top">

              <span className="kpi-icon">
                📈
              </span>

              <span className="trend">
                Maximum
              </span>

            </div>


            <p>
              Maximum ITE
            </p>


            <h3>

              {loading
                ? "..."
                : formatPercentage(
                    results?.max_ite
                  )}

            </h3>


            <small>
              Highest estimated treatment effect
            </small>

          </div>


          <div className="kpi-card effect">

            <div className="kpi-top">

              <span className="kpi-icon">
                📉
              </span>

              <span className="trend">
                Minimum
              </span>

            </div>


            <p>
              Minimum ITE
            </p>


            <h3>

              {loading
                ? "..."
                : formatPercentage(
                    results?.min_ite
                  )}

            </h3>


            <small>
              Lowest estimated treatment effect
            </small>

          </div>

        </section>


        {/* ====================================
            WORKFLOW
        ==================================== */}

        <section className="process-card">

          <div className="process-header">

            <div>

              <h3>
                Analysis Workflow
              </h3>

              <p>
                Run the Double Machine Learning causal analysis
              </p>

            </div>


            <button
              className="run-button"
              onClick={runAnalysis}
              disabled={analysisRunning}
            >

              {analysisRunning

                ? "⏳ Running Analysis..."

                : "🚀 Run Analysis"

              }

            </button>

          </div>


          {analysisComplete &&
            !analysisRunning && (

              <div
                style={{
                  marginTop: "15px",
                  padding: "10px 14px",
                  background:
                    "#ecfdf5",
                  color: "#07834f",
                  borderRadius: "9px",
                  fontSize: "12px",
                  fontWeight: "700"
                }}
              >

                ✓ Analysis completed successfully!

              </div>

            )}


          <div className="steps">


            <div className="step completed">

              <div className="step-number">
                ✓
              </div>

              <div>

                <strong>
                  Upload
                </strong>

                <span>
                  Campaign Data
                </span>

              </div>

            </div>


            <div className="line"></div>


            <div className="step completed">

              <div className="step-number">
                ✓
              </div>

              <div>

                <strong>
                  Budget
                </strong>

                <span>
                  Set Constraints
                </span>

              </div>

            </div>


            <div className="line"></div>


            <div className="step completed">

              <div className="step-number">
                ✓
              </div>

              <div>

                <strong>
                  Analyze
                </strong>

                <span>
                  Run DML Model
                </span>

              </div>

            </div>


            <div className="line"></div>


            <div className="step completed">

              <div className="step-number">
                ✓
              </div>

              <div>

                <strong>
                  Uplift
                </strong>

                <span>
                  Generate Curve
                </span>

              </div>

            </div>


            <div className="line"></div>


            <div className="step active">

              <div className="step-number">
                5
              </div>

              <div>

                <strong>
                  Results
                </strong>

                <span>
                  View Insights
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ====================================
            ITE GRAPH
        ==================================== */}

        <section className="card">

          <div className="card-title">

            <div
              className="title-icon"
              style={{
                background:
                  "#e8f5ff"
              }}
            >
              📊
            </div>

            <div>

              <h3>
                Individual Treatment Effect
              </h3>

              <p>
                ITE distribution across customers
              </p>

            </div>

          </div>


          {graphValues.length > 0 ? (

            <Plot

              data={[
                {
                  x: graphValues,

                  type: "histogram",

                  nbinsx: 20,

                  marker: {
                    color: "#6366f1"
                  },

                  name: "ITE"
                }
              ]}


              layout={{

                autosize: true,

                height: 420,

                margin: {
                  l: 60,
                  r: 30,
                  t: 30,
                  b: 60
                },

                paper_bgcolor:
                  "white",

                plot_bgcolor:
                  "#fafbff",

                title:
                  "ITE Distribution",

                xaxis: {
                  title:
                    "Individual Treatment Effect"
                },

                yaxis: {
                  title:
                    "Number of Customers"
                }

              }}


              config={{
                responsive: true,
                displaylogo: false
              }}


              style={{
                width: "100%"
              }}

            />

          ) : (

            <div
              style={{
                padding: "40px",
                textAlign: "center"
              }}
            >
              No ITE data available
            </div>

          )}

        </section>


        {/* ====================================
            UPLIFT CURVE
        ==================================== */}

        <section className="card">

          <div className="card-title">

            <div
              className="title-icon"
              style={{
                background:
                  "#fff0e6"
              }}
            >
              📈
            </div>

            <div>

              <h3>
                Uplift Curve
              </h3>

              <p>
                Incremental treatment effect
                across targeted customers
              </p>

            </div>

          </div>


          {qiniData ? (

            <Plot

              data={[

                {
                  x:
                    qiniData.population,

                  y:
                    qiniData.uplift,

                  type:
                    "scatter",

                  mode:
                    "lines",

                  name:
                    "Uplift Curve",

                  line: {
                    width: 3
                  }
                }

              ]}


              layout={{

                autosize: true,

                height: 420,

                margin: {
                  l: 60,
                  r: 30,
                  t: 50,
                  b: 70
                },

                paper_bgcolor:
                  "white",

                plot_bgcolor:
                  "#fafbff",

                title:
                  "Uplift Curve",

                xaxis: {
                  title:
                    "Customers Targeted (%)",

                  gridcolor:
                    "#e8ebf2"
                },

                yaxis: {
                  title:
                    "Uplift",

                  gridcolor:
                    "#e8ebf2"
                },

                hovermode:
                  "x unified"

              }}


              config={{
                responsive: true,
                displaylogo: false
              }}


              style={{
                width: "100%"
              }}

            />

          ) : (

            <div
              style={{
                padding: "40px",
                textAlign: "center"
              }}
            >
              Uplift data not available
            </div>

          )}

        </section>


        {/* ====================================
            QINI CURVE
        ==================================== */}

        <section className="card">

          <div className="card-title">

            <div
              className="title-icon"
              style={{
                background:
                  "#e9f7ef"
              }}
            >
              📊
            </div>

            <div>

              <h3>
                Qini Curve
              </h3>

              <p>
                Causal targeting performance
                versus random targeting
              </p>

            </div>

          </div>


          {qiniData ? (

            <Plot

              data={[

                {
                  x:
                    qiniData.population,

                  y:
                    qiniData.qini,

                  type:
                    "scatter",

                  mode:
                    "lines",

                  name:
                    "Qini Curve",

                  line: {
                    width: 3
                  }
                },


                {
                  x:
                    qiniData.population,

                  y:
                    qiniData.random,

                  type:
                    "scatter",

                  mode:
                    "lines",

                  name:
                    "Random Targeting",

                  line: {
                    dash:
                      "dash",

                    width: 2
                  }
                }

              ]}


              layout={{

                autosize: true,

                height: 420,

                margin: {
                  l: 60,
                  r: 30,
                  t: 50,
                  b: 80
                },

                paper_bgcolor:
                  "white",

                plot_bgcolor:
                  "#fafbff",

                title:
                  "Qini Curve vs Random Targeting",

                xaxis: {
                  title:
                    "Customers Targeted (%)",

                  gridcolor:
                    "#e8ebf2"
                },

                yaxis: {
                  title:
                    "Qini Value",

                  gridcolor:
                    "#e8ebf2"
                },

                hovermode:
                  "x unified",

                legend: {
                  orientation:
                    "h",

                  y:
                    -0.2
                }

              }}


              config={{
                responsive: true,
                displaylogo: false
              }}


              style={{
                width: "100%"
              }}

            />

          ) : (

            <div
              style={{
                padding: "40px",
                textAlign: "center"
              }}
            >
              Qini data not available
            </div>

          )}

        </section>


        {/* ====================================
            TOP CUSTOMERS
        ==================================== */}

        <section className="card">

          <div className="card-title">

            <div
              className="title-icon"
              style={{
                background:
                  "#fff7df"
              }}
            >
              🏆
            </div>

            <div>

              <h3>
                Top Customers by ITE
              </h3>

              <p>
                Customers with the highest estimated treatment effect
              </p>

            </div>

          </div>


          {topCustomers.length > 0 ? (

            <div
              style={{
                overflowX:
                  "auto"
              }}
            >

              <table
                style={{
                  width:
                    "100%",

                  borderCollapse:
                    "collapse",

                  fontSize:
                    "12px"
                }}
              >

                <thead>

                  <tr
                    style={{
                      background:
                        "#f7f8fc",

                      textAlign:
                        "left"
                    }}
                  >

                    <th
                      style={{
                        padding:
                          "12px"
                      }}
                    >
                      Rank
                    </th>

                    <th
                      style={{
                        padding:
                          "12px"
                      }}
                    >
                      Customer ID
                    </th>

                    <th
                      style={{
                        padding:
                          "12px"
                      }}
                    >
                      ITE
                    </th>

                    <th
                      style={{
                        padding:
                          "12px"
                      }}
                    >
                      Treatment
                    </th>

                    <th
                      style={{
                        padding:
                          "12px"
                      }}
                    >
                      Purchased
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {topCustomers
                    .slice(0, 10)
                    .map(
                      (
                        customer,
                        index
                      ) => (

                        <tr
                          key={index}
                          style={{
                            borderBottom:
                              "1px solid #edf0f5"
                          }}
                        >

                          <td
                            style={{
                              padding:
                                "12px",

                              fontWeight:
                                "700"
                            }}
                          >
                            #{index + 1}
                          </td>


                          <td
                            style={{
                              padding:
                                "12px"
                            }}
                          >
                            {getCustomerId(
                              customer,
                              index
                            )}
                          </td>


                          <td
                            style={{
                              padding:
                                "12px",

                              fontWeight:
                                "800",

                              color:
                                "#5146df"
                            }}
                          >

                            {formatPercentage(
                              customer.ITE
                            )}

                          </td>


                          <td
                            style={{
                              padding:
                                "12px"
                            }}
                          >

                            {customer.Treatment ??
                              customer.treatment ??
                              0}

                          </td>


                          <td
                            style={{
                              padding:
                                "12px"
                            }}
                          >

                            {customer.Purchased ??
                              customer.purchased ??
                              0}

                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>

          ) : (

            <div
              style={{
                padding:
                  "30px",

                textAlign:
                  "center",

                color:
                  "#8b93a5"
              }}
            >
              No customer data available.
            </div>

          )}

        </section>


        {/* ====================================
            INSIGHTS
        ==================================== */}

        <section className="insights">


          <div className="insight-card">

            <div className="insight-icon purple">
              🧠
            </div>

            <div>

              <h4>
                Double Machine Learning
              </h4>

              <p>
                Estimate individual treatment
                effects while controlling for
                confounding variables.
              </p>

            </div>

          </div>


          <div className="insight-card">

            <div className="insight-icon orange">
              📈
            </div>

            <div>

              <h4>
                Uplift Analysis
              </h4>

              <p>
                Identify customers who are most
                likely to benefit from marketing
                treatment.
              </p>

            </div>

          </div>


          <div className="insight-card">

            <div className="insight-icon teal">
              🎯
            </div>

            <div>

              <h4>
                Actionable Results
              </h4>

              <p>
                Use causal insights to prioritize
                customers and optimize marketing
                budget allocation.
              </p>

            </div>

          </div>


        </section>

      </main>


      {/* ====================================
          FOOTER
      ==================================== */}

      <footer>

        <p>
          © 2026 EconoCausal • Causal ML &amp; Optimization
        </p>

      </footer>


    </div>

  );

}


export default App;