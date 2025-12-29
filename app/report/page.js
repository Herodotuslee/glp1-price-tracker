"use client";
import React, { useRef, useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../../config/supabase";
import { CITY_LABELS } from "../../data/prices";

const INITIAL_FORM = {
  city: "",
  district: "",
  address: "",
  clinic: "",
  type: "clinic",
  price2_5mg: "",
  price5mg: "",
  price7_5mg: "",
  price10mg: "",
  price12_5mg: "",
  price15mg: "",
  note: "",
};

const CITY_OPTIONS = ["", ...Object.values(CITY_LABELS)];

const TYPE_OPTIONS = [
  { value: "clinic", label: "診所" },
  { value: "hospital", label: "醫院" },
  { value: "pharmacy", label: "藥局" },
  { value: "medical_aesthetic", label: "醫美" },
];

const PRICE_FIELDS = [
  { name: "price2_5mg", label: "2.5 mg" },
  { name: "price5mg", label: "5 mg" },
  { name: "price7_5mg", label: "7.5 mg" },
  { name: "price10mg", label: "10 mg" },
  { name: "price12_5mg", label: "12.5 mg" },
  { name: "price15mg", label: "15 mg" },
];

function ReportPriceFormPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  // Used to ensure the user sees the submission result right above the submit button.
  const resultAnchorRef = useRef(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const toNumberOrNull = (value) => {
    const trimmed = (value ?? "").toString().trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    return Number.isNaN(n) ? null : n;
  };

  const scrollResultIntoView = () => {
    // Bring the result banner (above the submit button) into view.
    if (resultAnchorRef.current) {
      resultAnchorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!form.city || !form.clinic.trim()) {
      setMessage({
        type: "error",
        text: "請記得填寫城市和診所名稱喔！",
      });
      scrollResultIntoView();
      return;
    }

    if (
      !form.price2_5mg &&
      !form.price5mg &&
      !form.price7_5mg &&
      !form.price10mg &&
      !form.price12_5mg &&
      !form.price15mg
    ) {
      setMessage({
        type: "error",
        text: "請至少告訴我一個劑量的價格吧 HOO！",
      });
      scrollResultIntoView();
      return;
    }

    const payload = {
      city: form.city.trim(),
      district: form.district.trim() || null,
      address: form.address.trim() || null,
      clinic: form.clinic.trim(),
      type: form.type || null,
      price2_5mg: toNumberOrNull(form.price2_5mg),
      price5mg: toNumberOrNull(form.price5mg),
      price7_5mg: toNumberOrNull(form.price7_5mg),
      price10mg: toNumberOrNull(form.price10mg),
      price12_5mg: toNumberOrNull(form.price12_5mg),
      price15mg: toNumberOrNull(form.price15mg),
      note: form.note.trim() || null,
      status: "pending",
      last_updated: new Date().toISOString().slice(0, 10),
    };

    try {
      setSubmitting(true);

      const url = `${SUPABASE_URL}/rest/v1/mounjaro_reports`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      setForm(INITIAL_FORM);
      setMessage({
        type: "success",
        text: "回報成功！狸克會把資料收好，審核後就會更新囉！",
      });

      // Ensure the success message is visible right above the submit button.
      scrollResultIntoView();
    } catch (err) {
      console.error("Submission failed:", err);
      setMessage({
        type: "error",
        text: "傳送失敗了... 請稍後再試試看！",
      });
      scrollResultIntoView();
    } finally {
      setSubmitting(false);
    }
  };

  const MessageBanner = () => {
    if (!message) return null;

    const baseClass =
      message.type === "success"
        ? "report-message report-message-success"
        : "report-message report-message-error";

    // Always render the banner in the "submit area" only.
    return (
      <div className={`${baseClass} report-message-sticky`}>{message.text}</div>
    );
  };

  return (
    <div className="price-page-root">
      <div className="price-page-inner">
        {/* Header */}
        <header className="page-header">
          <h1 className="page-title">
            <span className="title-icon">📮</span> 價格回報箱
          </h1>
          <p className="page-subtitle-text">
            健康的體態是大家共同的目標！
            <br />
            如果你知道哪裡有合理的價格，歡迎投遞情報喔！
          </p>
        </header>

        {/* Info Block */}
        <div className="report-info-block">
          <p className="report-info-text">
            感謝你願意分享情報！這個網站是靠大家的善意一起維護的。
            <br />
            除了價格，如果有推薦的好醫師，也歡迎在備註裡告訴大家喔！
          </p>
          <ul className="report-info-list">
            <li>
              為了保持資訊正確，回報的資料會先由站長人工確認，不會馬上顯示在主頁面喔。
            </li>
            <li>
              如果你覺得醫師很細心、對GLP-1很了解，都可以在備註裡幫他們加分！
            </li>
          </ul>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="report-form-card">
          {/* City */}
          <div className="form-field">
            <label className="form-label">📍 城市（必填）</label>
            <div className="select-wrapper">
              <select
                value={form.city}
                onChange={handleChange("city")}
                className="form-input"
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c === "" ? "請選擇..." : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* District */}
          <div className="form-field">
            <label className="form-label">🏠 地區（選填）</label>
            <input
              type="text"
              value={form.district}
              onChange={handleChange("district")}
              placeholder="例如：大安區、楠梓區..."
              className="form-input"
            />
          </div>

          {/* Clinic Name */}
          <div className="form-field">
            <label className="form-label">🏥 名稱（必填）</label>
            <input
              type="text"
              value={form.clinic}
              onChange={handleChange("clinic")}
              placeholder="請填寫完整名稱喔！"
              className="form-input"
            />
          </div>

          {/* Type Radio Buttons */}
          <div className="form-field">
            <label className="form-label">🏷️ 類型</label>
            <div className="type-options-container">
              {TYPE_OPTIONS.map((t) => (
                <label
                  key={t.value}
                  className={`type-option-btn ${
                    form.type === t.value ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    checked={form.type === t.value}
                    onChange={handleChange("type")}
                    className="hidden-radio"
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <div className="price-section-card">
            <div className="price-section-header">
              <div className="price-section-title">💰 價格情報</div>
              <div className="price-section-subtitle">
                請填寫單隻筆的費用 (NT$)，至少填一格喔！
              </div>
            </div>

            <div className="price-input-grid">
              {PRICE_FIELDS.map(({ name, label }) => (
                <div key={name} className="price-input-box">
                  <label className="price-mini-label" htmlFor={name}>
                    {label}
                  </label>
                  <input
                    id={name}
                    type="number"
                    value={form[name]}
                    onChange={handleChange(name)}
                    className="price-mini-input"
                    placeholder="-"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="form-field">
            <label className="form-label">📝 備註（選填）</label>
            <textarea
              value={form.note}
              onChange={handleChange("note")}
              rows={3}
              className="form-textarea"
              placeholder="有什麼想補充的嗎？"
            />
          </div>

          {/* Message ABOVE the submit button (single place only) */}
          <div ref={resultAnchorRef} />
          <MessageBanner />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="report-submit-btn"
          >
            {submitting ? "傳送中..." : "投遞情報"}
          </button>

          <p className="report-submit-note">
            再次感謝你的熱心！你的情報會幫助到很多島民喔！
          </p>
        </form>
      </div>
    </div>
  );
}

export default ReportPriceFormPage;
