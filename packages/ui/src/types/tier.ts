import { ReactNode, FC, MouseEvent, ChangeEventHandler, ChangeEvent } from 'react';
import { SxProps, Theme } from '@mui/material';

export type InputChangeHandler = ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
export type OnClickHandler = (e: MouseEvent<HTMLButtonElement>) => void;

export interface Tier {
  id: string;
  minValue: number;
  creditValue: number;
}

export type IHandleChange = <K extends keyof Omit<Tier, 'id'>>(
  id: string,
  field: K
) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

export type TierChangePayload<K extends keyof Omit<Tier, 'id'>> = { id: string } & Required<Pick<Tier, K>>;

export interface ComponentWithChildren {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export interface ComponentWithOnClick {
  onClick?: OnClickHandler;
  sx?: SxProps<Theme>;
}
export interface TierHeaderProps {
  title?: string;
  sx?: SxProps<Theme>;
  onEdit: () => void;
  onDelete: () => void;
  ModalEl?: ReactNode | null;
}

export interface TierToggleInputProps {
  onChange: InputChangeHandler;
  value: string | number;
  editing?: boolean;
  title?: string;
  label?: string;
}

export interface TierCardComponents {
  Root: FC<ComponentWithChildren>;
  ToggleInput: FC<TierToggleInputProps>;
  Header: FC<TierHeaderProps>;
}

export interface TierItemDetailsProps {
  title?: string;
  sx?: SxProps<Theme>;
  value: string | number;
  sxValue?: SxProps<Theme>;
  sxTitle?: SxProps<Theme>;
}

export interface TierItemSelectProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  sx?: SxProps<Theme>;
}

export interface TierItemComponents {
  Root: FC<ComponentWithChildren>;
  Details: FC<TierItemDetailsProps>;
  IconEdit: FC<ComponentWithOnClick>;
  IconDelete: FC<ComponentWithOnClick>;
  IconAdd: FC<ComponentWithOnClick>;
  Select: FC<TierItemSelectProps>;
  MoreOptions: FC<TierMoreOptionsProps>;
}

export interface MenuItemProps {
  label?: string;
  onClick: () => void;
  element?: JSX.Element;
}

export interface TierMoreOptionsProps {
  menuItems?: MenuItemProps[];
  triggerEl?: JSX.Element;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onOpen: (event: MouseEvent<HTMLElement>) => void;
  sx?: SxProps<Theme>;
  labelTrigger?: string;
}
