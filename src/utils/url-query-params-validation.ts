import { SortingOrder, SortingType } from '@/types';
import { currentYear, startYear, validSortingTypes } from './constants';

export function validateSortingType(value: string | undefined): value is SortingType {
  if (value) {
    return (validSortingTypes as readonly string[]).includes(value);
  }
  return false;
}

export function validateSortingOrder(value: string | undefined): value is SortingOrder {
  if (value) {
    return value === 'desc' || value === 'asc';
  }
  return false;
}

export function validateGenreIDs(value: string | null): value is string {
  if (typeof value === 'string') {
    return /^\d+(\|\d+)*$/.test(value);
  }
  return false;
}

export function validateReleaseYear(value: number): boolean {
  if (value) {
    return Number.isInteger(value) && value >= startYear && value <= currentYear;
  }
  return false;
}

export function validateVoteAverageLTE(lteValue: number): boolean {
  if (lteValue) {
    return Number.isInteger(lteValue) && lteValue >= 0 && lteValue <= 10;
  }
  return false;
}

export function validateVoteAverageGTE(gteValue: number): boolean {
  if (gteValue) {
    return Number.isInteger(gteValue) && gteValue >= 0 && gteValue <= 10;
  }
  return false;
}

export function validatePageNumber(pageNumber: number): boolean {
  if (pageNumber) {
    return Number.isInteger(pageNumber) && pageNumber <= 500;
  }
  return false;
}
