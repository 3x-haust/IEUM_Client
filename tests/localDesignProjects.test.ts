import assert from 'node:assert/strict';
import test from 'node:test';
import { findLocalDesignProjectByBooth } from '../src/api/localDesignProjects.ts';
import { BOOTHS } from '../src/data/booths.ts';

test('Given design booths When resolving local projects Then every design booth is available', () => {
  const expectedProjects = new Map([
    ['A-1', 'INFLOW'],
    ['A-2', 'S. F. O. C.'],
    ['A-3', '글자방'],
    ['A-4', 'MONODE'],
    ['A-5', 'REQUORD'],
    ['B-1', 'Last check-in'],
    ['B-2', 'Lazie5'],
    ['B-3', '또몽'],
    ['B-4', 'bivy'],
    ['B-5', '놀다보니'],
    ['C-1', 'Seumim'],
    ['C-2', '디깃(Dig-it!)'],
    ['C-3', 'BOOKIE'],
    ['C-4', 'StepIn'],
    ['C-5', '퇴근전쟁'],
    ['D-1', 'veritas'],
    ['D-2', '시선'],
    ['D-3', 'DECKA'],
    ['D-4', '하우브'],
    ['D-5', '퐁당'],
    ['E-1', '십만원권'],
    ['E-2', '스위트룸'],
    ['E-3', '모두와 함께하는 마을'],
    ['E-4', 'Big Wing'],
    ['E-5', '인생을 나답게 반스'],
    ['E-6', 'DESINTO'],
    ['F-1', 'F1rst'],
    ['F-2', '두리번'],
    ['F-3', '오케'],
    ['F-4', 'COURTIN'],
    ['F-5', 'WORLD IN TIME'],
    ['F-6', 'Refab'],
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
