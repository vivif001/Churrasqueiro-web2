document.addEventListener('DOMContentLoaded', () => {
  let usuarioLogado = typeof getUsuarioLogado === 'function' ? getUsuarioLogado() : null;
  const isFuncionario = Boolean(usuarioLogado && usuarioLogado.cargo);

  configurarModoVisual(isFuncionario, usuarioLogado);

  const estadoFiltros = {
    categoria: 'todos',
    busca: '',
    status: isFuncionario ? 'todos' : 'disponivel',
    ordenacao: 'populares'
  };

  const IMAGENS_PADRAO = {
    burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    smashes: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
    acompanhamentos: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80',
    bebidas: 'https://images.unsplash.com/photo-1608270199147-3860bb4f72eb?w=800&auto=format&fit=crop&q=80',
    sobremesas: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80'
  };

  const NOMES_CATEGORIAS = {
    burgers: 'Burgers Artesanais',
    smashes: 'Smash Burgers',
    acompanhamentos: 'Acompanhamentos',
    bebidas: 'Bebidas & Chopp',
    sobremesas: 'Sobremesas'
  };

  const gridProdutos = document.getElementById('produtosGrid');
  const estadoVazio = document.getElementById('estadoVazio');
  const inputBusca = document.getElementById('inputBusca');
  const btnLimparBusca = document.getElementById('btnLimparBusca');
  const selectStatus = document.getElementById('selectStatus');
  const selectOrdenacao = document.getElementById('selectOrdenacao');
  const pillsCategorias = document.querySelectorAll('.pill-btn');
  const btnResetarFiltros = document.getElementById('btnResetarFiltros');

  const btnAbrirSacola = document.getElementById('btnAbrirSacola');
  const sacolaBackdrop = document.getElementById('sacolaBackdrop');
  const btnFecharSacola = document.getElementById('btnFecharSacola');
  const sacolaItensLista = document.getElementById('sacolaItensLista');
  const sacolaTotalValor = document.getElementById('sacolaTotalValor');
  const headerSacolaCount = document.getElementById('headerSacolaCount');
  const headerSacolaTotal = document.getElementById('headerSacolaTotal');
  const inputMesaCliente = document.getElementById('inputMesaCliente');
  const inputObsCliente = document.getElementById('inputObsCliente');
  const btnFinalizarPedido = document.getElementById('btnFinalizarPedido');

  const modalSucessoPedidoBackdrop = document.getElementById('modalSucessoPedidoBackdrop');
  const numeroPedidoCriado = document.getElementById('numeroPedidoCriado');
  const resumoMesaConfirmada = document.getElementById('resumoMesaConfirmada');
  const resumoTotalConfirmado = document.getElementById('resumoTotalConfirmado');
  const btnFecharSucessoPedido = document.getElementById('btnFecharSucessoPedido');

  const modalProdutoBackdrop = document.getElementById('modalProdutoBackdrop');
  const btnAbrirModalCriar = document.getElementById('btnAbrirModalCriar');
  const btnFecharModal = document.getElementById('btnFecharModal');
  const btnCancelarModal = document.getElementById('btnCancelarModal');
  const formProduto = document.getElementById('formProduto');
  const modalTitulo = document.getElementById('modalTitulo');
  const inputProdutoId = document.getElementById('produtoId');
  const inputProdutoNome = document.getElementById('produtoNome');
  const inputProdutoPreco = document.getElementById('produtoPreco');
  const selectProdutoCategoria = document.getElementById('produtoCategoria');
  const inputProdutoTempo = document.getElementById('produtoTempo');
  const textareaProdutoDescricao = document.getElementById('produtoDescricao');
  const inputProdutoImagem = document.getElementById('produtoImagem');
  const imgPreview = document.getElementById('imgPreview');
  const checkboxProdutoDisponivel = document.getElementById('produtoDisponivel');
  const checkboxProdutoDestaque = document.getElementById('produtoDestaque');

  const modalExcluirBackdrop = document.getElementById('modalExcluirBackdrop');
  const btnFecharModalExcluir = document.getElementById('btnFecharModalExcluir');
  const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');
  const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
  const nomeProdutoExcluir = document.getElementById('nomeProdutoExcluir');
  let idProdutoParaExcluir = null;

  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      logout();
    });
  }

  function configurarModoVisual(isStaff, staffUser) {
    if (isStaff) {
      document.body.classList.remove('modo-cliente');
      document.body.classList.add('modo-funcionario');

      const elNome = document.getElementById('usuarioNome');
      const elCargo = document.getElementById('usuarioCargo');
      if (elNome) elNome.textContent = staffUser.nome || 'Colaborador';
      if (elCargo) elCargo.textContent = staffUser.cargo || 'STAFF';

      const heroSubtitle = document.getElementById('heroSubtitle');
      if (heroSubtitle) {
        heroSubtitle.textContent = 'Painel de Gestão: Gerencie receitas, fotos, disponibilidade e preços dos itens da hamburgueria';
      }
    } else {
      document.body.classList.remove('modo-funcionario');
      document.body.classList.add('modo-cliente');

      const heroSubtitle = document.getElementById('heroSubtitle');
      if (heroSubtitle) {
        heroSubtitle.textContent = 'Hambúrgueres artesanais na brasa, smash burgers crocantes, acompanhamentos e bebidas frescas';
      }
    }
  }

  const SACOLA_KEY = 'churrasqueiro_sacola_itens';

  function obterSacola() {
    try {
      const data = localStorage.getItem(SACOLA_KEY);
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  function salvarSacola(itens) {
    localStorage.setItem(SACOLA_KEY, JSON.stringify(itens));
    atualizarCabecalhoSacola();
  }

  function adicionarItemSacola(produto) {
    const sacola = obterSacola();
    const index = sacola.findIndex(i => i.id === produto.id);

    if (index > -1) {
      sacola[index].quantidade += 1;
    } else {
      sacola.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem || IMAGENS_PADRAO[produto.categoria] || IMAGENS_PADRAO.burgers,
        categoria: produto.categoria,
        quantidade: 1
      });
    }

    salvarSacola(sacola);
    mostrarToast(`"${produto.nome}" adicionado à comanda!`, 'sucesso');
  }

  function alterarQtdSacola(produtoId, delta) {
    let sacola = obterSacola();
    const index = sacola.findIndex(i => i.id === Number(produtoId));
    if (index === -1) return;

    sacola[index].quantidade += delta;
    if (sacola[index].quantidade <= 0) {
      sacola.splice(index, 1);
    }

    salvarSacola(sacola);
    renderizarItensSacola();
  }

  function atualizarCabecalhoSacola() {
    const sacola = obterSacola();
    const totalItens = sacola.reduce((acc, cur) => acc + cur.quantidade, 0);
    const totalValor = sacola.reduce((acc, cur) => acc + (cur.preco * cur.quantidade), 0);

    if (headerSacolaCount) headerSacolaCount.textContent = totalItens;
    if (headerSacolaTotal) headerSacolaTotal.textContent = formatarPreco(totalValor);
    if (sacolaTotalValor) sacolaTotalValor.textContent = formatarPreco(totalValor);

    if (btnFinalizarPedido) {
      btnFinalizarPedido.disabled = totalItens === 0;
    }
  }

  function renderizarItensSacola() {
    const sacola = obterSacola();
    sacolaItensLista.innerHTML = '';

    if (sacola.length === 0) {
      sacolaItensLista.innerHTML = `
        <div class="sacola-vazia-aviso">
          <i class="fa-solid fa-basket-shopping sacola-vazia-icone"></i>
          <p>Sua comanda está vazia.</p>
          <small>Escolha hambúrgueres artesanais ou bebidas para iniciar seu pedido.</small>
        </div>
      `;
      atualizarCabecalhoSacola();
      return;
    }

    sacola.forEach(item => {
      const el = document.createElement('div');
      el.className = 'sacola-item-card';
      el.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}" class="sacola-item-thumb" onerror="this.src='${IMAGENS_PADRAO.burgers}'" />
        <div class="sacola-item-info">
          <span class="sacola-item-nome">${item.nome}</span>
          <span class="sacola-item-preco">${formatarPreco(item.preco * item.quantidade)}</span>
        </div>
        <div class="sacola-qtd-controles">
          <button type="button" class="btn-qtd btn-menos" data-id="${item.id}">
            <i class="fa-solid fa-minus"></i>
          </button>
          <span class="qtd-valor">${item.quantidade}</span>
          <button type="button" class="btn-qtd btn-mais" data-id="${item.id}">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      `;

      el.querySelector('.btn-menos').addEventListener('click', () => {
        alterarQtdSacola(item.id, -1);
      });

      el.querySelector('.btn-mais').addEventListener('click', () => {
        alterarQtdSacola(item.id, 1);
      });

      sacolaItensLista.appendChild(el);
    });

    atualizarCabecalhoSacola();
  }

  btnAbrirSacola.addEventListener('click', () => {
    renderizarItensSacola();
    sacolaBackdrop.style.display = 'flex';
  });

  btnFecharSacola.addEventListener('click', () => {
    sacolaBackdrop.style.display = 'none';
  });

  sacolaBackdrop.addEventListener('click', (e) => {
    if (e.target === sacolaBackdrop) {
      sacolaBackdrop.style.display = 'none';
    }
  });

  btnFinalizarPedido.addEventListener('click', () => {
    const sacola = obterSacola();
    if (sacola.length === 0) return;

    const mesa = (inputMesaCliente.value || 'Mesa 01').trim();
    const observacoes = (inputObsCliente.value || '').trim();
    const total = sacola.reduce((acc, cur) => acc + (cur.preco * cur.quantidade), 0);
    const numero = Math.floor(100 + Math.random() * 900);

    const novoPedido = {
      id: numero,
      mesa,
      observacoes,
      itens: sacola,
      total,
      status: 'RECEBIDO',
      criadoEm: new Date().toISOString()
    };

    try {
      const historico = JSON.parse(localStorage.getItem('churrasqueiro_pedidos') || '[]');
      historico.unshift(novoPedido);
      localStorage.setItem('churrasqueiro_pedidos', JSON.stringify(historico));
    } catch (_) {}

    salvarSacola([]);
    sacolaBackdrop.style.display = 'none';

    numeroPedidoCriado.textContent = `#${numero}`;
    resumoMesaConfirmada.textContent = mesa;
    resumoTotalConfirmado.textContent = formatarPreco(total);
    modalSucessoPedidoBackdrop.style.display = 'flex';
  });

  btnFecharSucessoPedido.addEventListener('click', () => {
    modalSucessoPedidoBackdrop.style.display = 'none';
  });

  async function atualizarTela() {
    if (isFuncionario) {
      await carregarEstatisticas();
    }
    await renderizarGridProdutos();
    atualizarCabecalhoSacola();
  }

  async function carregarEstatisticas() {
    const stats = await cardapioService.obterEstatisticas();
    
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statBurgers').textContent = stats.burgers;
    document.getElementById('statDisponiveis').textContent = stats.disponiveis;
    document.getElementById('statEsgotados').textContent = stats.esgotados;

    const todosItens = await cardapioService.listar();
    document.getElementById('countTodos').textContent = todosItens.length;
    document.getElementById('countBurgers').textContent = todosItens.filter(i => i.categoria === 'burgers').length;
    document.getElementById('countSmashes').textContent = todosItens.filter(i => i.categoria === 'smashes').length;
    document.getElementById('countAcompanhamentos').textContent = todosItens.filter(i => i.categoria === 'acompanhamentos').length;
    document.getElementById('countBebidas').textContent = todosItens.filter(i => i.categoria === 'bebidas').length;
    document.getElementById('countSobremesas').textContent = todosItens.filter(i => i.categoria === 'sobremesas').length;
  }

  async function renderizarGridProdutos() {
    gridProdutos.innerHTML = '';
    const produtos = await cardapioService.listar(estadoFiltros);

    if (produtos.length === 0) {
      gridProdutos.style.display = 'none';
      estadoVazio.style.display = 'block';
      return;
    }

    gridProdutos.style.display = 'grid';
    estadoVazio.style.display = 'none';

    produtos.forEach(produto => {
      const card = criarCardProduto(produto);
      gridProdutos.appendChild(card);
    });
  }

  function formatarPreco(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = `produto-card ${!produto.disponivel ? 'esgotado' : ''}`;
    card.id = `card-produto-${produto.id}`;

    const nomeCat = NOMES_CATEGORIAS[produto.categoria] || produto.categoria;
    const imagemSrc = produto.imagem || IMAGENS_PADRAO[produto.categoria] || IMAGENS_PADRAO.burgers;

    card.innerHTML = `
      <div class="card-thumb-wrapper">
        <img src="${imagemSrc}" alt="${produto.nome}" class="card-thumb" loading="lazy" onerror="this.src='${IMAGENS_PADRAO.burgers}'" />
        <div class="card-overlay-gradient"></div>

        <div class="card-tags-top">
          <span class="categoria-tag">${nomeCat}</span>
          <span class="badge-status ${produto.disponivel ? 'badge-disponivel' : 'badge-esgotado'}">
            <i class="fa-solid ${produto.disponivel ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
            ${produto.disponivel ? 'Disponível' : 'Esgotado'}
          </span>
        </div>

        ${produto.destaque ? `
          <div class="badge-destaque">
            <i class="fa-solid fa-star"></i> Destaque da Casa
          </div>
        ` : ''}
      </div>

      <div class="card-corpo">
        <div class="card-header-preco">
          <h3 class="card-titulo">${produto.nome}</h3>
          <span class="card-preco">${formatarPreco(produto.preco)}</span>
        </div>

        <p class="card-descricao">${produto.descricao}</p>

        <div class="card-meta">
          <div class="card-meta-item">
            <i class="fa-regular fa-clock"></i>
            <span>~${produto.tempoPreparoMinutos || 12} min</span>
          </div>
          <div class="card-meta-item">
            <i class="fa-solid fa-tag"></i>
            <span>Cód #${produto.id}</span>
          </div>
        </div>

        <div class="card-acoes-wrapper">
          <button 
            type="button" 
            class="btn-card-adicionar apenas-cliente" 
            ${!produto.disponivel ? 'disabled' : ''}
          >
            <i class="fa-solid ${produto.disponivel ? 'fa-plus' : 'fa-ban'}"></i>
            <span>${produto.disponivel ? 'ADICIONAR À COMANDA' : 'ESGOTADO NO MOMENTO'}</span>
          </button>

          <div class="card-acoes-funcionario apenas-funcionario">
            <button 
              type="button" 
              class="btn-card-toggle ${produto.disponivel ? 'ativo' : 'pausado'}" 
              data-id="${produto.id}" 
              title="${produto.disponivel ? 'Pausar venda deste item' : 'Reativar item no salão'}"
            >
              <i class="fa-solid ${produto.disponivel ? 'fa-pause' : 'fa-play'}"></i>
              <span>${produto.disponivel ? 'Pausar Venda' : 'Ativar Venda'}</span>
            </button>

            <button 
              type="button" 
              class="btn-card-acao btn-editar" 
              data-id="${produto.id}" 
              title="Editar produto"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>

            <button 
              type="button" 
              class="btn-card-acao btn-excluir" 
              data-id="${produto.id}" 
              data-nome="${produto.nome}" 
              title="Excluir produto"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    const btnAdicionar = card.querySelector('.btn-card-adicionar');
    if (btnAdicionar && produto.disponivel) {
      btnAdicionar.addEventListener('click', () => {
        adicionarItemSacola(produto);
      });
    }

    const btnToggle = card.querySelector('.btn-card-toggle');
    if (btnToggle) {
      btnToggle.addEventListener('click', async () => {
        await alternarStatusProduto(produto.id);
      });
    }

    const btnEditar = card.querySelector('.btn-editar');
    if (btnEditar) {
      btnEditar.addEventListener('click', () => {
        abrirModalEdicao(produto.id);
      });
    }

    const btnExcluir = card.querySelector('.btn-excluir');
    if (btnExcluir) {
      btnExcluir.addEventListener('click', () => {
        abrirModalExclusao(produto.id, produto.nome);
      });
    }

    return card;
  }

  async function alternarStatusProduto(id) {
    try {
      const atualizado = await cardapioService.alternarStatus(id);
      const statusTexto = atualizado.disponivel ? 'ativado para venda' : 'marcado como esgotado';
      mostrarToast(`Produto "${atualizado.nome}" ${statusTexto}.`, 'sucesso');
      await atualizarTela();
    } catch (e) {
      mostrarToast('Não foi possível alterar a disponibilidade.', 'erro');
    }
  }

  function abrirModalCriacao() {
    formProduto.reset();
    inputProdutoId.value = '';
    modalTitulo.textContent = 'CADASTRAR NOVO PRODUTO';
    checkboxProdutoDisponivel.checked = true;
    checkboxProdutoDestaque.checked = false;
    inputProdutoTempo.value = 12;
    atualizarPreviewImagem();
    modalProdutoBackdrop.style.display = 'flex';
  }

  async function abrirModalEdicao(id) {
    const produto = await cardapioService.buscarPorId(id);
    if (!produto) {
      mostrarToast('Produto não encontrado.', 'erro');
      return;
    }

    inputProdutoId.value = produto.id;
    inputProdutoNome.value = produto.nome;
    inputProdutoPreco.value = produto.preco;
    selectProdutoCategoria.value = produto.categoria;
    inputProdutoTempo.value = produto.tempoPreparoMinutos || 12;
    textareaProdutoDescricao.value = produto.descricao;
    inputProdutoImagem.value = produto.imagem || '';
    checkboxProdutoDisponivel.checked = produto.disponivel;
    checkboxProdutoDestaque.checked = Boolean(produto.destaque);

    modalTitulo.textContent = 'EDITAR PRODUTO';
    atualizarPreviewImagem();
    modalProdutoBackdrop.style.display = 'flex';
  }

  function fecharModalProduto() {
    modalProdutoBackdrop.style.display = 'none';
    formProduto.reset();
  }

  function atualizarPreviewImagem() {
    const url = inputProdutoImagem.value.trim();
    const cat = selectProdutoCategoria.value;
    imgPreview.src = url || IMAGENS_PADRAO[cat] || IMAGENS_PADRAO.burgers;
  }

  inputProdutoImagem.addEventListener('input', atualizarPreviewImagem);
  selectProdutoCategoria.addEventListener('change', () => {
    if (!inputProdutoImagem.value.trim()) {
      atualizarPreviewImagem();
    }
  });

  formProduto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = inputProdutoId.value;
    const nome = inputProdutoNome.value.trim();
    const preco = parseFloat(inputProdutoPreco.value);
    const categoria = selectProdutoCategoria.value;
    const tempoPreparoMinutos = parseInt(inputProdutoTempo.value) || 12;
    const descricao = textareaProdutoDescricao.value.trim();
    const imagem = inputProdutoImagem.value.trim() || IMAGENS_PADRAO[categoria] || IMAGENS_PADRAO.burgers;
    const disponivel = checkboxProdutoDisponivel.checked;
    const destaque = checkboxProdutoDestaque.checked;

    if (!nome || isNaN(preco)) {
      mostrarToast('Preencha os campos obrigatórios corretamente.', 'erro');
      return;
    }

    const payload = {
      ...(id ? { id: Number(id) } : {}),
      nome,
      preco,
      categoria,
      tempoPreparoMinutos,
      descricao,
      imagem,
      disponivel,
      destaque
    };

    try {
      await cardapioService.salvar(payload);
      fecharModalProduto();
      mostrarToast(id ? 'Produto atualizado com sucesso!' : 'Novo produto adicionado ao cardápio!', 'sucesso');
      await atualizarTela();
    } catch (err) {
      mostrarToast(err.message || 'Erro ao salvar produto.', 'erro');
    }
  });

  function abrirModalExclusao(id, nome) {
    idProdutoParaExcluir = id;
    nomeProdutoExcluir.textContent = `"${nome}"`;
    modalExcluirBackdrop.style.display = 'flex';
  }

  function fecharModalExclusao() {
    modalExcluirBackdrop.style.display = 'none';
    idProdutoParaExcluir = null;
  }

  btnConfirmarExclusao.addEventListener('click', async () => {
    if (!idProdutoParaExcluir) return;

    try {
      await cardapioService.deletar(idProdutoParaExcluir);
      fecharModalExclusao();
      mostrarToast('Produto removido do cardápio com sucesso.', 'sucesso');
      await atualizarTela();
    } catch (err) {
      mostrarToast('Erro ao remover produto.', 'erro');
    }
  });

  if (btnAbrirModalCriar) btnAbrirModalCriar.addEventListener('click', abrirModalCriacao);
  if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModalProduto);
  if (btnCancelarModal) btnCancelarModal.addEventListener('click', fecharModalProduto);

  btnFecharModalExcluir.addEventListener('click', fecharModalExclusao);
  btnCancelarExclusao.addEventListener('click', fecharModalExclusao);

  window.addEventListener('click', (e) => {
    if (e.target === modalProdutoBackdrop) fecharModalProduto();
    if (e.target === modalExcluirBackdrop) fecharModalExclusao();
  });

  let timeoutBusca = null;
  inputBusca.addEventListener('input', (e) => {
    clearTimeout(timeoutBusca);
    const valor = e.target.value;
    btnLimparBusca.style.display = valor ? 'block' : 'none';

    timeoutBusca = setTimeout(async () => {
      estadoFiltros.busca = valor;
      await renderizarGridProdutos();
    }, 250);
  });

  btnLimparBusca.addEventListener('click', async () => {
    inputBusca.value = '';
    btnLimparBusca.style.display = 'none';
    estadoFiltros.busca = '';
    await renderizarGridProdutos();
  });

  pillsCategorias.forEach(pill => {
    pill.addEventListener('click', async () => {
      pillsCategorias.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      estadoFiltros.categoria = pill.dataset.categoria;
      await renderizarGridProdutos();
    });
  });

  selectStatus.addEventListener('change', async (e) => {
    estadoFiltros.status = e.target.value;
    await renderizarGridProdutos();
  });

  selectOrdenacao.addEventListener('change', async (e) => {
    estadoFiltros.ordenacao = e.target.value;
    await renderizarGridProdutos();
  });

  btnResetarFiltros.addEventListener('click', async () => {
    inputBusca.value = '';
    btnLimparBusca.style.display = 'none';
    estadoFiltros.busca = '';
    estadoFiltros.categoria = 'todos';
    estadoFiltros.status = isFuncionario ? 'todos' : 'disponivel';
    estadoFiltros.ordenacao = 'populares';

    pillsCategorias.forEach(p => p.classList.remove('active'));
    document.querySelector('.pill-btn[data-categoria="todos"]').classList.add('active');
    selectStatus.value = 'todos';
    selectOrdenacao.value = 'populares';

    await renderizarGridProdutos();
  });

  function mostrarToast(mensagem, tipo = 'sucesso') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    const icone = tipo === 'sucesso' ? 'fa-circle-check' : 'fa-triangle-exclamation';
    toast.innerHTML = `
      <i class="fa-solid ${icone}"></i>
      <span>${mensagem}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(60px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  atualizarTela();
});
