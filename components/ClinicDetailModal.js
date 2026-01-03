"use client";

// src/components/ClinicDetailModal.js
import React, { useEffect, useMemo, useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/config/supabase";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  CategoryScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  CategoryScale
);

/* ---------------- helpers ---------------- */

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const nfmt = (v) => new Intl.NumberFormat("zh-TW").format(v);

const toValidDate = (d) => {
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? null : x;
};

/* ---------------- chart component ---------------- */
/**
 * ✅ Equal spacing on X axis:
 * - Use CategoryScale (labels), not TimeScale.
 * - Each record becomes one evenly spaced point.
 * - Labels show date string only.
 * - if points < 2 -> don't render chart
 */
function SingleDoseChart({ title, rows, priceKey, color }) {
  const { labels, values } = useMemo(() => {
    const safe = Array.isArray(rows) ? rows : [];
    const pts = safe
      .map((r) => {
        const dt = toValidDate(r?.created_at);
        const y = Number(r?.[priceKey]);
        if (!dt || !Number.isFinite(y) || y <= 0) return null;
        return { dt, y };
      })
      .filter(Boolean)
      .sort((a, b) => a.dt - b.dt);

    return {
      labels: pts.map((p) => formatDate(p.dt)),
      values: pts.map((p) => p.y),
    };
  }, [rows, priceKey]);

  // ✅ Only render when we have at least 2 points
  if (values.length < 2) return null;

  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => items?.[0]?.label || "",
          label: (item) => `價格：${nfmt(item.parsed.y)} 元`,
        },
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          color: "rgba(0,0,0,0.55)",
        },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
      y: {
        ticks: {
          color: "rgba(0,0,0,0.55)",
          callback: (v) => nfmt(v),
        },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
    },
  };

  return (
    <div className="cdm-trend-card">
      <div className="cdm-trend-title">{title}</div>
      <div className="cdm-trend-canvas">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

/* ---------------- main modal ---------------- */

function ClinicDetailModal({ open, clinicId, onClose }) {
  const [clinic, setClinic] = useState(null);
  const [notes, setNotes] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) {
      setClinic(null);
      setNotes([]);
      setPriceHistory([]);
      setErr("");
      setLoading(false);
      return;
    }
    if (!clinicId) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        const clinicRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mounjaro_data?id=eq.${clinicId}&select=id,city,district,clinic,type,address,last_updated,price2_5mg,price5mg,price7_5mg,price10mg,price12_5mg,price15mg`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            signal: controller.signal,
          }
        );
        if (!clinicRes.ok) throw new Error("Failed to load clinic");
        const clinicRows = await clinicRes.json();
        setClinic(clinicRows?.[0] || null);

        const priceRes = await fetch(
          `${SUPABASE_URL}/rest/v1/clinic_drug_prices` +
            `?mounjaro_data_id=eq.${clinicId}` +
            `&is_deleted=eq.false` +
            `&select=price5mg,price10mg,created_at` +
            `&order=created_at.desc` +
            `&limit=10`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            signal: controller.signal,
          }
        );
        if (!priceRes.ok) throw new Error("Failed to load price history");
        const priceRows = await priceRes.json();
        setPriceHistory(Array.isArray(priceRows) ? priceRows : []);

        const notesRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mounjaro_notes?mounjaro_data_id=eq.${clinicId}&select=id,note,created_at&order=created_at.desc`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            signal: controller.signal,
          }
        );
        if (!notesRes.ok) throw new Error("Failed to load notes");
        const noteRows = await notesRes.json();
        setNotes(noteRows || []);
      } catch (e) {
        if (e?.name === "AbortError") return;
        setErr(e?.message || "載入失敗");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [open, clinicId]);

  const typeLabel =
    clinic?.type === "hospital"
      ? "醫院"
      : clinic?.type === "pharmacy"
      ? "藥局"
      : clinic?.type === "medical_aesthetic"
      ? "醫美"
      : "診所";

  const formatPrice = (v) => {
    if (v == null || v === "" || Number.isNaN(Number(v))) return "-";
    const num = Number(v);
    if (!Number.isFinite(num) || num === 0) return "-";
    return nfmt(num);
  };

  const priceItems = useMemo(() => {
    if (!clinic) return [];
    return [
      { label: "2.5mg", key: "price2_5mg", value: clinic.price2_5mg },
      { label: "5mg", key: "price5mg", value: clinic.price5mg },
      { label: "7.5mg", key: "price7_5mg", value: clinic.price7_5mg },
      { label: "10mg", key: "price10mg", value: clinic.price10mg },
      { label: "12.5mg", key: "price12_5mg", value: clinic.price12_5mg },
      { label: "15mg", key: "price15mg", value: clinic.price15mg },
    ];
  }, [clinic]);

  const countValid = (key) =>
    (priceHistory || [])
      .map((r) => {
        const dt = toValidDate(r?.created_at);
        const y = Number(r?.[key]);
        if (!dt || !Number.isFinite(y) || y <= 0) return null;
        return 1;
      })
      .filter(Boolean).length;

  const hasTrend5 = useMemo(() => countValid("price5mg") >= 2, [priceHistory]);
  const hasTrend10 = useMemo(
    () => countValid("price10mg") >= 2,
    [priceHistory]
  );
  const showTrendSection = hasTrend5 || hasTrend10;

  if (!open) return null;

  return (
    <div className="cdm-overlay" onClick={onClose}>
      <div
        className="cdm-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="cdm-header">
          <div className="cdm-title">{clinic?.clinic || "診所詳細資訊"}</div>
          <button type="button" className="cdm-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cdm-body">
          {loading ? (
            <div>載入中...</div>
          ) : err ? (
            <div>錯誤：{err}</div>
          ) : !clinic ? (
            <div>找不到資料</div>
          ) : (
            <>
              <div className="cdm-meta-line">
                <div className="cdm-meta-text">
                  {clinic.city}
                  {clinic.district ? ` · ${clinic.district}` : ""}
                  {" · "}
                  {typeLabel}
                </div>

                {clinic.last_updated ? (
                  <div
                    className="cdm-meta-updated"
                    title={`更新於 ${formatDate(clinic.last_updated)}`}
                    aria-label={`更新於 ${formatDate(clinic.last_updated)}`}
                  >
                    更新於 {formatDate(clinic.last_updated)}
                  </div>
                ) : null}
              </div>

              <div className="cdm-section">
                <div className="cdm-section-title">價格</div>
                <div className="cdm-price-grid">
                  {priceItems.map((p) => {
                    const display = formatPrice(p.value);
                    return (
                      <div className="cdm-price-item" key={p.key}>
                        <div className="cdm-price-dose">{p.label}</div>
                        <div className="cdm-price-val">
                          {display}
                          {display !== "-" ? " 元" : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {showTrendSection ? (
                <div className="cdm-section">
                  <div className="cdm-section-title">
                    價格趨勢（最近 10 筆）
                  </div>

                  {hasTrend5 ? (
                    <SingleDoseChart
                      title="5mg 價格趨勢"
                      rows={priceHistory}
                      priceKey="price5mg"
                      color="#4A90E2"
                    />
                  ) : null}

                  {hasTrend10 ? (
                    <SingleDoseChart
                      title="10mg 價格趨勢"
                      rows={priceHistory}
                      priceKey="price10mg"
                      color="#F5A623"
                    />
                  ) : null}

                  <style>{`
                    .cdm-trend-card{
                      background: rgba(255,255,255,0.70);
                      border: 1px solid rgba(0,0,0,0.08);
                      border-radius: 12px;
                      padding: 10px;
                      margin-top: 10px;
                    }
                    .cdm-trend-title{
                      font-size: 13px;
                      font-weight: 900;
                      margin-bottom: 6px;
                      color: var(--ac-brown-dark);
                    }
                    .cdm-trend-canvas{
                      height: 210px;
                    }
                  `}</style>
                </div>
              ) : null}

              <div className="cdm-section">
                <div className="cdm-section-title">地址</div>
                <div className="cdm-section-content">
                  {clinic.address || "（尚未提供）"}
                </div>
              </div>

              <div className="cdm-section">
                <div className="cdm-section-title">備註歷史</div>
                {notes.length === 0 ? (
                  <div className="cdm-section-content">目前沒有備註紀錄</div>
                ) : (
                  <div className="cdm-note-list">
                    {notes.map((n) => (
                      <div className="cdm-note-item" key={n.id}>
                        <div className="cdm-note-meta">
                          {new Date(n.created_at).toLocaleString("zh-TW")}
                        </div>
                        <div className="cdm-note-text">{n.note}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <style>{`
                .cdm-meta-line{
                  position: relative;
                  margin: 6px 0 14px;
                  font-size: 13px;
                  color: var(--ac-brown);
                  min-height: 20px;
                }
                .cdm-meta-text{
                  font-weight: 650;
                  letter-spacing: 0.2px;
                  padding-right: 140px;
                  line-height: 20px;
                }
                .cdm-meta-updated{
                  position: absolute;
                  top: 0;
                  right: 0;
                  font-size: 12px;
                  opacity: 0.45;
                  font-weight: 650;
                  white-space: nowrap;
                  user-select: none;
                  pointer-events: none;
                }
                @media (max-width: 640px){
                  .cdm-meta-text{ padding-right: 0; }
                  .cdm-meta-updated{
                    position: static;
                    display: block;
                    margin-top: 4px;
                  }
                }
              `}</style>
            </>
          )}
        </div>

        <div className="cdm-footer">
          <button type="button" className="cdm-btn" onClick={onClose}>
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClinicDetailModal;
