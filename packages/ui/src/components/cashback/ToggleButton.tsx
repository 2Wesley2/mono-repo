import React, { useState } from 'react';
import { ToggleButton as ToggleButtonComponent } from '../../ui/toggleButton';

export const ToggleButton: React.FC<{ label: string }> = ({ label }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <ToggleButtonComponent toggled={isToggled} onChange={handleToggle} />
      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
    </label>
  );
};
