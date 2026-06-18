import assert from 'node:assert/strict';
import test from 'node:test';
import { toOptimizedImagePath } from '../src/utils/imageAssets.ts';

test('Given empty thumbnail path When optimizing image path Then it stays empty', () => {
  assert.equal(toOptimizedImagePath(null), null);
  assert.equal(toOptimizedImagePath(undefined), null);
});

test('Given legacy png project path When optimizing image path Then it uses webp', () => {
  assert.equal(
    toOptimizedImagePath('/assets/projects/35.png'),
    '/assets/projects/35.webp',
  );
});
