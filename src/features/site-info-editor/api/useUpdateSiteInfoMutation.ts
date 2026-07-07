'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { siteInfoKeys, revalidateSiteInfoCache } from '@/entities/site-info'
import type { SiteInfo, SiteInfoUpdateBody } from '@/entities/site-info'

export function useUpdateSiteInfoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: SiteInfoUpdateBody) => {
      const { data } = await axiosInstance.put<SiteInfo>('/site-info', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteInfoKeys.all })
      void revalidateSiteInfoCache()
    },
  })
}
