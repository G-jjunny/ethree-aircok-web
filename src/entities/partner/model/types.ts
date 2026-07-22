export interface Partner {
  id: string;
  name: string;
  logoUrl: string | null;
  type: 'partner' | 'client';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerCreateBody {
  name: string;
  logoUrl?: string;
  type: 'partner' | 'client';
  order?: number;
}

export interface PartnerUpdateBody {
  name?: string;
  logoUrl?: string | null;
  type?: 'partner' | 'client';
  order?: number;
}
