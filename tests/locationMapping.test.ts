import assert from 'node:assert/strict';
import test from 'node:test';
import { BOOTHS } from '../src/data/booths.ts';
import {
  LOCATION_CALIBRATION_POINTS,
  projectLocationToMap,
  toMapHeading,
} from '../src/utils/locationMapping.ts';

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
