export type {
  DiagnosisConsultation,
  DiagnosisConsultationListItem,
  DiagnosisConsultationStatus,
  DiagnosisConsultationListResponse,
  UpdateDiagnosisConsultationBody,
} from './model/types'
export {
  DiagnosisConsultationApiError,
  diagnosisConsultationKeys,
  getAdminDiagnosisConsultationList,
  getDiagnosisConsultationDetail,
  getNewDiagnosisConsultationCount,
  updateDiagnosisConsultation,
  adminDiagnosisConsultationQueryOptions,
  diagnosisConsultationDetailQueryOptions,
  newDiagnosisConsultationCountQueryOptions,
} from './api/diagnosisConsultationApi'
