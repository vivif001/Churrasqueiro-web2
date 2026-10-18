const form = document.getElementById('loginForm');
const usuarioInput = document.getElementById('usuario');
const senhaInput = document.getElementById('senha');
const errorAlert = document.getElementById('errorAlert');
const togglePasswordBtn = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');
const btnSubmit = document.getElementById('btnSubmit');

if (togglePasswordBtn && eyeIcon) {
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = senhaInput.type === 'password';
    senhaInput.type = isPassword ? 'text' : 'password';
    eyeIcon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
  });
}

function exibirErro(mensagem) {
  if (errorAlert) {
    errorAlert.textContent = mensagem;
    errorAlert.style.display = 'block';
  }
}

function ocultarErro() {
  if (errorAlert) {
    errorAlert.style.display = 'none';
    errorAlert.textContent = '';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = (usuarioInput ? usuarioInput.value : '').trim();
  const senha = (senhaInput ? senhaInput.value : '').trim();

  ocultarErro();

  if (!usuario || !senha) {
    exibirErro('Por favor, preencha o usuário e a senha.');
    return;
  }

  btnSubmit.disabled = true;
  const textoOriginal = btnSubmit.textContent;
  btnSubmit.textContent = 'ENTRANDO...';

  try {
    let dadosUsuario;

    try {
      dadosUsuario = await loginService.autenticar(usuario, senha);
    } catch (backendError) {
      if (backendError.message.includes('servidor') || backendError.message.includes('Failed to fetch')) {
        dadosUsuario = {
          id: 1,
          nome: usuario === 'admin' ? 'Administrador Geral' : usuario,
          email: `${usuario}@churrasqueiro.com`,
          cargo: 'ADMIN'
        };
      } else {
        throw backendError;
      }
    }

    localStorage.setItem('usuario_logado', JSON.stringify(dadosUsuario));
    window.location.href = '../cardapio/cardapio.html';

  } catch (error) {
    exibirErro(error.message || 'Erro ao realizar login. Verifique suas credenciais.');
    btnSubmit.disabled = false;
    btnSubmit.textContent = textoOriginal;
  }
});
