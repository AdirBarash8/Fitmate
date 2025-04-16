import { useState } from "react";
import '../styles/components/CheckboxDropdown.css';

const CheckboxDropdown = ({ label, options, selectedValues, onChange }) => {
  const [open, setOpen] = useState(false);

  const toggleValue = (value) => {
    const updated = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];

    onChange(updated);
  };

  return (
    <div className="checkbox-dropdown">
      <label onClick={() => setOpen(!open)}>{label}</label>
      <div className={`dropdown-content ${open ? "show" : ""}`}>
        {options.map((opt) => (
          <label key={opt}>
            <input
              type="checkbox"
              checked={selectedValues.includes(opt)}
              onChange={() => toggleValue(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxDropdown;
