import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Recycle, LayoutDashboard, DollarSign, Phone, Image, Settings, ArrowLeft, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/admin', label: 'Главная', icon: LayoutDashboard, exact: true },
  { to: '/admin/prices', label: 'Цены', icon: DollarSign },
  { to: '/admin/contacts', label: 'Контакты', icon: Phone },
  { to: '/admin/gallery', label: 'Галерея', icon: Image },
  { to: '/admin/settings', label: 'Настройки', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar - desktop */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-zinc-950 border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <Recycle className="w-8 h-8 text-accent-500 group-hover:rotate-180 transition-transform duration-700" />
            <div>
              <div className="font-display text-lg font-bold text-white">Админ-панель</div>
              <div className="text-xs text-gray-500">ИП «Неделько»</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            На сайт
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/80 transition"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="text-white p-2 rounded-lg hover:bg-white/10">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-display font-bold text-white">Админ-панель</span>
          <button
            onClick={handleLogout}
            className="text-red-400 p-2 rounded-lg hover:bg-red-500/20 transition"
            aria-label="Выйти"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
