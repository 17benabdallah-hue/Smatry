// lib/smartParser.ts
import { addMinutes, addHours, addDays, setHours, setMinutes, setSeconds, isBefore } from 'date-fns';

export type EventType = 'food' | 'medicine' | 'travel' | 'meeting' | 'school' | 'other';

export interface ReminderData {
  eventType: EventType;
  eventTime: Date;
  reminderTimes: Date[]; // تحذيري + نهائي
  suggestedMessage: string;
  confidence: number; // 0..1
}

// كلمات مفتاحية لكل نوع حدث
const keywords: Record<EventType, string[]> = {
  food: ['حليب','طعام','فرن','نار','طبخ','milk','food','oven','stove'],
  medicine: ['دواء','حبة','pill','medicine','medication'],
  travel: ['رحلة','سفر','طائرة','flight','trip','travel'],
  meeting: ['اجتماع','موعد','meeting','appointment','event'],
  school: ['مدرسة','ابن','ابنة','طفل','school','child','kid'],
  other: [],
};

// رسائل ذكية لكل نوع حدث
const messages: Record<EventType, string> = {
  food: '🍲 الطعام جاهز تقريباً! تفقده الآن.',
  medicine: '💊 حان وقت تناول الدواء. لا تنسى!',
  travel: '✈️ اقترب موعد رحلتك. تأكد من وثائقك!',
  meeting: '💼 تذكير باجتماعك. استعد للموعد!',
  school: '🏫 اقترب موعد عودة الأبناء من المدرسة.',
  other: '🔔 تذكير: تحقق من جدولك.'
};

// أوقات التذكير التحذيري (بالدقائق قبل الحدث) لكل نوع
const warningOffsets: Record<EventType, number> = {
  food: 5,
  medicine: 5,
  travel: 120,
  meeting: 15,
  school: 15,
  other: 10
};

// أوقات التذكير النهائي (بعد مدة الحدث)
const defaultDurations: Record<EventType, number> = {
  food: 25,
  medicine: 30,
  travel: 0,
  meeting: 60,
  school: 240,
  other: 15
};

// ---------------------------
// تحليل النص لتحديد نوع الحدث
// ---------------------------
export function detectEventType(text: string): EventType {
  const t = text.toLowerCase();
  for (const [type, kws] of Object.entries(keywords)) {
    if (kws.some(k => t.includes(k.toLowerCase()))) return type as EventType;
  }
  return 'other';
}

// ---------------------------
// استخراج الوقت من نص عربي/إنجليزي
// ---------------------------
export function extractTime(text: string): Date {
  const now = new Date();

  // 1️⃣ ساعة محددة (مثال: "الساعة 4 مساءً" أو "at 4pm")
  const timePattern = /(الساعة|على|at|by|around)?\s*(\d{1,2})(?::(\d{2}))?\s*(صباحاً|مساءً|am|pm)?/i;
  const match = text.match(timePattern);
  if (match) {
    let hour = parseInt(match[2]);
    const minute = match[3] ? parseInt(match[3]) : 0;
    const period = (match[4] || '').toLowerCase();

    if ((period.includes('م') || period.includes('pm')) && hour < 12) hour += 12;
    if ((period.includes('ص') || period.includes('am')) && hour === 12) hour = 0;

    let date = setSeconds(setMinutes(setHours(now, hour), minute), 0);
    if (isBefore(date, now)) date = addDays(date, 1); // لو الوقت مضى اليوم
    return date;
  }

  // 2️⃣ بعد مدة (مثال: "بعد ساعة" أو "in 30 min")
  const minutesMatch = text.match(/(?:بعد|in)\s*(\d+)\s*(?:دقيقة|min)/i);
  if (minutesMatch) return addMinutes(now, parseInt(minutesMatch[1]));

  const hoursMatch = text.match(/(?:بعد|in)\s*(\d+)\s*(?:ساعة|hour)/i);
  if (hoursMatch) return addHours(now, parseInt(hoursMatch[1]));

  // 3️⃣ غداً
  if (/غداً|غدا|tomorrow/i.test(text)) return addDays(now, 1);

  // 4️⃣ افتراضي: الآن + مدة حسب نوع الحدث
  return now;
}

// ---------------------------
// إنشاء تذكيرات تحذيري + نهائي
// ---------------------------
export function calculateReminderTimes(eventType: EventType, eventTime: Date): Date[] {
  const warningTime = addMinutes(eventTime, -warningOffsets[eventType]);
  const finalTime = eventTime;
  return [warningTime, finalTime];
}

// ---------------------------
// إنشاء رسالة ذكية
// ---------------------------
export function generateSmartMessage(eventType: EventType): string {
  return messages[eventType];
}

// ---------------------------
// دمج كل شيء: تحويل النص لتذكير كامل
// ---------------------------
export function parseReminderText(text: string): ReminderData {
  const type = detectEventType(text);
  let eventTime = extractTime(text);

  // إذا النوع سفر ولا وقت محدد → نفترض الغد 8 صباحاً
  if (type === 'travel' && eventTime.getTime() === new Date().getTime()) {
    eventTime = setSeconds(setMinutes(setHours(addDays(new Date(), 1), 8), 0), 0);
  }

  const reminders = calculateReminderTimes(type, eventTime);
  const message = generateSmartMessage(type);

  // تقدير الثقة
  let confidence = 0.5;
  if (text.length > 5) confidence += 0.2;
  if (type !== 'other') confidence += 0.2;
  confidence = Math.min(confidence, 1);

  return {
    eventType: type,
    eventTime,
    reminderTimes: reminders,
    suggestedMessage: message,
    confidence
  };
}
