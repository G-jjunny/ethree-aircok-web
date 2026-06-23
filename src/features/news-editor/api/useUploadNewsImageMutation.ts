import { useMutation } from '@tanstack/react-query'
import { uploadNewsImage } from './uploadImage'

export function useUploadNewsImageMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadNewsImage(file),
  })
}
