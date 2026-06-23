import { useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Cadastro({ errors = {}, flash = {} }) {
  const { data, setData, post, processing } = useForm({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
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
    post('/cadastro');
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
        <div className="text-center mb-6">
          <div className="bg-gradient-to-tr from-emerald-500 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-lg shadow-indigo-500/10 hover:scale-105 transition-transform duration-300">
            🏢
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-3 tracking-tight">Criar Conta</h1>
          <p className="text-slate-400 text-xs mt-1">Cadastre um novo operador no Acesso Seguro</p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-black/40">

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Nome Completo</label>
              <input
                type="text"
                value={data.nome}
                onChange={e => setData('nome', e.target.value)}
                placeholder="Nome do Operador"
                className={`w-full px-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-655 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.nome ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500/80'
                }`}
                required
              />
              {errors.nome && (
                <span className="text-xs text-rose-400 font-medium mt-0.5">{errors.nome}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">E-mail Corporativo</label>
              <input
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                placeholder="operador@acessoseguro.com"
                className={`w-full px-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-655 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.email ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500/80'
                }`}
                required
              />
              {errors.email && (
                <span className="text-xs text-rose-400 font-medium mt-0.5">{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Senha</label>
              <input
                type="password"
                value={data.senha}
                onChange={e => setData('senha', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={`w-full px-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-655 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.senha ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500/80'
                }`}
                required
              />
              {errors.senha && (
                <span className="text-xs text-rose-400 font-medium mt-0.5">{errors.senha}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">Confirmar Senha</label>
              <input
                type="password"
                value={data.confirmarSenha}
                onChange={e => setData('confirmarSenha', e.target.value)}
                placeholder="Repita a senha"
                className={`w-full px-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-655 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.confirmarSenha ? 'border-rose-500/60 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500/80'
                }`}
                required
              />
              {errors.confirmarSenha && (
                <span className="text-xs text-rose-400 font-medium mt-0.5">{errors.confirmarSenha}</span>
              )}
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white py-2.5 px-4 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/25 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {processing ? 'Criando Conta...' : 'Cadastrar Operador'}
            </button>

          </form>

          {/* Link to login */}
          <div className="mt-4 text-center border-t border-slate-800/60 pt-3">
            <p className="text-slate-400 text-xs">
              Já possui uma conta?{' '}
              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors underline"
              >
                Faça Login
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-4">
          &copy; {new Date().getFullYear()} Akrium Acesso Seguro. Todos os direitos reservados.
        </p>

      </div>
    </div>
  );
}
