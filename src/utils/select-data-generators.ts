import { ComboboxData } from '@mantine/core';
import { SortingPatternsMap, SortingPattern } from '@/types';

function generateReversedNumericRange(end: number, start: number): number[] {
  if (end < start) {
    return [];
  }
  // Array(end - start + 1).fill(end).map((el, i) => el - i)
  return Array.from({ length: end - start + 1 }, (_, i) => end - i);
}

export function generateNumericOptions(end: number, start: number): ComboboxData {
  const reversedNumericRange = generateReversedNumericRange(end, start);
  return reversedNumericRange.map(value => ({
    value: value.toString(),
    label: value.toString(),
  }));
}

export const generateSortingOptions = (
  patternsMap: SortingPatternsMap
): {
  value: SortingPattern;
  label: string;
}[] => {
  return Object.entries(patternsMap).map(([value, label]) => ({
    value: value as SortingPattern,
    label,
  }));
};
