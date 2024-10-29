import './index.css'; 
import DrawerNavigation from "../../src/components/DrawerNavigation";

export const metadata = {
  title: "WFSystem",
  description: "WFSystem App",
};

export default function RootLayout({ children }) {
  console.log(`renderizando no servidor`)
  return (
    <html lang="pt-br">
      <body id="LAYOUTJS">
        <DrawerNavigation />
        {children}
      </body>
    </html>
  );
};
