const PEDIDOS_STORAGE_KEY = 'churrasqueiro_pedidos';

const pedidosClienteService = {
  obterPedidos() {
    try {
      const data = localStorage.getItem(PEDIDOS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  },

  obterPedidoPorId(id) {
    const pedidos = this.obterPedidos();
    return pedidos.find(p => p.id === Number(id)) || null;
  },

  obterUltimoPedido() {
    const pedidos = this.obterPedidos();
    return pedidos.length > 0 ? pedidos[0] : null;
  }
};
