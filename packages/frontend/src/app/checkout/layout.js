export const metadata = {
  title: 'Checkout - Processo de Venda',
  description: 'Página de processo de venda com clientes e tickets',
};

const CheckoutLayout = ({ children }) => {
  return (
    <div>
      <h1>Processo de Venda</h1>
      {children}
    </div>
  );
};

export default CheckoutLayout;
