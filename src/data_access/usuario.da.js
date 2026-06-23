import Usuario from '../models/usuario.model.js';

class UsuarioDataAccess {
  async getByEmail(email) {
    return await Usuario.findOne({ where: { email } });
  }

  async getById(id) {
    return await Usuario.findByPk(id);
  }

  async create(data) {
    try {
      const novo = await Usuario.create(data);
      return { status: 'ok', data: novo };
    } catch (error) {
      return { status: 'error', error: error };
    }
  }

  async update(id, data) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return { status: 'not_found' };
      const atualizado = await usuario.update(data);
      return { status: 'ok', data: atualizado };
    } catch (error) {
      return { status: 'error', error: error };
    }
  }

  async delete(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return false;
    await usuario.destroy();
    return true;
  }
}

export default new UsuarioDataAccess();
