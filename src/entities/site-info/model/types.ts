export interface SiteInfo {
  id: string;
  companyName: string;
  legalName: string | null;
  address: string;
  phone: string;
  email: string;
  bizNo: string;
  ceo: string;
  fax: string | null;
  mailOrderNo: string | null;
  instagram: string | null;
  youtube: string | null;
  linkedin: string | null;
  facebook: string | null;
  kakaoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SiteInfoUpdateBody {
  companyName: string;
  legalName?: string;
  address: string;
  phone: string;
  email: string;
  bizNo: string;
  ceo: string;
  fax?: string;
  mailOrderNo?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  facebook?: string;
  kakaoUrl?: string;
}
