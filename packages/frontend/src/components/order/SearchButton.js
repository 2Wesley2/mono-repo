'use client';
import { useState } from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { SearchModal } from './modal';

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
        sx={{
          backgroundColor: '#FFFFFF',
        }}
      >
        <SearchIcon sx={{ color: '#E50914' }} />
      </Button>
      <SearchModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SearchButton;
