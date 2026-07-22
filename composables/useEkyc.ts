/**
 * useEkyc — wrapper endpoint modul eKYC (/api/ekyc/*) di sekuritas-api.
 * Flow: createSession → ocr → liveness → faceMatch → sign → verify → status.
 * Proses AI berjalan di backend (provider stub/FastAPI) — frontend hanya kirim gambar.
 */
export interface EkycSession {
  id: string
  status: string
  provider: string
  score: number | null
  auto_approved: boolean
  reject_reason: string | null
}

export interface EkycVerifyResult {
  ocr_score: number
  liveness_score: number
  face_match_score: number
  final_score: number
  decision: 'approved' | 'review' | 'rejected'
  flags: string[]
}

export const useEkyc = () => {
  const { get, post, postFormData } = useApi()

  const createSession = () =>
    post<{ data: EkycSession }>('/ekyc/session').then((r) => r.data)

  /** OCR KTP. `override` = field hasil OCR on-device (Tesseract.js) yang lebih dipercaya. */
  const ocr = (sessionId: string, file: File, override: Record<string, string> = {}) => {
    const fd = new FormData()
    fd.append('session_id', sessionId)
    fd.append('file', file)
    Object.entries(override).forEach(([k, v]) => v && fd.append(k, v))
    return postFormData<{ data: any }>('/ekyc/ocr', fd).then((r) => r.data)
  }

  const liveness = (sessionId: string, file: File) => {
    const fd = new FormData()
    fd.append('session_id', sessionId)
    fd.append('file', file)
    return postFormData<{ data: any }>('/ekyc/liveness', fd).then((r) => r.data)
  }

  const faceMatch = (sessionId: string) =>
    post<{ data: any }>('/ekyc/face-match', { session_id: sessionId }).then((r) => r.data)

  /** Tanda tangan digital (data URI base64 PNG dari canvas). */
  const sign = (sessionId: string, signature: string) =>
    post<{ data: any }>('/ekyc/signature', { session_id: sessionId, signature }).then((r) => r.data)

  /** Verifikasi NIK hasil OCR ke Dukcapil (mock/asli). */
  const verifyNik = (sessionId: string) =>
    post<{ data: { dukcapil: any } }>('/ekyc/verify-nik', { session_id: sessionId }).then((r) => r.data)

  const verify = (sessionId: string) =>
    post<{ data: { session: EkycSession; result: EkycVerifyResult } }>('/ekyc/verify', {
      session_id: sessionId,
    }).then((r) => r.data)

  const status = (sessionId: string) =>
    get<{ data: any }>(`/ekyc/status/${sessionId}`).then((r) => r.data)

  return { createSession, ocr, liveness, faceMatch, sign, verify, verifyNik, status }
}
