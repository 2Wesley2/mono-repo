import { NextResponse } from 'next/server';

class LoginHandler {
  static handle({ pathname, wfSystemTokenValid, cookieRoleValid, req }) {
    const LOGIN_ROUTE = '/login';
    const HOME_ROUTE = '/';

    if (pathname === LOGIN_ROUTE) {
      if (!wfSystemTokenValid && !cookieRoleValid) {
        console.log('LoginHandler.js: Acesso permitido à rota de login, nenhum token presente.');
        return NextResponse.next();
      }
      console.log('LoginHandler.js: Tokens válidos detectados, redirecionando para a página inicial.');
      return NextResponse.redirect(new URL(HOME_ROUTE, req.url));
    }
    console.log('LoginHandler.js: Rota não corresponde a /login, passando adiante.');
    return NextResponse.next();
  }
}

export default LoginHandler;