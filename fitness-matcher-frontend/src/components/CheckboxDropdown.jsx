import { useState, useRef, useEffect } from "react";
import "../styles/components/CheckboxDropdown.css";

const CheckboxDropdown = ({ label, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const isAllSelected = selectedValues.length === options.length;
  const toggleSelectAll = () => {
    onChange(isAllSelected ? [] : [...options]);
  };

  const handleCheckboxChange = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="checkbox-dropdown" ref={dropdownRef}>
      <button type="button" className="dropdown-toggle" onClick={toggleDropdown}>
        {label} ({selectedValues.length} selected)
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-option select-all">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              id="selectAll"
            />
            <label htmlFor="selectAll">Select All</label>
          </div>
          <div className="options-scroll">
            {options.map((option, index) => (
              <div className="dropdown-option" key={index}>
                <input
                  type="checkbox"
                  id={`${label}-${option}`}
                  checked={selectedValues.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
                <label htmlFor={`${label}-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckboxDropdown;
