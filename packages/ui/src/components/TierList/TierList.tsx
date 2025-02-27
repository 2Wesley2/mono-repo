import React, { useState, useEffect, useMemo, useCallback, memo, FC } from 'react';
import { List, Box, Paper, Autocomplete, TextField } from '@mui/material';
import { Styles } from '../../types/style';
import { Tier, TierChangePayload, IHandleChange } from '../../types/tier';
import { TierCard } from '../ui/tierComponent';
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    },
    Box: {
      borderRadius: '100%'
    },
    IconAddMuiClasses: {}
  }
};

const fetchedOptions = ['crédito', 'recompensa'];
const rewardList = ['Recompensa 1', 'Recompensa 2', 'Recompensa 3'];

const mockedTiers: Tier[] = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  minValue: index * 100,
  creditValue: (index + 1) * 5,
  benefitType: 'crédito'
}));

type EditingId = string | null;
type HandleEdit = (id: string) => void;
type HandleAdd = () => void;

export const TierList: FC = memo(() => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [editingId, setEditingId] = useState<EditingId>(null);
  const [options, setOptions] = useState<string[]>([]);

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
        const inputValue = (e.target as HTMLInputElement).value;
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

  const handleSelect = useCallback(
    (id: string, value: 'crédito' | 'recompensa'): void => {
      setTiers((prevTiers: Tier[]) =>
        prevTiers.map((tier: Tier) =>
          tier.id === id
            ? {
                ...tier,
                benefitType: value,
                creditValue: value === 'crédito' ? tier.creditValue || 0 : undefined,
                rewardValues: value === 'recompensa' ? tier.rewardValues || [] : undefined
              }
            : tier
        )
      );
    },
    [setTiers]
  );

  const handleAutocompleteChange: IHandleChange = useCallback(
    (id, field) =>
      (e, newValue): void => {
        const updatedValues = Array.isArray(newValue) ? newValue : [];
        const change: TierChangePayload<typeof field> = {
          id,
          [field]: updatedValues
        } as TierChangePayload<typeof field>;

        setTiers((prevTiers: Tier[]) => prevTiers.map((tier) => (tier.id === id ? { ...tier, ...change } : tier)));
      },
    [setTiers]
  );

  useEffect(() => {
    setTimeout(() => {
      setOptions(fetchedOptions);
      setTiers(mockedTiers);
    });
  }, []);

  const cards: JSX.Element[] = useMemo(() => {
    return tiers.map((tier: Tier) => {
      const isEditing: boolean = editingId === tier.id;
      const minValue: string = 'Valor mínimo';
      const creditOption = tier.benefitType || options[0];
      return (
        <TierCard.Root key={tier.id}>
          <TierCard.Header
            title={tier.id}
            onEdit={() => handleEdit(tier.id)}
            onDelete={() => handleDelete(tier.id)}
            ModalEl={
              <TierItem.Select
                options={options}
                selected={creditOption}
                onSelect={(value) => handleSelect(tier.id, value as 'crédito' | 'recompensa')}
              />
            }
          />
          <Box sx={{ ...(((styles.TierList as Styles).Cards as Styles).Box as Styles) }}>
            <TierCard.ToggleInput
              key={tier.id + '-min'}
              title={minValue}
              label={minValue}
              value={tier.minValue}
              editing={isEditing}
              onChange={handleChange(tier.id, 'minValue')}
            />
            {tier.benefitType === 'recompensa' ? (
              isEditing ? (
                <Autocomplete
                  multiple={true}
                  fullWidth={true}
                  disableCloseOnSelect={true}
                  options={rewardList}
                  value={tier.rewardValues as string[]}
                  onChange={handleAutocompleteChange(tier.id, 'rewardValues')}
                  renderInput={(params) => <TextField {...params} fullWidth={true} label={creditOption} />}
                />
              ) : (
                <TierItem.Details title={creditOption} value={tier.rewardValues} />
              )
            ) : (
              <TierCard.ToggleInput
                key={tier.id + '-credit'}
                title={creditOption}
                label={creditOption}
                value={tier.creditValue}
                editing={isEditing}
                onChange={handleChange(tier.id, 'creditValue')}
              />
            )}
          </Box>
        </TierCard.Root>
      ) as JSX.Element;
    });
  }, [tiers, editingId, handleEdit, handleChange, handleDelete, handleSelect]);

  return (
    <>
      <List sx={{ ...((styles.TierList as Styles).List as Styles), width: '50%' }}>
        <Box component={Paper} sx={{ ...((styles.TierList as Styles).Box as Styles) }}>
          <TierItem.IconAdd onClick={handleAdd} sx={{ ...((styles.TierList as Styles).IconAddMuiClasses as Styles) }} />
        </Box>
        <Box
          sx={{
            ...((styles.TierList as Styles).List as Styles),
            overflowY: 'auto',
            width: '100%',
            minHeight: '0vh',
            maxHeight: '45vh',
            boxSizing: 'border-box'
          }}
        >
          {cards}
        </Box>
      </List>
    </>
  ) as JSX.Element;
});

TierList.displayName = 'TierList' as string;
