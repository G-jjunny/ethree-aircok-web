export interface TimelineItem {
  id: string;
  year: number;
  month: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineCreateBody {
  year: number;
  month: number;
  content: string;
}

export interface TimelineUpdateBody {
  year?: number;
  month?: number;
  content?: string;
}
