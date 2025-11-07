"use client";

import { useState } from "react";

interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleGroupProps {
  label?: string;
  options: ToggleOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const ToggleGroup = ({
  label,
  options,
  defaultValue,
  onChange,
}: ToggleGroupProps) => {
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || options[0]?.value || ""
  );

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  return (
    <div className="toggle-group">
      {label && <label className="toggle-group-label">{label}</label>}
      <div className="toggle-group-buttons">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`toggle-button ${selectedValue === option.value ? "active" : ""}`}
            onClick={() => handleChange(option.value)}
            aria-pressed={selectedValue === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      <style jsx>{`
        .toggle-group {
          margin: var(--space-4, 16px) 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2, 8px);
        }

        .toggle-group-label {
          font-size: var(--text-sm, 14px);
          font-weight: var(--weight-medium, 500);
          color: var(--color-text-secondary, #6b7280);
        }

        .toggle-group-buttons {
          display: flex;
          gap: var(--space-2, 8px);
          flex-wrap: wrap;
        }

        .toggle-button {
          padding: var(--space-2, 8px) var(--space-3, 12px);
          font-size: var(--text-sm, 14px);
          font-weight: var(--weight-medium, 500);
          color: var(--color-text-secondary, #6b7280);
          background-color: var(--color-bg, #ffffff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-button:hover {
          border-color: var(--color-blue, #00d8ff);
          color: var(--color-text, #111827);
        }

        .toggle-button.active {
          background-color: var(--color-blue, #00d8ff);
          border-color: var(--color-blue, #00d8ff);
          color: #ffffff;
        }

        .toggle-button:focus-visible {
          outline: 2px solid var(--color-blue, #00d8ff);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default ToggleGroup;
