export interface TeamImage {
  id: string;
  imageUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamImageCreateBody {
  imageUrl: string;
}

export interface TeamImageUpdateBody {
  imageUrl?: string;
}
