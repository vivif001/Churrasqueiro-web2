const GESTAO_API_URL = 'http://localhost:8081/api/funcionarios';
const EQUIPE_STORAGE_KEY = 'churrasqueiro_equipe_membros';

const MEMBROS_PADRAO = [
  {
    id: 1,
    nome: 'Administrador Chefe',
    email: 'admin@hamburgueria.com',
    cargo: 'ADMIN',
    ativo: true,
    criadoEm: '2026-10-17T18:00:00'
  },
  {
    id: 2,
    nome: 'Garçom Silva',
    email: 'garcom@hamburgueria.com',
    cargo: 'GARCOM',
    ativo: true,
    criadoEm: '2026-10-18T10:30:00'
  },
  {
    id: 3,
    nome: 'Chapeiro Carlos',
    email: 'cozinheiro@hamburgueria.com',
    cargo: 'COZINHEIRO',
    ativo: true,
    criadoEm: '2026-10-19T14:15:00'
  }
];

class EquipeService {
  constructor() {
    this._apiOnline = null;
    this._inicializarStorage();
  }

  _inicializarStorage() {
    const salvo = localStorage.getItem(EQUIPE_STORAGE_KEY);
    if (!salvo) {
      this._salvarNoStorage(MEMBROS_PADRAO);
    }
  }

  _obterDoStorage() {
    try {
      const data = localStorage.getItem(EQUIPE_STORAGE_KEY);
      return data ? JSON.parse(data) : [...MEMBROS_PADRAO];
    } catch (_) {
      return [...MEMBROS_PADRAO];
    }
  }

  _salvarNoStorage(membros) {
    try {
      localStorage.setItem(EQUIPE_STORAGE_KEY, JSON.stringify(membros));
    } catch (e) {
      console.warn('Erro ao salvar equipe no localStorage:', e);
    }
  }

  async verificarConexaoApi() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(GESTAO_API_URL, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      this._apiOnline = res.ok;
      return res.ok;
    } catch (_) {
      this._apiOnline = false;
      return false;
    }
  }

  async listarTodos() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(GESTAO_API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const dados = await response.json();
        this._apiOnline = true;
        if (Array.isArray(dados) && dados.length > 0) {
          this._salvarNoStorage(dados);
          return dados;
        }
      }
    } catch (err) {
      this._apiOnline = false;
    }

    return this._obterDoStorage();
  }

  async buscarPorId(id) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${GESTAO_API_URL}/${id}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}

    const membros = this._obterDoStorage();
    return membros.find(m => m.id === Number(id)) || null;
  }

  async salvar(funcionario) {
    const membros = this._obterDoStorage();
    let membroFinal;

    const isEdicao = Boolean(funcionario.id);

    if (isEdicao) {
      const index = membros.findIndex(m => m.id === Number(funcionario.id));
      if (index === -1) {
        throw new Error('Colaborador não encontrado para edição.');
      }

      membroFinal = {
        ...membros[index],
        nome: funcionario.nome.trim(),
        email: funcionario.email.trim().toLowerCase(),
        cargo: funcionario.cargo,
        ativo: funcionario.ativo !== undefined ? funcionario.ativo : membros[index].ativo,
        id: Number(funcionario.id)
      };

      membros[index] = membroFinal;
    } else {
      const novoId = membros.length > 0 ? Math.max(...membros.map(m => m.id || 0)) + 1 : 1;
      membroFinal = {
        id: novoId,
        nome: funcionario.nome.trim(),
        email: funcionario.email.trim().toLowerCase(),
        cargo: funcionario.cargo,
        ativo: funcionario.ativo !== undefined ? funcionario.ativo : true,
        criadoEm: new Date().toISOString()
      };
      membros.unshift(membroFinal);
    }

    this._salvarNoStorage(membros);

    try {
      const url = isEdicao ? `${GESTAO_API_URL}/${funcionario.id}` : GESTAO_API_URL;
      const method = isEdicao ? 'PUT' : 'POST';

      const payload = {
        nome: funcionario.nome,
        email: funcionario.email,
        cargo: funcionario.cargo,
        senha: funcionario.senha || 'padrao123'
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const backendResult = await res.json();
        if (!isEdicao && backendResult.id) {
          membroFinal.id = backendResult.id;
          this._salvarNoStorage(membros);
        }
        return backendResult;
      }
    } catch (_) {}

    return membroFinal;
  }

  async alternarStatus(id) {
    const membros = this._obterDoStorage();
    const index = membros.findIndex(m => m.id === Number(id));
    if (index === -1) {
      throw new Error('Colaborador não encontrado.');
    }

    membros[index].ativo = !membros[index].ativo;
    const atualizado = membros[index];
    this._salvarNoStorage(membros);

    try {
      await fetch(`${GESTAO_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: atualizado.nome,
          email: atualizado.email,
          cargo: atualizado.cargo,
          senha: 'senhaNaoModificada123',
          ativo: atualizado.ativo
        })
      });
    } catch (_) {}

    return atualizado;
  }

  async deletar(id) {
    const membros = this._obterDoStorage();
    const novosMembros = membros.filter(m => m.id !== Number(id));
    this._salvarNoStorage(novosMembros);

    try {
      await fetch(`${GESTAO_API_URL}/${id}`, {
        method: 'DELETE'
      });
    } catch (_) {}

    return true;
  }

  async obterEstatisticas() {
    const membros = await this.listarTodos();
    const total = membros.length;
    const admins = membros.filter(m => m.cargo === 'ADMIN').length;
    const garcons = membros.filter(m => m.cargo === 'GARCOM').length;
    const cozinheiros = membros.filter(m => m.cargo === 'COZINHEIRO').length;
    const ativos = membros.filter(m => m.ativo).length;
    const inativos = total - ativos;

    return {
      total,
      admins,
      garcons,
      cozinheiros,
      ativos,
      inativos
    };
  }
}

window.equipeService = new EquipeService();
