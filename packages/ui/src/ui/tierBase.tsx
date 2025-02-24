import React, { MouseEvent, FC, memo, useCallback, isValidElement } from 'react';
import { IconButton, Paper, ListItem, Typography } from '@mui/material';
import MuiModal from '@mui/material/Modal';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import {
  TierItemRootProps,
  TierIconEditProps,
  OnClickHandler,
  TierItemDetailsProps,
  TierItemComponents,
  TierIconDeleteProps,
  TierIconAddProps,
  ModalProps
} from '../types/tier';
import { Styles } from '../types/style';

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

const TierItemRoot: FC<TierItemRootProps> = memo((props: TierItemRootProps) => {
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
  const handleClick: OnClickHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClick(e);
    },
    [onClick]
  );

  return (
    <IconButton sx={{ ...(sx as Styles) }} edge={false} disableFocusRipple={true} onClick={handleClick}>
      <EditIcon />
    </IconButton>
  ) as JSX.Element;
});
TierIconEdit.displayName = 'TierIconEdit';

const TierIconDelete: FC<TierIconDeleteProps> = memo((props: TierIconDeleteProps) => {
  const { onClick, sx } = props;
  const handleClick: OnClickHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClick(e);
    },
    [onClick]
  );

  return (
    <IconButton sx={{ ...(sx as Styles) }} edge={false} disableFocusRipple onClick={handleClick}>
      <DeleteIcon />
    </IconButton>
  ) as JSX.Element;
});
TierIconDelete.displayName = 'TierIconDelete';

const TierIconAdd: FC<TierIconAddProps> = memo((props: TierIconAddProps) => {
  const { onClick, sx } = props;
  const handleClick: OnClickHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClick(e);
    },
    [onClick]
  );

  return (
    <IconButton sx={{ ...(sx as Styles) }} edge={false} onClick={handleClick}>
      <AddIcon />
    </IconButton>
  ) as JSX.Element;
});
TierIconAdd.displayName = 'TierIconAdd';

const Modal: FC<ModalProps> = memo((props: ModalProps) => {
  const { open, children, onClose } = props;
  const handleClose: () => void = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <MuiModal open={open} onClose={handleClose}>
      {isValidElement(children) ? children : <>{children}</>}
    </MuiModal>
  ) as JSX.Element;
});
Modal.displayName = 'Modal';

export const TierItem: TierItemComponents = {
  Root: TierItemRoot,
  Details: TierItemDetails,
  Modal: Modal,
  IconEdit: TierIconEdit,
  IconDelete: TierIconDelete,
  IconAdd: TierIconAdd
} as const;
