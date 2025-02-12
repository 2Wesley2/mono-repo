import React, { useState } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { FaPencilAlt } from 'react-icons/fa';
import { cn } from '../lib/utils';
import { TierListPropsUI } from '../types/tiers';

const tierCardVariants = cva('relative rounded-lg p-6 transition-all duration-200', {
  variants: {
    editing: {
      true: 'border border-blue-600 bg-blue-50 hover:shadow-xl',
      false: 'border border-gray-300 bg-white hover:shadow-md'
    },
    focused: {
      true: 'ring-2 ring-blue-400 shadow-2xl', // aplica destaque extra com ring e sombra
      false: ''
    }
  },
  defaultVariants: {
    editing: false,
    focused: false
  }
});

const fieldContentVariants = cva('', {
  variants: {
    editing: {
      true: 'mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm  hover:border-gray-400 focus:border-blue-500 focus:ring focus:outline-none focus:ring-2 focus:ring-blue-500',
      false: 'mt-1 text-gray-900'
    }
  },
  defaultVariants: {
    editing: false
  }
});

interface TierFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof fieldContentVariants> {
  label: string;
  fieldId: string;
  value: number;
  editing: boolean;
  onChange: (value: number) => void;
}

const TierField: React.FC<TierFieldProps> = ({ label, fieldId, value, editing, onChange }) => {
  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {editing ? (
        <input
          type="number"
          id={fieldId}
          className={cn(fieldContentVariants({ editing: true }))}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : (
        <p className={cn(fieldContentVariants({ editing: false }))}>{value}</p>
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
          <fieldset
            tabIndex={0}
            onFocus={() => setFocusedTier(tier.id)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setFocusedTier(null);
              }
            }}
            className={cn(
              tierCardVariants({ editing: editingTier[tier.id] || false, focused: focusedTier === tier.id })
            )}
          >
            <legend className="px-2 font-semibold">Faixa {tier.id}</legend>
            <FaPencilAlt
              onClick={() => onToggleEditing(tier.id)}
              className="absolute top-2 right-2 cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
            />
            <TierField
              label="Valor Mínimo:"
              fieldId={`min-value-${tier.id}`}
              value={tier.minValue}
              editing={editingTier[tier.id] || false}
              onChange={(newVal) => onChange(tier.id, 'minValue', newVal)}
            />
            <TierField
              label="Crédito Ganho:"
              fieldId={`credit-value-${tier.id}`}
              value={tier.creditValue}
              editing={editingTier[tier.id] || false}
              onChange={(newVal) => onChange(tier.id, 'creditValue', newVal)}
            />
          </fieldset>
        </li>
      ))}
    </ul>
  );
};
