const GESTAO_API_URL = 'http://localhost:8081/api/funcionarios';
const FUNCIONARIOS_STORAGE_KEY = 'churrasqueiro_funcionarios_local';

const SEED_FUNCIONARIOS = [
  {
    id: 1,
    nome: 'Administrador Chefe',
    email: 'admin@hamburgueria.com',
    cargo: 'ADMIN',
    ativo: true,
    criadoEm: '2026-10-01T10:00:00'
  },
  {
    id: 2,
    nome: 'Garçom Silva',
    email: 'garcom@hamburgueria.com',
    cargo: 'GARCOM',
    ativo: true,
    criadoEm: '2026-10-05T12:30:00'
  },
  {
    id: 3,
    nome: 'Chapeiro Carlos',
    email: 'cozinheiro@hamburgueria.com',
    cargo: 'COZINHEIRO',
    ativo: true,
    criadoEm: '2026-10-10T14:15:00'
  }
];

function obterCacheLocal() {
  try {
    const dados = localStorage.getItem(FUNCIONARIOS_STORAGE_KEY);
    if (!dados) {
      localStorage.setItem(FUNCIONARIOS_STORAGE_KEY, JSON.stringify(SEED_FUNCIONARIOS));
      return SEED_FUNCIONARIOS;
    }
    return JSON.parse(dados);
  } catch (_) {
    return SEED_FUNCIONARIOS;
  }
}

function salvarCacheLocal(lista) {
  try {
    localStorage.setItem(FUNCIONARIOS_STORAGE_KEY, JSON.stringify(lista));
  } catch (_) {}
}

const equipeService = {
  async listar() {
    try {
      const response = await fetch(GESTAO_API_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Erro ao consultar API: status ${response.status}`);
      }

      const funcionarios = await response.json();
      salvarCacheLocal(funcionarios);
      return funcionarios;
    } catch (err) {
      console.warn('API de gestão offline ou inacessível. Usando dados locais:', err.message);
      return obterCacheLocal();
    }
  },

  async buscarPorId(id) {
    try {
      const response = await fetch(`${GESTAO_API_URL}/${id}`);
      if (!response.ok) throw new Error('Não encontrado no servidor');
      return await response.json();
    } catch (_) {
      const cache = obterCacheLocal();
      return cache.find(f => f.id === Number(id)) || null;
    }
  },

  async salvar(dto) {
    try {
      const response = await fetch(GESTAO_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });

      if (!response.ok) {
        const erroJson = await response.json().catch(() => null);
        throw new Error(erroJson?.mensagem || 'Falha ao salvar funcionário no servidor');
      }

      const criado = await response.json();
      const cache = obterCacheLocal();
      cache.unshift(criado);
      salvarCacheLocal(cache);
      return criado;
    } catch (err) {
      console.warn('Salvando localmente em modo fallback:', err.message);
      const cache = obterCacheLocal();
      const novoId = cache.length > 0 ? Math.max(...cache.map(f => f.id || 0)) + 1 : 1;
      const novo = {
        id: novoId,
        nome: dto.nome,
        email: dto.email,
        cargo: dto.cargo,
        ativo: true,
        criadoEm: new Date().toISOString()
      };
      cache.unshift(novo);
      salvarCacheLocal(cache);
      return novo;
    }
  },

  async atualizar(id, dto) {
    try {
      const response = await fetch(`${GESTAO_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });

      if (!response.ok) {
        const erroJson = await response.json().catch(() => null);
        throw new Error(erroJson?.mensagem || 'Falha ao atualizar funcionário no servidor');
      }

      const atualizado = await response.json();
      const cache = obterCacheLocal();
      const idx = cache.findIndex(f => f.id === Number(id));
      if (idx > -1) {
        cache[idx] = atualizado;
        salvarCacheLocal(cache);
      }
      return atualizado;
    } catch (err) {
      console.warn('Atualizando localmente em modo fallback:', err.message);
      const cache = obterCacheLocal();
      const idx = cache.findIndex(f => f.id === Number(id));
      if (idx > -1) {
        cache[idx] = {
          ...cache[idx],
          nome: dto.nome,
          email: dto.email,
          cargo: dto.cargo,
          ativo: dto.ativo !== undefined ? dto.ativo : cache[idx].ativo
        };
        salvarCacheLocal(cache);
        return cache[idx];
      }
      throw new Error('Colaborador não encontrado');
    }
  },

  async deletar(id) {
    try {
      const response = await fetch(`${GESTAO_API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok && response.status !== 204) {
        throw new Error('Falha ao excluir no servidor');
      }
    } catch (err) {
      console.warn('Excluindo localmente em modo fallback:', err.message);
    }

    const cache = obterCacheLocal();
    const filtrados = cache.filter(f => f.id !== Number(id));
    salvarCacheLocal(filtrados);
    return true;
  }
};
