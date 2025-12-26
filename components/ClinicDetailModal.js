// src/components/ClinicDetailModal.js
import React, { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/config/supabase";

function ClinicDetailModal({ open, clinicId, onClose }) {
  const [clinic, setClinic] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // English comment: Reset local state when closing
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

        // English comment: Load clinic info (including address)
        const clinicRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mounjaro_data?id=eq.${clinicId}&select=id,city,district,clinic,type,address,last_updated`,
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

        // Load note history (newest first)
        const notesRes = await fetch(
          `${SUPABASE_URL}/rest/v1/mounjaro_notes?mounjaro_data_id=eq.${clinicId}&select=id,note,created_at,status,report_id,note_key&order=created_at.desc`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              Accept: "application/json",
              Range: "0-999",
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

  if (!open) return null;

  const typeLabel =
    clinic?.type === "hospital"
      ? "醫院"
      : clinic?.type === "pharmacy"
      ? "藥局"
      : clinic?.type === "medical_aesthetic"
      ? "醫美"
      : "診所";

  return (
    // ✅ IMPORTANT: use onClick (NOT onMouseDown) to avoid instant close on mobile taps
    <div className="cdm-overlay" onClick={onClose} role="presentation">
      <div
        className="cdm-card"
        onClick={(e) => e.stopPropagation()} // English comment: prevent overlay close
        role="dialog"
        aria-modal="true"
        aria-label="診所詳細資訊"
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
              <div className="cdm-meta">
                {clinic.city} {clinic.district ? `· ${clinic.district}` : ""} ·{" "}
                {typeLabel}
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
                          {n.source ? ` · ${n.source}` : ""}
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
      </div>
    </div>
  );
}

export default ClinicDetailModal;
