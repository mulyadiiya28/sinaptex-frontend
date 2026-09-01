"use client";

import { useState, KeyboardEvent, ChangeEvent } from "react";
import { X, Plus, Tag as TagIcon } from "lucide-react";

interface TagInputProps {
  id?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  suggestions?: string[];
  disabled?: boolean;
  error?: string;
}

const DEFAULT_SUGGESTIONS = [
  "b2b",
  "supplier",
  "organik",
  "kemasan",
  "distribusi",
  "ekspor",
  "f&b",
  "logistik",
  "teknologi",
  "manufaktur",
  "jasa",
  "retail",
];

export function TagInput({
  id = "tags-input",
  tags = [],
  onChange,
  maxTags = 20,
  placeholder = "Ketik tag lalu tekan Enter atau koma…",
  suggestions = DEFAULT_SUGGESTIONS,
  disabled = false,
  error,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (text: string) => {
    const clean = text.trim().toLowerCase().replace(/^[#,]+/, "");
    if (!clean) return;

    if (tags.length >= maxTags) return;

    // Hindari duplikasi
    if (!tags.includes(clean)) {
      onChange([...tags, clean]);
    }
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    if (disabled) return;
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Hapus tag terakhir saat input kosong dan tekan backspace
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",");
      parts.forEach((p) => {
        if (p.trim()) addTag(p);
      });
      setInputValue("");
    } else {
      setInputValue(val);
    }
  };

  const availableSuggestions = suggestions.filter((s) => !tags.includes(s.toLowerCase()));

  return (
    <div className="space-y-2">
      {/* Box Input dengan Tag Chips di dalamnya */}
      <div
        className={`flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-lg border bg-white p-2 text-sm transition focus-within:ring-2 dark:bg-zinc-950 ${
          error
            ? "border-red-500 ring-red-500/30"
            : "border-zinc-300 ring-zinc-900 dark:border-zinc-700 dark:ring-zinc-100"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {/* Render Tag Chips */}
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 transition dark:bg-zinc-800 dark:text-zinc-200"
          >
            <TagIcon className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="ml-0.5 rounded p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                aria-label={`Hapus tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}

        {/* Input Text */}
        {tags.length < maxTags && (
          <div className="flex flex-1 items-center min-w-[140px]">
            <input
              id={id}
              type="text"
              disabled={disabled}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (inputValue.trim()) {
                  addTag(inputValue);
                }
              }}
              placeholder={tags.length === 0 ? placeholder : "Tambah tag…"}
              className="w-full bg-transparent px-1 py-1 text-sm outline-none placeholder:text-zinc-400 dark:text-zinc-50 dark:placeholder:text-zinc-600"
            />
            {inputValue.trim() && (
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                className="shrink-0 rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                title="Tambah tag"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info & Rekomendasi Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          {tags.length}/{maxTags} tag digunakan
        </span>
        <span className="text-[11px] text-zinc-400">Tekan Enter atau pisahkan dengan koma</span>
      </div>

      {/* Suggestion Chips */}
      {!disabled && availableSuggestions.length > 0 && tags.length < maxTags && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Saran:</span>
          {availableSuggestions.slice(0, 6).map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => addTag(sug)}
              className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-zinc-300 px-2 py-0.5 text-xs text-zinc-600 transition hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <Plus className="h-2.5 w-2.5" />
              {sug}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
