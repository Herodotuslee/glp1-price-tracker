"use client";
import React, { useState } from "react";
import text from "../../data/texts.json";

const PEN_OPTIONS = [2.5, 5, 7.5, 10, 12.5, 15];

function DoseCalculatorPage() {
  const [penStrength, setPenStrength] = useState(10); // mg
  const [dose, setDose] = useState(5); // mg
  const [clicks, setClicks] = useState(null);
  const [totalUses, setTotalUses] = useState(null);

  // Handle user input for dose
  const handleDoseInput = (value) => {
    const num = Number(value);
    if (num <= 0 || Number.isNaN(num)) {
      setDose("");
      return;
    }
    // Prevent dose from exceeding pen strength
    const safeValue = Math.min(num, penStrength);
    setDose(safeValue);
  };

  // Perform calculation
  const calculate = () => {
    if (!penStrength || !dose) return;

    // Formula: (Dose * 60) / PenStrength = Clicks
    const raw = (dose * 60) / penStrength;
    const rounded = Math.round(raw);

    // Total available mg in pen = Strength * 4 doses (standard Mounjaro pens)
    const totalAvailable = penStrength * 4;
    // Calculate how many times this specific dose can be used
    const uses = Math.floor(totalAvailable / dose);

    setClicks(rounded);
    setTotalUses(uses);
  };

  return (
    <div className="price-page-root">
      <div className="price-page-inner">
        {/* --- Main Card Container --- */}
        <div className="calculator-card">
          {/* Header */}
          <div className="calc-header">
            <h1 className="calc-title">
              <span className="calc-icon">🧮</span> 劑量計算器
            </h1>
          </div>

          {/* Input: Pen Strength */}
          <div className="input-group">
            <label className="input-label">請選擇您購買的劑型 (mg)</label>
            <div className="select-wrapper">
              <select
                value={penStrength}
                onChange={(e) => {
                  const newStrength = Number(e.target.value);
                  setPenStrength(newStrength);
                  // Reset dose if it exceeds new pen strength
                  if (dose > newStrength) setDose(newStrength);
                }}
                className="ac-input ac-select"
              >
                {PEN_OPTIONS.map((mg) => (
                  <option key={mg} value={mg}>
                    {mg} mg
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input: Desired Dose */}
          <div className="input-group">
            <label className="input-label">每次想使用的劑量 (mg)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={dose}
              onChange={(e) => handleDoseInput(e.target.value)}
              className="ac-input"
              placeholder="0"
            />
          </div>

          {/* Action Button */}
          <button onClick={calculate} className="calc-button">
            開始計算
          </button>

          {/* Results Area */}
          {clicks !== null && (
            <div className="results-container">
              {/* Primary Result: Clicks */}
              <div className="result-box primary">
                <p className="result-label">請轉動筆身</p>
                <div className="result-value">
                  {clicks} <span className="result-unit">格</span>
                </div>
              </div>

              {/* Secondary Result: Total Uses */}
              <div className="result-box secondary">
                一支全新的 {penStrength} mg 筆<br />
                預計可施打 <span className="highlight-text">
                  {totalUses}
                </span>{" "}
                次 {dose} mg
              </div>
            </div>
          )}
        </div>

        {/* --- Warning Banner --- */}
        <div
          className="info-banner warning-block"
          style={{
            marginTop: "24px",
            maxWidth: "420px",
            margin: "24px auto 0",
          }}
        >
          <span className="icon">⚠️</span> {text.expiredWarning}
        </div>
      </div>
    </div>
  );
}

export default DoseCalculatorPage;
