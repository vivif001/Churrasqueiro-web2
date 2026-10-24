document.addEventListener('DOMContentLoaded', () => {
    const PEDIDOS_KEY = 'churrasqueiro_pedidos';

    const containerGrid = document.getElementById('pedidosContainer');
    const estadoVazio = document.getElementById('estadoVazioCozinha');
    const btnAtualizar = document.getElementById('btnAtualizarPedidos');

    const countRecebidos = document.getElementById('countRecebidos');
    const countEmPreparo = document.getElementById('countEmPreparo');
    const countProntos = document.getElementById('countProntos');

    function obterPedidos() {
        try {
            const data = localStorage.getItem(PEDIDOS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (_) {
            return [];
        }
    }

    function salvarPedidos(pedidos) {
        localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
        renderizarPainel();
    }

    function alterarStatusPedido(pedidoId, novoStatus) {
        const pedidos = obterPedidos();
        const index = pedidos.findIndex(p => p.id === Number(pedidoId));

        if (index > -1) {
            if (novoStatus === 'ENTREGUE') {
                pedidos.splice(index, 1);
            } else {
                pedidos[index].status = novoStatus;
            }
            salvarPedidos(pedidos);
        }
    }

    function renderizarPainel() {
        const todosPedidos = obterPedidos();
        containerGrid.innerHTML = '';

        const recebidos = todosPedidos.filter(p => p.status === 'RECEBIDO').length;
        const preparo = todosPedidos.filter(p => p.status === 'EM_PREPARO').length;
        const prontos = todosPedidos.filter(p => p.status === 'PRONTO').length;

        countRecebidos.textContent = recebidos;
        countEmPreparo.textContent = preparo;
        countProntos.textContent = prontos;

        if (todosPedidos.length === 0) {
            containerGrid.style.display = 'none';
            estadoVazio.style.display = 'block';
            return;
        }

        containerGrid.style.display = 'grid';
        estadoVazio.style.display = 'none';

        todosPedidos.forEach(pedido => {
            const card = document.createElement('div');
            card.className = `pedido-card-kds status-${pedido.status}`;

            const itensHtml = pedido.itens.map(i => `
        <li class="item-pedido-linha">
          <span><strong class="item-qtd-destaque">${i.quantidade}x</strong> ${i.nome}</span>
        </li>
      `).join('');

            let botaoAcaoHtml = '';
            if (pedido.status === 'RECEBIDO') {
                botaoAcaoHtml = `
          <button type="button" class="btn-status-acao btn-iniciar-preparo" data-id="${pedido.id}">
            <i class="fa-solid fa-fire"></i> INICIAR PREPARO
          </button>
        `;
            } else if (pedido.status === 'EM_PREPARO') {
                botaoAcaoHtml = `
          <button type="button" class="btn-status-acao btn-finalizar-preparo" data-id="${pedido.id}">
            <i class="fa-solid fa-check"></i> MARCAR COMO PRONTO
          </button>
        `;
            } else if (pedido.status === 'PRONTO') {
                botaoAcaoHtml = `
          <button type="button" class="btn-status-acao btn-concluir-entrega" data-id="${pedido.id}">
            <i class="fa-solid fa-bell-concierge"></i> FINALIZAR / ENTREGUE
          </button>
        `;
            }

            card.innerHTML = `
        <div class="pedido-kds-header">
          <span class="pedido-numero-tag">Comanda #${pedido.id}</span>
          <span class="pedido-mesa-badge"><i class="fa-solid fa-chair"></i> ${pedido.mesa}</span>
        </div>

        <div class="pedido-kds-corpo">
          <ul class="lista-itens-pedido">
            ${itensHtml}
          </ul>

          ${pedido.observacoes ? `
            <div class="pedido-observacao">
              <i class="fa-regular fa-comment-dots"></i>
              <span>Obs: ${pedido.observacoes}</span>
            </div>
          ` : ''}
        </div>

        <div class="pedido-kds-footer">
          ${botaoAcaoHtml}
        </div>
      `;

            const btnAcao = card.querySelector('.btn-status-acao');
            if (btnAcao) {
                btnAcao.addEventListener('click', () => {
                    if (pedido.status === 'RECEBIDO') {
                        alterarStatusPedido(pedido.id, 'EM_PREPARO');
                    } else if (pedido.status === 'EM_PREPARO') {
                        alterarStatusPedido(pedido.id, 'PRONTO');
                    } else if (pedido.status === 'PRONTO') {
                        alterarStatusPedido(pedido.id, 'ENTREGUE');
                    }
                });
            }

            containerGrid.appendChild(card);
        });
    }

    btnAtualizar.addEventListener('click', renderizarPainel);

    renderizarPainel();
    setInterval(renderizarPainel, 3000);
});