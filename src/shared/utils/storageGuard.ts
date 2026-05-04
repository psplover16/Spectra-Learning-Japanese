function getLocalStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readJsonStorage<T>(key: string, validate: (value: unknown) => value is T): T | null {
  const storage = getLocalStorage();

  if (!storage) {
    return null;
  }

  const rawValue = storage.getItem(key);

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

  storage.removeItem(key);
  return null;
}

export function writeJsonStorage<T>(key: string, value: T): void {
  getLocalStorage()?.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string): void {
  getLocalStorage()?.removeItem(key);
}
