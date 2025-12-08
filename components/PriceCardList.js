// src/components/PriceCardList.js
import React from "react";

function PriceCardList({ data, showAllDoses, onOpenReport }) {
  if (!data || data.length === 0) {
    return (
      <div className="no-data-card">
        <p>找不到符合的資料...</p>
      </div>
    );
  }

  const renderPriceItem = (dose, price) => {
    if (!price || price <= 0) return null;
    return (
      <div className="price-item">
        <span className="dose-label">{dose}</span>
        <span className="price-value">${price}</span>
      </div>
    );
  };

  return (
    <div className="card-list">
      {data.map((row) => (
        <div className="clinic-card" key={row.id}>
          {/* Header */}
          <div className="clinic-header">
            <div className="clinic-name">{row.clinic}</div>
            <div className="clinic-meta">
              {row.city} {row.district && `· ${row.district}`} ·{" "}
              {row.type === "hospital"
                ? "醫院"
                : row.type === "pharmacy"
                ? "藥局"
                : "診所"}
            </div>
          </div>

          {/* Prices Grid - 結構改為 Grid */}
          <div className="clinic-prices-grid">
            {showAllDoses ? (
              <>
                {renderPriceItem("2.5mg", row.price2_5mg)}
                {renderPriceItem("5mg", row.price5mg)}
                {renderPriceItem("7.5mg", row.price7_5mg)}
                {renderPriceItem("10mg", row.price10mg)}
                {renderPriceItem("12.5mg", row.price12_5mg)}
                {renderPriceItem("15mg", row.price15mg)}
              </>
            ) : (
              <>
                {renderPriceItem("5mg", row.price5mg)}
                {renderPriceItem("10mg", row.price10mg)}
              </>
            )}
          </div>

          {/* Notes */}
          {row.note && (
            <div className="clinic-note">
              <span className="note-icon">📝</span> {row.note}
            </div>
          )}

          {/* Footer */}
          <div className="clinic-footer">
            <div className="updated-date">
              {row.last_updated ? `更新於: ${row.last_updated}` : ""}
            </div>

            <button
              className="clinic-edit-btn"
              onClick={() => onOpenReport(row)}
            >
              <span className="edit-icon">✎</span> 協助更新
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PriceCardList;
