import { useState } from 'react';
import { DollarSign, Save, Pencil, X, Plus, Trash2, Check, ChevronDown } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_PRICES, type PriceItem, type PriceSubItem } from './Home';

export default function AdminPrices() {
  const [prices, setPrices] = useLocalStorage<PriceItem[]>('admin_prices', DEFAULT_PRICES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editName, setEditName] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [savedFlash, setSavedFlash] = useState<number | null>(null);
  const [expandedSubs, setExpandedSubs] = useState<Set<number>>(new Set());

  const toggleSubs = (index: number) => {
    setExpandedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const startEdit = (index: number) => {
    setEditingId(index);
    setEditName(prices[index].name);
    setEditValue(prices[index].price);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setEditName('');
  };

  const saveEdit = (index: number) => {
    const updated = [...prices];
    updated[index] = { ...updated[index], name: editName, price: editValue };
    setPrices(updated);
    setEditingId(null);
    setSavedFlash(index);
    setTimeout(() => setSavedFlash(null), 1500);
  };

  const deletePrice = (index: number) => {
    const updated = prices.filter((_, i) => i !== index);
    setPrices(updated);
  };

  const addPrice = () => {
    if (!newName.trim() || !newPrice.trim()) return;
    setPrices([...prices, { name: newName.trim(), price: newPrice.trim(), unit: '₽/кг' }]);
    setNewName('');
    setNewPrice('');
    setAdding(false);
  };

  // Sub-item operations
  const addSubItem = (index: number, name: string, price: string) => {
    if (!name.trim() || !price.trim()) return;
    const updated = [...prices];
    if (!updated[index].subItems) updated[index].subItems = [];
    updated[index].subItems!.push({ name: name.trim(), price: price.trim() });
    setPrices(updated);
  };

  const deleteSubItem = (index: number, subIndex: number) => {
    const updated = [...prices];
    updated[index].subItems = updated[index].subItems?.filter((_, j) => j !== subIndex);
    setPrices(updated);
  };

  const editSubItem = (index: number, subIndex: number, field: keyof PriceSubItem, value: string) => {
    const updated = [...prices];
    if (updated[index].subItems) {
      updated[index].subItems[subIndex] = { ...updated[index].subItems[subIndex], [field]: value };
      setPrices(updated);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-accent-500 text-sm font-semibold uppercase tracking-wider mb-2">
            <DollarSign className="w-4 h-4" />
            Управление ценами
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Цены на металлы</h1>
          <p className="text-gray-400 mt-2">Редактируйте цены и подпункты — они автоматически появятся на сайте.</p>
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

      {/* Add form */}
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
                onClick={addPrice}
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

      {/* Prices table */}
      <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
        {/* Header row - desktop */}
        <div className="hidden sm:grid grid-cols-12 px-6 py-4 border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 font-semibold">
          <div className="col-span-6">Название металла</div>
          <div className="col-span-3">Цена</div>
          <div className="col-span-3 text-right">Действия</div>
        </div>

        {prices.map((item, i) => (
          <div
            key={i}
            className={`transition-colors ${i !== prices.length - 1 ? 'border-b border-white/5' : ''} ${
              savedFlash === i ? 'bg-accent-500/10' : ''
            }`}
          >
            {/* Main row */}
            {editingId === i ? (
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
                      onClick={() => saveEdit(i)}
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
                      onClick={() => toggleSubs(i)}
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
                        className={`w-4 h-4 transition-transform duration-300 ${expandedSubs.has(i) ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="font-display text-xl font-bold text-accent-500">{item.price}</span>
                    <span className="text-sm text-gray-400 ml-1">{item.unit}</span>
                  </div>
                  <div className="sm:col-span-3 flex gap-2 sm:justify-end">
                    <button
                      onClick={() => startEdit(i)}
                      className="inline-flex items-center gap-1.5 border border-white/20 hover:border-accent-500 hover:text-accent-500 text-gray-300 text-sm font-medium px-4 py-2.5 rounded-xl transition"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="hidden sm:inline">Редактировать</span>
                    </button>
                    <button
                      onClick={() => deletePrice(i)}
                      className="inline-flex items-center justify-center border border-red-500/30 hover:bg-red-500/20 text-red-400 px-3 py-2.5 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-items panel */}
                {expandedSubs.has(i) && (
                  <SubItemsEditor
                    item={item}
                    onAdd={(name, price) => addSubItem(i, name, price)}
                    onDelete={(subIndex) => deleteSubItem(i, subIndex)}
                    onEdit={(subIndex, field, value) => editSubItem(i, subIndex, field, value)}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {prices.length === 0 && (
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
  item: PriceItem;
  onAdd: (name: string, price: string) => void;
  onDelete: (subIndex: number) => void;
  onEdit: (subIndex: number, field: keyof PriceSubItem, value: string) => void;
}) {
  const [newSubName, setNewSubName] = useState('');
  const [newSubPrice, setNewSubPrice] = useState('');

  return (
    <div className="mt-4 ml-2 sm:ml-12 pl-4 border-l-2 border-accent-500/30 space-y-2">
      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Подпункты</div>

      {item.subItems && item.subItems.length > 0 ? (
        item.subItems.map((sub, j) => (
          <div key={j} className="flex items-center gap-2">
            <input
              type="text"
              value={sub.name}
              onChange={(e) => onEdit(j, 'name', e.target.value)}
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none transition"
            />
            <input
              type="text"
              value={sub.price}
              onChange={(e) => onEdit(j, 'price', e.target.value)}
              className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none transition"
            />
            <button
              onClick={() => onDelete(j)}
              className="inline-flex items-center justify-center border border-red-500/30 hover:bg-red-500/20 text-red-400 px-2 py-2 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Пока нет подпунктов.</p>
      )}

      {/* Add sub-item */}
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
