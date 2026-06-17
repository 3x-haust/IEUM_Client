import { BOOTHS } from '../data/booths.ts';

export interface GeoLocationPoint {
  readonly latitude: number;
  readonly longitude: number;
}

export interface MapLocationPoint {
  readonly x: number;
  readonly y: number;
}

type CompassEvent = DeviceOrientationEvent & {
  readonly webkitCompassHeading?: number;
};

const METERS_PER_DEGREE_LATITUDE = 111_320;
const CALIBRATION_EPSILON_METERS = 0.02;
const RAW_HEADING_FACING_G1_DEG = 198.8;
const MAP_HEADING_FACING_G1_DEG = 270;
const ESTIMATED_G1_TO_G7_METERS = 18;
const MAX_PROJECTED_DISTANCE_METERS = 85;

const RAW_CALIBRATION_POINTS = [
  { boothId: 'G1', latitude: 37.4662117, longitude: 126.9318716 },
  { boothId: 'F-6', latitude: 37.4662809, longitude: 126.9318793 },
  { boothId: 'B-1', latitude: 37.4662813, longitude: 126.9318793 },
  { boothId: 'D-3', latitude: 37.4662815, longitude: 126.9318793 },
] as const;

export const LOCATION_CALIBRATION_POINTS = RAW_CALIBRATION_POINTS.map((point) => {
  const booth = BOOTHS.find((item) => item.id === point.boothId);
  if (!booth) {
    throw new Error(`Missing location calibration booth: ${point.boothId}`);
  }
  return {
    ...point,
    x: booth.x,
    y: booth.y,
  };
});

const G1_CALIBRATION_POINT = findCalibrationPoint('G1');
const G1_BOOTH = findBooth('G1');
const G7_BOOTH = findBooth('G7');

export const MAP_HEADING_OFFSET_DEG = normalizeDegrees(
  MAP_HEADING_FACING_G1_DEG - RAW_HEADING_FACING_G1_DEG,
);
export const MAP_UNITS_PER_METER =
  Math.abs(G7_BOOTH.y - G1_BOOTH.y) / ESTIMATED_G1_TO_G7_METERS;

export function projectLocationToMap(
  location: GeoLocationPoint,
): MapLocationPoint {
  for (const point of LOCATION_CALIBRATION_POINTS) {
    const distance = distanceMeters(location, point);
    if (distance <= CALIBRATION_EPSILON_METERS) {
      return { x: point.x, y: point.y };
    }
  }

  const delta = deltaMeters(G1_CALIBRATION_POINT, location);
  const distance = Math.min(
    Math.hypot(delta.east, delta.north),
    MAX_PROJECTED_DISTANCE_METERS,
  );
  if (distance === 0) return { x: G1_BOOTH.x, y: G1_BOOTH.y };

  const rawHeading = normalizeDegrees(
    Math.atan2(delta.east, delta.north) * (180 / Math.PI),
  );
  const mapHeading = toMapHeading(rawHeading) ?? 0;
  const mapHeadingRad = mapHeading * (Math.PI / 180);
  const mapDistance = distance * MAP_UNITS_PER_METER;

  return {
    x: clamp01(G1_BOOTH.x + Math.sin(mapHeadingRad) * mapDistance),
    y: clamp01(G1_BOOTH.y - Math.cos(mapHeadingRad) * mapDistance),
  };
}

export function toMapHeading(rawHeading: number | null): number | null {
  return rawHeading === null
    ? null
    : normalizeDegrees(rawHeading + MAP_HEADING_OFFSET_DEG);
}

export function readCompassHeading(
  event: DeviceOrientationEvent,
): number | null {
  const compassEvent = event as CompassEvent;
  if (typeof compassEvent.webkitCompassHeading === 'number') {
    return compassEvent.webkitCompassHeading;
  }
  if (typeof compassEvent.alpha === 'number') {
    return normalizeDegrees(360 - compassEvent.alpha);
  }
  return null;
}

function distanceMeters(a: GeoLocationPoint, b: GeoLocationPoint): number {
  const delta = deltaMeters(a, b);
  return Math.hypot(delta.east, delta.north);
}

function findCalibrationPoint(
  boothId: string,
): (typeof LOCATION_CALIBRATION_POINTS)[number] {
  const point = LOCATION_CALIBRATION_POINTS.find((item) => item.boothId === boothId);
  if (!point) {
    throw new Error(`Missing location calibration point: ${boothId}`);
  }
  return point;
}

function findBooth(boothId: string): (typeof BOOTHS)[number] {
  const booth = BOOTHS.find((item) => item.id === boothId);
  if (!booth) {
    throw new Error(`Missing location calibration booth: ${boothId}`);
  }
  return booth;
}

function deltaMeters(
  from: GeoLocationPoint,
  to: GeoLocationPoint,
): { readonly east: number; readonly north: number } {
  const meanLatitude = ((from.latitude + to.latitude) / 2) * (Math.PI / 180);
  const metersPerDegreeLongitude =
    METERS_PER_DEGREE_LATITUDE * Math.cos(meanLatitude);
  return {
    east: (to.longitude - from.longitude) * metersPerDegreeLongitude,
    north: (to.latitude - from.latitude) * METERS_PER_DEGREE_LATITUDE,
  };
}

function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
