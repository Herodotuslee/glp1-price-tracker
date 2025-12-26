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
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [keyword, setKeyword] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAllDoses, setShowAllDoses] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const url = `${SUPABASE_URL}/rest/v1/mounjaro_data?select=*`;
        const res = await fetch(url, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        if (!cancelled) setRows(data || []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("載入失敗... 請檢查網路連線後再試一次！");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const cityOptions = useMemo(() => {
    const uniqueCities = Array.from(
      new Set(rows.map((r) => r.city).filter(Boolean))
    );
    return ["all", ...uniqueCities];
  }, [rows]);

  const filteredData = useMemo(
    () =>
      rows.filter((row) => {
        const cityOk = cityMatchesSelected(row.city, selectedCity);
        const typeOk = typeMatchesSelected(row.type, selectedType);
        const kwOk = matchesKeyword(row, keyword);
        return cityOk && typeOk && kwOk;
      }),
    [rows, selectedCity, selectedType, keyword]
  );

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
    setReportError(null);
    setReportSubmitting(false);
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

      const url = `${SUPABASE_URL}/rest/v1/mounjaro_reports`;
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

      const res = await fetch(url, {
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
      setReportError("傳送失敗了... 請稍後再試試看！");
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
          </p>
        </header>

        <div className="info-banner warning-block">{texts.disclaimer}</div>

        {loading && <LoadingIndicator centered={true} />}
        {error && <p className="status-text error">{error}</p>}

        <section className="control-card">
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

          {selectedType === "pharmacy" && (
            <div className="warning-block small">{texts.pharmacyWarning}</div>
          )}
          {selectedType === "hospital" && (
            <div className="warning-block small">{texts.hospitalWarning}</div>
          )}

          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              placeholder="搜尋地區、診所或藥局..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
          </div>
        </section>

        {!loading && !error && (
          <>
            {isMobile ? (
              <PriceCardList
                data={filteredData}
                showAllDoses={showAllDoses}
                onOpenReport={openReportModal}
                onOpenClinicDetail={openClinicDetail}
              />
            ) : (
              <PriceTable
                data={filteredData}
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
      </div>
    </div>
  );
}

export default PricePage;
