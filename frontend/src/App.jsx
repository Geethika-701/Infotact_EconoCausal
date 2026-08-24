import React, { useState } from "react";
import "./App.css";

function App() {
  const [budget, setBudget] = useState(4000);
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="logo">EC</div>
          <div>
            <h1>EconoCausal</h1>
            <p>Dynamic Pricing via Double Machine Learning</p>
          </div>
        </div>

        <nav>
          <a className="active">Dashboard</a>
          <a>Results</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div>
          <span className="badge">CAUSAL AI PLATFORM</span>
          <h2>Dynamic Pricing &amp; <span>Causal Analytics</span></h2>
          <p>
            Optimize your marketing decisions with machine learning
            and causal inference.
          </p>
        </div>

        <div className="hero-icon">
          📈
        </div>
      </section>

      {/* Main Content */}
      <main className="dashboard">

        {/* Upload Card */}
        <section className="card upload-card">
          <div className="card-title">
            <div className="title-icon blue">📁</div>
            <div>
              <h3>Historical Campaign Data</h3>
              <p>Upload your campaign dataset to begin analysis</p>
            </div>
          </div>

          <label className="upload-box">
            <input
              type="file"
              accept=".csv"
              onChange={handleFile}
            />

            <div className="upload-icon">☁️</div>

            <strong>
              Drag &amp; Drop CSV here
            </strong>

            <span>or <b>Browse Files</b></span>

            {fileName ? (
              <div className="file-selected">
                ✓ {fileName}
              </div>
            ) : (
              <div className="sample-file">
                ✓ retail_campaign.csv &nbsp; • &nbsp; 1,250 records
              </div>
            )}
          </label>
        </section>

        {/* Budget Card */}
        <section className="card budget-card">
          <div className="card-title">
            <div className="title-icon green">💰</div>
            <div>
              <h3>Budget Constraints</h3>
              <p>Set the maximum marketing budget</p>
            </div>
          </div>

          <div className="budget-value">
            <span>Maximum Marketing Budget</span>
            <strong>${budget.toLocaleString()}</strong>
          </div>

          <input
            className="budget-slider"
            type="range"
            min="1000"
            max="10000"
            step="250"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />

          <div className="range-labels">
            <span>$1,000</span>
            <span>$10,000</span>
          </div>

          <div className="current-budget">
            <span>Current Budget</span>
            <strong>${budget.toLocaleString()}</strong>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="kpi-grid">

          <div className="kpi-card sales">
            <div className="kpi-top">
              <span className="kpi-icon">📊</span>
              <span className="trend">↗ 8.2%</span>
            </div>

            <p>Total Sales</p>
            <h3>$24.5K</h3>
            <small>Historical campaign sales</small>
          </div>

          <div className="kpi-card uplift">
            <div className="kpi-top">
              <span className="kpi-icon">🎯</span>
              <span className="trend">↗ 5.6%</span>
            </div>

            <p>Expected Uplift</p>
            <h3>+18.4%</h3>
            <small>Estimated causal uplift</small>
          </div>

          <div className="kpi-card budget">
            <div className="kpi-top">
              <span className="kpi-icon">💰</span>
              <span className="trend">Optimal</span>
            </div>

            <p>Optimal Budget</p>
            <h3>$4,250</h3>
            <small>Recommended allocation</small>
          </div>

          <div className="kpi-card effect">
            <div className="kpi-top">
              <span className="kpi-icon">📈</span>
              <span className="trend">Strong</span>
            </div>

            <p>Causal Effect</p>
            <h3>+12.7%</h3>
            <small>Estimated treatment effect</small>
          </div>

        </section>

        {/* Process */}
        <section className="process-card">

          <div className="process-header">
            <div>
              <h3>Analysis Workflow</h3>
              <p>Follow these steps to generate your pricing strategy</p>
            </div>

            <button className="run-button">
              🚀 Run Analysis
            </button>
          </div>

          <div className="steps">

            <div className="step completed">
              <div className="step-number">1</div>
              <div>
                <strong>Upload</strong>
                <span>Campaign Data</span>
              </div>
            </div>

            <div className="line"></div>

            <div className="step active">
              <div className="step-number">2</div>
              <div>
                <strong>Budget</strong>
                <span>Set Constraints</span>
              </div>
            </div>

            <div className="line"></div>

            <div className="step">
              <div className="step-number">3</div>
              <div>
                <strong>Analyze</strong>
                <span>Run DML Model</span>
              </div>
            </div>

            <div className="line"></div>

            <div className="step">
              <div className="step-number">4</div>
              <div>
                <strong>Price</strong>
                <span>Optimize Pricing</span>
              </div>
            </div>

            <div className="line"></div>

            <div className="step">
              <div className="step-number">5</div>
              <div>
                <strong>Results</strong>
                <span>View Insights</span>
              </div>
            </div>

          </div>
        </section>

        {/* Bottom insight cards */}
        <section className="insights">

          <div className="insight-card">
            <div className="insight-icon purple">🧠</div>
            <div>
              <h4>Double Machine Learning</h4>
              <p>
                Estimate reliable causal effects while controlling
                for confounding variables.
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon orange">⚡</div>
            <div>
              <h4>Smart Optimization</h4>
              <p>
                Find the pricing strategy that maximizes expected
                campaign returns.
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon teal">📊</div>
            <div>
              <h4>Actionable Results</h4>
              <p>
                Turn causal insights into practical marketing decisions.
              </p>
            </div>
          </div>

        </section>

      </main>

      <footer>
        <p>© 2026 EconoCausal • Dynamic Pricing &amp; Causal Analytics</p>
      </footer>

    </div>
  );
}

export default App;