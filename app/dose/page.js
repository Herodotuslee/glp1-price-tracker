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
  const [dose, setDose] = useState(""); // mg (number or "")
  const [clicks, setClicks] = useState(null);

  // Two answers:
  // 1) Without residual: total = penStrength * 4
  // 2) With residual:    total = penStrength * 4 + residualMg
  const [usesNoResidual, setUsesNoResidual] = useState(null);
  const [usesWithResidual, setUsesWithResidual] = useState(null);

  const handleDoseInput = (value) => {
    const num = Number(value);

    if (num <= 0 || Number.isNaN(num)) {
      setDose("");
      setClicks(null);
      setUsesNoResidual(null);
      setUsesWithResidual(null);
      return;
    }

    setDose(num);
    setClicks(null);
    setUsesNoResidual(null);
    setUsesWithResidual(null);
  };

  // --- Residual mg as a variable (not hardcoded "penStrength * 5") ---
  // Assumption: residual roughly equals one extra full penStrength dose worth of mg.
  // If you want a fixed residual (e.g. 1 mg), change this to: const residualMg = 1;
  const residualMg = penStrength;

  const calculate = () => {
    if (!penStrength || !dose) return;

    // Clicks: (dose / penStrength) * 60
    const rawClicks = (dose * 60) / penStrength;

    // Total available (mg)
    const baseTotalAvailable = penStrength * 4; // no residual
    const totalAvailableWithResidual = baseTotalAvailable + residualMg; // with residual

    // Uses
    const noResidual = baseTotalAvailable / dose;
    const withResidual = totalAvailableWithResidual / dose;

    setClicks(rawClicks);
    setUsesNoResidual(noResidual);
    setUsesWithResidual(withResidual);
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
                  setUsesNoResidual(null);
                  setUsesWithResidual(null);
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
              {/* Clicks */}
              <div className="result-box primary">
                <p className="result-label">請轉動筆身</p>
                <div className="result-value">
                  {formatNumber(clicks)} <span className="result-unit">格</span>
                </div>
              </div>

              {/* Decimal warning */}
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

              {/* Uses (two answers) */}
              <div className="result-box secondary">
                一支全新的 {penStrength} mg 筆<br />
                估計可施打{" "}
                <span className="highlight-text">
                  {formatNumber(usesNoResidual)}
                </span>{" "}
                次 {dose} mg
                <br />
                若考量殘劑（約 +一次{formatNumber(residualMg)}{" "}
                mg的量），估計可施打{" "}
                <span className="highlight-text">
                  {formatNumber(usesWithResidual)}
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
          {text.expiredWarning}
        </div>

        <div
          className="info-banner warning-block"
          style={{
            marginTop: "12px",
            maxWidth: "420px",
            margin: "12px auto 0",
            backgroundColor: "#fffdf0", // Light cream to distinguish from red warning if needed, or keep same class
            border: "2px solid var(--ac-orange)",
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: "4px", color: "var(--ac-brown-dark)" }}>
            ⚠️ 關於殘劑抽取
          </div>
          <div style={{ fontSize: "14px", lineHeight: "1.6", color: "#555" }}>
            若使用胰島素空針抽取殘劑，需特別注意施打深度。若針頭刺入過深（誤入肌肉層），可能會影響藥物吸收與療效。專業醫護較能精準掌握皮下注射的位置，因此若情況允許，建議請專業醫護人員協助施打會比較安全喔！
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoseCalculatorPage;
