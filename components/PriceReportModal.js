import React, { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import { CITY_LABELS, TYPE_LABELS } from "../data/prices";

/**
 * Convert empty string to number or null
 */
const toNullableInt = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

function PriceReportModal({ target, onClose }) {
  /**
   * mode:
   * - update  -> original update flow
   * - cleanup -> delete / duplicate / invalid data
   */
  const [mode, setMode] = useState("update");

  // ---------- Update fields ----------
  const [district, setDistrict] = useState("");
  const [type, setType] = useState("clinic");
  const [address, setAddress] = useState("");
  const [clinicName, setClinicName] = useState("");

  const [price2_5, setPrice2_5] = useState("");
  const [price5, setPrice5] = useState("");
  const [price7_5, setPrice7_5] = useState("");
  const [price10, setPrice10] = useState("");
  const [price12_5, setPrice12_5] = useState("");
  const [price15, setPrice15] = useState("");

  /**
   * note:
   * - update  -> optional note
   * - cleanup -> required reason
   */
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Whether a pending deletion already exists
  const [hasPendingDeletion, setHasPendingDeletion] = useState(false);

  const isUpdate = mode === "update";
  const isCleanup = mode === "cleanup";

  // ---------- Derived display ----------
  const cityLabel = CITY_LABELS[target?.city] || target?.city || "-";

  const normalizedTypeKey =
    (type || "").toString().trim().toLowerCase() || "clinic";
  const typeLabel = TYPE_LABELS[normalizedTypeKey] || "診所";

  const originalClinic = (target?.clinic ?? "").toString().trim();
  const editedClinic = (clinicName ?? "").toString().trim();

  const isClinicRenamed =
    !!originalClinic && !!editedClinic && originalClinic !== editedClinic;

  // ---------- Init when target changes ----------
  useEffect(() => {
    if (!target) return;

    setMode("update");
    setDistrict(target.district ?? "");
    setAddress(target.address ?? "");
    setClinicName(target.clinic ?? "");

    const normalizedType = (target.type || "clinic")
      .toString()
      .trim()
      .toLowerCase();
    setType(normalizedType || "clinic");

    setPrice2_5(target.price2_5mg ?? "");
    setPrice5(target.price5mg ?? "");
    setPrice7_5(target.price7_5mg ?? "");
    setPrice10(target.price10mg ?? "");
    setPrice12_5(target.price12_5mg ?? "");
    setPrice15(target.price15mg ?? "");

    setNote("");
    setError(null);
    setSubmitting(false);
  }, [target]);

  // ---------- Check pending deletion ----------
  useEffect(() => {
    if (!target?.id) return;

    fetch(
      `${SUPABASE_URL}/rest/v1/mounjaro_data_deletion_queue?` +
        `mounjaro_data_id=eq.${target.id}&status=eq.pending&select=id`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    )
      .then((r) => r.json())
      .then((rows) =>
        setHasPendingDeletion(Array.isArray(rows) && rows.length > 0)
      )
      .catch(() => setHasPendingDeletion(false));
  }, [target]);

  if (!target) return null;

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!target?.id) {
      setError("Missing target id.");
      return;
    }

    // ---------- Cleanup validation ----------
    if (isCleanup) {
      if (note.trim() === "") {
        setError("請填寫刪除原因。");
        return;
      }

      if (hasPendingDeletion) {
        alert("⚠️ 此資料已經有人申請刪除，正在審核中。");
        return;
      }
    }

    // ---------- Update validation ----------
    if (isUpdate) {
      if (!editedClinic) {
        setError("請填寫診所名稱。");
        return;
      }

      const hasPrice =
        price2_5 || price5 || price7_5 || price10 || price12_5 || price15;

      if (!hasPrice) {
        setError("請至少填寫一個劑量的價格。");
        return;
      }
    }

    try {
      setSubmitting(true);

      // ---------- Cleanup flow ----------
      if (isCleanup) {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/mounjaro_data_deletion_queue`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              mounjaro_data_id: target.id,
              reason: note,
              snapshot: {
                ...target,
                corrected_type: normalizedTypeKey,
              },
            }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          if (err?.code === "23505") {
            alert("⚠️ 此資料已經有人申請刪除，正在審核中。");
            onClose();
            return;
          }
          throw new Error(JSON.stringify(err));
        }

        alert("🧹 已送出刪除 / 修正申請，感謝協助！");
        onClose();
        return;
      }

      // ---------- Update flow ----------
      const res = await fetch(`${SUPABASE_URL}/rest/v1/mounjaro_reports`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          mounjaro_data_id: target.id,
          city: target.city,
          district: district || target.district || null,
          clinic: editedClinic,
          address: address || target.address || null,
          type: normalizedTypeKey,
          is_cosmetic: target.is_cosmetic ?? false,

          price2_5mg: toNullableInt(price2_5),
          price5mg: toNullableInt(price5),
          price7_5mg: toNullableInt(price7_5),
          price10mg: toNullableInt(price10),
          price12_5mg: toNullableInt(price12_5),
          price15mg: toNullableInt(price15),

          note: note || null,
          status: "pending",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err));
      }

      alert("🎉 回報成功！感謝你的回報！");
      onClose();
    } catch (err) {
      console.error(err);
      setError("送出失敗，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2 className="modal-title">📝 價格回報單</h2>

        {/* Clinic context */}
        <p
          style={{
            marginTop: 4,
            marginBottom: 14,
            fontSize: 13,
            color: "var(--ac-brown)",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {cityLabel} / {district || target.district || "-"} /{" "}
          <strong>{editedClinic || "-"}</strong>（{typeLabel}）
        </p>

        {/* Mode buttons */}
        <div className="modal-field">
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className={`filter-btn ${isUpdate ? "active" : ""}`}
              onClick={() => setMode("update")}
              disabled={submitting}
            >
              回報更新
            </button>
            <button
              type="button"
              className={`filter-btn ${isCleanup ? "active" : ""}`}
              onClick={() => {
                setMode("cleanup");
                setNote("");
              }}
              disabled={submitting || hasPendingDeletion}
            >
              {hasPendingDeletion ? "刪除審核中" : "刪除 / 修正錯誤資料"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ---------- TYPE SELECT (KEY FIX) ---------- */}
          <div className="modal-field">
            <label className="modal-label">🏥 類型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="modal-input"
              disabled={submitting}
            >
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {isCleanup && (
            <div className="modal-field">
              <label className="modal-label">🧩 刪除原因（必填）</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="modal-textarea"
              />
            </div>
          )}

          {isUpdate && (
            <>
              <div className="modal-field">
                <label className="modal-label">🏷️ 診所名稱</label>
                <input
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="modal-input"
                />
                {isClinicRenamed && (
                  <div className="modal-hint-warn">
                    已偵測到診所名稱變更，需經站長審核。
                  </div>
                )}
              </div>

              <div className="modal-grid">
                {[
                  ["2.5 mg", price2_5, setPrice2_5],
                  ["5 mg", price5, setPrice5],
                  ["7.5 mg", price7_5, setPrice7_5],
                  ["10 mg", price10, setPrice10],
                  ["12.5 mg", price12_5, setPrice12_5],
                  ["15 mg", price15, setPrice15],
                ].map(([label, value, setter]) => (
                  <div className="modal-field dose-field" key={label}>
                    <label className="modal-label">{label}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="modal-input"
                    />
                  </div>
                ))}
              </div>

              <div className="modal-field">
                <label className="modal-label">🍃 備註（選填）</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="modal-textarea"
                />
              </div>
            </>
          )}

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={submitting}
            >
              取消
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "傳送中…" : "送出"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PriceReportModal;
