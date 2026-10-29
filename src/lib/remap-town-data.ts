import { createContext } from 'react';

// National Stage 1 remapping town pages. Works like the AdBlue town pages
// (see town-data.ts): src/data/remap-towns/towns.json is imported ONLY by
// entry-server.tsx, each town page writes its own record into the HTML
// (window.__REMAP_TOWN__) and the areas index writes the town list
// (window.__REMAP_TOWN_INDEX__), so the dataset never enters the client bundle.

export interface RemapTownPlace {
  slug: string;
  name: string;
  km: number;
}

/** Licensed vehicles in the town's council area (DfT VEH0105). */
export interface RemapCouncilVehicles {
  area: string;
  quarter: string;
  cars: number;
  carsDieselPct: number;
  carsPetrolPct: number;
  carsHybridPct?: number;
  carsElectricPct?: number;
  vans: number;
  vansDieselPct: number;
}

/** Census travel-to-work and car ownership figures. */
export interface RemapCensus {
  area: string;
  census: string;
  driveToWorkPct: number;
  homeWorkPct?: number;
  km10plusPct?: number;
  km30plusPct?: number;
  noCarPct?: number;
  twoPlusCarsPct?: number;
  /** Same measures for England and Wales, for comparison. */
  national?: Partial<Record<'driveToWorkPct' | 'homeWorkPct' | 'km10plusPct' | 'km30plusPct' | 'noCarPct' | 'twoPlusCarsPct', number>>;
}

export interface RemapCleanAirZone {
  name: string;
  /** What the zone charges or restricts, in plain words (left out for the ULEZ). */
  scope?: string;
}

export interface RemapTownData {
  slug: string;
  name: string;
  county: string;
  region: string;
  country: string;
  pop: number;
  districts: string[];
  roads: string[];
  vehicles?: RemapCouncilVehicles | null;
  census?: RemapCensus | null;
  caz?: RemapCleanAirZone | null;
  /** Our vehicle remap pages for the diesel models most often MOT tested in the
   *  town's postcode area (DVSA MOT results), most tested first. */
  models?: { slug: string; name: string }[];
  modelsArea?: { postcodeArea: string; year: number };
  /** The town's AdBlue repair page, when one is published. */
  adblueSlug?: string;
  intro: string;
  driving: string;
  nearby: RemapTownPlace[];
  updated: string;
}

export interface RemapTownIndexEntry {
  slug: string;
  name: string;
  region: string;
}

export interface RemapTownStore {
  towns: Record<string, RemapTownData>;
  index: RemapTownIndexEntry[];
}

export const RemapTownDataContext = createContext<RemapTownStore | null>(null);

declare global {
  interface Window {
    __REMAP_TOWN__?: RemapTownData;
    __REMAP_TOWN_INDEX__?: RemapTownIndexEntry[];
  }
}

export const REMAP_TOWNS_PATH = '/ecu-remapping/areas';
export const remapTownPath = (slug: string) => `/ecu-remapping/${slug}`;
