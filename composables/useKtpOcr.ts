/**
 * useKtpOcr — OCR KTP GRATIS on-device (Tesseract.js). Parse field KTP dari teks
 * hasil OCR memakai regex + heuristik label. Akurasi tergantung kualitas foto;
 * untuk produksi gunakan PaddleOCR/vendor (server) via /api/ekyc/ocr.
 */
export interface KtpOcrResult {
  nik: string | null
  name: string | null
  birth_place: string | null
  birth_date: string | null           // YYYY-MM-DD
  gender: string | null               // 'M' | 'F'
  blood_type: string | null
  address: string | null
  rt_rw: string | null
  village: string | null              // Kel/Desa
  district: string | null             // Kecamatan
  religion: string | null
  marital_status: string | null       // single|married|divorced|widowed
  occupation: string | null           // raw text
  nationality: string | null
  rawText: string
}

const NIK_RE = /\b\d{16}\b/
const DATE_RE = /(\d{2})[-/. ](\d{2})[-/. ](\d{4})/
const RTRW_RE = /(\d{1,3})\s*[/\\]\s*(\d{1,3})/

export const useKtpOcr = () => {
  // ambil teks setelah ':' (atau setelah label) pada satu baris
  const after = (line: string): string => {
    if (line.includes(':')) return line.split(':').slice(1).join(':').trim()
    return line.trim()
  }

  const mapMarital = (s: string): string | null => {
    const u = s.toUpperCase()
    if (u.includes('BELUM')) return 'single'
    if (u.includes('KAWIN') || u.includes('MENIKAH')) return u.includes('BELUM') ? 'single' : 'married'
    if (u.includes('CERAI HIDUP')) return 'divorced'
    if (u.includes('CERAI MATI') || u.includes('JANDA') || u.includes('DUDA')) return 'widowed'
    return null
  }

  const parse = (text: string): Omit<KtpOcrResult, 'rawText'> => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
    const upper = text.toUpperCase()
    const r: any = {
      nik: null, name: null, birth_place: null, birth_date: null, gender: null,
      blood_type: null, address: null, rt_rw: null, village: null, district: null,
      religion: null, marital_status: null, occupation: null, nationality: null,
    }

    const nik = NIK_RE.exec(text.replace(/\s/g, ''))
    if (nik) r.nik = nik[0]

    for (const line of lines) {
      const u = line.toUpperCase()
      if (!r.name && u.includes('NAMA')) {
        const v = after(line).replace(/[^A-Za-z .'-]/g, '').trim()
        if (v.length > 2) r.name = v.toUpperCase()
      } else if ((u.includes('TEMPAT') && u.includes('LAHIR')) || u.includes('TGL LAHIR') || u.includes('TTL')) {
        const v = after(line)
        const d = DATE_RE.exec(v)
        if (d) {
          r.birth_date = `${d[3]}-${d[2]}-${d[1]}`
          const place = v.slice(0, d.index).replace(/[^A-Za-z ]/g, '').trim()
          if (place) r.birth_place = place.toUpperCase()
        }
      } else if (u.includes('JENIS KELAMIN') || u.includes('KELAMIN')) {
        if (u.includes('PEREMPUAN')) r.gender = 'F'
        else if (u.includes('LAKI')) r.gender = 'M'
        const bt = /GOL[.\s]*DARAH\s*:?\s*(A|B|AB|O)/i.exec(line)
        if (bt) r.blood_type = bt[1].toUpperCase()
      } else if (u.startsWith('ALAMAT') || (u.includes('ALAMAT') && !r.address)) {
        r.address = after(line)
      } else if (u.includes('RT') && u.includes('RW')) {
        const m = RTRW_RE.exec(line)
        if (m) r.rt_rw = `${m[1]}/${m[2]}`
      } else if (u.includes('KEL') || u.includes('DESA')) {
        r.village = after(line).toUpperCase() || null
      } else if (u.includes('KECAMATAN')) {
        r.district = after(line).toUpperCase() || null
      } else if (u.includes('AGAMA')) {
        r.religion = after(line).toUpperCase() || null
      } else if (u.includes('PERKAWINAN') || u.includes('STATUS')) {
        r.marital_status = mapMarital(after(line) || line)
      } else if (u.includes('PEKERJAAN')) {
        r.occupation = after(line).toUpperCase() || null
      } else if (u.includes('KEWARGANEGARAAN') || u.includes('WNI') || u.includes('WNA')) {
        r.nationality = u.includes('WNA') ? 'WNA' : 'WNI'
      }
    }

    // fallback dari seluruh teks
    if (!r.gender) {
      if (upper.includes('PEREMPUAN')) r.gender = 'F'
      else if (upper.includes('LAKI-LAKI') || upper.includes('LAKI LAKI')) r.gender = 'M'
    }
    if (!r.marital_status) r.marital_status = mapMarital(upper)
    const rt = RTRW_RE.exec(text)
    if (!r.rt_rw && rt) r.rt_rw = `${rt[1]}/${rt[2]}`

    return r
  }

  const recognize = async (file: File): Promise<KtpOcrResult> => {
    // @ts-ignore — modul opsional
    const Tesseract = (await import('tesseract.js')).default
    const { data } = await Tesseract.recognize(file, 'ind')
    return { ...parse(data.text || ''), rawText: data.text || '' }
  }

  return { recognize, parse }
}
