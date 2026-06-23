import { useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Login({ errors = {}, flash = {} }) {
  const { data, setData, post, processing } = useForm({
    email: '',
    senha: ''
  });

  const [exibirFlash, setExibirFlash] = useState(false);

  useEffect(() => {
    if (flash?.error || flash?.success) {
      setExibirFlash(true);
      const timer = setTimeout(() => setExibirFlash(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  function handleSubmit(e) {
    e.preventDefault();
    post('/login');
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/15 blur-[120px] pointer-events-none"></div>

      {/* Toast Notifier */}
      {exibirFlash && (flash?.error || flash?.success) && (
        <div className="fixed top-6 right-6 z-[100] animate-slide-in">
          {flash.success && (
            <div className="bg-emerald-600/90 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/30 backdrop-blur-md flex items-center gap-3">
              <span className="text-xl">✅</span>
              <span className="font-medium text-sm">{flash.success}</span>
              <button onClick={() => setExibirFlash(false)} className="ml-3 hover:text-emerald-200 transition-colors">✕</button>
            </div>
          )}
          {flash.error && (
            <div className="bg-rose-600/90 text-white px-5 py-3 rounded-xl shadow-2xl border border-rose-500/30 backdrop-blur-md flex items-center gap-3 animate-shake">
              <span className="text-xl">❌</span>
              <span className="font-medium text-sm">{flash.error}</span>
              <button onClick={() => setExibirFlash(false)} className="ml-3 hover:text-rose-200 transition-colors">✕</button>
            </div>
          )}
        </div>
      )}

      <div className="max-w-md w-full relative z-10">
        
        {/* Header/Logo */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-tr from-emerald-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg shadow-indigo-500/10 hover:scale-105 transition-transform duration-300">
            🏢
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">Acesso Seguro</h1>
          <p className="text-slate-400 text-sm mt-1.5">Controle de Portaria Integrado & Auditado</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/40">
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Login Administrativo</h2>
            <p className="text-slate-400 text-xs mt-1">Entre com as suas credenciais para gerenciar portarias.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">E-mail Corporativo</label>
              <div className="relative">
                <input
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  placeholder="exemplo@acessoseguro.com"
                  className={`w-full px-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.email ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500/80'
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <span className="text-xs text-rose-400 font-medium mt-0.5">{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Senha de Acesso</label>
              <div className="relative">
                <input
                  type="password"
                  value={data.senha}
                  onChange={e => setData('senha', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.senha ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500/80'
                  }`}
                  required
                />
              </div>
              {errors.senha && (
                <span className="text-xs text-rose-400 font-medium mt-0.5">{errors.senha}</span>
              )}
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/25 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Autenticando...
                </span>
              ) : (
                'Entrar no Sistema'
              )}
            </button>

          </form>

          <div className="mt-6 text-center border-t border-slate-800/60 pt-4">
            <p className="text-slate-400 text-xs">
              Não possui uma conta?{' '}
              <Link
                href="/cadastro"
                className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          &copy; {new Date().getFullYear()} Akrium Acesso Seguro. Todos os direitos reservados.
        </p>

      </div>
    </div>
  );
}
