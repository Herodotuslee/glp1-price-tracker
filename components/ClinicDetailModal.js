// src/components/ClinicDetailModal.js
import React, { useEffect, useMemo, useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/config/supabase";

/**
 * Format date (e.g. "2025-12-28") into zh-TW display.
 * Falls back to raw string if parsing fails.
 */
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

function ClinicDetailModal({ open, clinicId, onClose }) {
  const [clinic, setClinic] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) {
      setClinic(null);
      setNotes([]);
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

        const notesRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mounjaro_notes?mounjaro_data_id=eq.${clinicId}&select=id,note,created_at,status,report_id,note_key&order=created_at.desc`,
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
    return new Intl.NumberFormat("zh-TW").format(num);
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
              {/* Meta line: left = city · district / type, right-top = updated */}
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
                          {new Date(n.created_at).toLocaleString()}
                        </div>
                        <div className="cdm-note-text">{n.note}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="cdm-footer">
          <button type="button" className="cdm-btn" onClick={onClose}>
            關閉
          </button>
        </div>

        <style>{`
          /* --- Meta line (clean separators) --- */
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
            padding-right: 140px; /* reserve space for top-right updated */
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

          /* --- Prices --- */
          .cdm-price-grid{
            display:grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap:10px;
            margin-top:10px;
          }
          .cdm-price-item{
            background: rgba(255,255,255,0.06);
            border: 1px dashed rgba(255,255,255,0.18);
            border-radius: 12px;
            padding: 10px;
          }
          .cdm-price-dose{
            font-size: 12px;
            opacity: 0.85;
            margin-bottom: 4px;
            font-weight: 800;
          }
          .cdm-price-val{
            font-size: 16px;
            font-weight: 900;
          }

          @media (max-width: 640px){
            .cdm-price-grid{
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .cdm-meta-text{
              padding-right: 0;
            }
            .cdm-meta-updated{
              position: static;
              display: block;
              margin-top: 4px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ClinicDetailModal;
