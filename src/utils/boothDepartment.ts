export function isDesignDepartmentBoothSlot(
  boothSlot: string | null | undefined,
): boolean {
  return Boolean(boothSlot?.includes('-'));
}
