import { Minute } from '../types';

const STORAGE_KEY = 'ai_minutes';

export function saveMinutes(minutes: Minute[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(minutes));
}

export function loadMinutes(): Minute[] {
  const storedMinutes = localStorage.getItem(STORAGE_KEY);
  return storedMinutes ? JSON.parse(storedMinutes) : [];
}