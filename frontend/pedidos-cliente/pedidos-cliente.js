document.addEventListener('DOMContentLoaded', () => {
    const PEDIDOS_KEY = 'churrasqueiro_pedidos';

    const numeroComanda = document.getElementById('numeroComanda');
    const nomeMesa = document.getElementById('nomeMesa');
    const linhaProgresso = document.getElementById('linhaProgresso');

    const etapaRecebido = document.getElementById('etapaRecebido');
    const etapaPreparo = document.getElementById('etapaPreparo');
    const etapaPronto = document.getElementById('etapaPronto');
    const etapaEntregue = document.getElementById('etapaEntregue');

    const tituloMensagem = document.getElementById('tituloMensagem');
    const subtituloMensagem = document.getElementById('subtituloMensagem');
    const listaItensCliente = document.getElementById('listaItensCliente');
    const valorTotalCliente = document.getElementById('valorTotalCliente');

    const staffNav = document.getElementById('staffNav');
    const staffUserPanel = document.getElementById('staffUserPanel');
    const seletorComandasBox = document.getElementById('seletorComandasBox');
    const selectComandaAtiva = document.getElementById('selectComandaAtiva');

    // Identifica se há funcionário logado
    const usuarioLogado = typeof getUsuarioLogado === 'function' ? getUsuarioLogado() : null;
    const isStaff = Boolean(usuarioLogado && usuarioLogado.cargo);

    if (isStaff) {
        if (staffNav) staffNav.style.display = 'flex';
        if (staffUserPanel) staffUserPanel.style.display = 'flex';
        if (typeof configurarHeaderUsuario === 'function') {
            configurarHeaderUsuario();
        }
    }

    function obterTodosPedidos() {
        try {
            const data = localStorage.getItem(PEDIDOS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (_) {
            return [];
        }
    }

    function obterIdPedidoAlvo() {
        // 1. Query parameter ?id=123
        const params = new URLSearchParams(window.location.search);
        const paramId = params.get('id');
        if (paramId) return Number(paramId);

        // 2. Seletor selecionado manualmente na tela
        if (selectComandaAtiva && selectComandaAtiva.value) {
            return Number(selectComandaAtiva.value);
        }

        // 3. Último pedido criado nesta sessão/navegador
        const ultimoId = localStorage.getItem('churrasqueiro_ultimo_pedido_id');
        if (ultimoId) return Number(ultimoId);

        // 4. Primeiro pedido da lista (mais recente)
        const pedidos = obterTodosPedidos();
        return pedidos.length > 0 ? pedidos[0].id : null;
    }

    function obterPedidoAtual() {
        const pedidos = obterTodosPedidos();
        if (pedidos.length === 0) return null;

        const idAlvo = obterIdPedidoAlvo();
        if (idAlvo) {
            const encontrado = pedidos.find(p => p.id === idAlvo);
            if (encontrado) return encontrado;
        }

        return pedidos[0];
    }

    function formatarMoeda(valor) {
        return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function atualizarSeletorComandas(pedidos, pedidoAtual) {
        if (!selectComandaAtiva || !seletorComandasBox) return;

        if (pedidos.length > 1 || isStaff) {
            seletorComandasBox.style.display = 'block';
            
            const currentSelected = pedidoAtual ? String(pedidoAtual.id) : '';
            const optionsHtml = pedidos.map(p => `
                <option value="${p.id}" ${String(p.id) === currentSelected ? 'selected' : ''}>
                    Comanda #${p.id} - ${p.mesa} (${p.status}) - ${formatarMoeda(p.total)}
                </option>
            `).join('');

            if (selectComandaAtiva.innerHTML !== optionsHtml) {
                selectComandaAtiva.innerHTML = optionsHtml;
            }
        } else {
            seletorComandasBox.style.display = 'none';
        }
    }

    if (selectComandaAtiva) {
        selectComandaAtiva.addEventListener('change', () => {
            localStorage.setItem('churrasqueiro_ultimo_pedido_id', selectComandaAtiva.value);
            renderizarPedido();
        });
    }

    function atualizarStatusVisual(status) {
        etapaRecebido.classList.remove('ativa', 'concluida');
        etapaPreparo.classList.remove('ativa', 'concluida');
        etapaPronto.classList.remove('ativa', 'concluida');
        if (etapaEntregue) etapaEntregue.classList.remove('ativa', 'concluida');

        if (status === 'EM_PREPARO') {
            linhaProgresso.style.width = '35%';

            etapaRecebido.classList.add('concluida');
            etapaPreparo.classList.add('ativa');

            tituloMensagem.textContent = 'O seu pedido está na brasa!';
            subtituloMensagem.textContent = 'Os nossos churrasqueiros já estão preparando seus hambúrgueres na chapa quente.';
        } else if (status === 'PRONTO') {
            linhaProgresso.style.width = '70%';

            etapaRecebido.classList.add('concluida');
            etapaPreparo.classList.add('concluida');
            etapaPronto.classList.add('ativa');

            tituloMensagem.textContent = 'O seu pedido está pronto!';
            subtituloMensagem.textContent = 'Tudo no ponto certo! O garçom está a caminho para levar à sua mesa.';
        } else if (status === 'ENTREGUE') {
            linhaProgresso.style.width = '100%';

            etapaRecebido.classList.add('concluida');
            etapaPreparo.classList.add('concluida');
            etapaPronto.classList.add('concluida');
            if (etapaEntregue) etapaEntregue.classList.add('ativa', 'concluida');

            tituloMensagem.textContent = 'Pedido entregue! Bom apetite!';
            subtituloMensagem.textContent = 'Esperamos que você aprecie a verdadeira experiência do churrasco artesanal.';
        } else {
            linhaProgresso.style.width = '0%';

            etapaRecebido.classList.add('ativa');

            tituloMensagem.textContent = 'O seu pedido foi recebido!';
            subtituloMensagem.textContent = 'A equipe da chapa já recebeu a sua comanda e iniciará o preparo em instantes.';
        }
    }

    function renderizarPedido() {
        const todosPedidos = obterTodosPedidos();
        const pedido = obterPedidoAtual();

        atualizarSeletorComandas(todosPedidos, pedido);

        if (!pedido) {
            numeroComanda.textContent = '#---';
            nomeMesa.textContent = 'Mesa --';
            tituloMensagem.textContent = 'Nenhum pedido encontrado';
            subtituloMensagem.textContent = 'Faça um pedido no cardápio para acompanhar o status e o preparo em tempo real.';
            listaItensCliente.innerHTML = '<li class="item-cliente-linha" style="color: var(--text-muted); padding: 16px 0;"><span>Nenhum pedido ativo no momento</span></li>';
            valorTotalCliente.textContent = formatarMoeda(0);
            linhaProgresso.style.width = '0%';
            etapaRecebido.classList.remove('ativa', 'concluida');
            etapaPreparo.classList.remove('ativa', 'concluida');
            etapaPronto.classList.remove('ativa', 'concluida');
            if (etapaEntregue) etapaEntregue.classList.remove('ativa', 'concluida');
            return;
        }

        numeroComanda.textContent = `#${pedido.id || '101'}`;
        nomeMesa.textContent = pedido.mesa || 'Mesa 01';

        atualizarStatusVisual(pedido.status || 'RECEBIDO');

        if (pedido.itens && pedido.itens.length > 0) {
            listaItensCliente.innerHTML = pedido.itens.map(item => `
                <li class="item-cliente-linha">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="item-qtd-badge">${item.quantidade}x</span>
                    <span class="item-nome-texto">${item.nome}</span>
                  </div>
                  <span class="item-preco-texto">${formatarMoeda(item.preco * item.quantidade)}</span>
                </li>
            `).join('');
        }

        const totalCalculado = pedido.total || (pedido.itens || []).reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
        valorTotalCliente.textContent = formatarMoeda(totalCalculado);
    }

    window.addEventListener('storage', renderizarPedido);

    renderizarPedido();
    setInterval(renderizarPedido, 3000);
});