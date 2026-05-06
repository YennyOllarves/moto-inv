'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { MotoPart, CreatePartData, UpdatePartData } from '@/types';

interface PartModalProps {
  part: MotoPart | null;
  onClose: () => void;
  onSave: (data: CreatePartData | UpdatePartData) => Promise<void>;
}

const motorcycleBrands = ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Ducati', 'BMW', 'KTM', 'Otro'] as const;
const categories = ['Motor', 'Frenos', 'Suspensión', 'Transmisión', 'Eléctrico', 'Carrocería', 'Neumáticos', 'Aceites', 'Otro'] as const;

export default function PartModal({ part, onClose, onSave }: PartModalProps) {
  const [formData, setFormData] = useState<CreatePartData>({
    name: '',
    sku: '',
    motorcycleBrand: '',
    category: '',
    stock: 0,
    price: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (part) {
      setFormData({
        name: part.name,
        sku: part.sku,
        motorcycleBrand: part.motorcycleBrand,
        category: part.category,
        stock: part.stock,
        price: part.price,
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        motorcycleBrand: '',
        category: '',
        stock: 0,
        price: 0,
      });
    }
    setErrors({});
  }, [part]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }

    if (!formData.motorcycleBrand) {
      newErrors.motorcycleBrand = 'La marca de moto es requerida';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (formData.price < 0) {
      newErrors.price = 'El precio no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (part) {
      await onSave({ ...formData, id: part.id });
    } else {
      await onSave(formData);
    }
  };

  const handleChange = (field: keyof CreatePartData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {part ? 'Editar Repuesto' : 'Nuevo Repuesto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre del Repuesto
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ej: Filtro de aceite"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              SKU
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.sku ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ej: HON-001"
            />
            {errors.sku && (
              <p className="text-red-400 text-sm mt-1">{errors.sku}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Marca de Moto
            </label>
            <select
              value={formData.motorcycleBrand}
              onChange={(e) => handleChange('motorcycleBrand', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.motorcycleBrand ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Seleccionar marca</option>
              {motorcycleBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            {errors.motorcycleBrand && (
              <p className="text-red-400 text-sm mt-1">{errors.motorcycleBrand}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.category ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Stock
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.stock ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="0"
              min="0"
            />
            {errors.stock && (
              <p className="text-red-400 text-sm mt-1">{errors.stock}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Precio ($)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.price ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            {errors.price && (
              <p className="text-red-400 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
