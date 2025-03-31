"use client";

import React, { useState, useRef, useEffect } from "react";

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
};

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle selection of an option
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((val) => val !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  // Format display text for selected options
  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }

    if (selectedValues.length === 1) {
      const option = options.find((opt) => opt.value === selectedValues[0]);
      return option ? option.label : selectedValues[0];
    }

    return `${selectedValues.length} options selected`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full p-2 border rounded flex justify-between items-center cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="truncate">{getDisplayText()}</div>
        <div>
          <svg
            className={`w-4 h-4 transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 border rounded bg-white z-10 max-h-60 overflow-auto shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className="p-2 cursor-pointer hover:bg-gray-100 flex items-center"
              onClick={() => toggleOption(option.value)}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => {}}
                className="mr-2"
              />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
