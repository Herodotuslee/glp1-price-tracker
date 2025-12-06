// src/components/ErrorReportModal.js
import React, { useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import "../styles/errorReportModal.css";

function ErrorReportModal({ isOpen, onClose, sourceType, sourceId }) {
  // ✅ All hooks must be at the top level of the component
  const [errorType, setErrorType] = useState("資料有誤");
  const [description, setDescription] = useState("");
  const [suggestedValue, setSuggestedValue] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // helper: simple validation
  const canSubmit = description.trim().length > 0 && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/error_reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          source_type: sourceType || "other",
          source_id: sourceId ?? null,
          error_type: errorType || null,
          description: description.trim(),
          suggested_value: suggestedValue.trim() || null,
          contact: contact.trim() || null,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error report failed:", text);
        throw new Error("送出失敗，請稍後再試。");
      }

      setSubmitSuccess(true);
      setDescription("");
      setSuggestedValue("");
      setContact("");

      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 800);
    } catch (err) {
      setSubmitError(err.message || "送出失敗，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    // Close when clicking on the backdrop
    if (e.target.classList.contains("modal-backdrop")) {
      onClose();
    }
  };

  // ✅ Conditional rendering AFTER hooks
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card report-modal-card">
        <h2 className="report-modal-title">回報資料錯誤 / 問題</h2>
        <p className="report-modal-subtitle">
          如果你發現價格、診所資訊或文章內容有誤，歡迎幫忙回報。
          不會公開顯示你的聯絡方式。
        </p>

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="report-form-field">
            <label htmlFor="errorType" className="report-label">
              問題類型
            </label>
            <select
              id="errorType"
              className="report-input"
              value={errorType}
              onChange={(e) => setErrorType(e.target.value)}
            >
              <option value="資料有誤">資料有誤</option>
              <option value="價格資訊有誤">價格資訊有誤</option>
              <option value="診所資訊有誤">診所資訊有誤</option>
              <option value="文章內容有誤">文章內容有誤</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div className="report-form-field">
            <label htmlFor="description" className="report-label">
              具體說明<span className="report-required">*</span>
            </label>
            <textarea
              id="description"
              className="report-textarea"
              rows={4}
              placeholder="例如：台北 XX 診所 5 mg 價格應該是 3,000 元，而不是 30,000 元。"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="report-help-text">
              請盡量說明是「哪一間診所 / 哪一筆價格 / 哪一段文字」有問題。
            </p>
          </div>

          <div className="report-form-field">
            <label htmlFor="suggestedValue" className="report-label">
              正確資訊（若知道）
            </label>
            <textarea
              id="suggestedValue"
              className="report-textarea"
              rows={2}
              placeholder="如果你知道正確價格、地址或內容，也可以在這裡補充。"
              value={suggestedValue}
              onChange={(e) => setSuggestedValue(e.target.value)}
            />
          </div>

          <div className="report-form-field">
            <label htmlFor="contact" className="report-label">
              聯絡方式（選填）
            </label>
            <input
              id="contact"
              className="report-input"
              placeholder="Email、IG、Line ID（若願意讓我私訊確認）"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          {submitError && (
            <div className="report-message report-message-error">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="report-message report-message-success">
              已收到回報，非常感謝你的協助！
            </div>
          )}

          <div className="report-actions">
            <button
              type="button"
              className="report-button-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              取消
            </button>
            <button
              type="submit"
              className="report-button-primary"
              disabled={!canSubmit}
            >
              {submitting ? "送出中..." : "送出回報"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ErrorReportModal;
