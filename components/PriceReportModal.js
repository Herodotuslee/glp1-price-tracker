import React, { useEffect, useMemo, useState } from "react";
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
   * - update  -> report updates (creates/updates a pending report)
   * - cleanup -> delete / duplicate / invalid data (enqueue deletion)
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

  // Existing pending report id (so we PATCH instead of POST)
  const [existingPendingReportId, setExistingPendingReportId] = useState(null);

  // Existing pending report note (so we can show it, and avoid clearing it)
  const [existingPendingReportNote, setExistingPendingReportNote] =
    useState(null);

  const isUpdate = mode === "update";
  const isCleanup = mode === "cleanup";

  // ---------- Derived display ----------
  const cityLabel = CITY_LABELS[target?.city] || target?.city || "-";

  const normalizedTypeKey = useMemo(() => {
    return (type || "").toString().trim().toLowerCase() || "clinic";
  }, [type]);

  const typeLabel = TYPE_LABELS[normalizedTypeKey] || "診所";

  const originalClinic = (target?.clinic ?? "").toString().trim();
  const editedClinic = (clinicName ?? "").toString().trim();
  const isClinicRenamed =
    !!originalClinic && !!editedClinic && originalClinic !== editedClinic;

  const originalType = (target?.type || "clinic")
    .toString()
    .trim()
    .toLowerCase();
  const isTypeChanged = originalType !== normalizedTypeKey;

  const originalDistrict = (target?.district ?? "").toString().trim();
  const editedDistrict = (district ?? "").toString().trim();
  const isDistrictChanged = originalDistrict !== editedDistrict;

  const isIdentityChanged =
    isClinicRenamed || isTypeChanged || isDistrictChanged;

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

    setExistingPendingReportId(null);
    setExistingPendingReportNote(null);
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
  }, [target?.id]);

  // ---------- Find existing pending report (id + note) ----------
  useEffect(() => {
    if (!target?.id) return;

    const controller = new AbortController();

    (async () => {
      try {
        const url =
          `${SUPABASE_URL}/rest/v1/mounjaro_reports?` +
          `mounjaro_data_id=eq.${target.id}&status=eq.pending&select=id,note,created_at&` +
          `order=created_at.desc&limit=1`;

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        if (!res.ok) {
          setExistingPendingReportId(null);
          setExistingPendingReportNote(null);
          return;
        }

        const rows = await res.json();
        const row = Array.isArray(rows) ? rows[0] : null;

        setExistingPendingReportId(row?.id ?? null);
        setExistingPendingReportNote(row?.note ?? null);

        // If user hasn't typed anything yet, prefill with existing note (so they can see it)
        // IMPORTANT: Don't overwrite if they already typed something.
        setNote((prev) => {
          if ((prev ?? "").toString().trim() !== "") return prev;
          return (row?.note ?? "").toString();
        });
      } catch {
        setExistingPendingReportId(null);
        setExistingPendingReportNote(null);
      }
    })();

    return () => controller.abort();
  }, [target?.id]);

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
      if ((note ?? "").toString().trim() === "") {
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
              reason: (note ?? "").toString(),
              snapshot: target,
            }),
          }
        );

        if (!res.ok) {
          let errObj = null;
          try {
            errObj = await res.json();
          } catch {
            errObj = null;
          }

          if (
            errObj?.code === "23505" ||
            JSON.stringify(errObj || "").includes(
              "mounjaro_data_deletion_queue_unique"
            )
          ) {
            alert("⚠️ 此資料已經有人申請刪除，正在審核中。");
            onClose();
            return;
          }

          throw new Error(JSON.stringify(errObj || { status: res.status }));
        }

        alert("🧹 已送出刪除申請，感謝協助！");
        onClose();
        return;
      }

      // ---------- Update flow ----------
      const payload = {
        mounjaro_data_id: target.id,
        city: target.city,
        district: editedDistrict || null,
        clinic: editedClinic,
        address: (address ?? "").toString().trim() || null,
        type: normalizedTypeKey,
        is_cosmetic: target.is_cosmetic ?? false,

        price2_5mg: toNullableInt(price2_5),
        price5mg: toNullableInt(price5),
        price7_5mg: toNullableInt(price7_5),
        price10mg: toNullableInt(price10),
        price12_5mg: toNullableInt(price12_5),
        price15mg: toNullableInt(price15),

        status: "pending",
        last_updated: new Date().toISOString().slice(0, 10),
      };

      // ✅ IMPORTANT: only include `note` in PATCH/POST if user actually provided it.
      // This prevents wiping out existing note when the textarea is empty.
      const trimmedNote = (note ?? "").toString().trim();
      if (trimmedNote !== "") {
        payload.note = trimmedNote;
      }

      const isPatch = !!existingPendingReportId;
      const url = isPatch
        ? `${SUPABASE_URL}/rest/v1/mounjaro_reports?id=eq.${existingPendingReportId}`
        : `${SUPABASE_URL}/rest/v1/mounjaro_reports`;

      const res = await fetch(url, {
        method: isPatch ? "PATCH" : "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errPayload = null;
        try {
          errPayload = await res.json();
        } catch {
          errPayload = await res.text();
        }
        throw new Error(
          typeof errPayload === "string"
            ? errPayload
            : JSON.stringify(errPayload)
        );
      }

      // If POSTed, remember the new pending report id + note
      if (!isPatch) {
        try {
          const rows = await res.json();
          const row = Array.isArray(rows) ? rows[0] : null;
          if (row?.id) setExistingPendingReportId(row.id);
          if (row?.note !== undefined)
            setExistingPendingReportNote(row.note ?? null);
        } catch {
          // Ignore
        }
      } else {
        // If PATCHed and note was provided, keep local "existing" note in sync
        if (trimmedNote !== "") setExistingPendingReportNote(trimmedNote);
      }

      alert(
        isIdentityChanged
          ? "🎉 已送出更新（關鍵資訊變更需審核）！"
          : "🎉 回報成功！感謝你的回報！"
      );
      onClose();
    } catch (err) {
      console.error(err);
      setError("送出失敗，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  };

  const effectiveNotePreview =
    (note ?? "").toString().trim() !== ""
      ? note
      : existingPendingReportNote ?? "";

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
          {cityLabel} / {editedDistrict || target.district || "-"} /{" "}
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
              {hasPendingDeletion ? "刪除審核中" : "刪除錯誤 / 重複資料"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {isCleanup && (
            <div className="modal-field">
              <label className="modal-label">🧩 原因 / 說明（必填）</label>
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

                {isIdentityChanged && (
                  <div className="modal-hint-warn">
                    已偵測到關鍵資訊變更（名稱/類型/地區），需經站長審核後才會更新主頁資料。
                  </div>
                )}

                {!!existingPendingReportId && (
                  <div className="modal-hint">
                    已有待審更新：本次會更新同一筆待審回報，不會新增新的回報列。
                  </div>
                )}
              </div>

              <div className="modal-field">
                <label className="modal-label">🏠 地區</label>
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">🏷️ 類型</label>
                <div className="type-options-container">
                  {[
                    { value: "clinic", label: "診所" },
                    { value: "hospital", label: "醫院" },
                    { value: "pharmacy", label: "藥局" },
                    { value: "medical_aesthetic", label: "醫美" },
                  ].map((t) => (
                    <label
                      key={t.value}
                      className={`type-option-btn ${
                        normalizedTypeKey === t.value ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={t.value}
                        checked={normalizedTypeKey === t.value}
                        onChange={(e) => setType(e.target.value)}
                        className="hidden-radio"
                      />
                      {t.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-field">
                <label className="modal-label">📍 地址（選填）</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="modal-input"
                />
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
                  placeholder={
                    existingPendingReportNote
                      ? "（目前有待審備註，留空不會清掉）"
                      : "有什麼想補充的嗎？"
                  }
                />
                {existingPendingReportNote &&
                  (note ?? "").toString().trim() === "" && (
                    <div className="modal-hint">
                      目前待審備註（預覽）：{effectiveNotePreview}
                    </div>
                  )}
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
