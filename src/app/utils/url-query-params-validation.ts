import { SortingOrder, SortingType } from "../types";
import { validSortingTypes } from "./constants";

export function isValidSortingType(value: string | null): value is SortingType {

  if (value) {
    return validSortingTypes.includes(value);
  }
  return false;
}



export function isValidSortingOrder(value: string | null): value is SortingOrder {

  if (value) {
    return value === 'desc' || value === 'asc';
  }
  return false;
}



export function areValidGenreIDs(value: string | null): value is string {

  if (typeof value === 'string') {
    return /^\d+(\|\d+)*$/.test(value);
  }
  return false;
}



export function isValidReleaseYear(value: number): boolean {

  if (value) {
    return Number.isInteger(value) && value >= 1900 && value <= new Date().getFullYear();
  }
  return false;

}



export function areValidVoteAverageLimits(gteValue: number, lteValue: number): boolean {

  if (gteValue && lteValue) {
    return Number.isInteger(gteValue) && Number.isInteger(lteValue) && gteValue <= lteValue;
  }
  return false;
}