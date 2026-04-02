"use client";

import { useEffect, useState } from "react";

export function formatDate(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const inputCls =
  "w-full bg-white border border-[#209dd7] rounded px-2 py-1 text-[13px] " +
  "focus:outline-none focus:ring-2 focus:ring-[#209dd7]/30";

/** Inline-editable text field */
export function InlineEdit({
  value,
  placeholder,
  onChange,
  multiline = false,
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const safeValue = value ?? "";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(safeValue);

  useEffect(() => {
    if (!editing) setDraft(safeValue);
  }, [safeValue, editing]);

  function startEditing() {
    setDraft(safeValue);
    setEditing(true);
  }

  function commit() {
    onChange(draft);
    setEditing(false);
  }

  if (!editing) {
    return (
      <span
        onClick={startEditing}
        title="Click to edit"
        className="cursor-text hover:bg-[#ecad0a]/10 rounded px-0.5 -mx-0.5 transition-colors"
      >
        {safeValue.trim() ? safeValue : <span className="italic text-gray-300">[{placeholder}]</span>}
      </span>
    );
  }

  if (multiline) {
    return (
      <textarea
        autoFocus
        rows={3}
        className={inputCls + " resize-none block"}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
      />
    );
  }

  return (
    <input
      autoFocus
      type="text"
      className={inputCls + " block"}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      }}
    />
  );
}

/** Inline-editable date field — displays formatted date, edits as ISO string */
export function InlineDateEdit({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <span
        onClick={() => setEditing(true)}
        title="Click to edit"
        className="cursor-text hover:bg-[#ecad0a]/10 rounded px-0.5 -mx-0.5 transition-colors"
      >
        {value ? formatDate(value) : <span className="italic text-gray-300">[Date]</span>}
      </span>
    );
  }

  return (
    <input
      autoFocus
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setEditing(false)}
      className="bg-white border border-[#209dd7] rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#209dd7]/30"
    />
  );
}
