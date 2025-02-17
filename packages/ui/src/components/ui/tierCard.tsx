import React, { MouseEvent, useCallback, FC, memo } from 'react';
import { SxProps, Theme, Typography, TextField } from '@mui/material';
import { TierItem } from '../../ui/tier';

type InputChangeHandler = React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
type OnClickHandler = (e: MouseEvent<HTMLButtonElement>) => void;

interface TierCardRootProps {
  onClick: OnClickHandler;
  children?: React.ReactNode;
  editing?: boolean;
  label?: string;
  sx?: SxProps<Theme>;
}

const TierCardRootComponent: FC<TierCardRootProps> = (props) => {
  const { children, label, sx, onClick } = props;
  const handleIconClick: OnClickHandler = useCallback(
    (e) => {
      onClick(e);
    },
    [onClick]
  );
  return (
    <TierItem.Root sx={sx}>
      <Typography>Faixa {label}</Typography>
      <TierItem.IconEdit onClick={handleIconClick} />
      {children}
    </TierItem.Root>
  );
};

const MemoizedTierCardRoot = memo(TierCardRootComponent);
MemoizedTierCardRoot.displayName = 'TierCardRootComponent';

interface TierToggleInputProps {
  onChange: InputChangeHandler;
  value: string | number;
  editing?: boolean;
}

const TierToggleInputComponent: FC<TierToggleInputProps> = (props) => {
  const { onChange, value, editing } = props;
  return editing ? <TextField value={value} onChange={(e) => onChange(e)} /> : <Typography>{value}</Typography>;
};

const MemoizedTierToggleInput = memo(TierToggleInputComponent);
MemoizedTierToggleInput.displayName = 'TierToggleInputComponent';

type TierCardComponents = {
  Root: FC<TierCardRootProps>;
  ToggleInput: FC<TierToggleInputProps>;
};

export const TierCard: TierCardComponents = {
  Root: MemoizedTierCardRoot,
  ToggleInput: MemoizedTierToggleInput
} as const;
