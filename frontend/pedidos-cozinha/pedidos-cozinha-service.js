const PEDIDOS_API_URL = 'http://localhost:8083/api/pedidos';
const PEDIDOS_STORAGE_KEY = 'churrasqueiro_pedidos';

const pedidosCozinhaService = {
  async obterPedidos() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(PEDIDOS_API_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const dados = await res.json();
        if (Array.isArray(dados)) {
          localStorage.setItem(PEDIDOS_STORAGE_KEY, JSON.stringify(dados));
          return dados;
        }
      }
    } catch (_) {}

    try {
      const data = localStorage.getItem(PEDIDOS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  },

  salvarPedidos(pedidos) {
    try {
      localStorage.setItem(PEDIDOS_STORAGE_KEY, JSON.stringify(pedidos));
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}
  },

  async alterarStatus(pedidoId, novoStatus) {

    const pedidos = this.obterPedidosCache();
    const index = pedidos.findIndex(p => p.id === Number(pedidoId));
    if (index > -1) {
      pedidos[index].status = novoStatus;
      this.salvarPedidos(pedidos);
    }

    try {
      await fetch(`${PEDIDOS_API_URL}/${pedidoId}/status?novoStatus=${novoStatus}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });
    } catch (_) {}

    return index > -1 ? pedidos[index] : null;
  },

  obterPedidosCache() {
    try {
      const data = localStorage.getItem(PEDIDOS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }
};
