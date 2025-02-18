import React, { useState, useEffect, useMemo, Dispatch, SetStateAction, useCallback, memo, FC } from 'react';
import { List } from '@mui/material';
import { Tier, TierChangePayload, IHandleChange } from '../../types/tier';
import { TierCard } from '../ui/tierCard';

const mockedTiers: Tier[] = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  minValue: index * 100,
  creditValue: (index + 1) * 5
}));
type EditingId = string | null;
type HandleEdit = (id: string) => void;
type SetTiers = Dispatch<SetStateAction<Tier[]>>;
type SetEditingId = Dispatch<SetStateAction<EditingId>>;

export const TierList: FC = memo(() => {
  const [tiers, setTiers]: [Tier[], SetTiers] = useState<Tier[]>([]);
  const [editingId, setEditingId]: [EditingId, SetEditingId] = useState<EditingId>(null);

  const handleEdit: HandleEdit = useCallback(
    (id: string): void => {
      setEditingId((prev) => (prev === id ? null : id));
    },
    [setEditingId]
  );

  const handleChange: IHandleChange = useCallback(
    (id, field) =>
      (e): void => {
        const inputValue = e.target.value;
        const newValue = isNaN(Number(inputValue)) ? inputValue : Number(inputValue);
        const change: TierChangePayload<typeof field> = {
          id,
          [field]: newValue
        } as TierChangePayload<typeof field>;

        setTiers((prevTiers: Tier[]) =>
          prevTiers.map((tier: Tier) => (tier.id === id ? { ...tier, ...change } : tier))
        );
      },
    [setTiers]
  );

  useEffect(() => {
    setTimeout(() => {
      setTiers(mockedTiers);
    });
  }, []);

  const cards: JSX.Element[] = useMemo(() => {
    return tiers.map((tier: Tier) => {
      const isEditing: boolean = editingId === tier.id;
      const minValue: string = 'Valor mínimo';
      const creditValue: string = 'Crédito';
      return (
        <TierCard.Root key={tier.id} label={tier.id} editing={isEditing} onClick={() => handleEdit(tier.id)}>
          <TierCard.ToggleInput
            key={tier.id + '-min'}
            title={minValue}
            label={minValue}
            value={tier.minValue}
            editing={isEditing}
            onChange={handleChange(tier.id, 'minValue')}
          />
          <TierCard.ToggleInput
            key={tier.id + '-credit'}
            title={creditValue}
            label={creditValue}
            value={tier.creditValue}
            editing={isEditing}
            onChange={handleChange(tier.id, 'creditValue')}
          />
        </TierCard.Root>
      );
    });
  }, [tiers, editingId, handleEdit, handleChange]);

  return <List>{cards}</List>;
});
TierList.displayName = 'TierList';
