// src/utils/priceHelpers.js
import { CITY_LABELS, TYPE_LABELS } from "../data/prices";

export const normalize = (value) =>
  (value ?? "").toString().trim().toLowerCase();

export const getCanonicalTypeCode = (rowTypeRaw) => {
  const n = normalize(rowTypeRaw || "clinic");
  if (TYPE_LABELS[n]) return n;
  return "clinic";
};

export const cityMatchesSelected = (rowCity, selectedCity) => {
  if (selectedCity === "all") return true;
  return rowCity === selectedCity;
};

export const typeMatchesSelected = (rowType, selectedType) => {
  if (selectedType === "all") return true;
  return (rowType || "clinic") === selectedType;
};

// Simple keyword search on major fields
export const matchesKeyword = (row, kwRaw) => {
  const kw = normalize(kwRaw);
  if (!kw) return true;

  const typeCode = getCanonicalTypeCode(row.type);
  const cityCode = row.city || "";
  const cityLabel = CITY_LABELS[cityCode] || "";
  const typeLabel = TYPE_LABELS[typeCode] || "";

  const fields = [
    row.clinic,
    row.district,
    cityCode,
    cityLabel,
    typeCode,
    typeLabel,
  ];

  return fields.filter(Boolean).some((f) => normalize(f).includes(kw));
};

export const formatPrice = (value) => {
  if (value === null || value === undefined || value === 0) return "";
  return value;
};

export const formatLastUpdated = (lastUpdatedRaw) => {
  if (!lastUpdatedRaw) return "";
  const d = new Date(lastUpdatedRaw);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

export const toNullableInt = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};
