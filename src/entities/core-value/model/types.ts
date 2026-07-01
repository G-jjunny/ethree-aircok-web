export interface CoreValue {
  id: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CoreValueCreateBody {
  title: string;
  description: string;
  order?: number;
}

export interface CoreValueUpdateBody {
  title?: string;
  description?: string;
  order?: number;
}
