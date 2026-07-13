import { useState, useEffect } from 'react';
import { Settings, Save, Check, Globe, Type, Search } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_SETTINGS, type SettingsData } from './Home';

const FIELDS: { key: keyof SettingsData; label: string; icon: typeof Settings; placeholder: string; multiline?: boolean }[] = [
  { key: 'siteName', label: 'Название сайта', icon: Type, placeholder: 'ИП «Неделько»' },
  { key: 'subtitle', label: 'Подзаголовок', icon: Globe, placeholder: 'Приём металлолома в Пятигорске и Минеральных Водах' },
  { key: 'seoTitle', label: 'SEO Title', icon: Search, placeholder: 'ИП «Неделько» — Приём металлолома...' },
  { key: 'seoDescription', label: 'SEO Description', icon: Search, placeholder: 'Описание для поисковых систем...', multiline: true },
];

export default function AdminSettings() {
  const [stored, setStored] = useLocalStorage<SettingsData>('admin_settings', DEFAULT_SETTINGS);
  const [form, setForm] = useState<SettingsData>(stored);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(stored);
  }, [stored]);

  const handleChange = (key: keyof SettingsData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setStored(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-accent-500 text-sm font-semibold uppercase tracking-wider mb-2">
            <Settings className="w-4 h-4" />
            Настройки сайта
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Настройки</h1>
          <p className="text-gray-400 mt-2">Название, подзаголовок и SEO-данные сайта.</p>
        </div>
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition hover:scale-105 ${
            saved ? 'bg-green-500 text-white' : 'bg-accent-500 hover:bg-accent-600 text-white'
          }`}
        >
          {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? 'Сохранено!' : 'Сохранить'}
        </button>
      </div>

      <div className="space-y-5 max-w-3xl">
        {FIELDS.map((field) => (
          <div key={field.key} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
              <field.icon className="w-4 h-4 text-accent-500" />
              {field.label}
            </label>
            {field.multiline ? (
              <textarea
                value={form[field.key]}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-accent-500 focus:outline-none transition resize-none"
              />
            ) : (
              <input
                type="text"
                value={form[field.key]}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-accent-500 focus:outline-none transition"
              />
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
