// pullDownMenu.tsx
"use client";
import React from "react";

type PullDownMenuProps = {
  months: string[];
  onMonthChange: (selectedMonth: string) => void;
};

const PullDownMenu: React.FC<PullDownMenuProps> = ({
  months,
  onMonthChange,
}) => {
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.value;
    onMonthChange(selectedMonth);
  };

  return (
    <div>
      <label htmlFor="months">Select a month:</label>
      <select id="months" name="months" onChange={handleMonthChange}>
        {months.map((month, index) => (
          <option key={index} value={`${index + 1}`}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PullDownMenu;
