export function shuffleArray<T>(items: readonly T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = copy[index] as T;
    const nextItem = copy[swapIndex] as T;
    copy[index] = nextItem;
    copy[swapIndex] = currentItem;
  }

  return copy;
}

export function buildLoopedDeck<T>(items: readonly T[], count: number): T[] {
  if (items.length === 0 || count <= 0) {
    return [];
  }

  const deck: T[] = [];

  while (deck.length < count) {
    deck.push(...shuffleArray(items));
  }

  return deck.slice(0, count);
}
