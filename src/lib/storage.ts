import { MotoPart, CreatePartData, UpdatePartData } from '@/types';

const STORAGE_KEY = 'moto-parts-inventory';

export class PartsStorage {
  static getParts(): MotoPart[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading parts from storage:', error);
      return [];
    }
  }

  static savePart(partData: CreatePartData): MotoPart {
    if (typeof window === 'undefined') {
      throw new Error('LocalStorage is not available on the server');
    }

    const parts = this.getParts();
    const newPart: MotoPart = {
      ...partData,
      id: this.generateId(),
    };

    parts.push(newPart);
    this.saveParts(parts);
    return newPart;
  }

  static updatePart(partData: UpdatePartData): MotoPart | null {
    if (typeof window === 'undefined') {
      throw new Error('LocalStorage is not available on the server');
    }

    const parts = this.getParts();
    const index = parts.findIndex(part => part.id === partData.id);
    
    if (index === -1) return null;

    const updatedPart = { ...parts[index], ...partData };
    parts[index] = updatedPart;
    this.saveParts(parts);
    return updatedPart;
  }

  static deletePart(id: string): boolean {
    if (typeof window === 'undefined') {
      throw new Error('LocalStorage is not available on the server');
    }

    const parts = this.getParts();
    const filteredParts = parts.filter(part => part.id !== id);
    
    if (filteredParts.length === parts.length) return false;

    this.saveParts(filteredParts);
    return true;
  }

  static getPartById(id: string): MotoPart | null {
    const parts = this.getParts();
    return parts.find(part => part.id === id) || null;
  }

  private static saveParts(parts: MotoPart[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
    } catch (error) {
      console.error('Error saving parts to storage:', error);
    }
  }

  private static generateId(): string {
    return `part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static searchParts(query: string): MotoPart[] {
    const parts = this.getParts();
    const lowercaseQuery = query.toLowerCase();
    
    return parts.filter(part => 
      part.name.toLowerCase().includes(lowercaseQuery) ||
      part.sku.toLowerCase().includes(lowercaseQuery) ||
      part.motorcycleBrand.toLowerCase().includes(lowercaseQuery) ||
      part.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  static getPartsByCategory(category: string): MotoPart[] {
    const parts = this.getParts();
    return parts.filter(part => part.category === category);
  }

  static getPartsByBrand(brand: string): MotoPart[] {
    const parts = this.getParts();
    return parts.filter(part => part.motorcycleBrand === brand);
  }
}
