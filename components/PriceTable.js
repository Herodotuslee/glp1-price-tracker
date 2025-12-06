import React from "react";

function formatLastUpdated(value) {
  if (!value) return "";
  return value.slice(0, 10);
}

function PriceTable({ data, showAllDoses, onOpenReport }) {
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
                <td className="col-city" style={{ fontWeight: 700 }}>
                  {row.city}
                </td>

                <td className="col-district">{row.district}</td>

                <td
                  className="col-clinic"
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    lineHeight: 1.4,
                  }}
                >
                  {row.clinic}
                </td>

                <td style={{ fontSize: "13px", color: "#666" }}>
                  {row.type === "hospital"
                    ? "醫院"
                    : row.type === "pharmacy"
                    ? "藥局"
                    : "診所"}
                </td>

                {showAllDoses ? (
                  <>
                    <td>{row.price2_5mg || "-"}</td>
                    <td>{row.price5mg || "-"}</td>
                    <td>{row.price7_5mg || "-"}</td>
                    <td>{row.price10mg || "-"}</td>
                    <td>{row.price12_5mg || "-"}</td>
                    <td>{row.price15mg || "-"}</td>
                  </>
                ) : (
                  <>
                    <td
                      style={{ fontWeight: 700, color: "var(--ac-green-dark)" }}
                    >
                      {row.price5mg || "-"}
                    </td>
                    <td
                      style={{ fontWeight: 700, color: "var(--ac-green-dark)" }}
                    >
                      {row.price10mg || "-"}
                    </td>
                  </>
                )}

                <td className="col-note">{row.note || ""}</td>

                <td>
                  <button
                    className="report-icon-btn"
                    onClick={() => onOpenReport(row)}
                    title="協助更新價格"
                  >
                    ✎
                  </button>
                </td>

                <td
                  style={{
                    fontSize: "12px",
                    color: "#777",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.last_updated ? formatLastUpdated(row.last_updated) : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PriceTable;
