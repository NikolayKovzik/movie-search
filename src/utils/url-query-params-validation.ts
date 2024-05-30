import { SortingOrder, SortingPattern, SortingType } from '@/types';
import { currentYear, startYear, validSortingTypes } from './constants';

export function validateSortingType(value: string): value is SortingType {
  return (validSortingTypes as readonly string[]).includes(value);
}

export function validateSortingOrder(value: string): value is SortingOrder {
  return value === 'desc' || value === 'asc';
}

export function validateSortingPattern(value: string): value is SortingPattern {
  const [sortingType, sortingOrder] = value.split('.');
  return validateSortingType(sortingType) && validateSortingOrder(sortingOrder);
}

//! more specific return type
export function validateGenreIDs(value: string): boolean {
  return /^\d+(\|\d+)*$/.test(value);
}

export function validateReleaseYear(value: number): boolean {
  return Number.isInteger(value) && value >= startYear && value <= currentYear;
}

export function validateVoteAverageValue(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 10;
}

export function validatePageNumber(pageNumber: number): boolean {
  return Number.isInteger(pageNumber) && pageNumber <= 500;
}
