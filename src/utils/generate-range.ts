import { ComboboxData } from '@mantine/core';

function generateReversedNumericRange(end: number, start: number): number[] {
  if (end < start) {
    return [];
  }
  return Array.from({ length: end - start + 1 }, (_, i) => end - i);
}

export function generateDataRange(end: number, start: number): ComboboxData {
  console.log('ALERT, generation! (useCallback?)');

  const reversedNumericRange = generateReversedNumericRange(end, start);
  return reversedNumericRange.map(value => ({
    value: value.toString(),
    label: value.toString(),
  }));
}

// Array(end - start + 1).fill(end).map((el, i) => el - i)
