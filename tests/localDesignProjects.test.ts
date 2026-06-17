import assert from 'node:assert/strict';
import test from 'node:test';
import { findLocalDesignProjectByBooth } from '../src/api/localDesignProjects.ts';
import { BOOTHS } from '../src/data/booths.ts';

test('Given design booths When resolving local projects Then A-3 and F-4 are available', () => {
  const expectedProjects = new Map([
    ['A-3', '글자방'],
    ['F-4', 'COURTIN'],
  ]);

  for (const [slot, serviceName] of expectedProjects) {
    const booth = BOOTHS.find((item) => item.title === slot);

    assert.ok(booth, `${slot} booth should exist`);
    assert.equal(booth.aux, undefined);
    assert.equal(booth.serviceName, serviceName);

    const project = findLocalDesignProjectByBooth(
      booth.title,
      booth.serviceName,
    );

    assert.ok(project, `${slot} should resolve to a local design project`);
    assert.equal(project.boothSlot, slot);
    assert.equal(project.serviceName, serviceName);
  }
});
