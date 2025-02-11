import React from 'react';
import { TierListProps } from '../../types/tiers';

export const TierList: React.FC<TierListProps> = ({ tiers, setTiers }) => {
  const handleInputChange = (id: number, field: string, value: number) => {
    setTiers((prevTiers) => prevTiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)));
  };

  return (
    <ul>
      {tiers.map((tier) => (
        <li key={tier.id}>
          <fieldset>
            <legend>Faixa {tier.id}</legend>
            <label htmlFor={`min-value-${tier.id}`}>Valor Mínimo:</label>
            <input
              type="number"
              id={`min-value-${tier.id}`}
              value={tier.minValue}
              onChange={(e) => handleInputChange(tier.id, 'minValue', Number(e.target.value))}
            />

            <label htmlFor={`credit-value-${tier.id}`}>Crédito Ganho:</label>
            <input
              type="number"
              id={`credit-value-${tier.id}`}
              value={tier.creditValue}
              onChange={(e) => handleInputChange(tier.id, 'creditValue', Number(e.target.value))}
            />
          </fieldset>
        </li>
      ))}
    </ul>
  );
};
