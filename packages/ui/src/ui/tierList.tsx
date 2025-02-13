import React, { useState } from 'react';
import { Card, Input, IconButton } from '@material-tailwind/react';
import { TierListPropsUI } from '../types/tiers';

interface TierFieldProps {
  label: string;
  fieldId: string;
  value: number;
  editing: boolean;
  onChange: (value: number) => void;
}

const TierField: React.FC<TierFieldProps> = ({ label, fieldId, value, editing, onChange }) => {
  return (
    <div className="mb-4">
      {editing ? (
        <Input
          type="number"
          label={label}
          id={fieldId}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          crossOrigin={undefined}
        />
      ) : (
        <>
          <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <p className="mt-1 text-gray-900">{value}</p>
        </>
      )}
    </div>
  );
};

export const TierList: React.FC<TierListPropsUI> = ({ tiers, editingTier, onToggleEditing, onChange }) => {
  const [focusedTier, setFocusedTier] = useState<string | number | null>(null);
  return (
    <ul className="flex flex-col flex-1 min-h-0 overflow-y-auto space-y-4">
      {tiers.map((tier) => (
        <li key={tier.id}>
          <Card
            className={`relative p-6 transition-all duration-200 
              ${editingTier[tier.id] ? 'border border-blue-600 bg-blue-50 hover:shadow-xl' : 'border border-gray-300 bg-white hover:shadow-md'} 
              ${focusedTier === tier.id ? 'ring-2 ring-blue-400 shadow-2xl' : ''}`}
            tabIndex={0}
            onFocus={() => setFocusedTier(tier.id)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setFocusedTier(null);
              }
            }}
            placeholder=""
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-semibold">Faixa {tier.id}</h5>
              <IconButton
                onClick={() => onToggleEditing(tier.id)}
                className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
                placeholder=""
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487a2.05 2.05 0 112.829 2.83l-10.5 10.5-4.75 1.5 1.5-4.75 10.5-10.5z"
                  />
                </svg>
              </IconButton>
            </div>
            <TierField
              label="Valor Mínimo:"
              fieldId={`min-value-${tier.id}`}
              value={tier.minValue}
              editing={!!editingTier[tier.id]}
              onChange={(newVal) => onChange(tier.id, 'minValue', newVal)}
            />
            <TierField
              label="Crédito Ganho:"
              fieldId={`credit-value-${tier.id}`}
              value={tier.creditValue}
              editing={!!editingTier[tier.id]}
              onChange={(newVal) => onChange(tier.id, 'creditValue', newVal)}
            />
          </Card>
        </li>
      ))}
    </ul>
  );
};
