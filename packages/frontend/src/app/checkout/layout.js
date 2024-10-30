export const metadata = {
  title: 'Checkout - Processo de Venda',
  description: 'Página de processo de venda com clientes e tickets',
};

const CheckoutLayout = ({ children }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Processo de Venda</h1>
      {children}
    </div>
  );
};

export default CheckoutLayout;
