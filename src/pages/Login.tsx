import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    navigate('/admin', { replace: true });
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginValue.trim() || !passwordValue.trim()) {
      setError('Заполните все поля.');
      return;
    }

    const success = login(loginValue, passwordValue);
    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setError('Неверный логин или пароль.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-700/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent-500/15 mb-4 animate-scale-in">
            <Recycle className="w-10 h-10 text-accent-500" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
            Вход в административную панель
          </h1>
          <p className="text-gray-400 text-sm">ИП «Неделько» — управление сайтом</p>
        </div>

        {/* Form card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm animate-fade-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 text-accent-500" />
                Логин
              </label>
              <input
                type="text"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                placeholder="Введите логин"
                autoComplete="username"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500/50 transition"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Lock className="w-4 h-4 text-accent-500" />
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-600 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent-500 transition"
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-500/40"
            >
              Войти
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-accent-500 text-sm transition"
          >
            <Recycle className="w-4 h-4" />
            Вернуться на сайт
          </a>
        </div>
      </div>
    </div>
  );
}
