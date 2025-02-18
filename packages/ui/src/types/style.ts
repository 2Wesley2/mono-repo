import { SxProps, Theme } from '@mui/material';

export type Styles = Record<string, SxProps<Theme>> | Record<string, Record<string, SxProps<Theme>>>;
