const CARDAPIO_API_URL = 'http://localhost:8082/api/produtos';
const STORAGE_KEY = 'churrasqueiro_cardapio_itens';

const ITENS_INICIAIS = [
  {
    id: 1,
    nome: 'Costela Defumada Burger',
    categoria: 'burgers',
    preco: 44.90,
    descricao: 'Pão brioche selado na manteiga de garrafa, blend bovino de 200g grelhado na brasa, costela desfiada com barbecue artesanal, queijo monterey jack derretido e cebola crispy.',
    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    disponivel: true,
    destaque: true,
    tempoPreparoMinutos: 15
  },
  {
    id: 2,
    nome: 'Bacon & Cheddar Volcano',
    categoria: 'burgers',
    preco: 39.90,
    descricao: 'Blend 180g de fraldinha e bacon, dobro de queijo cheddar inglês fundido, fatias generosas de bacon artesanal caramelizado e maionese defumada.',
    imagem: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80',
    disponivel: true,
    destaque: true,
    tempoPreparoMinutos: 12
  },
  {
    id: 3,
    nome: 'Double Smash Churrasqueiro',
    categoria: 'smashes',
    preco: 34.90,
    descricao: 'Dois ultrassmash burgers prensados de 90g com crostinha perfeita, queijo prato duplo derretido, picles artesanal agridoce e molho especial da casa.',
    imagem: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
    disponivel: true,
    destaque: false,
    tempoPreparoMinutos: 8
  },
  {
    id: 4,
    nome: 'Smash Trufado',
    categoria: 'smashes',
    preco: 36.90,
    descricao: 'Dois smash de 90g, queijo gouda cremoso, cogumelos salteados no azeite trufado e maionese de alho negro no pão de batata fofinho.',
    imagem: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    disponivel: false,
    destaque: false,
    tempoPreparoMinutos: 10
  },
  {
    id: 5,
    nome: 'Batatas Rústicas com Alecrim',
    categoria: 'acompanhamentos',
    preco: 24.90,
    descricao: 'Batatas com casca cortadas à mão, douradas e crocantes, temperadas com sal grosso triturado, alecrim fresco da horta e aioli de alho assado.',
    imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80',
    disponivel: true,
    destaque: false,
    tempoPreparoMinutos: 10
  },
  {
    id: 6,
    nome: 'Onion Rings Crocantes',
    categoria: 'acompanhamentos',
    preco: 26.90,
    descricao: 'Anéis de cebola doce envoltos em massa temperada com cerveja artesanal e farinha panko japonesa, ultra crocantes. Acompanha molho barbecue com whisky.',
    imagem: 'https://images.unsplash.com/photo-1639024471287-035216734182?w=800&auto=format&fit=crop&q=80',
    disponivel: true,
    destaque: false,
    tempoPreparoMinutos: 8
  },
  {
    id: 7,
    nome: 'Chopp Artesanal IPA 500ml',
    categoria: 'bebidas',
    preco: 18.00,
    descricao: 'Chopp artesanal fresco, notas cítricas e amargor equilibrado. Servido em caldereta ultracongelada.',
    imagem: 'https://images.unsplash.com/photo-1608270199147-3860bb4f72eb?w=800&auto=format&fit=crop&q=80',
    disponivel: true,
    destaque: false,
    tempoPreparoMinutos: 3
  },
  {
    id: 8,
    nome: 'Pink Lemonade da Casa',
    categoria: 'bebidas',
    preco: 14.50,
    descricao: 'Limonada siciliana fresca com infusão de frutas vermelhas silvestres, xarope de hibisco artesanal e hortelã fresca.',
    imagem: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
    disponivel: true,
    destaque: false,
    tempoPreparoMinutos: 4
  },
  {
    id: 9,
    nome: 'Brownie na Brasa com Sorvete',
    categoria: 'sobremesas',
    preco: 28.00,
    descricao: 'Fatia alta de brownie de chocolate 70% selada na grelha, servida com bola de sorvete de baunilha de Madagascar, nozes caramelizadas e calda de chocolate quente.',
    imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    disponivel: true,
    destaque: true,
    tempoPreparoMinutos: 7
  },
  {
    id: 10,
    nome: 'Shake Doce de Leite com Farofa de Bacon',
    categoria: 'sobremesas',
    preco: 26.50,
    descricao: 'Milkshake ultra cremoso de doce de leite artesanal argentino, finalizado com chantilly de baunilha e crumble crocante de bacon caramelizado.',
    imagem: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    disponivel: true,
    destaque: false,
    tempoPreparoMinutos: 6
  }
];

class CardapioService {
  constructor() {
    this._inicializarArmazenamento();
  }

  _inicializarArmazenamento() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ITENS_INICIAIS));
    }
  }

  _obterTodosDoStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  _salvarTodosNoStorage(itens) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }

  async listar(filtros = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(CARDAPIO_API_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const dadosBack = await res.json();
        if (Array.isArray(dadosBack) && dadosBack.length > 0) {
          return this._aplicarFiltros(dadosBack, filtros);
        }
      }
    } catch (_) {
    }

    const itens = this._obterTodosDoStorage();
    return this._aplicarFiltros(itens, filtros);
  }

  _aplicarFiltros(itens, { categoria, busca, status, ordenacao } = {}) {
    let filtrados = [...itens];

    if (categoria && categoria !== 'todos') {
      filtrados = filtrados.filter(item => item.categoria === categoria);
    }

    if (status && status !== 'todos') {
      const disponivel = status === 'disponivel';
      filtrados = filtrados.filter(item => item.disponivel === disponivel);
    }

    if (busca && busca.trim() !== '') {
      const termo = busca.trim().toLowerCase();
      filtrados = filtrados.filter(item =>
        item.nome.toLowerCase().includes(termo) ||
        (item.descricao && item.descricao.toLowerCase().includes(termo))
      );
    }

    if (ordenacao) {
      switch (ordenacao) {
        case 'menor_preco':
          filtrados.sort((a, b) => a.preco - b.preco);
          break;
        case 'maior_preco':
          filtrados.sort((a, b) => b.preco - a.preco);
          break;
        case 'nome_asc':
          filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
          break;
        case 'populares':
        default:
          filtrados.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
          break;
      }
    }

    return filtrados;
  }

  async buscarPorId(id) {
    const itens = this._obterTodosDoStorage();
    return itens.find(item => item.id === Number(id)) || null;
  }

  async salvar(produto) {
    const itens = this._obterTodosDoStorage();
    let produtoSalvo;

    if (produto.id) {
      const index = itens.findIndex(i => i.id === Number(produto.id));
      if (index === -1) throw new Error('Produto não encontrado para edição.');
      produtoSalvo = { ...itens[index], ...produto, id: Number(produto.id) };
      itens[index] = produtoSalvo;
    } else {
      const novoId = itens.length > 0 ? Math.max(...itens.map(i => i.id || 0)) + 1 : 1;
      produtoSalvo = {
        ...produto,
        id: novoId,
        disponivel: produto.disponivel !== undefined ? produto.disponivel : true,
        destaque: Boolean(produto.destaque)
      };
      itens.unshift(produtoSalvo);
    }

    this._salvarTodosNoStorage(itens);

    try {
      const url = produto.id ? `${CARDAPIO_API_URL}/${produto.id}` : CARDAPIO_API_URL;
      const method = produto.id ? 'PUT' : 'POST';
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoSalvo)
      }).catch(() => {});
    } catch (_) {}

    return produtoSalvo;
  }

  async alternarStatus(id) {
    const itens = this._obterTodosDoStorage();
    const index = itens.findIndex(i => i.id === Number(id));
    if (index === -1) throw new Error('Produto não encontrado');

    itens[index].disponivel = !itens[index].disponivel;
    this._salvarTodosNoStorage(itens);

    try {
      fetch(`${CARDAPIO_API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disponivel: itens[index].disponivel })
      }).catch(() => {});
    } catch (_) {}

    return itens[index];
  }

  async deletar(id) {
    const itens = this._obterTodosDoStorage();
    const novosItens = itens.filter(i => i.id !== Number(id));
    this._salvarTodosNoStorage(novosItens);

    try {
      fetch(`${CARDAPIO_API_URL}/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (_) {}

    return true;
  }

  async obterEstatisticas() {
    const itens = this._obterTodosDoStorage();
    const total = itens.length;
    const burgers = itens.filter(i => i.categoria === 'burgers' || i.categoria === 'smashes').length;
    const disponiveis = itens.filter(i => i.disponivel).length;
    const esgotados = itens.filter(i => !i.disponivel).length;

    return { total, burgers, disponiveis, esgotados };
  }
}

window.cardapioService = new CardapioService();
