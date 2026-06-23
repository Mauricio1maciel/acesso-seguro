import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { inertiaMiddleware } from './middleware/inertia.js';
import sequelize from './config/database.js';
import authRouter from './routers/auth.router.js';
import visitanteRouter from './routers/visitante.router.js';
import moradorRouter from './routers/morador.router.js';
import { autenticar } from './middleware/auth.js';
import UsuarioDataAccess from './data_access/usuario.da.js';
import { initCleanupJob } from './jobs/cleanup.job.js';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'unoesc_portaria_secret_key',
  resave: false,
  saveUninitialized: true
}));


const possiblePaths = [
  path.join(process.cwd(), 'dist', 'index.html'),
  path.join(__dirname, '../dist', 'index.html'),
  path.join(__dirname, 'views', 'dist', 'index.html'),
  path.join(process.cwd(), 'src', 'views', 'dist', 'index.html')
];

let finalHtmlPath = null;
let finalDistPath = null;

// O servidor vai testar os caminhos até achar onde a nuvem escondeu o arquivo
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    finalHtmlPath = p;
    finalDistPath = path.dirname(p);
    console.log('✅ Tela React encontrada com sucesso em:', finalDistPath);
    break; 
  }
}

// Libera o acesso aos arquivos estáticos (CSS/JS)
if (finalDistPath) {
  app.use(express.static(finalDistPath, { index: false }));
}

const htmlTemplate = (page) => {
  if (process.env.NODE_ENV === 'production') {
    if (finalHtmlPath) {
      let template = fs.readFileSync(finalHtmlPath, 'utf-8');
      const inertiaDiv = `<div id="app" data-page='${JSON.stringify(page)}'></div>`;

      if (template.includes('<div id="root"></div>')) {
        return template.replace('<div id="root"></div>', inertiaDiv);
      } else if (template.includes('<div id="app"></div>')) {
        return template.replace('<div id="app"></div>', inertiaDiv);
      } else {
        return template.replace('</body>', `${inertiaDiv}</body>`);
      }
    } else {
      return '<h2>Erro: Pasta dist não foi encontrada pelo servidor.</h2>';
    }
  }

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Acesso Seguro</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div id="app" data-page='${JSON.stringify(page)}'></div>
      <script type="module">
        import RefreshRuntime from 'http://localhost:5173/@react-refresh'
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
      </script>
      <script type="module" src="http://localhost:5173/@vite/client"></script>
      <script type="module" src="http://localhost:5173/src/views/app.jsx"></script>
    </body>
  </html>
  `;
};
//<script type="module" src="http://localhost:5173/src/views/app.jsx"></script>
// <script type="module" src="http://localhost:5173/app.jsx"></script>
app.use(inertiaMiddleware(htmlTemplate));

app.use(async (req, res, next) => {
  req.user = null;
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'acesso_seguro_jwt_secret_key_987!');
      const usuario = await UsuarioDataAccess.getById(decoded.id);
      if (usuario) {
        req.user = {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        };
      }
    } catch (err) {
      res.clearCookie('token');
    }
  }

  const flash = req.session.flash || {};
  const errors = req.session.errors || {};
  req.session.flash = {};
  req.session.errors = {};

  res.inertia.share({
    flash: {
      success: flash.success || null,
      error: flash.error || null
    },
    errors: errors,
    auth: {
      user: req.user
    }
  });

  next();
});

app.use(authRouter);
app.use(autenticar, visitanteRouter);
app.use(autenticar, moradorRouter);

initCleanupJob();

const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true }).then(() => {
  console.log('Banco de dados sincronizado...');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});