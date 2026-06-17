import assert from 'node:assert/strict';
import test from 'node:test';
import { BOOTHS } from '../src/data/booths.ts';
import {
  LOCATION_CALIBRATION_POINTS,
  MAP_HEADING_OFFSET_DEG,
  MAP_UNITS_PER_METER,
  projectLocationToMap,
  toMapHeading,
} from '../src/utils/locationMapping.ts';

const METERS_PER_DEGREE_LATITUDE = 111_320;

test('Given calibrated GPS samples When projected Then they land on their booth markers', () => {
  for (const calibration of LOCATION_CALIBRATION_POINTS) {
    const booth = BOOTHS.find((item) => item.id === calibration.boothId);
    assert.ok(booth, `${calibration.boothId} booth should exist`);

    const projected = projectLocationToMap(calibration);

    assert.equal(projected.x, booth.x);
    assert.equal(projected.y, booth.y);
  }
});

test('Given raw compass heading facing G1 When converted Then it points west on the map', () => {
  assert.equal(toMapHeading(198.8), 270);
});

test('Given GPS moves away from G1 When projected Then the map marker also moves', () => {
  const g1 = LOCATION_CALIBRATION_POINTS.find((point) => point.boothId === 'G1');
  assert.ok(g1, 'G1 calibration point should exist');

  const projectedG1 = projectLocationToMap(g1);
  const rawHeadingForMapTop = 360 - MAP_HEADING_OFFSET_DEG;
  const movedLocation = offsetLocation(g1, 10, rawHeadingForMapTop);
  const projectedMoved = projectLocationToMap(movedLocation);

  assert.ok(Math.abs(projectedMoved.x - projectedG1.x) < 0.000001);
  assert.equal(
    Number(projectedMoved.y.toFixed(6)),
    Number((projectedG1.y - 10 * MAP_UNITS_PER_METER).toFixed(6)),
  );
  assert.ok(projectedMoved.y < projectedG1.y);
});

function offsetLocation(
  origin: { readonly latitude: number; readonly longitude: number },
  distanceMeters: number,
  headingDegrees: number,
): { readonly latitude: number; readonly longitude: number } {
  const headingRadians = headingDegrees * (Math.PI / 180);
  const north = Math.cos(headingRadians) * distanceMeters;
  const east = Math.sin(headingRadians) * distanceMeters;
  const metersPerDegreeLongitude =
    METERS_PER_DEGREE_LATITUDE *
    Math.cos(origin.latitude * (Math.PI / 180));

  return {
    latitude: origin.latitude + north / METERS_PER_DEGREE_LATITUDE,
    longitude: origin.longitude + east / metersPerDegreeLongitude,
  };
}
