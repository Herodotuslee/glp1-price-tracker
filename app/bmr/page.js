"use client";

import React, { useState } from "react";
import "../../styles/BmrPage.css";

function BmrPage() {
  const [gender, setGender] = useState("female");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const calculateBMR = (e) => {
    e.preventDefault();
    if (!age || !height || !weight) return;

    // Mifflin-St. Jeor Equation (Standard)
    // Men: (10 × weight) + (6.25 × height) - (5 × age) + 5
    // Women: (10 × weight) + (6.25 × height) - (5 × age) - 161

    let bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age);

    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    setResult({
      bmr: Math.round(bmr),
      bmi: (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1),
    });
  };

  return (
    <div className="bmr-page-root">
      <div className="bmr-page-inner">
        <header className="page-header">
          <h1 className="page-title">
            <span className="title-icon">🔋</span> BMR & BMI 計算機
          </h1>
          <p className="page-subtitle-text">
            輸入您的身體數值，計算基礎代謝率 (BMR) 與身體質量指數 (BMI)。
          </p>
        </header>

        <div className="bmr-container">
          <form onSubmit={calculateBMR}>
            <div className="bmr-form-group">
              <label className="bmr-label">性別</label>
              <div className="bmr-radio-group">
                <label className="bmr-radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                    className="bmr-radio-input"
                  />
                  生理男性
                </label>
                <label className="bmr-radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                    className="bmr-radio-input"
                  />
                  生理女性
                </label>
              </div>
            </div>

            <div className="bmr-row-3">
              <div className="bmr-form-group">
                <label className="bmr-label">年齡</label>
                <div className="input-suffix-group">
                  <input
                    type="number"
                    placeholder="30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="bmr-input"
                    required
                  />
                  <span className="suffix">歲</span>
                </div>
              </div>
              <div className="bmr-form-group">
                <label className="bmr-label">身高</label>
                <div className="input-suffix-group">
                  <input
                    type="number"
                    placeholder="170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="bmr-input"
                    required
                  />
                  <span className="suffix">cm</span>
                </div>
              </div>
              <div className="bmr-form-group">
                <label className="bmr-label">體重</label>
                <div className="input-suffix-group">
                  <input
                    type="number"
                    placeholder="65"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bmr-input"
                    required
                  />
                  <span className="suffix">kg</span>
                </div>
              </div>
            </div>

            <button type="submit" className="bmr-btn">
              開始計算
            </button>
          </form>

          {result && (
            <div className="bmr-result-card">
              <div className="bmr-result-title">您的基礎代謝率 (BMR)</div>
              <div className="bmr-value">
                {result.bmr.toLocaleString()}
                <span className="bmr-unit"> 大卡/天</span>
              </div>

              <div className="bmr-divider"></div>

              <div className="bmr-result-title">您的身體質量指數 (BMI)</div>
              <div className="bmr-value tdee-value">
                {result.bmi}
              </div>

              <div className="bmr-disclaimer">
                *此結果基於 Mifflin-St. Jeor 公式計算。
                <br />
                <strong>請注意：公式無法計算「肌肉量」與「體脂率」。</strong>
                <br />
                同樣體重的人，肌肉量越多，實際 BMR 會越高。因此若您有在重訓或體脂較低，此公式可能會低估您的代謝率；反之若體脂較高，則可能高估。
              </div>
            </div>
          )}
        </div>

        <section className="bmr-info-section">
          <h2 className="bmr-section-title">
            <span className="title-icon">👨‍⚕️</span> 影響 BMR 的醫學因素
          </h2>
          <div className="bmr-info-card">
            <p className="bmr-info-intro">
              根據 <strong>Cleveland Clinic</strong> 與 <strong>Mayo Clinic</strong> 指出，除了公式中的變數外，以下生理因素也會顯著影響代謝率：
            </p>
            <ul className="bmr-factor-list">
              <li>
                <strong>瘦體組織 (Muscle Mass)：</strong> <br />
                影響最大。肌肉組織消耗的熱量遠高於脂肪。肌肉量越高，靜止代謝率 (RMR) 越高。
              </li>
              <li>
                <strong>體型 (Body Size)：</strong> <br />
                體表面積越大（高大或體重較重），需消耗更多能量維持體溫與運作，因此 BMR 較高。
              </li>
              <li>
                <strong>荷爾蒙 (Hormones)：</strong> <br />
                甲狀腺素 (Thyroxin) 直接調控代謝速度。甲狀腺亢進會大幅提高 BMR，低下則會降低。
              </li>
              <li>
                <strong>健康狀況 (Health Status)：</strong> <br />
                發燒或受傷時，身體需消耗能量修復組織與對抗感染。體溫每升高 1°C，BMR 約提升 7-10%。
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BmrPage;
