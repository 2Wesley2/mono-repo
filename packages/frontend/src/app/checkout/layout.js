export const metadata = {
  title: 'Checkout - Processo de Venda',
  description: 'Página de processo de venda com clientes e tickets',
};

const CheckoutLayout = ({ children }) => {
  return (
    <div className='layout' style={{ margin: '0 auto' }}>
      {children}
    </div>
  );
};

export default CheckoutLayout;
