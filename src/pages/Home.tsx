import { useEffect, useState } from 'react';
import {
  Recycle,
  Phone,
  Menu,
  X,
  TrendingUp,
  Scale,
  Wallet,
  ArrowRight,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  HardHat,
  Cable,
  Battery,
  Anvil,
  CircleDollarSign,
  ShieldCheck,
  Award,
  ChevronDown,
  Mail,
  Maximize2,
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface PriceSubItem {
  name: string;
  price: string;
}

export interface PriceItem {
  name: string;
  price: string;
  unit: string;
  subItems?: PriceSubItem[];
}

export interface ContactsData {
  orgName: string;
  addrPyatigorsk: string;
  addrMinvody: string;
  phone1: string;
  phone2: string;
  email: string;
  hours: string;
  whatsapp: string;
  telegram: string;
  max: string;
}

export interface SettingsData {
  siteName: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
}

export const DEFAULT_PRICES: PriceItem[] = [
  { name: 'МЕДЬ', price: '825', unit: '₽/кг', subItems: [
    { name: 'Медь кусок', price: '825' },
    { name: 'Медь газовые горелки', price: '780' },
  ] },
  { name: 'МЕДЬ ЛУЖЕНКА', price: '700', unit: '₽/кг' },
  { name: 'ГОРЕЛКА', price: '700', unit: '₽/кг' },
  { name: 'ГОРЕЛКА ЛУЖЕННАЯ', price: '600', unit: '₽/кг' },
  { name: 'ЛАТУНЬ', price: '540', unit: '₽/кг' },
  { name: 'ЛАТ.РАД.', price: '500', unit: '₽/кг' },
  { name: 'БОЧКА', price: '235', unit: '₽/кг' },
  { name: 'ПИЩЕВОЙ', price: '230', unit: '₽/кг' },
  { name: 'МОТОРНЫЙ', price: '143', unit: '₽/кг' },
  { name: 'ЛИТЬЁ', price: '138', unit: '₽/кг' },
  { name: 'ДИСКИ', price: '170', unit: '₽/кг' },
  { name: 'БЫТОВОЙ', price: '135', unit: '₽/кг' },
  { name: 'БАНКА АЛЮМ. (12%)', price: '138', unit: '₽/кг' },
  { name: 'АЛЮМ.РАД', price: '90', unit: '₽/кг' },
  { name: 'ЦИНК', price: '120', unit: '₽/кг' },
  { name: 'ЦИНК С/ТЕХ', price: '110', unit: '₽/кг' },
  { name: 'АКБ СУХОЙ', price: '43', unit: '₽/кг' },
  { name: 'АКБ ЗАЛИТ.', price: '40', unit: '₽/кг' },
  { name: 'СВИНЕЦ', price: '95', unit: '₽/кг' },
];

export const DEFAULT_CONTACTS: ContactsData = {
  orgName: 'ИП «Неделько»',
  addrPyatigorsk: 'г. Пятигорск, пос. Горячеводский, ул. Ленина 116А',
  addrMinvody: 'г. Минеральные Воды, ул. Московская 23',
  phone1: '+79280000000',
  phone2: '+79887419359',
  email: 'KMV-LOM@mail.ru',
  hours: 'Пн–Пт 08:00–17:00, Сб 08:00–14:00, Вс — выходной',
  whatsapp: '+79280000000',
  telegram: '+79280000000',
  max: '+79887419359',
};

export const DEFAULT_SETTINGS: SettingsData = {
  siteName: 'ИП «Неделько»',
  subtitle: 'Приём металлолома в Пятигорске и Минеральных Водах',
  seoTitle: 'ИП «Неделько» — Приём металлолома в Пятигорске и Минеральных Водах',
  seoDescription:
    'ИП «Неделько» — приём металлолома в Пятигорске и Минеральных Водах. Высокие цены, честное взвешивание, моментальная оплата.',
};

const NAV = [
  { id: 'prices', label: 'Цены' },
  { id: 'materials', label: 'Материалы' },
  { id: 'advantages', label: 'Преимущества' },
  { id: 'contacts', label: 'Контакты' },
];

const MATERIALS = [
  { name: 'Чёрный лом', desc: 'Арматура, трубы, балки, листы', icon: Anvil },
  { name: 'Медь', desc: 'Кабель, трубы, радиаторы', icon: CircleDollarSign },
  { name: 'Латунь', desc: 'Детали, фитинги, сантехника', icon: CircleDollarSign },
  { name: 'Алюминий', desc: 'Профиль, банки, рамы', icon: CircleDollarSign },
  { name: 'Нержавейка', desc: 'Трубы, листы, пищевая сталь', icon: ShieldCheck },
  { name: 'Кабель', desc: 'Силовой, медный, алюминиевый', icon: Cable },
  { name: 'Аккумуляторы', desc: 'Авто, промышленные, АКБ', icon: Battery },
];

const ADVANTAGES = [
  { icon: TrendingUp, title: 'Высокие цены', text: 'Лучшие цены в регионе. Ежедневно отслеживаем рынок.' },
  { icon: Scale, title: 'Честное взвешивание', text: 'Поверенные весы. Прозрачный процесс без обмана.' },
  { icon: Wallet, title: 'Моментальная оплата', text: 'Деньги сразу на карту без задержек.' },
];

const PRICE_ICONS = [
  CircleDollarSign, CircleDollarSign, CircleDollarSign, CircleDollarSign, CircleDollarSign,
  CircleDollarSign, CircleDollarSign, CircleDollarSign, CircleDollarSign, CircleDollarSign,
  CircleDollarSign, CircleDollarSign, CircleDollarSign, CircleDollarSign, CircleDollarSign,
  CircleDollarSign, Battery, Battery, Anvil,
];

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  return phone;
}

function Header({ contacts }: { contacts: ContactsData }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 shrink-0 group">
          <div className="relative">
            <Recycle className="w-9 h-9 text-accent-500 group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg sm:text-xl font-bold tracking-wide text-white">
              {contacts.orgName}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400 tracking-wider uppercase">
              Пятигорск • Минеральные Воды
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                active === item.id
                  ? 'text-accent-500 bg-accent-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Call button + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${contacts.phone1}`}
            className="hidden sm:inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent-500/40"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">Позвонить</span>
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Меню"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 pt-4 pb-6 flex flex-col gap-1 bg-black/95 backdrop-blur-md border-t border-white/10 mt-3">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                active === item.id
                  ? 'text-accent-500 bg-accent-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={`tel:${contacts.phone1}`}
            className="mt-2 inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-3 rounded-xl transition"
          >
            <Phone className="w-4 h-4" />
            Позвонить
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ contacts }: { contacts: ContactsData }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Экскаватор с грейфером на фоне металлолома"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-accent-500/15 border border-accent-500/30 text-accent-400 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <HardHat className="w-4 h-4" />
            Приём металлолома в КМВ
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 animate-fade-up">
            {contacts.orgName} — <span className="text-gradient-accent">Приём металлолома</span> в Пятигорске и Минеральных Водах
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Принимаем чёрный и цветной металл по лучшим ценам в регионе. Честное взвешивание, моментальная оплата.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {[
              { icon: TrendingUp, text: 'Высокие цены' },
              { icon: Scale, text: 'Честное взвешивание' },
              { icon: Wallet, text: 'Моментальная оплата' },
            ].map((f) => (
              <div
                key={f.text}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-xl"
              >
                <f.icon className="w-5 h-5 text-accent-500" />
                <span className="text-sm font-medium text-gray-200">{f.text}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <a
              href={`tel:${contacts.phone1}`}
              className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-accent-500/40"
            >
              <Phone className="w-5 h-5" />
              Позвонить
            </a>
            <a
              href="#prices"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-accent-500 hover:text-accent-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-105"
            >
              Актуальные цены
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-accent-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function PricesAndMaterials({ prices }: { prices: PriceItem[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <section id="prices" className="relative py-20 sm:py-28 bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Prices */}
          <div id="prices-block" className="reveal">
            <div className="inline-flex items-center gap-2 text-accent-500 text-sm font-semibold uppercase tracking-wider mb-3">
              <TrendingUp className="w-4 h-4" />
              Прайс-лист
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              Актуальные <span className="text-gradient-accent">цены</span>
            </h2>

            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
              {prices.map((item, i) => {
                const Icon = PRICE_ICONS[i % PRICE_ICONS.length];
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isOpen = expanded === i;
                return (
                  <div
                    key={item.name}
                    className={`transition-colors ${i !== prices.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <div
                      className={`flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 transition-colors ${
                        hasSubItems ? 'cursor-pointer hover:bg-accent-500/5' : 'hover:bg-accent-500/5'
                      }`}
                      onClick={() => hasSubItems && toggle(i)}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent-500/15 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-500" />
                        </div>
                        <span className="font-medium text-base sm:text-lg text-gray-100">{item.name}</span>
                        {hasSubItems && (
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-display text-2xl sm:text-3xl font-bold text-accent-500">{item.price}</span>
                        <span className="text-sm text-gray-400 ml-1">{item.unit}</span>
                      </div>
                    </div>

                    {/* Sub-items */}
                    {hasSubItems && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="pl-12 sm:pl-16 pr-5 sm:pr-6 pb-3 pt-1 space-y-1">
                          {item.subItems!.map((sub, j) => (
                            <div
                              key={j}
                              className="flex items-center justify-between py-2 px-3 rounded-lg bg-black/30 border border-white/5"
                            >
                              <span className="text-sm text-gray-300">{sub.name}</span>
                              <span className="font-display text-base font-bold text-accent-400">
                                {sub.price}
                                <span className="text-xs text-gray-500 ml-1">₽/кг</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-sm text-gray-500 flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 shrink-0 text-accent-500/70" />
              Цены обновляются ежедневно. Итоговая стоимость зависит от чистоты и объёма металла. Позвоните для уточнения.
            </p>
          </div>

          {/* Materials */}
          <div id="materials" className="reveal" style={{ transitionDelay: '0.15s' }}>
            <div className="inline-flex items-center gap-2 text-accent-500 text-sm font-semibold uppercase tracking-wider mb-3">
              <Recycle className="w-4 h-4" />
              Что принимаем
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              Принимаемые <span className="text-gradient-accent">материалы</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {MATERIALS.map((m) => (
                <div
                  key={m.name}
                  className="group bg-white/[0.04] border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:bg-accent-500/10 hover:border-accent-500/40 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-500/15 group-hover:bg-accent-500 group-hover:rotate-6 flex items-center justify-center mb-4 transition-all duration-300">
                    <m.icon className="w-6 h-6 text-accent-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-white">{m.name}</h3>
                  <p className="text-sm text-gray-400">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Advantages() {
  return (
    <section id="advantages" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-accent-900/5 to-black" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 text-accent-500 text-sm font-semibold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4" />
            Почему мы
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            Наши <span className="text-gradient-accent">преимущества</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ADVANTAGES.map((a, i) => (
            <div
              key={a.title}
              className="reveal group relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:bg-white/[0.07] hover:border-accent-500/30 hover:-translate-y-1.5"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/5 rounded-full blur-2xl group-hover:bg-accent-500/15 transition-colors" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-accent-500/15 group-hover:bg-accent-500 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110">
                  <a.icon className="w-7 h-7 text-accent-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2 text-white">{a.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniMap({ label, query }: { label: string; query: string }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 h-44 sm:h-48 bg-gray-900">
      <iframe
        title={`Карта: ${label}`}
        src={src}
        className="w-full h-full grayscale-[40%] contrast-110"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

function Contacts({ contacts }: { contacts: ContactsData }) {
  const addresses = [
    {
      city: 'Пятигорск',
      addr: contacts.addrPyatigorsk,
      mapQuery: `Пятигорск, ${contacts.addrPyatigorsk}`,
      mapLabel: `Пятигорск, ${contacts.addrPyatigorsk}`,
    },
    {
      city: 'Минеральные Воды',
      addr: contacts.addrMinvody,
      mapQuery: `Минеральные Воды, ${contacts.addrMinvody}`,
      mapLabel: `Минеральные Воды, ${contacts.addrMinvody}`,
    },
  ];

  return (
    <section id="contacts" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 text-accent-500 text-sm font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4" />
            Контакты
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            Где нас <span className="text-gradient-accent">найти</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Addresses */}
          <div className="lg:col-span-2 reveal">
            <div className="grid sm:grid-cols-2 gap-6">
              {addresses.map((a) => (
                <div
                  key={a.city}
                  className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-accent-500/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-accent-500" />
                    <h3 className="font-display text-xl font-bold text-white">{a.city}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{a.addr}</p>
                  <MiniMap label={a.mapLabel} query={a.mapQuery} />
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition hover:scale-105"
                    >
                      <MapPin className="w-4 h-4" />
                      Построить маршрут
                    </a>
                    <a
                      href={`tel:${contacts.phone1}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 border border-white/20 hover:border-accent-500 hover:text-accent-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
                    >
                      <Phone className="w-4 h-4" />
                      Позвонить
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: hours + contacts */}
          <div className="flex flex-col gap-6 reveal" style={{ transitionDelay: '0.15s' }}>
            {/* Hours */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-accent-500" />
                <h3 className="font-display text-xl font-bold text-white">Режим работы</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { day: 'Пн – Пт', time: '08:00 – 17:00' },
                  { day: 'Сб', time: '08:00 – 14:00' },
                  { day: 'Вс', time: 'Выходной', off: true },
                ].map((d) => (
                  <li key={d.day} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{d.day}</span>
                    <span className={`font-medium ${d.off ? 'text-gray-500' : 'text-white'}`}>{d.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-accent-500" />
                <h3 className="font-display text-xl font-bold text-white">Контакты</h3>
              </div>
              <a href={`tel:${contacts.phone1}`} className="block font-display text-2xl font-bold text-white hover:text-accent-500 transition mb-2">
                {formatPhone(contacts.phone1)}
              </a>
              <a href={`tel:${contacts.phone2}`} className="block font-display text-2xl font-bold text-white hover:text-accent-500 transition mb-3">
                {formatPhone(contacts.phone2)}
              </a>
              <a href={`mailto:${contacts.email}`} className="flex items-center gap-2 text-gray-300 hover:text-accent-500 transition mb-4">
                <Mail className="w-4 h-4 text-accent-500" />
                {contacts.email}
              </a>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${contacts.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white text-sm font-semibold px-3 py-3 rounded-xl transition hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <a
                  href={`https://t.me/${contacts.telegram.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#229ED9]/15 hover:bg-[#229ED9] text-[#229ED9] hover:text-white text-sm font-semibold px-3 py-3 rounded-xl transition hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Telegram</span>
                </a>
                <a
                  href={`https://max.ru/${contacts.max.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500 hover:to-amber-500 text-orange-400 hover:text-white text-sm font-semibold px-3 py-3 rounded-xl transition hover:scale-105"
                >
                  <Maximize2 className="w-5 h-5" />
                  <span className="hidden sm:inline">MAX</span>
                </a>
                <a
                  href={`tel:${contacts.phone1}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent-500/15 hover:bg-accent-500 text-accent-500 hover:text-white text-sm font-semibold px-3 py-3 rounded-xl transition hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  <span className="hidden sm:inline">Звонок</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA({ contacts }: { contacts: ContactsData }) {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-600 via-accent-500 to-accent-600" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Готовы сдать металлолом?
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Позвоните прямо сейчас и узнайте цену вашего металла за 2 минуты.
        </p>
        <a
          href={`tel:${contacts.phone1}`}
          className="inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white font-semibold px-10 py-5 rounded-xl text-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl"
        >
          <Phone className="w-6 h-6 text-accent-500" />
          {formatPhone(contacts.phone1)}
        </a>
      </div>
    </section>
  );
}

function Footer({ contacts }: { contacts: ContactsData }) {
  return (
    <footer className="bg-black border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Recycle className="w-7 h-7 text-accent-500" />
            <div>
              <div className="font-display font-bold text-white">© 2024 {contacts.orgName}</div>
              <div className="text-xs text-gray-500">Приём металлолома</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-accent-500 font-medium">
            <ShieldCheck className="w-5 h-5" />
            <span>Работаем честно и прозрачно!</span>
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${contacts.phone1}`} className="text-gray-400 hover:text-accent-500 transition" aria-label="Позвонить">
              <Phone className="w-5 h-5" />
            </a>
            <a href={`mailto:${contacts.email}`} className="text-gray-400 hover:text-accent-500 transition" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
            <a href={`https://wa.me/${contacts.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#25D366] transition" aria-label="WhatsApp">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href={`https://t.me/${contacts.telegram.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#229ED9] transition" aria-label="Telegram">
              <Send className="w-5 h-5" />
            </a>
            <a href={`https://max.ru/${contacts.max.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition" aria-label="MAX">
              <Maximize2 className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  useReveal();
  const [prices] = useLocalStorage<PriceItem[]>('admin_prices', DEFAULT_PRICES);
  const [contacts] = useLocalStorage<ContactsData>('admin_contacts', DEFAULT_CONTACTS);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header contacts={contacts} />
      <main>
        <Hero contacts={contacts} />
        <PricesAndMaterials prices={prices} />
        <Advantages />
        <Contacts contacts={contacts} />
        <CTA contacts={contacts} />
      </main>
      <Footer contacts={contacts} />
    </div>
  );
}
