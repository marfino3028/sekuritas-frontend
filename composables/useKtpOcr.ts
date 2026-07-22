/**
 * useKtpOcr — OCR KTP GRATIS on-device dengan Tesseract.js (tanpa biaya server/AI).
 * Hasil (NIK, nama) dikirim ke backend sebagai override yang lebih dipercaya.
 * Butuh dependency `tesseract.js` (npm i). Import dinamis agar tidak membebani bundle awal.
 */
export interface KtpOcrResult {
  nik: string | null
  name: string | null
  rawText: string
}

export const useKtpOcr = () => {
  const parse = (text: string): { nik: string | null; name: string | null } => {
    const upper = text.toUpperCase()
    // NIK = 16 digit berurutan
    const nikMatch = upper.replace(/\s/g, '').match(/\d{16}/)
    // Nama: baris setelah kata "NAMA"
    let name: string | null = null
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
    for (const line of lines) {
      const m = line.match(/NAMA\s*[:.]?\s*(.+)/i)
      if (m && m[1] && m[1].replace(/[^A-Za-z ]/g, '').trim().length > 2) {
        name = m[1].replace(/[^A-Za-z .'-]/g, '').trim().toUpperCase()
        break
      }
    }
    return { nik: nikMatch ? nikMatch[0] : null, name }
  }

  /** Jalankan OCR pada File gambar KTP. Mengembalikan field terparse. */
  const recognize = async (file: File): Promise<KtpOcrResult> => {
    // @ts-ignore — modul opsional, resolve saat runtime
    const Tesseract = (await import('tesseract.js')).default
    const { data } = await Tesseract.recognize(file, 'ind')
    const { nik, name } = parse(data.text || '')
    return { nik, name, rawText: data.text || '' }
  }

  return { recognize }
}
