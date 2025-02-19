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
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export interface TierHeaderProps {
  onClick: OnClickHandler;
  title?: string;
  sx?: SxProps<Theme>;
}
export interface TierToggleInputProps {
  onChange: InputChangeHandler;
  value: string | number;
  editing?: boolean;
  title?: string;
  label?: string;
}

export interface TierItemRootProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export interface TierItemDetailsProps {
  title?: string;
  value: string | number;
  sxTitle?: SxProps<Theme>;
  sxValue?: SxProps<Theme>;
}

export interface TierIconEditProps {
  onClick: OnClickHandler;
  sx?: SxProps<Theme>;
}

export interface TierItemComponents {
  Root: FC<TierItemRootProps>;
  Details: FC<TierItemDetailsProps>;
  IconEdit: FC<TierIconEditProps>;
}

export interface TierCardComponents {
  Root: FC<TierCardRootProps>;
  ToggleInput: FC<TierToggleInputProps>;
  Header: FC<TierHeaderProps>;
}
