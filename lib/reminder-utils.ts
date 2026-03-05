import { translations, type LanguageCode } from './translations';

export type EventType =
  | 'food'
  | 'medicine'
  | 'travel'
  | 'meeting'
  | 'school'
  | 'other';

export interface ReminderAnalysis {
  eventType: EventType;
  eventTime: Date;
  warningTime: Date;
  finalTime: Date;
  message: string;
  confidence: number; // 0-100
}

/**
 * تحليل نص التذكير لتحديد نوع الحدث
 */
export function detectEventType(text: string): EventType {
  const t = text.toLowerCase();

  if (t.includes('حليب') || t.includes('طبخ') || t.includes('نار') || t.includes('food') || t.includes('meal'))
    return 'food';

  if (t.includes('دواء') || t.includes('حبة') || t.includes('medicine') || t.includes('pill'))
    return 'medicine';

  if (t.includes('رحلة') || t.includes('طائرة') || t.includes('travel') || t.includes('flight'))
    return 'travel';

  if (t.includes('اجتماع') || t.includes('meeting') || t.includes('appointment'))
    return 'meeting';

  if (t.includes('مدرسة') || t.includes('ابن') || t.includes('ابنة') || t.includes('طفل') || t.includes('school') || t.includes('child'))
    return 'school';

  return 'other';
}

/**
 * تحويل الوقت من نص إلى Date
 * يدعم العربية والإنجليزية (12h و24h)
 */
export function parseTime(text: string, reference: Date = new Date()): Date {
  let hour = 0;
  let minute = 0;
  let ampm: 'AM' | 'PM' | null = null;

  // الإنجليزية: 4:30 PM, 16:30
  const enMatch = text.match(/(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)?/i);
  if (enMatch) {
    hour = parseInt(enMatch[1], 10);
    minute = enMatch[2] ? parseInt(enMatch[2], 10) : 0;
    ampm = enMatch[3]?.toUpperCase() as 'AM' | 'PM' | null;
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
  }

  // العربية: الساعة 4 مساءً
  const arMatch = text.match(/الساعة\s*(\d{1,2})(?:\s*[:٫]\s*(\d{1,2}))?\s*(صباحاً|مساءً)?/i);
  if (arMatch) {
    hour = parseInt(arMatch[1], 10);
    minute = arMatch[2] ? parseInt(arMatch[2], 10) : 0;
    const part = arMatch[3];
    if (part === 'مساءً' && hour < 12) hour += 12;
    if (part === 'صباحاً' && hour === 12) hour = 0;
  }

  const result = new Date(reference);
  result.setHours(hour, minute, 0, 0);

  // إذا الوقت أصغر من الآن، افترض اليوم التالي
  if (result < reference) result.setDate(result.getDate() + 1);

  return result;
}

/**
 * حساب أوقات التذكير التحذيري والنهائي
 */
export function calculateReminderTimes(eventType: EventType, eventTime: Date): { warningTime: Date; finalTime: Date } {
  let durationMinutes = 0;
  switch (eventType) {
    case 'food':
      durationMinutes = 25;
      break;
    case 'medicine':
      durationMinutes = 30;
      break;
    case 'meeting':
      durationMinutes = 60;
      break;
    case 'travel':
      durationMinutes = 24 * 60; // غداً 7 صباحاً يتم حسابه مسبقاً
      break;
    case 'school':
      durationMinutes = 60;
      break;
    default:
      durationMinutes = 60;
  }

  const finalTime = new Date(eventTime.getTime() + durationMinutes * 60000);
  const warningTime = new Date(eventTime.getTime() + durationMinutes * 0.8 * 60000); // 80%

  return { warningTime, finalTime };
}

/**
 * إنشاء رسالة ذكية حسب نوع الحدث
 */
export function buildSmartMessage(eventType: EventType, lang: LanguageCode = 'ar'): string {
  const t = translations[lang];
  switch (eventType) {
    case 'food': return t.msg_food_ready;
    case 'medicine': return t.msg_medicine_time;
    case 'travel': return t.msg_travel_warning;
    case 'meeting': return t.msg_meeting_reminder;
    case 'school': return t.msg_school_return;
    default: return '';
  }
}

/**
 * تحليل نص التذكير بالكامل
 */
export function analyzeReminder(text: string, lang: LanguageCode = 'ar', reference: Date = new Date()): ReminderAnalysis {
  const eventType = detectEventType(text);

  // حاول العثور على الوقت في النص
  const eventTime = parseTime(text, reference);

  const { warningTime, finalTime } = calculateReminderTimes(eventType, eventTime);

  const message = buildSmartMessage(eventType, lang);

  return {
    eventType,
    eventTime,
    warningTime,
    finalTime,
    message,
    confidence: 95, // مبدئي، يمكن تحسينه لاحقاً
  };
}
