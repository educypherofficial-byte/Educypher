export function cleanFirestoreData<T extends Record<string, unknown>>(
  obj: T
): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as T;
}
