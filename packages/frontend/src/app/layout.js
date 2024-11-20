import './index.css';
import DrawerNavigation from '../../src/components/DrawerNavigation';
import Footer from '../../src/components/Footer';

export const metadata = {
  title: 'Facilite Varejo',
  description: 'Facilite Varejo App',
};

export default function RootLayout({ children }) {
  console.log(`renderizando no servidor`);
  return (
    <html lang="pt-br">
      <body>
        <DrawerNavigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
