import { describe, it, expect } from 'vitest';
import { helloShared } from './index';

describe('helloShared', () => {
  it('returns phrase', () => {
    expect(helloShared()).toBe('shared works');
  });
});