
const API_BASE_URL = 'http://localhost:3001';

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.token) {
    throw new Error('Erro no login: verifique suas credenciais.');
  }

  const data = await res.json();
  return data;
}
