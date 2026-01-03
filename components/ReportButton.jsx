// src/components/ReportButton.jsx
import React, { useMemo, useState } from "react";
import ReportModal from "./ReportModal";

/**
 * A small, consistent report entry point.
 * Use this next to user-generated content (notes / price reports / clinic info).
 */
export default function ReportButton({
  itemLabel = "內容",
  targetId,
  targetType = "note",
  size = "md", // "sm" | "md"
  onSubmitted, // optional callback after submit
}) {
  const [open, setOpen] = useState(false);

  const cls = useMemo(() => {
    const base = "rp-btn";
    const s = size === "sm" ? "rp-btn--sm" : "rp-btn--md";
    return `${base} ${s}`;
  }, [size]);

  return (
    <>
      <button className={cls} onClick={() => setOpen(true)} type="button">
        <span className="rp-btn__icon" aria-hidden="true">
          ⚑
        </span>
        檢舉
      </button>

      <ReportModal
        open={open}
        onClose={() => setOpen(false)}
        itemLabel={itemLabel}
        targetId={targetId}
        targetType={targetType}
        onSubmitted={onSubmitted}
      />
    </>
  );
}
