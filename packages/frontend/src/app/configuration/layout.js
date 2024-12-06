import Layout from '@/components/global/Layout';

export const metadata = {
  title: 'Configuração de Cashback',
  description: 'Página de gerenciamento de cashback',
};

const CashbackLayout = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default CashbackLayout;
