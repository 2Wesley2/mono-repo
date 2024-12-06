'use client';
import { Tabs, Tab } from '@mui/material';
import { useOrderState } from '../../context/useOrderState';

const styled = {
  Tabs: {
    minHeight: '0.1%',
    marginInline: '1% 1%',
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    '& .MuiTab-root': {
      textAlign: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      color: '#000000',
      fontFamily: 'inherit',
      fontWeight: 'normal',
      textTransform: 'none',
      transition: 'color 0.3s ease, background-color 0.3s ease',
      borderBottom: '2px solid transparent',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#EFEFEF',
        color: '#E50914',
      },
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#E50914',
      height: '5%',
      borderRadius: '4px 4px 0 0',
    },
    '& .css-hmk518-MuiButtonBase-root-MuiTab-root.Mui-selected': {
      color: '#E50914',
      fontWeight: 'bold',
      borderBottom: '2px solid #E50914',
    },
    '& .MuiTab-root': {
      minHeight: '0.1%',
    },
  },
};

const TabsOrder = () => {
  const { activeTab, setActiveTab, categories } = useOrderState();

  return (
    <Tabs
      value={activeTab}
      onChange={(event, newValue) => setActiveTab(newValue)}
      variant="fullWidth"
      sx={{
        ...styled.Tabs,
        '& .MuiTab-root': {
          width: `${100 / categories?.length}%`,
        },
      }}
    >
      {categories.map((category, index) => (
        <Tab key={index} label={category} />
      ))}
    </Tabs>
  );
};
export default TabsOrder;
