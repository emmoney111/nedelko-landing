import { useState } from 'react';
import { DollarSign, Save, Pencil, X, Plus, Trash2, Check, ChevronDown, AlertCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { usePrices, createPrice, updatePrice, deletePrice, createSubItem, updateSubItem, deleteSubItem } from '../lib/prices';
import type { PriceWithSubs, PriceSubItemRow } from '../lib/types';

export default function AdminPrices() {
  const { status, data: prices, error, refetch } = usePrices();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editName, setEditName] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [savedFlash, setSavedFlash] = useState<string | null>(null);
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);

  const flash = (id: string) => {
    setSavedFlash(id);
    setTimeout(() => setSavedFlash(null), 1500);
  };

  const toggleSubs = (id: string) => {
    setExpandedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEdit = (item: PriceWithSubs) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditValue(item.price);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setEditName('');
  };

  const saveEdit = async (id: string) => {
    try {
      setActionError(null);
      await updatePrice(id, { name: editName, price: editValue });
      await refetch();
      setEditingId(null);
      flash(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ошибка сохранения');
    }
  };

  const handleDeletePrice = async (id: string) => {
    try {
      setActionError(null);
      await deletePrice(id);
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const handleAddPrice = async () => {
    if (!newName.trim() || !newPrice.trim()) return;
    try {
      setActionError(null);
      const sortOrder = prices ? prices.length : 0;
      await createPrice(newName.trim(), newPrice.trim(), '₽/кг', sortOrder);
      await refetch();
      setNewName('');
      setNewPrice('');
      setAdding(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ошибка добавления');
    }
  };

  const handleAddSubItem = async (priceId: string, name: string, price: string) => {
    if (!name.trim() || !price.trim()) return;
    try {
      setActionError(null);
      const parent = prices?.find((p) => p.id === priceId);
      const sortOrder = parent?.subItems?.length ?? 0;
      await createSubItem(priceId, name.trim(), price.trim(), sortOrder);
      await refetch();
      setExpandedSubs((prev) => new Set(prev).add(priceId));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ошибка добавления подпункта');
    }
  };

  const handleDeleteSubItem = async (id: string) => {
    try {
      setActionError(null);
      await deleteSubItem(id);
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ошибка удаления подпункта');
    }
  };

  const handleEditSubItem = async (id: string, field: keyof PriceSubItemRow, value: string) => {
    try {
      setActionError(null);
      await updateSubItem(id, { [field]: value });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ошибка редактирования');
    }
  };

  const loading = status === 'loading';

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-accent-500 text-sm font-semibold uppercase tracking-wider mb-2">
            <DollarSign className="w-4 h-4" />
            Управление ценами
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Цены на металлы</h1>
          <p className="text-gray-400 mt-2">Цены хранятся в базе данных и видны всем посетителям сайта.</p>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-3 rounded-xl transition hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        )}
      </div>

      {actionError && (
        <div className="mb-6 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {actionError}
        </div>
      )}

      {adding && (
        <div className="mb-6 bg-white/[0.04] border border-accent-500/30 rounded-2xl p-5">
          <h3 className="font-display text-lg font-bold text-white mb-4">Новая цена</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Название металла"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-accent-500 focus:outline-none transition"
            />
            <input
              type="text"
              placeholder="Цена"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-accent-500 focus:outline-none transition"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddPrice}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-4 py-3 rounded-xl transition"
              >
                <Check className="w-5 h-5" />
                Добавить
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setNewName('');
                  setNewPrice('');
                }}
                className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-gray-300 px-4 py-3 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 px-6 py-4 border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 font-semibold">
          <div className="col-span-6">Название металла</div>
          <div className="col-span-3">Цена</div>
          <div className="col-span-3 text-right">Действия</div>
        </div>

        {loading && (
          <div className="px-6 py-10 text-center text-gray-400">Загрузка…</div>
        )}

        {error && !loading && (
          <div className="px-6 py-10 text-center text-red-400">Ошибка загрузки: {error}</div>
        )}

        {!loading && !error && prices && prices.map((item) => (
          <div
            key={item.id}
            className={`transition-colors border-b border-white/5 last:border-b-0 ${
              savedFlash === item.id ? 'bg-accent-500/10' : ''
            }`}
          >
            {editingId === item.id ? (
              <div className="px-5 sm:px-6 py-4 sm:py-5">
                <div className="grid sm:grid-cols-12 gap-3 items-center">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="sm:col-span-6 bg-black/50 border border-accent-500/40 rounded-xl px-4 py-2.5 text-white focus:border-accent-500 focus:outline-none transition"
                  />
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="sm:col-span-3 bg-black/50 border border-accent-500/40 rounded-xl px-4 py-2.5 text-white focus:border-accent-500 focus:outline-none transition"
                  />
                  <div className="sm:col-span-3 flex gap-2 sm:justify-end">
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="inline-flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
                    >
                      <Save className="w-4 h-4" />
                      Сохранить
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-gray-300 px-3 py-2.5 rounded-xl transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-5 sm:px-6 py-4 sm:py-5 hover:bg-white/[0.02]">
                <div className="grid sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5 text-accent-500" />
                    </div>
                    <span className="font-medium text-base text-gray-100">{item.name}</span>
                    <button
                      onClick={() => toggleSubs(item.id)}
                      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-accent-500 transition ml-1"
                    >
                      {item.subItems && item.subItems.length > 0 ? (
                        <span className="bg-accent-500/10 px-2 py-0.5 rounded-full">{item.subItems.length} подп.</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 border border-white/10 px-2 py-0.5 rounded-full">
                          <Plus className="w-3 h-3" />
                          Подпункты
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${expandedSubs.has(item.id) ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="font-display text-xl font-bold text-accent-500">{item.price}</span>
                    <span className="text-sm text-gray-400 ml-1">{item.unit}</span>
                  </div>
                  <div className="sm:col-span-3 flex gap-2 sm:justify-end">
                    <button
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-1.5 border border-white/20 hover:border-accent-500 hover:text-accent-500 text-gray-300 text-sm font-medium px-4 py-2.5 rounded-xl transition"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="hidden sm:inline">Редактировать</span>
                    </button>
                    <button
                      onClick={() => handleDeletePrice(item.id)}
                      className="inline-flex items-center justify-center border border-red-500/30 hover:bg-red-500/20 text-red-400 px-3 py-2.5 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedSubs.has(item.id) && (
                  <SubItemsEditor
                    item={item}
                    onAdd={(name, price) => handleAddSubItem(item.id, name, price)}
                    onDelete={(subId) => handleDeleteSubItem(subId)}
                    onEdit={(subId, field, value) => handleEditSubItem(subId, field, value)}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && !error && prices && prices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Нет цен. Нажмите «Добавить», чтобы создать первую.
        </div>
      )}
    </AdminLayout>
  );
}

function SubItemsEditor({
  item,
  onAdd,
  onDelete,
  onEdit,
}: {
  item: PriceWithSubs;
  onAdd: (name: string, price: string) => void;
  onDelete: (subId: string) => void;
  onEdit: (subId: string, field: keyof PriceSubItemRow, value: string) => void;
}) {
  const [newSubName, setNewSubName] = useState('');
  const [newSubPrice, setNewSubPrice] = useState('');

  return (
    <div className="mt-4 ml-2 sm:ml-12 pl-4 border-l-2 border-accent-500/30 space-y-2">
      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Подпункты</div>

      {item.subItems && item.subItems.length > 0 ? (
        item.subItems.map((sub) => (
          <div key={sub.id} className="flex items-center gap-2">
            <input
              type="text"
              value={sub.name}
              onChange={(e) => onEdit(sub.id, 'name', e.target.value)}
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none transition"
            />
            <input
              type="text"
              value={sub.price}
              onChange={(e) => onEdit(sub.id, 'price', e.target.value)}
              className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none transition"
            />
            <button
              onClick={() => onDelete(sub.id)}
              className="inline-flex items-center justify-center border border-red-500/30 hover:bg-red-500/20 text-red-400 px-2 py-2 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Пока нет подпунктов.</p>
      )}

      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          placeholder="Название подпункта"
          value={newSubName}
          onChange={(e) => setNewSubName(e.target.value)}
          className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-accent-500 focus:outline-none transition"
        />
        <input
          type="text"
          placeholder="Цена"
          value={newSubPrice}
          onChange={(e) => setNewSubPrice(e.target.value)}
          className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-accent-500 focus:outline-none transition"
        />
        <button
          onClick={() => {
            onAdd(newSubName, newSubPrice);
            setNewSubName('');
            setNewSubPrice('');
          }}
          className="inline-flex items-center justify-center bg-accent-500/15 hover:bg-accent-500 text-accent-500 hover:text-white px-2 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
