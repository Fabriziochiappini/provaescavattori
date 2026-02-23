
export type MachineCategory = 'Mini' | 'Medio' | 'Pesante' | 'Specialistico';

export interface Machine {
  id: string;
  name: string;
  model: string;
  brand: string;
  year: number;
  hours?: number;
  weight: number; // in tons
  type: 'sale' | 'rental' | 'rent' | 'both';
  category: MachineCategory | string;
  price?: number;
  rentalPrice?: string; // e.g. "200€ / giorno"
  imageUrl: string;
  condition?: 'NUOVO' | 'USATO' | 'OTTIME CONDIZIONI' | string;
  powerType?: 'Elettrico' | 'Termico' | string;
  features: string[];
  description: string;
  createdAt?: number;
}

export interface Testimonial {
  id: number;
  author: string;
  company: string;
  text: string;
  rating: number;
}
