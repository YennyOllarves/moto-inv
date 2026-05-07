export interface MotoPart {
  id: string;
  name: string;
  sku: string;
  motorcycle_brand: string;
  category: string;
  stock: number;
  price: number;
}

export interface CreatePartData {
  name: string;
  sku: string;
  motorcycle_brand: string;
  category: string;
  stock: number;
  price: number;
}

export interface UpdatePartData extends Partial<CreatePartData> {
  id: string;
}

export type MotorcycleBrand = 'Honda' | 'Yamaha' | 'Suzuki' | 'Kawasaki' | 'Ducati' | 'BMW' | 'KTM' | 'Otro';

export type PartCategory = 'Motor' | 'Frenos' | 'Suspensión' | 'Transmisión' | 'Eléctrico' | 'Carrocería' | 'Neumáticos' | 'Aceites' | 'Otro';
