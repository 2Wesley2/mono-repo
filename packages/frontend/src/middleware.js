import accessController from "./middlewares/index";

export async function middleware(req) {
  return accessController.handleRequest(req);
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
