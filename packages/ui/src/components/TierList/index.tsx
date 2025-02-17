import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { List } from '@mui/material';
import { Tier } from '../../types/tier';
import { TierCard } from '../ui/tierCard';

const mockedTiers: Tier[] = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  minValue: index * 100,
  creditValue: (index + 1) * 5
}));

type IHandleChange = <K extends keyof Omit<Tier, 'id'>>(
  id: string,
  field: K
) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

type TierChangePayload<K extends keyof Omit<Tier, 'id'>> = { id: string } & Required<Pick<Tier, K>>;

export const TierList = () => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId((prev) => (prev === id ? null : id));
  };

  const handleChange: IHandleChange = (id, field) => (e) => {
    const inputValue = e.target.value;
    const newValue = isNaN(Number(inputValue)) ? inputValue : Number(inputValue);
    const change: TierChangePayload<typeof field> = {
      id,
      [field]: newValue
    } as TierChangePayload<typeof field>;

    setTiers((prevTiers) => prevTiers.map((tier) => (tier.id === id ? { ...tier, ...change } : tier)));
  };

  useEffect(() => {
    setTimeout(() => {
      setTiers(mockedTiers);
    }, 1000);
  }, []);

  const cards = useMemo(() => {
    return tiers.map((tier) => {
      const isEditing = editingId === tier.id;
      return (
        <TierCard.Root key={tier.id} label={tier.id} editing={isEditing} onClick={() => handleEdit(tier.id)}>
          <TierCard.ToggleInput
            key={tier.id + '-min'}
            value={tier.minValue}
            editing={isEditing}
            onChange={handleChange(tier.id, 'minValue')}
          />
          <TierCard.ToggleInput
            key={tier.id + '-credit'}
            value={tier.creditValue}
            editing={isEditing}
            onChange={handleChange(tier.id, 'creditValue')}
          />
        </TierCard.Root>
      );
    });
  }, [tiers, editingId]);

  return <List>{cards}</List>;
};
