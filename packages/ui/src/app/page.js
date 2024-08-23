import Link from 'next/link';
import styles from './page.module.css';
import { Typography, Grid, Card, CardContent } from '@mui/material';

export default function Home() {
  return (
    <main className={styles.main}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Meu App
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <Card>
            <CardContent>
              <Link href="/products">
                <Typography variant="h5" component="div">
                  Produtos
                </Typography>
                <Typography variant="body2">Gerencie seus produtos.</Typography>
              </Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <Link href="/sales">
                <Typography variant="h5" component="div">
                  Vendas
                </Typography>
                <Typography variant="body2">Visualize e gerencie suas vendas.</Typography>
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </main>
  );
}
