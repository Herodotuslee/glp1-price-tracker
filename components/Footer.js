// src/components/Footer.js
import React from "react";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Donate Section - Styled as a Pinned Card */}
        <div className="footer-donate-card">
          {/* Tape Decoration */}
          <div className="footer-tape"></div>

          <h3 className="footer-donate-title">
            <span className="icon">🎁</span> 小額贊助
          </h3>
          <p className="footer-donate-text">
            這個網站目前沒有廣告、沒有業配。如果這個網站有幫到你。
            歡迎請我喝杯咖啡，讓我有動力持續更新價格與功能！
          </p>
          <a
            href="https://buymeacoffee.com/holaalbertc"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-donate-button"
          >
            ☕ 請我喝杯咖啡
          </a>

          <p className="footer-donate-note">
            每一杯咖啡，都是開發的一小步。真的非常感謝你的支持！
          </p>
        </div>

        {/* About Section */}
        <div className="footer-main">
          <h2 className="footer-title">
            <span className="icon">🍃</span> 關於這個網站
          </h2>
          <p className="footer-text">
            我第一隻去醫美買 5 mg 猛健樂花了 15,000 元，也幾乎沒有衛教。
            後來聽說朋友付到 32,000 元，才發現資訊落差造成的價差極大。
            於是決定把全台診所與醫療院所的價格集中整理起來，讓大家可以更快找到合理的價格與適合的醫師。
            希望健康的體態是每個台灣人都能追求的權利。
          </p>
          <div className="footer-disclaimer-box">
            <p className="footer-text-sub">
              ⚠️
              本網站內容由站長整理，僅供一般資訊參考，不構成醫療診斷或治療建議；價格資訊來自網友回報，僅供參考。
              任何用藥或醫療決策，請務必諮詢合格醫師；如本站內容與醫師建議不符，以醫師指示為準。
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-bottom-text">
          © {new Date().getFullYear()} 台灣猛健樂資訊網 · Made by Island
          Representative
        </span>
      </div>
    </footer>
  );
}

export default Footer;
