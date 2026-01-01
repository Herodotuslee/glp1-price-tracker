// src/pages/PricePage.js
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TYPES } from "@/data/prices";
import texts from "@/data/texts.json";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/config/supabase";
import PriceReportModal from "@/components/PriceReportModal";
import PriceTable from "@/components/PriceTable";
import PriceCardList from "@/components/PriceCardList";
import ClinicDetailModal from "@/components/ClinicDetailModal";
import useIsMobile from "@/hooks/useIsMobile";
import {
  cityMatchesSelected,
  typeMatchesSelected,
  matchesKeyword,
  toNullableInt,
} from "@/utils/priceHelpers";
import "@/styles/PricePage.css";
import "@/styles/PriceTable.css";
import "@/styles/PriceCardList.css";
import "@/styles/PriceReportModal.css";
import "@/styles/ClinicDetailModal.css";
import LoadingIndicator from "@/components/LoadingIndicator";

function PricePage() {
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10));
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [keyword, setKeyword] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAllDoses, setShowAllDoses] = useState(false);

  // ---------- SORT ----------
  const [sortKey, setSortKey] = useState("min"); // min | price5mg | price10mg
  const [sortDir, setSortDir] = useState("asc"); // asc | desc

  // ---------- SORT WARNING MODAL ----------
  const [showSortWarning, setShowSortWarning] = useState(false);
  const [pendingSort, setPendingSort] = useState(null); // { key: "price5mg"|"price10mg"|"min", dir:"asc"|"desc" }

  const requestSort = (key, dir = "asc") => {
    setPendingSort({ key, dir });
    setShowSortWarning(true);
  };

  const confirmSort = () => {
    if (!pendingSort) return;
    setSortKey(pendingSort.key);
    setSortDir(pendingSort.dir);
    setShowSortWarning(false);
    setPendingSort(null);
  };

  const cancelSort = () => {
    setShowSortWarning(false);
    setPendingSort(null);
  };

  const [reportTarget, setReportTarget] = useState(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState(null);

  const [reportDistrict, setReportDistrict] = useState("");
  const [reportPrice2_5, setReportPrice2_5] = useState("");
  const [reportPrice5, setReportPrice5] = useState("");
  const [reportPrice7_5, setReportPrice7_5] = useState("");
  const [reportPrice10, setReportPrice10] = useState("");
  const [reportPrice12_5, setReportPrice12_5] = useState("");
  const [reportPrice15, setReportPrice15] = useState("");
  const [reportNote, setReportNote] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailClinicId, setDetailClinicId] = useState(null);

  const isMobile = useIsMobile(640);

  // ---------- FUN CITY NAME (ONLY FOR THE HEADER LINE) ----------
  // Do NOT use this for filtering, only for display in the "X 個合法通路" sentence.
  const CITY_ALIAS = useMemo(
    () => ({
      台北: "天龍國",
      新北: "新北",
      基隆: "雨都",
      桃園: "桃園",
      新竹: "風城",
      苗栗: "苗栗國",
      台中: "大台中",
      彰化: "彰化",
      南投: "內地",
      雲林: "雲林",
      嘉義: "綠豆城",
      台南: "府城",
      高雄: "打狗",
      屏東: "屏東",
      宜蘭: "蘭陽",
      花蓮: "花蓮",
      台東: "台東",
    }),
    []
  );

  const cityDisplayName = (cityKey) => {
    if (!cityKey) return "-";
    return CITY_ALIAS[cityKey] || cityKey;
  };

  // ---------- FETCH ----------
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/mounjaro_data?select=*`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );

        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        if (!cancelled) setRows(data || []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("載入失敗，請稍後再試");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- CITY OPTIONS ----------
  const CITY_ORDER = [
    "台北",
    "新北",
    "基隆",
    "桃園",
    "新竹",
    "苗栗",
    "台中",
    "彰化",
    "南投",
    "雲林",
    "嘉義",
    "台南",
    "高雄",
    "屏東",
    "宜蘭",
    "花蓮",
    "台東",
  ];

  const cityOptions = useMemo(() => {
    const uniqueCities = Array.from(
      new Set(rows.map((r) => r.city).filter(Boolean))
    );

    uniqueCities.sort((a, b) => {
      const ia = CITY_ORDER.indexOf(a);
      const ib = CITY_ORDER.indexOf(b);

      if (ia === -1 && ib === -1) return a.localeCompare(b, "zh-Hant");
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    return ["all", ...uniqueCities];
  }, [rows]);

  // ---------- TOTAL COUNT (ALL TYPES) FOLLOW CITY ----------
  // Counts all types (clinic/hospital/pharmacy/medical_aesthetic).
  // Follows selectedCity ("all" => nationwide).
  // Deduplicates by id first; fallback to (city|type|clinic).
  const totalLocationCount = useMemo(() => {
    const seen = new Set();

    for (const r of rows || []) {
      if (!cityMatchesSelected(r.city, selectedCity)) continue;

      const t = (r?.type || "clinic").toString().trim().toLowerCase();
      const key =
        (r?.id ? `id:${r.id}` : null) ??
        `key:${(r?.city ?? "").toString().trim()}|${t}|${(r?.clinic ?? "")
          .toString()
          .trim()}`;

      if (!seen.has(key)) seen.add(key);
    }

    return seen.size;
  }, [rows, selectedCity]);

  // ---------- SORT HELPER ----------
  const getSortValue = (row) => {
    const n = (v) => {
      if (v === "" || v == null) return null;
      const num = typeof v === "number" ? v : Number(v);
      if (!Number.isFinite(num)) return null;
      return num > 0 ? num : null;
    };

    if (sortKey === "price5mg") return n(row.price5mg);
    if (sortKey === "price10mg") return n(row.price10mg);

    const prices = [
      n(row.price2_5mg),
      n(row.price5mg),
      n(row.price7_5mg),
      n(row.price10mg),
      n(row.price12_5mg),
      n(row.price15mg),
    ].filter((v) => v != null);

    return prices.length ? Math.min(...prices) : null;
  };

  // ---------- FILTER + SORT ----------
  const filteredAndSortedData = useMemo(() => {
    const filtered = rows.filter((row) => {
      return (
        cityMatchesSelected(row.city, selectedCity) &&
        typeMatchesSelected(row.type, selectedType) &&
        matchesKeyword(row, keyword)
      );
    });

    const dir = sortDir === "asc" ? 1 : -1;

    return filtered.slice().sort((a, b) => {
      const av = getSortValue(a);
      const bv = getSortValue(b);

      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;

      return (a.clinic || "").localeCompare(b.clinic || "", "zh-Hant");
    });
  }, [rows, selectedCity, selectedType, keyword, sortKey, sortDir]);

  // ---------- REPORT ----------
  const openReportModal = (row) => {
    setReportTarget(row);
    setReportError(null);
    setReportDistrict(row.district ?? "");
    setReportPrice2_5(row.price2_5mg ?? "");
    setReportPrice5(row.price5mg ?? "");
    setReportPrice7_5(row.price7_5mg ?? "");
    setReportPrice10(row.price10mg ?? "");
    setReportPrice12_5(row.price12_5mg ?? "");
    setReportPrice15(row.price15mg ?? "");
    setReportNote(row.note ?? "");
  };

  const closeReportModal = () => {
    setReportTarget(null);
    setReportSubmitting(false);
    setReportError(null);
  };

  const openClinicDetail = (clinicId) => {
    setDetailClinicId(clinicId);
    setDetailOpen(true);
  };

  const closeClinicDetail = () => {
    setDetailOpen(false);
    setDetailClinicId(null);
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;

    try {
      setReportSubmitting(true);
      setReportError(null);

      const body = {
        city: reportTarget.city,
        district: reportDistrict || reportTarget.district || null,
        clinic: reportTarget.clinic,
        type: reportTarget.type || "clinic",
        price2_5mg: toNullableInt(reportPrice2_5),
        price5mg: toNullableInt(reportPrice5),
        price7_5mg: toNullableInt(reportPrice7_5),
        price10mg: toNullableInt(reportPrice10),
        price12_5mg: toNullableInt(reportPrice12_5),
        price15mg: toNullableInt(reportPrice15),
        note: reportNote || null,
        last_updated: new Date().toISOString().slice(0, 10),
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/mounjaro_reports`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Submit failed");

      alert("🎉 回報成功！非常感謝你的熱心幫忙！");
      closeReportModal();
    } catch (err) {
      console.error(err);
      setReportError("送出失敗，請稍後再試");
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="price-page-root">
      <div className="price-page-inner">
        <header className="page-header">
          <h1 className="page-title">
            <span className="title-icon">📢</span> 全國價格公佈欄
          </h1>

          <p className="page-subtitle-text">
            大家好！這裡是整理各地診所與藥局價格的地方。
            <br />
            如果發現資訊有變動，歡迎協助回報更新喔！
            <br />
            {!loading && !error && (
              <span style={{ fontWeight: 800 }}>
                <span className="cute-count">
                  {selectedCity === "all"
                    ? "全國"
                    : cityDisplayName(selectedCity)}
                </span>
                目前總共{" "}
                <span className="cute-count">{totalLocationCount}</span>{" "}
                個合法通路可以購買囉！大家可以告訴大家不要找非法管道購買避免被騙！
              </span>
            )}
          </p>
        </header>

        <div className="info-banner warning-block">{texts.disclaimer}</div>

        {loading && <LoadingIndicator centered />}
        {error && <p className="status-text error">{error}</p>}

        <section className="control-card">
          {/* Cities */}
          <div className="filter-row">
            <div className="filter-wrap-container">
              {cityOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={`filter-btn ${c === selectedCity ? "active" : ""}`}
                >
                  {c === "all" ? "全部城市" : c}
                </button>
              ))}
            </div>
          </div>

          <div className="pp-divider" aria-hidden="true" />

          {/* Types */}
          <div className="filter-row">
            <div className="filter-wrap-container">
              <button
                onClick={() => setSelectedType("all")}
                className={`filter-btn ${
                  selectedType === "all" ? "active" : ""
                }`}
              >
                全部類型
              </button>

              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`filter-btn ${t === selectedType ? "active" : ""}`}
                >
                  {t === "clinic"
                    ? "診所"
                    : t === "hospital"
                    ? "醫院"
                    : t === "pharmacy"
                    ? "藥局"
                    : t === "medical_aesthetic"
                    ? "醫美"
                    : t}
                </button>
              ))}
            </div>
          </div>

          {selectedType === "pharmacy" && (
            <div className="warning-block small">{texts.pharmacyWarning}</div>
          )}
          {selectedType === "hospital" && (
            <div className="warning-block small">{texts.hospitalWarning}</div>
          )}

          <div className="pp-divider" aria-hidden="true" />

          {/* Doses */}
          <div className="filter-row">
            <div className="filter-wrap-container">
              <button
                onClick={() => setShowAllDoses(false)}
                className={`filter-btn ${!showAllDoses ? "active" : ""}`}
              >
                常見劑量
              </button>
              <button
                onClick={() => setShowAllDoses(true)}
                className={`filter-btn ${showAllDoses ? "active" : ""}`}
              >
                所有劑量
              </button>
            </div>
          </div>

          <div className="pp-divider" aria-hidden="true" />

          {/* Search */}
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              placeholder="搜尋地區、診所或藥局..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="pp-divider" aria-hidden="true" />

          {/* Sort quick (warning first) */}
          <div className="filter-row">
            <div className="filter-wrap-container">
              <button
                type="button"
                onClick={() => requestSort("price5mg", "asc")}
                className={`filter-btn sort-chip ${
                  sortKey === "price5mg" && sortDir === "asc" ? "active" : ""
                }`}
              >
                💰 5mg　低 → 高
              </button>

              <button
                type="button"
                onClick={() => requestSort("price10mg", "asc")}
                className={`filter-btn sort-chip ${
                  sortKey === "price10mg" && sortDir === "asc" ? "active" : ""
                }`}
              >
                💰 10mg　低 → 高
              </button>
            </div>
          </div>
        </section>

        {!loading && !error && (
          <>
            {isMobile ? (
              <PriceCardList
                data={filteredAndSortedData}
                showAllDoses={showAllDoses}
                onOpenReport={openReportModal}
                onOpenClinicDetail={openClinicDetail}
              />
            ) : (
              <PriceTable
                data={filteredAndSortedData}
                showAllDoses={showAllDoses}
                onOpenReport={openReportModal}
              />
            )}
          </>
        )}

        {reportTarget && (
          <PriceReportModal
            target={reportTarget}
            reportSubmitting={reportSubmitting}
            reportError={reportError}
            onClose={closeReportModal}
            handleSubmitReport={handleSubmitReport}
            reportDistrict={reportDistrict}
            setReportDistrict={setReportDistrict}
            reportPrice2_5={reportPrice2_5}
            setReportPrice2_5={setReportPrice2_5}
            reportPrice5={reportPrice5}
            setReportPrice5={setReportPrice5}
            reportPrice7_5={reportPrice7_5}
            setReportPrice7_5={setReportPrice7_5}
            reportPrice10={reportPrice10}
            setReportPrice10={setReportPrice10}
            reportPrice12_5={reportPrice12_5}
            setReportPrice12_5={setReportPrice12_5}
            reportPrice15={reportPrice15}
            setReportPrice15={setReportPrice15}
            reportNote={reportNote}
            setReportNote={setReportNote}
          />
        )}

        <ClinicDetailModal
          open={detailOpen}
          clinicId={detailClinicId}
          onClose={closeClinicDetail}
        />

        {/* Sort warning modal */}
        {showSortWarning && (
          <div className="modal-backdrop" onClick={cancelSort}>
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="價格排序提醒"
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 16,
                  marginBottom: 10,
                  color: "#c0392b",
                }}
              >
                ⚠️ 重要提醒
              </div>

              <div style={{ lineHeight: 1.7, fontWeight: 700, fontSize: 14 }}>
                <p>
                  若價格明顯偏低，為提供單次施打服務之診所，拿大劑量打小劑量，表面上價格較低，實際上未必較為划算。
                  島主認為肥胖應當成慢性病長期治療，除非有特殊理由，不然買整隻筆會比較好唷！
                </p>

                <p>
                  價格非選擇診所之唯一考量，專業有價；醫師的評估、治療規劃、後續追蹤與售後服務皆為重要因素。若是若經濟能力充裕，歡迎大家也能多支持台灣的好醫師而非一昧追求最低價唷！
                </p>
                <p>
                  此外，本站收錄之價格資訊來源眾多，無法逐一進行實地查證，近期相關詐騙案件增加，請勿任意匯款至不明帳戶。
                  <strong>請務必親自前往實體診所或藥局購買</strong>！
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 16,
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="filter-btn"
                  onClick={cancelSort}
                  style={{
                    borderColor: "#999",
                    color: "#555",
                    background: "#fff",
                  }}
                >
                  取消
                </button>

                <button
                  type="button"
                  className="filter-btn active"
                  onClick={confirmSort}
                >
                  我了解，繼續排序
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PricePage;
