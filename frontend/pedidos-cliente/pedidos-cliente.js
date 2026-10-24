document.addEventListener('DOMContentLoaded', () => {
    const PEDIDOS_KEY = 'churrasqueiro_pedidos';

    const numeroComanda = document.getElementById('numeroComanda');
    const nomeMesa = document.getElementById('nomeMesa');
    const linhaProgresso = document.getElementById('linhaProgresso');

    const etapaRecebido = document.getElementById('etapaRecebido');
    const etapaPreparo = document.getElementById('etapaPreparo');
    const etapaPronto = document.getElementById('etapaPronto');

    const tituloMensagem = document.getElementById('tituloMensagem');
    const subtituloMensagem = document.getElementById('subtituloMensagem');
    const listaItensCliente = document.getElementById('listaItensCliente');
    const valorTotalCliente = document.getElementById('valorTotalCliente');

    function obterUltimoPedido() {
        try {
            const data = localStorage.getItem(PEDIDOS_KEY);
            const pedidos = data ? JSON.parse(data) : [];
            return pedidos.length > 0 ? pedidos[pedidos.length - 1] : null;
        } catch (_) {
            return null;
        }
    }

    function formatarMoeda(valor) {
        return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function atualizarStatusVisual(status) {
        etapaRecebido.classList.remove('ativa', 'concluida');
        etapaPreparo.classList.remove('ativa', 'concluida');
        etapaPronto.classList.remove('ativa', 'concluida');

        if (status === 'EM_PREPARO') {
            linhaProgresso.style.width = '50%';

            etapaRecebido.classList.add('concluida');
            etapaPreparo.classList.add('ativa');

            tituloMensagem.textContent = 'O seu pedido está na brasa!';
            subtituloMensagem.textContent = 'Os nossos churrasqueiros já estão a preparar os seus hambúrgueres na chapa.';
        } else if (status === 'PRONTO') {
            linhaProgresso.style.width = '100%';

            etapaRecebido.classList.add('concluida');
            etapaPreparo.classList.add('concluida');
            etapaPronto.classList.add('ativa');

            tituloMensagem.textContent = 'O seu pedido está pronto!';
            subtituloMensagem.textContent = 'Tudo pronto no ponto certo. O seu pedido já está a caminho da mesa/balcão.';
        } else {
            linhaProgresso.style.width = '0%';

            etapaRecebido.classList.add('ativa');

            tituloMensagem.textContent = 'O seu pedido foi recebido!';
            subtituloMensagem.textContent = 'A equipa da chapa já recebeu a sua comanda e iniciará o preparo em breve.';
        }
    }

    function renderizarPedido() {
        const pedido = obterUltimoPedido();

        if (!pedido) {
            numeroComanda.textContent = '#---';
            nomeMesa.textContent = 'Mesa --';
            tituloMensagem.textContent = 'Nenhum pedido encontrado';
            subtituloMensagem.textContent = 'Faça um pedido no cardápio para acompanhar o status aqui.';
            listaItensCliente.innerHTML = '<li class="item-cliente-linha"><span>Nenhum item adicionado</span></li>';
            valorTotalCliente.textContent = formatarMoeda(0);
            return;
        }

        numeroComanda.textContent = `#${pedido.id || '101'}`;
        nomeMesa.textContent = pedido.mesa || 'Mesa 01';

        atualizarStatusVisual(pedido.status || 'RECEBIDO');

        if (pedido.itens && pedido.itens.length > 0) {
            listaItensCliente.innerHTML = pedido.itens.map(item => `
        <li class="item-cliente-linha">
          <div>
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

    renderizarPedido();
    setInterval(renderizarPedido, 3000);
});