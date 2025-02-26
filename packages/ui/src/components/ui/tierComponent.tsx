import React, { MouseEvent, FC, memo, useState, useCallback } from 'react';
import { Typography, TextField, Box, Modal } from '@mui/material';
import { TierItem } from '../../ui/tierBase';
import { Styles } from '../../types/style';
import { TierHeaderProps, TierToggleInputProps, TierCardComponents, ComponentWithChildren } from '../../types/tier';

const styles: Styles = {
  TierCardRoot: {
    Root: { flexDirection: 'column' }
  },
  TierHeader: {
    Box: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between'
    },
    Modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    BackdropProps: {
      backdrop: {
        style: { backgroundColor: 'rgba(0, 0, 0, 0.2)' }
      }
    },
    BoxModal: {
      backgroundColor: '#000000'
    }
  }
};

const TierCardRoot: FC<ComponentWithChildren> = memo((props: ComponentWithChildren) => {
  const { children, sx } = props;
  return (
    <TierItem.Root sx={{ ...((styles.TierCardRoot as Styles).Root as Styles), ...(sx as Styles) }}>
      {children}
    </TierItem.Root>
  ) as JSX.Element;
});

TierCardRoot.displayName = 'TierCardRoot' as string;

const TierHeader: FC<TierHeaderProps> = memo((props: TierHeaderProps) => {
  const { title, onEdit, onDelete, sx, ModalEl } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpen = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <Box sx={{ ...((styles.TierHeader as Styles).Box as Styles), ...(sx as Styles) }}>
      <Typography>Faixa {title}</Typography>
      <Box>
        <TierItem.MoreOptions
          triggerEl={<TierItem.IconEdit />}
          menuItems={[
            { label: 'Editar', onClick: onEdit },
            { label: 'Modal', onClick: handleOpenModal }
          ]}
          anchorEl={anchorEl}
          onOpen={handleOpen}
          onClose={handleClose}
        />
        <TierItem.IconDelete onClick={onDelete} />
      </Box>
      <Modal
        sx={{ ...((styles.TierHeader as Styles).Modal as Styles) }}
        slotProps={{ ...((styles.TierHeader as Styles).BackdropProps as Styles) }}
        open={isModalOpen}
        onClose={handleCloseModal}
      >
        <Box sx={{ ...((styles.TierHeader as Styles).BoxModal as Styles) }}>{ModalEl}</Box>
      </Modal>
    </Box>
  ) as JSX.Element;
});

TierHeader.displayName = 'TierHeader' as string;

const TierToggleInput: FC<TierToggleInputProps> = memo((props: TierToggleInputProps) => {
  const { onChange, value, editing, title, label } = props;
  return (
    editing ? (
      <TextField label={label} value={value} onChange={(e) => onChange(e)} fullWidth={true} />
    ) : (
      <TierItem.Details title={title} value={value} />
    )
  ) as JSX.Element;
});

TierToggleInput.displayName = 'TierToggleInput' as string;

export const TierCard: TierCardComponents = {
  Root: TierCardRoot,
  Header: TierHeader,
  ToggleInput: TierToggleInput
} as const;
