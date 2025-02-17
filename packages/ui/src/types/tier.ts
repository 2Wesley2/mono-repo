import { ReactNode, FC, MouseEvent, ChangeEventHandler, ChangeEvent } from 'react';
import { SxProps, Theme } from '@mui/material';
export interface Tier {
  id: string;
  minValue: number;
  creditValue: number;
}

export type InputChangeHandler = ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;

export type OnClickHandler = (e: MouseEvent<HTMLButtonElement>) => void;

export type IHandleChange = <K extends keyof Omit<Tier, 'id'>>(
  id: string,
  field: K
) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
export type TierChangePayload<K extends keyof Omit<Tier, 'id'>> = { id: string } & Required<Pick<Tier, K>>;

export interface TierCardRootProps {
  onClick: OnClickHandler;
  children?: ReactNode;
  editing?: boolean;
  label?: string;
}

export interface TierToggleInputProps {
  onChange: InputChangeHandler;
  value: string | number;
  editing?: boolean;
}

export interface TierItemRootProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export interface TierIconEditProps {
  onClick: OnClickHandler;
  sx?: SxProps<Theme>;
}

export interface TierItemComponents {
  Root: FC<TierItemRootProps>;
  IconEdit: FC<TierIconEditProps>;
}

export interface TierCardComponents {
  Root: FC<TierCardRootProps>;
  ToggleInput: FC<TierToggleInputProps>;
}
