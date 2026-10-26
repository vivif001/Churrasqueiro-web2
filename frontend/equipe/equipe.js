document.addEventListener('DOMContentLoaded', async () => {

    if (typeof getUsuarioLogado === 'function') {
        const usuario = getUsuarioLogado();
        if (!usuario) {

            const adminPadrao = {
                id: 1,
                nome: 'Administrador Chefe',
                email: 'admin@hamburgueria.com',
                cargo: 'ADMIN'
            };
            localStorage.setItem('usuario_logado', JSON.stringify(adminPadrao));
        }
        if (typeof configurarHeaderUsuario === 'function') {
            configurarHeaderUsuario();
        }
    }

    const statTotal = document.getElementById('statTotal');
    const statAdmin = document.getElementById('statAdmin');
    const statGarcom = document.getElementById('statGarcom');
    const statCozinheiro = document.getElementById('statCozinheiro');

    const inputBusca = document.getElementById('inputBusca');
    const botoesFiltro = document.querySelectorAll('.filtro-pill');
    const corpoTabela = document.getElementById('corpoTabelaEquipe');
    const estadoVazio = document.getElementById('estadoVazioEquipe');
    const tabela = document.getElementById('tabelaEquipe');

    const btnNovoColaborador = document.getElementById('btnNovoColaborador');
    const modalColaborador = document.getElementById('modalColaborador');
    const btnFecharModal = document.getElementById('btnFecharModal');
    const btnCancelarModal = document.getElementById('btnCancelarModal');
    const formColaborador = document.getElementById('formColaborador');
    const modalTituloTexto = document.getElementById('modalTituloTexto');

    const inputId = document.getElementById('colaboradorId');
    const inputNome = document.getElementById('colaboradorNome');
    const inputEmail = document.getElementById('colaboradorEmail');
    const selectCargo = document.getElementById('colaboradorCargo');
    const inputSenha = document.getElementById('colaboradorSenha');
    const labelSenha = document.getElementById('labelSenha');
    const ajudaSenha = document.getElementById('ajudaSenha');
    const checkAtivo = document.getElementById('colaboradorAtivo');

    const modalExcluir = document.getElementById('modalExcluir');
    const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');
    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
    const nomeExcluir = document.getElementById('nomeExcluir');

    const toastContainer = document.getElementById('toastContainer');

    let todosColaboradores = [];
    let filtroCargoAtual = 'TODOS';
    let idParaExcluir = null;

    function mostrarToast(mensagem, tipo = 'sucesso') {
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        const icone = tipo === 'sucesso' ? 'fa-check' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fa-solid ${icone}"></i><span>${mensagem}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    function atualizarEstatisticas(lista) {
        statTotal.textContent = lista.length;
        statAdmin.textContent = lista.filter(c => c.cargo === 'ADMIN').length;
        statGarcom.textContent = lista.filter(c => c.cargo === 'GARCOM').length;
        statCozinheiro.textContent = lista.filter(c => c.cargo === 'COZINHEIRO').length;
    }

    function formatarData(dataIso) {
        if (!dataIso) return '-';
        try {
            const data = new Date(dataIso);
            return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (_) {
            return '-';
        }
    }

    function obterIniciais(nome) {
        if (!nome) return 'CH';
        const partes = nome.trim().split(' ');
        if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
        return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }

    function renderizarTabela() {
        const busca = (inputBusca.value || '').toLowerCase().trim();

        const filtrados = todosColaboradores.filter(c => {
            const matchCargo = filtroCargoAtual === 'TODOS' || c.cargo === filtroCargoAtual;
            const matchBusca = !busca ||
                (c.nome && c.nome.toLowerCase().includes(busca)) ||
                (c.email && c.email.toLowerCase().includes(busca));
            return matchCargo && matchBusca;
        });

        corpoTabela.innerHTML = '';

        if (filtrados.length === 0) {
            tabela.style.display = 'none';
            estadoVazio.style.display = 'block';
            return;
        }

        tabela.style.display = 'table';
        estadoVazio.style.display = 'none';

        filtrados.forEach(c => {
            const tr = document.createElement('tr');

            const cargoNomeFormatado = {
                ADMIN: 'Administrador',
                GARCOM: 'Garçom',
                COZINHEIRO: 'Cozinheiro'
            }[c.cargo] || c.cargo;

            const cargoIcone = {
                ADMIN: 'fa-user-shield',
                GARCOM: 'fa-bell-concierge',
                COZINHEIRO: 'fa-kitchen-set'
            }[c.cargo] || 'fa-user';

            const statusClass = c.ativo !== false ? 'ativo' : 'inativo';
            const statusTexto = c.ativo !== false ? 'Ativo' : 'Inativo';

            tr.innerHTML = `
                <td>
                    <div class="colaborador-perfil">
                        <div class="avatar-colaborador">${obterIniciais(c.nome)}</div>
                        <div class="colaborador-nome-email">
                            <span class="colaborador-nome">${c.nome}</span>
                            <span class="colaborador-email">${c.email}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge-cargo ${c.cargo}">
                        <i class="fa-solid ${cargoIcone}"></i>
                        ${cargoNomeFormatado}
                    </span>
                </td>
                <td>
                    <span class="status-pill ${statusClass}">
                        <span class="status-dot"></span>
                        ${statusTexto}
                    </span>
                </td>
                <td style="color: var(--text-secondary);">${formatarData(c.criadoEm)}</td>
                <td style="text-align: right;">
                    <div class="acoes-wrapper" style="justify-content: flex-end;">
                        <button type="button" class="btn-acao editar" title="Editar colaborador" data-id="${c.id}">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button type="button" class="btn-acao excluir" title="Excluir colaborador" data-id="${c.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            tr.querySelector('.btn-acao.editar').addEventListener('click', () => abrirModalEditar(c));
            tr.querySelector('.btn-acao.excluir').addEventListener('click', () => abrirModalExcluir(c));

            corpoTabela.appendChild(tr);
        });
    }

    async function carregarDados() {
        try {
            todosColaboradores = await equipeService.listar();
            atualizarEstatisticas(todosColaboradores);
            renderizarTabela();
        } catch (err) {
            mostrarToast('Erro ao carregar colaboradores: ' + err.message, 'erro');
        }
    }

    function abrirModalNovo() {
        formColaborador.reset();
        inputId.value = '';
        modalTituloTexto.textContent = 'NOVO COLABORADOR';
        inputSenha.required = true;
        labelSenha.textContent = 'Senha de Acesso *';
        ajudaSenha.textContent = 'Mínimo de 4 caracteres para acesso ao sistema.';
        checkAtivo.checked = true;
        modalColaborador.style.display = 'flex';
        inputNome.focus();
    }

    function abrirModalEditar(colaborador) {
        formColaborador.reset();
        inputId.value = colaborador.id;
        inputNome.value = colaborador.nome || '';
        inputEmail.value = colaborador.email || '';
        selectCargo.value = colaborador.cargo || 'GARCOM';
        inputSenha.value = '';
        inputSenha.required = false;
        labelSenha.textContent = 'Nova Senha (Opcional)';
        ajudaSenha.textContent = 'Deixe em branco para manter a senha atual.';
        checkAtivo.checked = colaborador.ativo !== false;

        modalTituloTexto.textContent = 'EDITAR COLABORADOR';
        modalColaborador.style.display = 'flex';
        inputNome.focus();
    }

    function fecharModal() {
        modalColaborador.style.display = 'none';
    }

    btnNovoColaborador.addEventListener('click', abrirModalNovo);
    btnFecharModal.addEventListener('click', fecharModal);
    btnCancelarModal.addEventListener('click', fecharModal);

    modalColaborador.addEventListener('click', (e) => {
        if (e.target === modalColaborador) fecharModal();
    });

    formColaborador.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = inputId.value;
        const dto = {
            nome: inputNome.value.trim(),
            email: inputEmail.value.trim(),
            cargo: selectCargo.value,
            ativo: checkAtivo.checked
        };

        if (inputSenha.value.trim()) {
            dto.senha = inputSenha.value.trim();
        }

        try {
            if (id) {
                await equipeService.atualizar(id, dto);
                mostrarToast('Colaborador atualizado com sucesso!');
            } else {
                if (!dto.senha) {
                    mostrarToast('A senha é obrigatória para novo cadastro', 'erro');
                    return;
                }
                await equipeService.salvar(dto);
                mostrarToast('Colaborador cadastrado com sucesso!');
            }

            fecharModal();
            await carregarDados();
        } catch (err) {
            mostrarToast(err.message, 'erro');
        }
    });

    function abrirModalExcluir(colaborador) {
        idParaExcluir = colaborador.id;
        nomeExcluir.textContent = `"${colaborador.nome}"`;
        modalExcluir.style.display = 'flex';
    }

    function fecharModalExcluir() {
        idParaExcluir = null;
        modalExcluir.style.display = 'none';
    }

    btnCancelarExclusao.addEventListener('click', fecharModalExcluir);
    modalExcluir.addEventListener('click', (e) => {
        if (e.target === modalExcluir) fecharModalExcluir();
    });

    btnConfirmarExclusao.addEventListener('click', async () => {
        if (!idParaExcluir) return;
        try {
            await equipeService.deletar(idParaExcluir);
            mostrarToast('Colaborador removido com sucesso!');
            fecharModalExcluir();
            await carregarDados();
        } catch (err) {
            mostrarToast('Erro ao remover: ' + err.message, 'erro');
        }
    });

    inputBusca.addEventListener('input', renderizarTabela);

    botoesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            botoesFiltro.forEach(b => b.classList.remove('ativo'));
            btn.classList.add('ativo');
            filtroCargoAtual = btn.dataset.cargo;
            renderizarTabela();
        });
    });

    await carregarDados();
});
