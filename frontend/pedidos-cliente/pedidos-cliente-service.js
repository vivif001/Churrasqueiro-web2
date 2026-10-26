const PEDIDOS_API_URL = 'http://localhost:8083/api/pedidos';
const PEDIDOS_STORAGE_KEY = 'churrasqueiro_pedidos';

const pedidosClienteService = {
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

  async obterPedidoPorId(id) {
    try {
      const res = await fetch(`${PEDIDOS_API_URL}/${id}`);
      if (res.ok) return await res.json();
    } catch (_) {}

    const pedidos = await this.obterPedidos();
    return pedidos.find(p => p.id === Number(id)) || null;
  },

  async obterUltimoPedido() {
    const pedidos = await this.obterPedidos();
    return pedidos.length > 0 ? pedidos[0] : null;
  }
};
