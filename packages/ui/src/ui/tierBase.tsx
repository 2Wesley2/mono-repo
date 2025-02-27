import React, { MouseEvent, FC, memo, cloneElement, useState, useCallback } from 'react';
import { IconButton, Paper, ListItem, Typography, Menu, MenuItem } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import {
  TierItemDetailsProps,
  TierItemComponents,
  TierItemSelectProps,
  TierMoreOptionsProps,
  ComponentWithOnClick,
  ComponentWithChildren
} from '../types/tier';
import { Styles } from '../types/style';

type TierIconEditProps = ComponentWithOnClick;
type TierIconDeleteProps = ComponentWithOnClick;
type TierIconAddProps = ComponentWithOnClick;

const styles: Styles = {
  TierItemRoot: {
    ListItem: {
      display: 'flex',
      width: '100%'
    }
  },
  TierItemDetails: {
    Typography: {
      width: '100%'
    }
  }
};

const TierItemRoot: FC<ComponentWithChildren> = memo((props: ComponentWithChildren) => {
  const { children, sx } = props;
  return (
    <ListItem
      component={Paper}
      tabIndex={0}
      role="group"
      square={true}
      disableGutters={false}
      divider={true}
      sx={{ ...((styles.TierItemRoot as Styles).ListItem as Styles), ...(sx as Styles) }}
    >
      {children}
    </ListItem>
  ) as JSX.Element;
});
TierItemRoot.displayName = 'TierItemRoot';

const TierItemDetails: FC<TierItemDetailsProps> = memo((props: TierItemDetailsProps) => {
  const { title, value, sxTitle, sxValue } = props;
  return (
    <Typography sx={{ ...((styles.TierItemDetails as Styles).Typography as Styles), ...(sxValue as Styles) }}>
      {title && (
        <Typography
          variant="subtitle2"
          sx={{ ...((styles.TierItemDetails as Styles).Typography as Styles), ...(sxTitle as Styles) }}
        >
          {title}
        </Typography>
      )}
      {value}
    </Typography>
  ) as JSX.Element;
});
TierItemDetails.displayName = 'TierItemDetails';

const TierIconEdit: FC<TierIconEditProps> = memo((props: TierIconEditProps) => {
  const { onClick, sx } = props;
  return (
    <IconButton sx={{ ...(sx as Styles) }} edge={false} disableFocusRipple={true} onClick={onClick}>
      <EditIcon />
    </IconButton>
  ) as JSX.Element;
});
TierIconEdit.displayName = 'TierIconEdit';

const TierIconDelete: FC<TierIconDeleteProps> = memo((props: TierIconDeleteProps) => {
  const { onClick, sx } = props;
  return (
    <IconButton sx={{ ...(sx as Styles) }} edge={false} disableFocusRipple onClick={onClick}>
      <DeleteIcon />
    </IconButton>
  ) as JSX.Element;
});
TierIconDelete.displayName = 'TierIconDelete';

const TierIconAdd: FC<TierIconAddProps> = memo((props: TierIconAddProps) => {
  const { onClick, sx } = props;
  return (
    <IconButton sx={{ ...(sx as Styles) }} edge={false} onClick={onClick}>
      <AddIcon />
    </IconButton>
  ) as JSX.Element;
});
TierIconAdd.displayName = 'TierIconAdd';

const TierMoreOptions: FC<TierMoreOptionsProps> = memo((props) => {
  const { triggerEl, labelTrigger, menuItems = [], sx } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      {triggerEl ? (
        cloneElement(triggerEl, { onClick: handleOpen })
      ) : (
        <Typography sx={sx} onClick={handleOpen}>
          {labelTrigger}
        </Typography>
      )}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              handleClose();
            }}
          >
            {item.element || item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  ) as JSX.Element;
});
TierMoreOptions.displayName = 'TierMoreOptions';

const TierItemSelect: FC<TierItemSelectProps> = memo((props: TierItemSelectProps) => {
  const { options, selected, onSelect, sx } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleAnchorChange = useCallback((newAnchorEl: HTMLElement | null) => {
    setAnchorEl(newAnchorEl);
  }, []);

  return (
    <>
      <Typography sx={{ ...(sx as Styles) }}>
        <span onClick={(event: MouseEvent<HTMLSpanElement>) => handleAnchorChange(event.currentTarget)}>
          {selected}
        </span>
      </Typography>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleAnchorChange(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {options.map((option: string) => (
          <MenuItem
            key={option}
            onClick={() => {
              onSelect(option);
              handleAnchorChange(null);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  ) as JSX.Element;
});
TierItemSelect.displayName = 'TierItemSelect';

export const TierItem: TierItemComponents = {
  Root: TierItemRoot,
  Details: TierItemDetails,
  IconEdit: TierIconEdit,
  IconDelete: TierIconDelete,
  IconAdd: TierIconAdd,
  Select: TierItemSelect,
  MoreOptions: TierMoreOptions
} as const;
