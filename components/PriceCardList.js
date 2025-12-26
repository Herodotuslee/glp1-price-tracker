// src/components/PriceCardList.js
import React, { useState } from "react";
import ClinicDetailModal from "@/components/ClinicDetailModal";
import { Info } from "lucide-react";

function PriceCardList({ data, showAllDoses, onOpenReport }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailClinicId, setDetailClinicId] = useState(null);

  const openDetailByRow = (row) => {
    setDetailClinicId(row?.id || null);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailClinicId(null);
  };

  const typeLabel = (type) => {
    if (type === "hospital") return "醫院";
    if (type === "pharmacy") return "藥局";
    if (type === "medical_aesthetic") return "醫美";
    return "診所";
  };

  const renderPriceItem = (dose, price) => {
    if (!price || price <= 0) return null;
    return (
      <div className="price-item">
        <span className="dose-label">{dose}</span>
        <span className="price-value">${price}</span>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="no-data-card">
        <p>找不到符合的資料...</p>
      </div>
    );
  }

  return (
    <>
      <div className="card-list">
        {data.map((row) => (
          <div className="clinic-card" key={row.id}>
            {/* Header */}
            <div className="clinic-header">
              <div>
                <div className="clinic-name">{row.clinic}</div>
                <div className="clinic-meta">
                  {row.city} {row.district && `· ${row.district}`} ·{" "}
                  {typeLabel(row.type)}
                </div>
              </div>

              {/* Detail icon button (clear affordance, minimal UI) */}
              <button
                type="button"
                className="clinic-info-btn"
                onClick={() => openDetailByRow(row)}
                aria-label="查看診所詳細資訊"
                title="查看詳情"
              >
                <Info size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Prices */}
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

            {/* Notes (current note from main table) */}
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
                type="button"
                className="clinic-edit-btn"
                onClick={() => onOpenReport?.(row)}
              >
                <span className="edit-icon">✎</span> 協助更新
              </button>
            </div>
          </div>
        ))}
      </div>

      <ClinicDetailModal
        open={detailOpen}
        clinicId={detailClinicId}
        onClose={closeDetail}
      />
    </>
  );
}

export default PriceCardList;
