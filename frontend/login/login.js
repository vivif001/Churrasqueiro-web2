const form = document.getElementById('loginForm');
const mensagemDiv = document.getElementById('mensagem');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  mensagemDiv.classList.add('d-none');

  try {
    const usuario = await loginService.autenticar(email, senha);
    
    localStorage.setItem('usuario_logado', JSON.stringify(usuario));

    mensagemDiv.className = 'alert alert-success';
    mensagemDiv.textContent = `Login realizado com sucesso! Bem-vindo, ${usuario.nome}.`;
    mensagemDiv.classList.remove('d-none');
  } catch (error) {
    mensagemDiv.className = 'alert alert-danger';
    mensagemDiv.textContent = error.message;
    mensagemDiv.classList.remove('d-none');
  }
});
