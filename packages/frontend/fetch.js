import env from './env/index'

const apiBaseUrl = env.apiBaseUrl;
console.log("API Base URL (fetch.js):", apiBaseUrl);

export async function login(username, password) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Erro no login: verifique suas credenciais.');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}
