import { useState, useRef, ChangeEvent } from 'react';
import { Image, Upload, Trash2, Plus, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MAX_IMAGES = 20;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function AdminGallery() {
  const [images, setImages] = useLocalStorage<string[]>('admin_gallery', []);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    setError('');
    if (!files || files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      setError(`Максимум ${MAX_IMAGES} изображений. Удалите лишние.`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Можно загружать только изображения.');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`Файл «${file.name}» слишком большой (макс. 2 МБ).`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImages((prev) => [...prev, result]);
      };
      reader.onerror = () => setError('Ошибка чтения файла.');
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const deleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-accent-500 text-sm font-semibold uppercase tracking-wider mb-2">
          <Image className="w-4 h-4" />
          Управление галереей
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Галерея</h1>
        <p className="text-gray-400 mt-2">Добавляйте и удаляйте фотографии. Они хранятся в браузере.</p>
      </div>

      {error && (
        <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="mb-8 cursor-pointer border-2 border-dashed border-white/15 hover:border-accent-500/50 rounded-2xl p-10 text-center transition group bg-white/[0.02]"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
        />
        <div className="w-16 h-16 rounded-2xl bg-accent-500/15 group-hover:bg-accent-500 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110">
          <Upload className="w-8 h-8 text-accent-500 group-hover:text-white transition-colors" />
        </div>
        <p className="text-white font-medium mb-1">Перетащите фото сюда или нажмите для выбора</p>
        <p className="text-sm text-gray-500">JPG, PNG, WebP — до 2 МБ каждое</p>
      </div>

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Пока нет фотографий. Добавьте первую.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-900"
            >
              <img src={img} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setPreview(img)}
                  className="inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-white p-2.5 rounded-xl transition"
                  title="Просмотр"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteImage(i)}
                  className="inline-flex items-center justify-center bg-red-500/80 hover:bg-red-500 text-white p-2.5 rounded-xl transition"
                  title="Удалить"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <button className="absolute top-4 right-4 text-white p-2 rounded-lg hover:bg-white/10 transition">
            <X className="w-8 h-8" />
          </button>
          <img
            src={preview}
            alt="Просмотр"
            className="max-w-full max-h-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </AdminLayout>
  );
}
