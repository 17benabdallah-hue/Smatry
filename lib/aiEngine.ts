export type EventType =
  | "food"
  | "medicine"
  | "travel"
  | "meeting"
  | "shopping"
  | "general";

export function detectEventType(text: string): EventType {
  const t = text.toLowerCase();

  // طعام / مطبخ
  if (
    t.includes("حليب") ||
    t.includes("طبخ") ||
    t.includes("نار") ||
    t.includes("milk") ||
    t.includes("cook")
  ) {
    return "food";
  }

  // دواء
  if (
    t.includes("دواء") ||
    t.includes("حبة") ||
    t.includes("medicine") ||
    t.includes("pill")
  ) {
    return "medicine";
  }

  // سفر
  if (
    t.includes("رحلة") ||
    t.includes("طائرة") ||
    t.includes("travel") ||
    t.includes("flight")
  ) {
    return "travel";
  }

  // اجتماع
  if (
    t.includes("اجتماع") ||
    t.includes("meeting") ||
    t.includes("لقاء")
  ) {
    return "meeting";
  }

  // تسوق
  if (
    t.includes("شراء") ||
    t.includes("سوق") ||
    t.includes("buy") ||
    t.includes("shopping")
  ) {
    return "shopping";
  }

  return "general";
}
