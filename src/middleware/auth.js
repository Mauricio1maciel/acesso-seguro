import jwt from 'jsonwebtoken';
import UsuarioDataAccess from '../data_access/usuario.da.js';

export async function autenticar(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    req.session.flash = { error: 'Por favor, faça login para acessar o sistema.' };
    return res.redirect(303, '/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'acesso_seguro_jwt_secret_key_987!');
    const usuario = await UsuarioDataAccess.getById(decoded.id);

    if (!usuario) {
      res.clearCookie('token');
      req.session.flash = { error: 'Usuário não encontrado. Faça login novamente.' };
      return res.redirect(303, '/login');
    }

    // Injeta dados do usuário na requisição
    req.user = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    };

    return next();
  } catch (error) {
    res.clearCookie('token');
    req.session.flash = { error: 'Sessão expirada. Por favor, faça login novamente.' };
    return res.redirect(303, '/login');
  }
}

export function redirecionarSeLogado(req, res, next) {
  const token = req.cookies?.token;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'acesso_seguro_jwt_secret_key_987!');
      return res.redirect(303, '/');
    } catch (error) {
      res.clearCookie('token');
    }
  }

  next();
}
