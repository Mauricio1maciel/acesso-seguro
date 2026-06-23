import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioDataAccess from '../data_access/usuario.da.js';

class AuthController {
  showLogin = async (req, res) => {
    return res.inertia('Auth/Login');
  }

  login = async (req, res) => {
    const { email, senha } = req.body;
    const errors = {};

    if (!email || email.trim() === '') {
      errors.email = 'O e-mail é obrigatório.';
    }
    if (!senha || senha.trim() === '') {
      errors.senha = 'A senha é obrigatória.';
    }

    if (Object.keys(errors).length > 0) {
      req.session.flash = { error: 'Campos obrigatórios ausentes.' };
      req.session.errors = errors;
      return res.redirect(303, '/login');
    }

    try {
      const usuario = await UsuarioDataAccess.getByEmail(email);

      if (!usuario) {
        req.session.flash = { error: 'E-mail ou senha inválidos.' };
        req.session.errors = { email: 'E-mail ou senha incorretos.' };
        return res.redirect(303, '/login');
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        req.session.flash = { error: 'E-mail ou senha inválidos.' };
        req.session.errors = { email: 'E-mail ou senha incorretos.' };
        return res.redirect(303, '/login');
      }

      // Gerar Token JWT
      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET || 'acesso_seguro_jwt_secret_key_987!',
        { expiresIn: '1d' }
      );

      // Salvar em um cookie seguro HttpOnly
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 dia
      });

      req.session.flash = { success: `Bem-vindo de volta, ${usuario.nome}!` };
      return res.redirect(303, '/');
    } catch (error) {
      req.session.flash = { error: 'Erro interno ao realizar autenticação.' };
      return res.redirect(303, '/login');
    }
  }

  showCadastro = async (req, res) => {
    return res.inertia('Auth/Cadastro');
  }

  cadastro = async (req, res) => {
    const { nome, email, senha, confirmarSenha } = req.body;
    const errors = {};

    if (!nome || nome.trim() === '') errors.nome = 'O nome é obrigatório.';
    if (!email || email.trim() === '') errors.email = 'O e-mail é obrigatório.';
    if (!senha || senha.trim() === '') errors.senha = 'A senha é obrigatória.';
    if (senha && senha.length < 6) errors.senha = 'A senha deve conter ao menos 6 caracteres.';
    if (!confirmarSenha || confirmarSenha.trim() === '') errors.confirmarSenha = 'A confirmação de senha é obrigatória.';
    if (senha && confirmarSenha && senha !== confirmarSenha) {
      errors.confirmarSenha = 'As senhas não coincidem.';
    }

    if (Object.keys(errors).length > 0) {
      req.session.flash = { error: 'Verifique os dados informados.' };
      req.session.errors = errors;
      return res.redirect(303, '/cadastro');
    }

    try {
      const usuarioExistente = await UsuarioDataAccess.getByEmail(email);
      if (usuarioExistente) {
        req.session.flash = { error: 'E-mail já cadastrado.' };
        req.session.errors = { email: 'Este e-mail já está em uso.' };
        return res.redirect(303, '/cadastro');
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const resultado = await UsuarioDataAccess.create({
        nome,
        email,
        senha: senhaHash
      });

      if (resultado.status === 'ok') {
        req.session.flash = { success: 'Conta criada com sucesso! Faça login para continuar.' };
        return res.redirect(303, '/login');
      } else {
        req.session.flash = { error: 'Erro ao salvar os dados do usuário.' };
        return res.redirect(303, '/cadastro');
      }
    } catch (error) {
      req.session.flash = { error: 'Erro interno ao criar conta.' };
      return res.redirect(303, '/cadastro');
    }
  }

  logout = async (req, res) => {
    res.clearCookie('token');
    req.session.flash = { success: 'Você saiu com sucesso!' };
    return res.redirect(303, '/login');
  }
}

export default new AuthController();
