export interface TeamImage {
  id: string;
  imageUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamImageCreateBody {
  imageUrl: string;
  order?: number;
}

export interface TeamImageUpdateBody {
  imageUrl?: string;
  order?: number;
}
