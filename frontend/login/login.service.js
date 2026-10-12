const API_BASE_URL = 'http://localhost:8081';

const loginService = {
  async autenticar(email, senha) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend (porta 8081) está ligado.');
      }
      throw error;
    }
  }
};
