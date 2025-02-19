import React, { useState, useEffect, useMemo, Dispatch, SetStateAction, useCallback, memo, FC } from 'react';
import { List, Box } from '@mui/material';
import { Styles } from '../../types/style';
import { Tier, TierChangePayload, IHandleChange } from '../../types/tier';
import { TierCard } from '../../components/ui/tierComponent';

const styles: Styles = {
  TierList: {
    Box: {
      display: 'flex',
      width: '100%',
      gap: '1rem'
    } as Styles,
    List: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    } as Styles
  } as Styles
} as Styles;

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
    [setEditingId as SetEditingId]
  );

  const handleDelete: HandleEdit = useCallback(
    (id: string): void => {
      setTiers((prevTiers: Tier[]) => prevTiers.filter((tier: Tier) => tier.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    },
    [editingId]
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
    [setTiers as SetTiers]
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
        <TierCard.Root key={tier.id}>
          <TierCard.Header title={tier.id} onEdit={() => handleEdit(tier.id)} onDelete={() => handleDelete(tier.id)} />
          <Box sx={{ ...((styles.TierList as Styles).Box as Styles) }}>
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
          </Box>
        </TierCard.Root>
      ) as JSX.Element;
    });
  }, [tiers as Tier[], editingId as EditingId, handleEdit as HandleEdit, handleChange as IHandleChange]);

  return (<List sx={{ ...((styles.TierList as Styles).List as Styles) }}>{cards}</List>) as JSX.Element;
});

TierList.displayName = 'TierList' as string;
