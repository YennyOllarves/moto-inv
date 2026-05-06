'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Wrench, Package, DollarSign, AlertTriangle } from 'lucide-react';
import { MotoPart, CreatePartData, UpdatePartData } from '@/types';
import { PartsDatabase } from '@/lib/database';
import PartModal from '@/components/PartModal';
import PartCard from '@/components/PartCard';

export default function Home() {
  const [parts, setParts] = useState<MotoPart[]>([]);
  const [filteredParts, setFilteredParts] = useState<MotoPart[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<MotoPart | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadParts();
  }, []);

  useEffect(() => {
    filterParts();
  }, [parts, searchTerm, selectedCategory]);

  const loadParts = async () => {
    try {
      const loadedParts = await PartsDatabase.getParts();
      setParts(loadedParts);
    } catch (error) {
      console.error('Error loading parts:', error);
    }
  };

  const filterParts = async () => {
    let filtered: MotoPart[] = [];

    if (searchTerm) {
      filtered = await PartsDatabase.searchParts(searchTerm);
    } else {
      filtered = parts;
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(part => part.category === selectedCategory);
    }

    setFilteredParts(filtered);
  };

  const handleCreatePart = async (partData: CreatePartData) => {
    try {
      await PartsDatabase.savePart(partData);
      loadParts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating part:', error);
    }
  };

  const handleUpdatePart = async (partData: UpdatePartData) => {
    try {
      await PartsDatabase.updatePart(partData);
      loadParts();
      setEditingPart(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating part:', error);
    }
  };

  const handleSave = async (data: CreatePartData | UpdatePartData) => {
    if (editingPart) {
      await handleUpdatePart(data as UpdatePartData);
    } else {
      await handleCreatePart(data as CreatePartData);
    }
  };

  const handleDeletePart = async (id: string) => {
    try {
      await PartsDatabase.deletePart(id);
      loadParts();
    } catch (error) {
      console.error('Error deleting part:', error);
    }
  };

  const openEditModal = (part: MotoPart) => {
    setEditingPart(part);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingPart(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPart(null);
  };

  const stats = {
    total: parts.length,
    lowStock: parts.filter(part => part.stock < 5).length,
    totalValue: parts.reduce((sum, part) => sum + (part.price * part.stock), 0),
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Wrench className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-white">Taller Motos - Inventario</h1>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo Repuesto</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Repuestos</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Stock Bajo</p>
                <p className="text-3xl font-bold text-orange-500">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Valor Total</p>
                <p className="text-3xl font-bold text-green-500">
                  ${stats.totalValue.toLocaleString('es-MX')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU, marca o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Todas las categorías</option>
            <option value="Motor">Motor</option>
            <option value="Frenos">Frenos</option>
            <option value="Suspensión">Suspensión</option>
            <option value="Transmisión">Transmisión</option>
            <option value="Eléctrico">Eléctrico</option>
            <option value="Carrocería">Carrocería</option>
            <option value="Neumáticos">Neumáticos</option>
            <option value="Aceites">Aceites</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      {/* Parts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-8">
        {filteredParts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No se encontraron repuestos con los filtros seleccionados' 
                : 'No hay repuestos registrados'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button
                onClick={openCreateModal}
                className="mt-4 text-orange-500 hover:text-orange-400 underline"
              >
                Agregar primer repuesto
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                onEdit={openEditModal}
                onDelete={handleDeletePart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PartModal
          part={editingPart}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
