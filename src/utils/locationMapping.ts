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
const IDW_POWER = 4;
const CALIBRATION_EPSILON_METERS = 0.02;
const RAW_HEADING_FACING_G1_DEG = 198.8;
const MAP_HEADING_FACING_G1_DEG = 270;

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

export const MAP_HEADING_OFFSET_DEG = normalizeDegrees(
  MAP_HEADING_FACING_G1_DEG - RAW_HEADING_FACING_G1_DEG,
);

export function projectLocationToMap(
  location: GeoLocationPoint,
): MapLocationPoint {
  let weightSum = 0;
  let weightedX = 0;
  let weightedY = 0;

  for (const point of LOCATION_CALIBRATION_POINTS) {
    const distance = distanceMeters(location, point);
    if (distance <= CALIBRATION_EPSILON_METERS) {
      return { x: point.x, y: point.y };
    }

    const weight = 1 / Math.max(Math.pow(distance, IDW_POWER), Number.EPSILON);
    weightSum += weight;
    weightedX += point.x * weight;
    weightedY += point.y * weight;
  }

  return {
    x: clamp01(weightedX / weightSum),
    y: clamp01(weightedY / weightSum),
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
  const meanLatitude = ((a.latitude + b.latitude) / 2) * (Math.PI / 180);
  const metersPerDegreeLongitude =
    METERS_PER_DEGREE_LATITUDE * Math.cos(meanLatitude);
  const dx = (a.longitude - b.longitude) * metersPerDegreeLongitude;
  const dy = (a.latitude - b.latitude) * METERS_PER_DEGREE_LATITUDE;
  return Math.hypot(dx, dy);
}

function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
