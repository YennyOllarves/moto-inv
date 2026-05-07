'use client';

import { Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { MotoPart } from '@/types';

interface PartCardProps {
  part: MotoPart;
  onEdit: (part: MotoPart) => void;
  onDelete: (id: string) => void;
}

export default function PartCard({ part, onEdit, onDelete }: PartCardProps) {
  const isLowStock = part.stock < 5;
  const stockColor = isLowStock ? 'text-orange-500' : 'text-green-500';

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{part.name}</h3>
          <p className="text-gray-400 text-sm">SKU: {part.sku}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(part)}
            className="p-2 text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(part.id)}
            className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Marca:</span>
          <span className="text-white font-medium">{part.motorcycle_brand}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Categoría:</span>
          <span className="text-white font-medium">{part.category}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Stock:</span>
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${stockColor}`}>
              {part.stock}
            </span>
            {isLowStock && (
              <span title="Stock bajo">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Precio:</span>
          <span className="text-green-400 font-medium">
            ${part.price.toLocaleString('es-MX')}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Valor total:</span>
            <span className="text-green-400 font-semibold">
              ${(part.price * part.stock).toLocaleString('es-MX')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
