import React, { useState, useRef, useEffect } from "react";

const DropdownInput = ({
    id,
    label,
    placeholder = "Pilih atau ketik untuk mencari...",
    value,
    onChange,
    options = [],
    error,
    required = false,
    disabled = false,
    valueKey = "value",
    labelKey = "label",
    className = "",
    dropdownClassName = "",
    noDataText = "Tidak ada data ditemukan",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [displayValue, setDisplayValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const optionRefs = useRef([]);

    const filteredOptions = options.filter((option) =>
        option[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setHighlightedIndex(-1);
    }, [filteredOptions.length]);

    useEffect(() => {
        if (value) {
            const selectedOption = options.find(
                (option) => option[valueKey] === value
            );
            setDisplayValue(selectedOption ? selectedOption[labelKey] : "");
        } else {
            setDisplayValue("");
        }
    }, [value, options, valueKey, labelKey]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearchTerm("");
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputClick = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            setSearchTerm("");
            setHighlightedIndex(-1);
        }
    };

    const handleInputChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setIsOpen(true);
        setHighlightedIndex(-1);
    };

    const handleOptionSelect = (option) => {
        onChange(option[valueKey]);
        setDisplayValue(option[labelKey]);
        setSearchTerm("");
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
    };

    const scrollToOption = (index) => {
        if (optionRefs.current[index]) {
            optionRefs.current[index].scrollIntoView({
                block: "nearest",
                behavior: "smooth",
            });
        }
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (
                e.key === "ArrowDown" ||
                e.key === "ArrowUp" ||
                e.key === "Enter"
            ) {
                e.preventDefault();
                setIsOpen(true);
                setSearchTerm("");
                setHighlightedIndex(-1);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                const nextIndex =
                    highlightedIndex < filteredOptions.length - 1
                        ? highlightedIndex + 1
                        : 0;
                setHighlightedIndex(nextIndex);
                scrollToOption(nextIndex);
                break;

            case "ArrowUp":
                e.preventDefault();
                const prevIndex =
                    highlightedIndex > 0
                        ? highlightedIndex - 1
                        : filteredOptions.length - 1;
                setHighlightedIndex(prevIndex);
                scrollToOption(prevIndex);
                break;

            case "Enter":
                e.preventDefault();
                if (
                    highlightedIndex >= 0 &&
                    filteredOptions[highlightedIndex]
                ) {
                    handleOptionSelect(filteredOptions[highlightedIndex]);
                }
                break;

            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setSearchTerm("");
                setHighlightedIndex(-1);
                inputRef.current?.blur();
                break;

            case "Tab":
                setIsOpen(false);
                setSearchTerm("");
                setHighlightedIndex(-1);
                break;

            default:
                setHighlightedIndex(-1);
                break;
        }
    };

    return (
        <div
            className={`flex flex-col gap-1.5 text-sm ${className}`}
            ref={dropdownRef}
        >
            {label && (
                <label
                    htmlFor={id}
                    className={
                        required ? "after:content-['*'] after:text-red-500" : ""
                    }
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    ref={inputRef}
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 bg-gray-200 outline-none rounded cursor-pointer ${
                        disabled ? "cursor-not-allowed opacity-50" : ""
                    } ${error ? "border border-red-500" : ""}`}
                    value={isOpen ? searchTerm : displayValue}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    autoComplete="off"
                />

                {/* Dropdown Arrow */}
                <div
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                        disabled ? "opacity-50" : ""
                    }`}
                >
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div
                        className={`absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto ${dropdownClassName}`}
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={`${option[valueKey]}-${index}`}
                                    ref={(el) =>
                                        (optionRefs.current[index] = el)
                                    }
                                    className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                        index === highlightedIndex
                                            ? "bg-blue-100 text-blue-900"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => handleOptionSelect(option)}
                                    onMouseEnter={() =>
                                        setHighlightedIndex(index)
                                    }
                                >
                                    {option[labelKey]}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-500 text-center">
                                {noDataText}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
};

export default DropdownInput;
