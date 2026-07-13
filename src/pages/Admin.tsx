import { Link } from 'react-router-dom';
import { DollarSign, Phone, Image, Settings, ArrowRight, TrendingUp } from 'lucide-react';
import AdminLayout from './AdminLayout';

const CARDS = [
  {
    to: '/admin/prices',
    title: 'Цены',
    desc: 'Управление ценами на металлы',
    icon: DollarSign,
    gradient: 'from-accent-500/20 to-accent-700/5',
  },
  {
    to: '/admin/contacts',
    title: 'Контакты',
    desc: 'Адреса, телефоны, режим работы',
    icon: Phone,
    gradient: 'from-blue-500/20 to-blue-700/5',
  },
  {
    to: '/admin/gallery',
    title: 'Галерея',
    desc: 'Добавление и удаление фото',
    icon: Image,
    gradient: 'from-emerald-500/20 to-emerald-700/5',
  },
  {
    to: '/admin/settings',
    title: 'Настройки',
    desc: 'Название сайта, SEO, мета-теги',
    icon: Settings,
    gradient: 'from-purple-500/20 to-purple-700/5',
  },
];

export default function Admin() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-accent-500 text-sm font-semibold uppercase tracking-wider mb-2">
          <TrendingUp className="w-4 h-4" />
          Панель управления
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Админ-панель</h1>
        <p className="text-gray-400 mt-2">Управляйте контентом сайта из одного места.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`group relative bg-gradient-to-br ${card.gradient} border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-accent-500/40 hover:-translate-y-1.5`}
          >
            <div className="w-14 h-14 rounded-2xl bg-accent-500/15 group-hover:bg-accent-500 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110">
              <card.icon className="w-7 h-7 text-accent-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-1">{card.title}</h3>
            <p className="text-sm text-gray-400 mb-4">{card.desc}</p>
            <div className="flex items-center gap-2 text-accent-500 text-sm font-semibold">
              Открыть
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
