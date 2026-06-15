const FEEDBACK_DISABLED_BOOTH_SLOTS = new Set([
  'A6',
  'B3',
  'C5',
  'D5',
  'D6',
  'E2',
  'B-3',
  'D-4',
  'F-1',
  'F-3',
]);

export function isFeedbackDisabledBoothSlot(
  boothSlot: string | null | undefined,
): boolean {
  return Boolean(boothSlot && FEEDBACK_DISABLED_BOOTH_SLOTS.has(boothSlot));
}
