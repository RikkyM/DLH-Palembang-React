import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

const SearchableSelect = ({
  id,
  options,
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!inputRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHighlightedIndex(0);
    }
  }, [open]);

  const selectedOption = options?.find((opt) => opt.value === value);
  const filteredOptions =
    query.trim() === ""
      ? options
      : options.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase()),
        );

  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredOptions[highlightedIndex];
      if (selected) {
        onChange(selected.value);
        setQuery(selected.label);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const handleClear = () => {
    onChange("");
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="relative w-64" ref={inputRef}>
      <label htmlFor={id} className="relative">
        <input
          autoComplete="off"
          id={id}
          type="text"
          className="w-full rounded border p-2 pr-8"
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightedIndex(0);
          }}
          value={open ? query : selectedOption?.label || ""}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
            type="button"
            tabIndex={-1}
          >
            <X size={16} />
          </button>
        )}
      </label>

      {open && (
        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border bg-white shadow">
          {filteredOptions.length ? (
            filteredOptions.map((opt, index) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setQuery(opt.label);
                  setOpen(false);
                }}
                className={`cursor-pointer px-3 py-1 ${
                  index === highlightedIndex
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-1 text-gray-500">Tidak ditemukan</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default React.memo(SearchableSelect);
