'use client';

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { STORAGE_KEYS } from '@/lib/config';
import type { Appliance } from '@/lib/types/nature';
import { useEffect, useState } from 'react';

// API Key atom with localStorage persistence
export const apiKeyAtom = atomWithStorage<string | null>(
  STORAGE_KEYS.apiKey,
  null
);

// Appliances data atom
export const appliancesAtom = atom<Appliance[]>([]);

// Loading state atom
export const isLoadingAtom = atom<boolean>(true);

// Error state atom
export const errorAtom = atom<string | null>(null);

// Refreshing state atom
export const isRefreshingAtom = atom<boolean>(false);

// Hydration hook for SSR compatibility
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return hydrated;
}

// Custom hooks for convenience
export function useApiKey() {
  return useAtom(apiKeyAtom);
}

export function useApiKeyValue() {
  return useAtomValue(apiKeyAtom);
}

export function useSetApiKey() {
  return useSetAtom(apiKeyAtom);
}

export function useAppliances() {
  return useAtom(appliancesAtom);
}

export function useAppliancesValue() {
  return useAtomValue(appliancesAtom);
}

export function useSetAppliances() {
  return useSetAtom(appliancesAtom);
}

export function useAppliancesLoading() {
  return useAtom(isLoadingAtom);
}

export function useAppliancesError() {
  return useAtom(errorAtom);
}

export function useRefreshing() {
  return useAtom(isRefreshingAtom);
}
