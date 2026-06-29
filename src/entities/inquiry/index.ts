export type {
  InquiryStatus,
  InquirySummary,
  InquiryListResponse,
  CreateInquiryBody,
} from './model/types';
export {
  createInquiry,
  getAdminInquiryList,
  adminInquiryQueryOptions,
  adminInquiryKeys,
  updateInquiryStatus,
  deleteInquiry,
  InquiryApiError,
  newInquiryCountQueryOptions,
  newInquiryCountKeys,
} from './api/inquiryApi';
