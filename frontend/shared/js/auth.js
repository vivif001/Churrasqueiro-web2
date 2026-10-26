function getUsuarioLogado() {
  const usuario = localStorage.getItem('usuario_logado');
  return usuario ? JSON.parse(usuario) : null;
}

function estaAutenticado() {
  return getUsuarioLogado() !== null;
}

function logout() {
  localStorage.removeItem('usuario_logado');
  window.location.href = '../login/login.html';
}

function exigirAutenticacao() {
  if (!estaAutenticado()) {
    window.location.href = '../login/login.html';
  }
}

function configurarHeaderUsuario() {
  const usuario = getUsuarioLogado();
  const elNome = document.getElementById('usuarioNome');
  const elCargo = document.getElementById('usuarioCargo');
  const painel = document.querySelector('.usuario-painel');
  const btnLogin = document.querySelector('.btn-acesso-funcionario');
  const navLinks = document.querySelector('.nav-links');

  if (usuario && usuario.cargo) {
    if (elNome) elNome.textContent = usuario.nome || 'Colaborador';
    if (elCargo) elCargo.textContent = usuario.cargo || 'STAFF';
    if (painel) painel.style.display = 'flex';
    if (btnLogin) btnLogin.style.display = 'none';
    if (navLinks) navLinks.style.display = 'flex';
  } else {
    if (painel) painel.style.display = 'none';
    if (btnLogin) btnLogin.style.display = 'flex';
  }

  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}

