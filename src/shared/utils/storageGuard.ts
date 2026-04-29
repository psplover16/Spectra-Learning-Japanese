export function readJsonStorage<T>(key: string, validate: (value: unknown) => value is T): T | null {
  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (validate(parsed)) {
      return parsed;
    }
  } catch {
    // Ignore invalid storage and remove it below.
  }

  window.localStorage.removeItem(key);
  return null;
}

export function writeJsonStorage<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string): void {
  window.localStorage.removeItem(key);
}
