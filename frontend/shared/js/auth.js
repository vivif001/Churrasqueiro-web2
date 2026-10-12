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
