/**
 * Thailand Timezone Utilities (UTC+7)
 * ฟังก์ชันช่วยเหลือสำหรับจัดการเวลาประเทศไทย
 */

/**
 * แปลง Date object เป็น ISO string ในเวลาไทย (UTC+7)
 * ใช้สำหรับบันทึกลง database
 */
export function toThailandISO(date = new Date()) {
  // ใช้ Intl API เพื่อรับวันที่-เวลาที่แม่นยำในเวลาไทย
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  const parts = formatter.formatToParts(date)
  const get = (type) => parts.find(p => p.type === type).value
  
  // สร้าง ISO string ในรูปแบบ YYYY-MM-DDTHH:mm:ss+07:00
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}+07:00`
}

/**
 * รับวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD ตามเวลาไทย
 */
export function getTodayThailand() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  
  return formatter.format(new Date())
}

/**
 * แปลง date string (YYYY-MM-DD) เป็น Date object โดยไม่ให้เกิด timezone shift
 */
export function parseThailandDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0)
}

/**
 * จัดรูปแบบวันที่เป็นภาษาไทย
 * @returns {Object} { day, month, thaiYear, dayName, full }
 */
export function formatThaiDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]
  
  const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
  
  return {
    day: day,
    month: thaiMonths[month - 1],
    thaiYear: year + 543,
    dayName: thaiDays[date.getDay()],
    full: `${thaiDays[date.getDay()]}ที่ ${day} ${thaiMonths[month - 1]} ${year + 543}`
  }
}

/**
 * แสดงเวลาในรูปแบบ HH:MM ตามเวลาไทย
 */
export function formatThaiTime(timestamp) {
  const date = new Date(timestamp)
  const formatter = new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  
  return formatter.format(date)
}

/**
 * แสดงวันที่และเวลาแบบเต็มในรูปแบบไทย
 */
export function formatThaiDateTime(timestamp) {
  const date = new Date(timestamp)
  const formatter = new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  
  return formatter.format(date)
}
