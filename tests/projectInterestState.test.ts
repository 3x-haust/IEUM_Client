import assert from 'node:assert/strict';
import test from 'node:test';
import {
  settleProjectInterestSave,
  toggleProjectInterest,
  type ProjectInterestState,
} from '../src/sections/projectInterestState.ts';

test('Given pending interest save When user taps heart again Then it cancels immediately', () => {
  const state: ProjectInterestState = {
    projectId: 'project-c2',
    interested: true,
    saving: true,
  };

  const result = toggleProjectInterest('project-c2', state);

  assert.deepEqual(result, {
    state: {
      projectId: 'project-c2',
      interested: false,
      saving: false,
    },
    shouldPersistInterest: false,
    shouldRequestInterest: false,
  });
});

test('Given user canceled interest When stale save resolves Then it keeps canceled state', () => {
  const state: ProjectInterestState = {
    projectId: 'project-c2',
    interested: false,
    saving: false,
  };

  const result = settleProjectInterestSave({
    activeRequestId: 2,
    fallbackInterested: false,
    projectId: 'project-c2',
    requestId: 1,
    state,
  });

  assert.deepEqual(result, state);
});
