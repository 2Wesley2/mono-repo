import { NextResponse } from 'next/server';
import LoginHandler from './LoginHandler';

class AccessController {
  constructor(tokenValidator, roleExtractor, tokenSigner) {
    this.tokenValidator = tokenValidator;
    this.roleExtractor = roleExtractor;
    this.tokenSigner = tokenSigner;
  }

  async handleRequest(req) {
    console.log('Iniciando middleware de autenticação...');
    const wfSystemToken = req.cookies.get('wfSystem')?.value;
    const cookieRole = req.cookies.get('cookieRole')?.value;
    const { pathname } = req.nextUrl;

    const wfSystemTokenValid = await this.tokenValidator.isValid(wfSystemToken);
    const cookieRoleValid = await this.tokenValidator.isValid(cookieRole);

    if (pathname === '/login') {
      return LoginHandler.handle({ pathname, wfSystemTokenValid, cookieRoleValid, req });
    }

    if (cookieRoleValid && wfSystemTokenValid) {
      console.log('cookieRole e wfSystem autêntico detectado, prosseguindo com a requisição.');
      return NextResponse.next();
    }

    if (wfSystemTokenValid && (!cookieRole || !cookieRoleValid)) {
      const roleFromWfSystem = await this.roleExtractor.extractRole(wfSystemToken);
      if (roleFromWfSystem) {
        const encryptRole = await this.tokenSigner.sign({ role: roleFromWfSystem });
        console.log('wfSystemToken válido, configurando cookieRole.');
        const response = NextResponse.next();
        response.cookies.set('cookieRole', encryptRole, { httpOnly: true });
        console.log('cookieRole configurado com sucesso.');
        return response;
      }
    }

    console.log('Nenhum token válido detectado, redirecionando para login.', 'WARN');
    return this.redirectToLoginWithCookieCleanup(req);
  }

  redirectToLoginWithCookieCleanup(req) {
    console.log('Redirecionando para login e limpando cookies inválidos...');
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('wfSystem');
    response.cookies.delete('cookieRole');
    console.log('Redirecionamento para login concluído e cookies limpos.');
    return response;
  }
}

export default AccessController;
