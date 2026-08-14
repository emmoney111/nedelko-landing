import { useEffect, useState } from 'react';
import {
  Phone,
  Save,
  Check,
  Building2,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Maximize2,
  Mail,
  AlertCircle,
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { DEFAULT_CONTACTS, type ContactsData } from './Home';
import { updateContacts, useContacts } from '../lib/contacts';

const FIELDS: {
  key: keyof ContactsData;
  label: string;
  icon: typeof Phone;
  placeholder: string;
}[] = [
  {
    key: 'orgName',
    label: 'Название организации',
    icon: Building2,
    placeholder: 'ИП «Неделько»',
  },
  {
    key: 'addrPyatigorsk',
    label: 'Адрес — Пятигорск',
    icon: MapPin,
    placeholder: 'г. Пятигорск, пос. Горячеводский, ул. Ленина 116А',
  },
  {
    key: 'addrMinvody',
    label: 'Адрес — Минеральные Воды',
    icon: MapPin,
    placeholder: 'г. Минеральные Воды, ул. Московская 23',
  },
  {
    key: 'phone1',
    label: 'Телефон 1',
    icon: Phone,
    placeholder: '+7 962 025-55-56',
  },
  {
    key: 'phone2',
    label: 'Телефон 2',
    icon: Phone,
    placeholder: '+7 988 741-93-59',
  },
  {
    key: 'email',
    label: 'Email',
    icon: Mail,
    placeholder: 'KMV-LOM@mail.ru',
  },
  {
    key: 'hours',
    label: 'Режим работы',
    icon: Clock,
    placeholder: 'Пн–Пт 08:00–17:00, Сб 08:00–14:00, Вс — выходной',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    placeholder: '+7 961 484-34-63',
  },
  {
    key: 'telegram',
    label: 'Telegram',
    icon: Send,
    placeholder: '+7 962 025-55-56',
  },
  {
    key: 'max',
    label: 'MAX',
    icon: Maximize2,
    placeholder: '+7 962 025-55-56',
  },
];

const { data: contacts, loading: contactsLoading, error: contactsError } = useContacts();

const [form, setForm] = useState<ContactsData>(DEFAULT_CONTACTS);
const [saved, setSaved] = useState(false);
const [saving, setSaving] = useState(false);
const [error, setError] = useState('');

useEffect(() => {
  if (contacts) {
    setForm(contacts);
  }
}, [contacts]);

useEffect(() => {
  if (contactsError) {
    setError(contactsError);
  }
}, [contactsError]);

  const handleChange = (key: keyof ContactsData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');

    try {
      await updateContacts(form);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error('Ошибка сохранения контактов:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось сохранить контакты.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-accent-500 text-sm font-semibold uppercase tracking-wider mb-2">
            <Phone className="w-4 h-4" />
            Управление контактами
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Контакты
          </h1>

          <p className="text-gray-400 mt-2">
            Изменения сохраняются в базе данных и будут видны всем посетителям.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-accent-500 hover:bg-accent-600 text-white'
          }`}
        >
          {saved ? (
            <Check className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}

          {saving
            ? 'Сохранение...'
            : saved
              ? 'Сохранено!'
              : 'Сохранить'}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

          <div>
            <div className="font-semibold mb-1">
              Ошибка сохранения
            </div>

            <div>{error}</div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {FIELDS.map((field) => (
          <div
            key={field.key}
            className="bg-white/[0.04] border border-white/10 rounded-2xl p-5"
          >
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
              <field.icon className="w-4 h-4 text-accent-500" />
              {field.label}
            </label>

            <input
              type="text"
              value={form[field.key]}
              placeholder={field.placeholder}
              onChange={(e) =>
                handleChange(field.key, e.target.value)
              }
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-accent-500 focus:outline-none transition"
            />
          </div>
        ))}
      </div>
    </AdminLayout>
  );

