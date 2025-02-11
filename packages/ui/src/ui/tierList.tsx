import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { FaPencilAlt } from 'react-icons/fa';
import { cn } from '../lib/utils';
import { TierListPropsUI } from '../types/tiers';

const tierCardVariants = cva('relative rounded p-4', {
  variants: {
    editing: {
      true: 'border border-blue-600',
      false: 'border border-gray-300'
    }
  },
  defaultVariants: {
    editing: false
  }
});

const fieldContentVariants = cva('', {
  variants: {
    editing: {
      true: 'mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary-200',
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
  return (
    <ul className="space-y-4">
      {tiers.map((tier) => (
        <li key={tier.id}>
          <fieldset className={cn(tierCardVariants({ editing: editingTier[tier.id] || false }))}>
            <legend className="px-2 font-semibold">Faixa {tier.id}</legend>
            <FaPencilAlt
              onClick={() => onToggleEditing(tier.id)}
              className="absolute top-2 right-2 cursor-pointer text-gray-600 hover:text-gray-800"
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
