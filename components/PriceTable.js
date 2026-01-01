// src/components/PriceTable.js
import React, { useState } from "react";
import ClinicDetailModal from "@/components/ClinicDetailModal";
import { Info } from "lucide-react";

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
                <th>備註</th>
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
                      <span className="clinic-name-text">{row.clinic}</span>

                      <button
                        type="button"
                        className="clinic-info-btn"
                        onClick={() => openDetailByRow(row)}
                        aria-label="查看診所詳細資訊"
                        title="查看詳情"
                      >
                        <Info size={16} strokeWidth={2} />
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
