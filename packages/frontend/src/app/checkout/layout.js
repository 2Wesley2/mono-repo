import Layout from '@/components/global/Layout';

export const metadata = {
  title: 'Checkout - Processo de Venda',
  description: 'Página de processo de venda com clientes e tickets',
};

const CheckoutLayout = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default CheckoutLayout;
