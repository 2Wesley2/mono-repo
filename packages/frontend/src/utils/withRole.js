export async function withRole(context) {
  const { req } = context;
  const cookieRole = req.cookies['cookieRole'] || null;

  console.log(`getServerSideProps (withRole): ${cookieRole}`);

  return {
    props: {
      cookieRole,
    },
  };
}
