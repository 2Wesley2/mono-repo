
export const metadata = {
  title: "WFSystem",
  description: "WFSystem App",
};

export default function RootLayout({ children }) {
  console.log(`renderizando no servidor`)
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}
