document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = typeof getUsuarioLogado === 'function' ? getUsuarioLogado() : null;
  configurarUsuarioTopo(usuarioLogado);

  const badgeStatusApi = document.getElementById('badgeStatusApi');
  const textoStatusApi = document.getElementById('textoStatusApi');
  const equipeGrid = document.getElementById('equipeGrid');
  const estadoVazio = document.getElementById('estadoVazio');
  const btnResetarFiltros = document.getElementById('btnResetarFiltros');

  const statTotal = document.getElementById('statTotal');
  const statAdmin = document.getElementById('statAdmin');
  const statGarcom = document.getElementById('statGarcom');
  const statCozinha = document.getElementById('statCozinha');

  const countTodos = document.getElementById('countTodos');
  const countAdmin = document.getElementById('countAdmin');
  const countGarcom = document.getElementById('countGarcom');
  const countCozinha = document.getElementById('countCozinha');

  const inputBusca = document.getElementById('inputBusca');
  const btnLimparBusca = document.getElementById('btnLimparBusca');
  const selectStatus = document.getElementById('selectStatus');
  const selectOrdenacao = document.getElementById('selectOrdenacao');
  const pillsCargo = document.querySelectorAll('.pill-cargo');

  const modalMembroBackdrop = document.getElementById('modalMembroBackdrop');
  const btnAbrirModalCriar = document.getElementById('btnAbrirModalCriar');
  const btnFecharModal = document.getElementById('btnFecharModal');
  const btnCancelarModal = document.getElementById('btnCancelarModal');
  const formMembro = document.getElementById('formMembro');
  const modalTitulo = document.getElementById('modalTitulo');
  const membroIdInput = document.getElementById('membroId');
  const membroNomeInput = document.getElementById('membroNome');
  const membroEmailInput = document.getElementById('membroEmail');
  const membroCargoInput = document.getElementById('membroCargo');
  const membroSenhaInput = document.getElementById('membroSenha');
  const membroAtivoInput = document.getElementById('membroAtivo');
  const btnToggleSenha = document.getElementById('btnToggleSenha');
  const iconeOlhoSenha = document.getElementById('iconeOlhoSenha');
  const senhaObrigatorioMark = document.getElementById('senhaObrigatorioMark');
  const senhaDica = document.getElementById('senhaDica');
  const formErroAlerta = document.getElementById('formErroAlerta');
  const formErroTexto = document.getElementById('formErroTexto');

  const modalDeleteBackdrop = document.getElementById('modalDeleteBackdrop');
  const deleteNomeFuncionario = document.getElementById('deleteNomeFuncionario');
  const btnCancelarDelete = document.getElementById('btnCancelarDelete');
  const btnConfirmarDelete = document.getElementById('btnConfirmarDelete');

  const toastContainer = document.getElementById('toastContainer');

  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (typeof logout === 'function') {
        logout();
      } else {
        localStorage.removeItem('usuario_logado');
        window.location.href = '../login/login.html';
      }
    });
  }

  let membrosCarregados = [];
  let idParaExcluir = null;

  const filtros = {
    busca: '',
    cargo: 'todos',
    status: 'todos',
    ordenacao: 'nome-asc'
  };

  function configurarUsuarioTopo(user) {
    const elNome = document.getElementById('usuarioNome');
    const elCargo = document.getElementById('usuarioCargo');
    if (user) {
      if (elNome) elNome.textContent = user.nome || 'Colaborador';
      if (elCargo) elCargo.textContent = user.cargo || 'EQUIPE';
    } else {
      if (elNome) elNome.textContent = 'Admin (Demo)';
      if (elCargo) elCargo.textContent = 'ADMIN';
    }
  }

  function mostrarToast(mensagem, tipo = 'sucesso') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;

    let icone = 'fa-circle-check';
    if (tipo === 'erro') icone = 'fa-circle-exclamation';
    if (tipo === 'info') icone = 'fa-circle-info';

    toast.innerHTML = `
      <i class="fa-solid ${icone}"></i>
      <span>${mensagem}</span>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('mostrar');
    });

    setTimeout(() => {
      toast.classList.remove('mostrar');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  }

  async function verificarApi() {
    if (!badgeStatusApi || !textoStatusApi) return;
    const online = await window.equipeService.verificarConexaoApi();
    if (online) {
      badgeStatusApi.className = 'banner-status-api online';
      textoStatusApi.textContent = 'API Conectada (Porta 8081)';
    } else {
      badgeStatusApi.className = 'banner-status-api offline';
      textoStatusApi.textContent = 'Modo Local / Offline';
    }
  }

  function formatarData(dataIso) {
    if (!dataIso) return 'Recentemente';
    try {
      const d = new Date(dataIso);
      if (isNaN(d.getTime())) return 'Recentemente';
      return d.toLocaleDateString('pt-BR');
    } catch (_) {
      return 'Recentemente';
    }
  }

  function atualizarEstatisticas(membros) {
    const total = membros.length;
    const admins = membros.filter(m => m.cargo === 'ADMIN').length;
    const garcons = membros.filter(m => m.cargo === 'GARCOM').length;
    const cozinheiros = membros.filter(m => m.cargo === 'COZINHEIRO').length;

    if (statTotal) statTotal.textContent = total;
    if (statAdmin) statAdmin.textContent = admins;
    if (statGarcom) statGarcom.textContent = garcons;
    if (statCozinha) statCozinha.textContent = cozinheiros;

    if (countTodos) countTodos.textContent = total;
    if (countAdmin) countAdmin.textContent = admins;
    if (countGarcom) countGarcom.textContent = garcons;
    if (countCozinha) countCozinha.textContent = cozinheiros;
  }

  function filtrarEOrdenarMembros() {
    let resultado = [...membrosCarregados];

    if (filtros.cargo !== 'todos') {
      resultado = resultado.filter(m => m.cargo === filtros.cargo);
    }

    if (filtros.status === 'ativo') {
      resultado = resultado.filter(m => m.ativo === true);
    } else if (filtros.status === 'inativo') {
      resultado = resultado.filter(m => m.ativo === false);
    }

    if (filtros.busca.trim() !== '') {
      const termo = filtros.busca.trim().toLowerCase();
      resultado = resultado.filter(m => {
        const nome = (m.nome || '').toLowerCase();
        const email = (m.email || '').toLowerCase();
        return nome.includes(termo) || email.includes(termo);
      });
    }

    resultado.sort((a, b) => {
      if (filtros.ordenacao === 'nome-asc') {
        return (a.nome || '').localeCompare(b.nome || '');
      } else if (filtros.ordenacao === 'nome-desc') {
        return (b.nome || '').localeCompare(a.nome || '');
      } else if (filtros.ordenacao === 'cargo') {
        return (a.cargo || '').localeCompare(b.cargo || '');
      } else if (filtros.ordenacao === 'recentes') {
        return (b.id || 0) - (a.id || 0);
      }
      return 0;
    });

    renderizarGrid(resultado);
  }

  function renderizarGrid(membros) {
    if (!equipeGrid) return;
    equipeGrid.innerHTML = '';

    if (membros.length === 0) {
      equipeGrid.style.display = 'none';
      if (estadoVazio) estadoVazio.style.display = 'block';
      return;
    }

    equipeGrid.style.display = 'grid';
    if (estadoVazio) estadoVazio.style.display = 'none';

    membros.forEach(m => {
      const card = criarCardMembro(m);
      equipeGrid.appendChild(card);
    });
  }

  function criarCardMembro(m) {
    const card = document.createElement('div');
    card.className = `card-membro ${m.ativo ? '' : 'inativo'}`;

    let cargoClass = 'admin';
    let cargoNome = 'Administrador';
    let cargoIcone = 'fa-shield-halved';
    let avatarIcone = 'fa-user-tie';

    if (m.cargo === 'GARCOM') {
      cargoClass = 'garcom';
      cargoNome = 'Garçom & Salão';
      cargoIcone = 'fa-bell-concierge';
      avatarIcone = 'fa-concierge-bell';
    } else if (m.cargo === 'COZINHEIRO') {
      cargoClass = 'cozinheiro';
      cargoNome = 'Cozinha & Chapa';
      cargoIcone = 'fa-fire-burner';
      avatarIcone = 'fa-utensils';
    }

    const iniciais = (m.nome || 'C')
      .split(' ')
      .filter(p => p.length > 0)
      .slice(0, 2)
      .map(p => p[0].toUpperCase())
      .join('');

    card.innerHTML = `
      <div class="card-membro-header">
        <span class="badge-cargo ${cargoClass}">
          <i class="fa-solid ${cargoIcone}"></i>
          <span>${cargoNome}</span>
        </span>
        <span class="badge-status ${m.ativo ? 'ativo' : 'inativo'}">
          <i class="fa-solid ${m.ativo ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
          <span>${m.ativo ? 'Ativo' : 'Inativo'}</span>
        </span>
      </div>

      <div class="card-membro-body">
        <div class="avatar-wrapper ${cargoClass}" title="${m.nome}">
          ${iniciais || '<i class="fa-solid ' + avatarIcone + '"></i>'}
        </div>
        <div class="membro-dados">
          <h3 class="membro-nome" title="${m.nome}">${m.nome}</h3>
          <span class="membro-email" title="${m.email}">
            <i class="fa-solid fa-envelope"></i>
            <span>${m.email}</span>
          </span>
          <div class="membro-meta">
            <i class="fa-regular fa-calendar"></i>
            <span>Cadastrado em: ${formatarData(m.criadoEm)}</span>
          </div>
        </div>
      </div>

      <div class="card-membro-footer">
        <button type="button" class="btn-toggle-status" data-id="${m.id}" title="${m.ativo ? 'Desativar acesso' : 'Reativar acesso'}">
          <i class="fa-solid ${m.ativo ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
          <span>${m.ativo ? 'Desativar' : 'Ativar'}</span>
        </button>

        <div class="card-acoes-direita">
          <button type="button" class="btn-acao-card btn-editar" data-id="${m.id}" title="Editar dados">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="btn-acao-card btn-deletar" data-id="${m.id}" data-nome="${m.nome}" title="Excluir colaborador">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;

    const btnToggle = card.querySelector('.btn-toggle-status');
    btnToggle.addEventListener('click', () => handleToggleStatus(m.id));

    const btnEditar = card.querySelector('.btn-editar');
    btnEditar.addEventListener('click', () => handleAbrirEdicao(m.id));

    const btnDeletar = card.querySelector('.btn-deletar');
    btnDeletar.addEventListener('click', () => handleAbrirConfirmacaoDelete(m.id, m.nome));

    return card;
  }

  async function carregarEquipe() {
    try {
      membrosCarregados = await window.equipeService.listarTodos();
      atualizarEstatisticas(membrosCarregados);
      filtrarEOrdenarMembros();
    } catch (err) {
      mostrarToast('Erro ao carregar colaboradores.', 'erro');
    }
  }

  async function handleToggleStatus(id) {
    try {
      const atualizado = await window.equipeService.alternarStatus(id);
      mostrarToast(
        `Colaborador ${atualizado.nome} agora está ${atualizado.ativo ? 'ATIVO' : 'INATIVO'}.`,
        'info'
      );
      await carregarEquipe();
    } catch (err) {
      mostrarToast('Falha ao alterar status.', 'erro');
    }
  }

  function abrirModalCriar() {
    formMembro.reset();
    membroIdInput.value = '';
    modalTitulo.textContent = 'Novo Colaborador';
    membroSenhaInput.required = true;
    senhaObrigatorioMark.style.display = 'inline';
    senhaDica.style.display = 'none';
    membroAtivoInput.checked = true;
    ocultarErroForm();

    modalMembroBackdrop.classList.add('ativo');
    membroNomeInput.focus();
  }

  async function handleAbrirEdicao(id) {
    const membro = await window.equipeService.buscarPorId(id);
    if (!membro) {
      mostrarToast('Colaborador não encontrado.', 'erro');
      return;
    }

    formMembro.reset();
    membroIdInput.value = membro.id;
    modalTitulo.textContent = 'Editar Colaborador';
    membroNomeInput.value = membro.nome || '';
    membroEmailInput.value = membro.email || '';
    membroCargoInput.value = membro.cargo || 'GARCOM';
    membroSenhaInput.value = '';
    membroSenhaInput.required = false;
    senhaObrigatorioMark.style.display = 'none';
    senhaDica.style.display = 'block';
    membroAtivoInput.checked = membro.ativo !== false;
    ocultarErroForm();

    modalMembroBackdrop.classList.add('ativo');
    membroNomeInput.focus();
  }

  function fecharModalMembro() {
    modalMembroBackdrop.classList.remove('ativo');
    formMembro.reset();
    ocultarErroForm();
  }

  function exibirErroForm(msg) {
    if (formErroAlerta && formErroTexto) {
      formErroTexto.textContent = msg;
      formErroAlerta.style.display = 'flex';
    }
  }

  function ocultarErroForm() {
    if (formErroAlerta) {
      formErroAlerta.style.display = 'none';
    }
  }

  formMembro.addEventListener('submit', async (e) => {
    e.preventDefault();
    ocultarErroForm();

    const id = membroIdInput.value;
    const nome = membroNomeInput.value.trim();
    const email = membroEmailInput.value.trim();
    const cargo = membroCargoInput.value;
    const senha = membroSenhaInput.value;
    const ativo = membroAtivoInput.checked;

    if (!nome) {
      exibirErroForm('Informe o nome do colaborador.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      exibirErroForm('Informe um e-mail válido.');
      return;
    }

    if (!cargo) {
      exibirErroForm('Selecione um cargo operacional.');
      return;
    }

    if (!id && (!senha || senha.length < 4)) {
      exibirErroForm('A senha é obrigatória e deve ter no mínimo 4 caracteres.');
      return;
    }

    if (id && senha && senha.length < 4) {
      exibirErroForm('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }

    const payload = {
      nome,
      email,
      cargo,
      ativo
    };

    if (id) payload.id = id;
    if (senha) payload.senha = senha;

    try {
      await window.equipeService.salvar(payload);
      fecharModalMembro();
      mostrarToast(id ? 'Colaborador atualizado com sucesso!' : 'Novo colaborador cadastrado!', 'sucesso');
      await carregarEquipe();
    } catch (err) {
      exibirErroForm(err.message || 'Erro ao salvar colaborador.');
    }
  });

  function handleAbrirConfirmacaoDelete(id, nome) {
    idParaExcluir = id;
    if (deleteNomeFuncionario) deleteNomeFuncionario.textContent = `"${nome}"`;
    modalDeleteBackdrop.classList.add('ativo');
  }

  function fecharModalDelete() {
    modalDeleteBackdrop.classList.remove('ativo');
    idParaExcluir = null;
  }

  btnConfirmarDelete.addEventListener('click', async () => {
    if (!idParaExcluir) return;
    try {
      await window.equipeService.deletar(idParaExcluir);
      fecharModalDelete();
      mostrarToast('Colaborador removido da equipe com sucesso.', 'sucesso');
      await carregarEquipe();
    } catch (err) {
      mostrarToast('Erro ao remover colaborador.', 'erro');
    }
  });

  if (btnToggleSenha && iconeOlhoSenha) {
    btnToggleSenha.addEventListener('click', () => {
      const tipoAtual = membroSenhaInput.getAttribute('type');
      if (tipoAtual === 'password') {
        membroSenhaInput.setAttribute('type', 'text');
        iconeOlhoSenha.className = 'fa-regular fa-eye-slash';
      } else {
        membroSenhaInput.setAttribute('type', 'password');
        iconeOlhoSenha.className = 'fa-regular fa-eye';
      }
    });
  }

  inputBusca.addEventListener('input', (e) => {
    filtros.busca = e.target.value;
    btnLimparBusca.style.display = filtros.busca.length > 0 ? 'block' : 'none';
    filtrarEOrdenarMembros();
  });

  btnLimparBusca.addEventListener('click', () => {
    inputBusca.value = '';
    filtros.busca = '';
    btnLimparBusca.style.display = 'none';
    filtrarEOrdenarMembros();
    inputBusca.focus();
  });

  selectStatus.addEventListener('change', (e) => {
    filtros.status = e.target.value;
    filtrarEOrdenarMembros();
  });

  selectOrdenacao.addEventListener('change', (e) => {
    filtros.ordenacao = e.target.value;
    filtrarEOrdenarMembros();
  });

  pillsCargo.forEach(pill => {
    pill.addEventListener('click', () => {
      pillsCargo.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filtros.cargo = pill.getAttribute('data-cargo');
      filtrarEOrdenarMembros();
    });
  });

  btnResetarFiltros.addEventListener('click', () => {
    inputBusca.value = '';
    filtros.busca = '';
    btnLimparBusca.style.display = 'none';
    selectStatus.value = 'todos';
    filtros.status = 'todos';
    selectOrdenacao.value = 'nome-asc';
    filtros.ordenacao = 'nome-asc';
    filtros.cargo = 'todos';
    pillsCargo.forEach(p => {
      if (p.getAttribute('data-cargo') === 'todos') p.classList.add('active');
      else p.classList.remove('active');
    });
    filtrarEOrdenarMembros();
  });

  btnAbrirModalCriar.addEventListener('click', abrirModalCriar);
  btnFecharModal.addEventListener('click', fecharModalMembro);
  btnCancelarModal.addEventListener('click', fecharModalMembro);
  btnCancelarDelete.addEventListener('click', fecharModalDelete);

  modalMembroBackdrop.addEventListener('click', (e) => {
    if (e.target === modalMembroBackdrop) fecharModalMembro();
  });

  modalDeleteBackdrop.addEventListener('click', (e) => {
    if (e.target === modalDeleteBackdrop) fecharModalDelete();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      fecharModalMembro();
      fecharModalDelete();
    }
  });

  verificarApi();
  carregarEquipe();
});
