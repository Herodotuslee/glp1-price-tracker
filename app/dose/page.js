"use client";
import React, { useState } from "react";
import text from "../../data/texts.json";

const PEN_OPTIONS = [2.5, 5, 7.5, 10, 12.5, 15];

// --- Format number: keep up to 2 decimals but remove trailing zeros ---
const formatNumber = (num) => {
  if (typeof num !== "number") return "";
  return parseFloat(num.toFixed(2)).toString();
};

function DoseCalculatorPage() {
  const [penStrength, setPenStrength] = useState(10); // mg
  const [dose, setDose] = useState(""); // mg
  const [clicks, setClicks] = useState(null);
  const [totalUses, setTotalUses] = useState(null);

  const handleDoseInput = (value) => {
    const num = Number(value);

    if (num <= 0 || Number.isNaN(num)) {
      setDose("");
      setClicks(null);
      setTotalUses(null);
      return;
    }

    setDose(num);

    setClicks(null);
    setTotalUses(null);
  };

  const calculate = () => {
    if (!penStrength || !dose) return;

    let raw = (dose * 60) / penStrength;

    const totalAvailable = penStrength * 4;
    const uses = totalAvailable / dose;

    setClicks(raw);
    setTotalUses(uses);
  };

  const getDecimalPart = (num) => {
    if (typeof num !== "number") return null;

    const frac = num - Math.floor(num);
    const rounded = Number(frac.toFixed(2));

    if (rounded <= 0 || rounded >= 1) return null;
    return rounded;
  };

  const decimalPart = clicks !== null ? getDecimalPart(clicks) : null;

  return (
    <div className="price-page-root">
      <div className="price-page-inner">
        <div className="calculator-card">
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

                  setClicks(null);
                  setTotalUses(null);
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
            />
          </div>

          {/* Action Button */}
          <button onClick={calculate} className="calc-button">
            開始計算
          </button>

          {/* Results */}
          {clicks !== null && (
            <div className="results-container">
              {/* 格數 */}
              <div className="result-box primary">
                <p className="result-label">請轉動筆身</p>
                <div className="result-value">
                  {formatNumber(clicks)} <span className="result-unit">格</span>
                </div>
              </div>

              {/* 小數格數提醒 */}
              {decimalPart !== null && (
                <div
                  className="info-banner warning-block"
                  style={{ marginTop: "16px" }}
                >
                  ⚠️ 計算結果不是整數格數。
                  <br />
                  筆身無法轉出 <strong>{formatNumber(decimalPart)} 格</strong>
                  ，請自行判斷是否要調整為整數格數。
                </div>
              )}

              {/* 次數 */}
              <div className="result-box secondary">
                一支全新的 {penStrength} mg 筆<br />
                若不包含殘劑估計可施打{" "}
                <span className="highlight-text">
                  {formatNumber(totalUses)}
                </span>{" "}
                次 {dose} mg
              </div>
            </div>
          )}
        </div>

        {/* Warning Banner */}
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
