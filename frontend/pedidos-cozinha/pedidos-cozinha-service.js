const PEDIDOS_STORAGE_KEY = 'churrasqueiro_pedidos';

const pedidosCozinhaService = {
  obterPedidos() {
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

  alterarStatus(pedidoId, novoStatus) {
    const pedidos = this.obterPedidos();
    const index = pedidos.findIndex(p => p.id === Number(pedidoId));
    if (index > -1) {
      pedidos[index].status = novoStatus;
      this.salvarPedidos(pedidos);
      return pedidos[index];
    }
    return null;
  }
};
