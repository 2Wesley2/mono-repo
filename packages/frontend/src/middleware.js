import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import env from '../env/index';

const jwtSecret = env.jwtSecret;
const jwtSecretInUint8Array = new TextEncoder().encode(jwtSecret);

// Verifica a autenticidade do token
async function verifyToken(token, secret) {
  console.log('Iniciando verificação do token...');
  try {
    const { payload } = await jwtVerify(token, secret);
    console.log('Token verificado com sucesso.');
    return payload;
  } catch (error) {
    console.log('Falha na verificação do token:', error);
    return null;
  }
}

// Extrai o 'role' do payload do token, se for autêntico
async function extractRoleFromToken(token, secret) {
  console.log('Extraindo role do token...');
  const payload = await verifyToken(token, secret);
  if (payload) {
    console.log('Role extraído com sucesso:', payload.role);
  } else {
    console.log('Falha ao extrair role do token.');
  }
  return payload ? payload.role : undefined;
}

// Redireciona para login e limpa cookies inválidos
function redirectToLoginWithCookieCleanup(req) {
  console.log('Redirecionando para login e limpando cookies inválidos...');
  const response = NextResponse.redirect(new URL('/login', req.url));
  response.cookies.delete('wfSystem');
  response.cookies.delete('cookieRole');
  console.log('Redirecionamento para login concluído e cookies limpos.');
  return response;
}

// Middleware principal
export async function middleware(req) {
  console.log('Iniciando middleware de autenticação...');
  const wfSystemToken = req.cookies.get('wfSystem')?.value;
  const cookieRole = req.cookies.get('cookieRole')?.value;
  const { pathname } = req.nextUrl;

  // Verifica se a rota atual é '/login'
  if (pathname === '/login') {
    // Se já estamos em /login e não há tokens válidos, permita o acesso à página de login
    if (!wfSystemToken && !cookieRole) {
      console.log('Acesso permitido à rota de login, nenhum token presente.');
      return NextResponse.next();
    }
    // Se há tokens válidos, redireciona para a página inicial para evitar re-login
    console.log('Tokens válidos detectados, redirecionando para a página inicial.');
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Para todas as outras rotas protegidas, realiza a verificação de autenticação
  console.log('Rota protegida detectada:', pathname);

  // Se já existe um cookieRole, tenta verificar o payload
  if (cookieRole) {
    console.log('cookieRole detectado, prosseguindo com a requisição.');
    return NextResponse.next();
  }

  // Se não existe o cookieRole, verifica se o usuário tem o cookie wfSystem
  if (wfSystemToken) {
    const roleFromWfSystem = await extractRoleFromToken(wfSystemToken, jwtSecretInUint8Array);
    if (roleFromWfSystem) {
      console.log('wfSystemToken válido, configurando cookieRole.');
      const response = NextResponse.next();
      response.cookies.set('cookieRole', roleFromWfSystem, { httpOnly: true });
      console.log('cookieRole configurado com sucesso.');
      return response;
    }
  }

  // Se nenhum token válido é encontrado, redireciona para a página de login
  console.log('Nenhum token válido detectado, redirecionando para login.');
  return redirectToLoginWithCookieCleanup(req);
}

export const config = {
  matcher: [
    '/login',
    '/dashboard',
    '/profile',
    '/settings',
    '/',
    '/((?!_next/static|favicon.ico).*)',
  ],
};
