"use client";
import React from "react";
import healthSections from "../../data/healthSections.json";

function HealthPage() {
  // Helper to determine style class based on index
  const getSectionClass = (index) => {
    if (index === 0) return "theme-orange"; // Main Quest
    if (index === 1) return "theme-blue"; // Long-term
    if (index === 2) return "theme-purple"; // Advanced
    return "theme-general"; // Others
  };

  // Helper for Section Icons
  const getSectionIcon = (index) => {
    if (index === 0) return "🎒";
    if (index === 1) return "✈️";
    if (index === 2) return "🔮";
    return "📋";
  };

  return (
    <div className="price-page-root">
      <div className="price-page-inner">
        {/* --- Header --- */}
        <header className="page-header">
          <h1 className="page-title">
            <span className="title-icon">🍎</span> 健康任務指南
          </h1>
          <p className="page-subtitle-text">
            這裡整理了島民生活的健康任務。
            <br />
            完成這些挑戰，讓你的減重旅程更順利喔！
          </p>
        </header>

        {/* --- Warning Banner --- */}
        <div className="info-banner warning-block">
          <span className="icon">⚠️</span>
          <strong>狸克提醒：</strong>{" "}
          以下內容僅供參考，若有特殊疾病或需求，請務必聽從醫生與營養師的專業指示
          HOO！
        </div>

        {/* --- Sections Loop --- */}
        {healthSections.map((section, index) => {
          const themeClass = getSectionClass(index);
          const icon = getSectionIcon(index);

          return (
            <section
              key={section.title}
              className={`health-section ${themeClass}`}
            >
              {/* Section Header (Looks like a Nook Miles Card Header) */}
              <div className="health-section-header">
                <span className="section-icon">{icon}</span>
                <h2 className="section-title">{section.title}</h2>
              </div>

              {/* Task Items (Accordions) */}
              <div className="health-tasks-list">
                {section.items.map((item, idx) => (
                  <details key={idx} className="task-card">
                    <summary className="task-summary">
                      <span className="task-bullet">📌</span>
                      {item.q}
                    </summary>
                    <div className="task-content">
                      <p className="task-answer">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}

        {/* --- Footer Disclaimer --- */}
        <div className="health-footer-note">
          <p>
            📝 本人非營養學專業，以上內容多為一般健康概念整理。
            若有慢性病、正在用藥或特殊狀況，請務必與醫師、營養師討論後再做調整。
          </p>
        </div>
      </div>
    </div>
  );
}

export default HealthPage;
