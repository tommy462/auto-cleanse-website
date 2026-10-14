import { createContext } from 'react';

// AdBlue town pages. The full town dataset (src/data/adblue-towns/towns.json)
// is imported ONLY by entry-server.tsx, so it never enters the client bundle.
// During prerender each town page writes its own record into the HTML
// (window.__ADBLUE_TOWN__), and the areas index writes the town list
// (window.__ADBLUE_TOWN_INDEX__), which is what the client hydrates from.

export interface TownPlace {
  slug: string;
  name: string;
  km: number;
}

export interface TownData {
  slug: string;
  name: string;
  county: string;
  region: string;
  country: string;
  pop: number;
  kmFromTotnes: number;
  /** Covered by our own Totnes technicians (Devon). */
  inHouse: boolean;
  districts: string[];
  roads: string[];
  services: { name: string; road?: string; km: number }[];
  pumps: { name: string; km: number; town?: string }[];
  /** Privately kept licensed vans in the town's council area (DfT VEH0105). */
  vans?: { area: string; count: number; dieselPct: number; quarter: string } | null;
  nearby: TownPlace[];
  intro: string;
  roadsText: string;
  updated: string;
}

export interface TownIndexEntry {
  slug: string;
  name: string;
  region: string;
  county: string;
}

export interface TownStore {
  towns: Record<string, TownData>;
  index: TownIndexEntry[];
}

export const TownDataContext = createContext<TownStore | null>(null);

declare global {
  interface Window {
    __ADBLUE_TOWN__?: TownData;
    __ADBLUE_TOWN_INDEX__?: TownIndexEntry[];
  }
}

/** Inline JSON for a <script> body, safe against "</script>" in the data. */
export function inlineJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export const TOWNS_PATH = '/adblue-repair/areas';
export const townPath = (slug: string) => `/adblue-repair/${slug}`;
