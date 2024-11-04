import Layout from "@/components/Layout";

export const metadata = {
  title: ' Gerenciamento de clientes',
  description: 'Página gerenciar clientes',
};

const CustomerManagementLayout = ({ children }) => (
  <Layout>
    {children}
  </Layout>
);

export default CustomerManagementLayout;
