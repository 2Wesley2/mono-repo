import accessController from "./middlewares/index";

export async function middleware(req) {
  console.log('Middleware executado para:', req.nextUrl.pathname);
  return accessController.handleRequest(req);
}

export const config = {
  matcher: [
    '/((?!api|_next/|favicon.ico).*)'
  ],
};
