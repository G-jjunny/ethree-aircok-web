import { axiosInstance } from '@/shared/api';

export async function uploadNewsImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axiosInstance.post<{ url: string }>('/news/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.url;
}
