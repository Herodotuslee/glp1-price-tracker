// src/components/PriceTable.js
import React, { useState } from "react";
import ClinicDetailModal from "@/components/ClinicDetailModal";

function formatDistrict(district) {
  if (!district) return "";
  if (district.length === 3 && district.endsWith("區")) {
    return district.slice(0, 2);
  }
  return district;
}

function formatLastUpdated(value) {
  if (!value) return "";
  return value.slice(0, 10);
}

function typeLabel(type) {
  if (type === "hospital") return "醫院";
  if (type === "pharmacy") return "藥局";
  if (type === "medical_aesthetic") return "醫美";
  return "診所";
}

function PriceTable({ data, showAllDoses, onOpenReport }) {
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

  if (!data || data.length === 0) {
    return (
      <div className="table-card">
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "var(--ac-brown)",
          }}
        >
          沒有找到符合的資料...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="table-card">
        <div className="table-scroll">
          <table className="price-table">
            <thead>
              <tr>
                <th>城市</th>
                <th>地區</th>
                <th>名稱</th>
                <th>類型</th>
                {showAllDoses ? (
                  <>
                    <th>2.5mg</th>
                    <th>5mg</th>
                    <th>7.5mg</th>
                    <th>10mg</th>
                    <th>12.5mg</th>
                    <th>15mg</th>
                  </>
                ) : (
                  <>
                    <th>5mg</th>
                    <th>10mg</th>
                  </>
                  )}
               
                <th>最新情報</th>
                 <th>歷史情報</th>
                <th>協助更新</th>
                <th>更新日期</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td className="col-city">{row.city}</td>

                  <td className="col-district">
                    {formatDistrict(row.district)}
                  </td>

                  <td
                    className="col-clinic"
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: 1.4,
                    }}
                  >
                    <span className="clinic-name-cell">
                      <button
                        type="button"
                        className="clinic-name-text clinic-name-clickable"
                        onClick={() => openDetailByRow(row)}
                        aria-label={`查看 ${row.clinic} 的歷史價格與備註`}
                      >
                        {row.clinic}
                      </button>
                    </span>
                  </td>

                  <td className="col-type">{typeLabel(row.type)}</td>

                  {showAllDoses ? (
                    <>
                      <td className="price-value">{row.price2_5mg || "-"}</td>
                      <td className="price-value">{row.price5mg || "-"}</td>
                      <td className="price-value">{row.price7_5mg || "-"}</td>
                      <td className="price-value">{row.price10mg || "-"}</td>
                      <td className="price-value">{row.price12_5mg || "-"}</td>
                      <td className="price-value">{row.price15mg || "-"}</td>
                    </>
                  ) : (
                    <>
                      <td className="col-price-highlight price-value">
                        {row.price5mg || "-"}
                      </td>
                      <td className="col-price-highlight price-value">
                        {row.price10mg || "-"}
                      </td>
                    </>
                  )}

                  <td className="col-note">{row.note || ""}</td>
                  <td>
                    <button
                      type="button"
                      className="clinic-info-btn acnh-style"
                      onClick={() => openDetailByRow(row)}
                      aria-label="查看診所詳細資訊"
                      title="查看詳情"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                      </svg>
                      <span className="btn-text">查看詳情</span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="report-icon-btn"
                      onClick={() => onOpenReport?.(row)}
                      title="協助更新價格"
                      aria-label="協助更新價格"
                    >
                      ✎
                    </button>
                  </td>

                  <td className="col-updated">
                    {row.last_updated
                      ? formatLastUpdated(row.last_updated)
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ClinicDetailModal
        open={detailOpen}
        clinicId={detailClinicId}
        onClose={closeDetail}
      />
    </>
  );
}

export default PriceTable;
