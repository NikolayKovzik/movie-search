import { ComboboxItem } from '@mantine/core';
import { sortingPatternsMap } from './constants';
import { SortingPattern } from '@/types';

export const calcInitialSelectValue = (
  urlParamValue: string | null,
  isSortingPatternValue: boolean = false
): ComboboxItem | null => {
  if (urlParamValue) {
    return {
      value: urlParamValue,
      label: isSortingPatternValue
        ? sortingPatternsMap[urlParamValue as SortingPattern]
        : urlParamValue,
    };
  }
  return null;
};
