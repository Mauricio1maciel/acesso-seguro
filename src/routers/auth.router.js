import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { redirecionarSeLogado } from '../middleware/auth.js';

const router = Router();

router.get('/login', redirecionarSeLogado, AuthController.showLogin);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

router.get('/cadastro', redirecionarSeLogado, AuthController.showCadastro);
router.post('/cadastro', AuthController.cadastro);

export default router;
