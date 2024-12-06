import './index.css';
import DrawerNavigation from '../components/global/DrawerNavigation';
import Footer from '../components/global/Footer';
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
