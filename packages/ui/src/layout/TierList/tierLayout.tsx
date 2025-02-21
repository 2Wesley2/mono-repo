import React, { useState, useEffect, useMemo, useCallback, memo, FC } from 'react';
import { List, Box, Paper } from '@mui/material';
import { Styles } from '../../types/style';
import { Tier, TierChangePayload, IHandleChange } from '../../types/tier';
import { TierCard } from '../../components/ui/tierComponent';
import { TierItem } from '../../ui/tierBase';

const styles: Styles = {
  TierList: {
    Cards: {
      Box: {
        display: 'flex',
        width: '100%',
        gap: '1rem'
      }
    },
    List: {
      flex: '1 1 0%',
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
      alignItems: 'center',
      gap: '1rem',
      height: '90%',
      overflowY: 'auto',
      padding: '1%'
    },
    Box: {
      borderRadius: '100%'
    }
  }
};

const mockedTiers: Tier[] = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  minValue: index * 100,
  creditValue: (index + 1) * 5
}));

type EditingId = string | null;
type HandleEdit = (id: string) => void;
type HandleAdd = () => void;

export const TierList: FC = memo(() => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [editingId, setEditingId] = useState<EditingId>(null);

  const handleEdit: HandleEdit = useCallback(
    (id: string): void => {
      setEditingId((prev) => (prev === id ? null : id));
    },
    [setEditingId]
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
    [setTiers]
  );

  const handleAdd: HandleAdd = useCallback((): void => {
    setTiers((prevTiers: Tier[]) => {
      const nextId = String(prevTiers.reduce((max, tier) => Math.max(max, Number(tier.id)), 0) + 1);
      return [...(prevTiers as Tier[]), { id: nextId, minValue: 0, creditValue: 0 } as Tier];
    });
  }, []);

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
          <Box sx={{ ...(((styles.TierList as Styles).Cards as Styles).Box as Styles) }}>
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
  }, [tiers, editingId, handleEdit, handleChange, handleDelete]);

  return (
    <List className="LISTAAAAAAAAAAAAAAAAA" sx={{ ...((styles.TierList as Styles).List as Styles) }}>
      <Box component={Paper} sx={{ ...((styles.TierList as Styles).Box as Styles) }}>
        <TierItem.IconAdd onClick={handleAdd} sx={{ ...((styles.TierList as Styles).IconAddMuiClasses as Styles) }} />
      </Box>
      {cards}
    </List>
  ) as JSX.Element;
});

TierList.displayName = 'TierList' as string;
