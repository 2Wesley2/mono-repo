'use client';
import { useState } from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { SearchModal } from './modal';

const styled = {
  Button: {
    backgroundColor: '#FFFFFF',
    cursor: 'auto',
    '&:hover': {
      transform: 'scale(1.10)',
      WebkitTransform: 'scale(1.10)',
    },
  },
};

const SearchButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        onClick={handleOpenModal}
        sx={{ ...styled.Button }}
      >
        <SearchIcon sx={{ color: '#E50914' }} />
      </Button>
      <SearchModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SearchButton;
