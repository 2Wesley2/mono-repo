import React, { useState, useEffect, useMemo, ChangeEvent, useCallback, memo, FC } from 'react';
import { List } from '@mui/material';
import { Tier } from '../../types/tier';
import { TierCard } from '../ui/tierCard';

const mockedTiers: Tier[] = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  minValue: index * 100,
  creditValue: (index + 1) * 5
}));
type EditingId = string | null;
type HandleEdit = (id: string) => void;
type SetTiers = React.Dispatch<React.SetStateAction<Tier[]>>;
type SetEditingId = React.Dispatch<React.SetStateAction<string | null>>;
type IHandleChange = <K extends keyof Omit<Tier, 'id'>>(
  id: string,
  field: K
) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
type TierChangePayload<K extends keyof Omit<Tier, 'id'>> = { id: string } & Required<Pick<Tier, K>>;

const TierListComponent: FC = () => {
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

        setTiers((prevTiers) => prevTiers.map((tier) => (tier.id === id ? { ...tier, ...change } : tier)));
      },
    [setTiers]
  );

  useEffect(() => {
    setTimeout(() => {
      setTiers(mockedTiers);
    });
  }, []);

  const cards: JSX.Element[] = useMemo(() => {
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
  }, [tiers, editingId, handleEdit, handleChange]);

  return <List>{cards}</List>;
};
TierListComponent.displayName = 'TierListComponent';
export const TierList = memo(TierListComponent);
