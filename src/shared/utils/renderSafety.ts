export function ensureDefined<T>(value: T | undefined | null, fallback: T): T {
  return value ?? fallback;
}
