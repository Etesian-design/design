import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { SMALL, LEAVE_OUT } from '../src/stories/explorations/phone2/states';

describe('assistant declined (mock 19)', () => {
  it('has no assistant state and is listed as left out', () => {
    expect(SMALL).not.toContain('assistant');
    expect(LEAVE_OUT.some(([k]) => k === 'Assistant')).toBe(true);
  });
  it('never puts an assistant on the power key', () => {
    const vue = readFileSync('src/stories/explorations/phone2/PhoneV2.vue', 'utf8');
    expect(vue).not.toMatch(/Power long-press or Fn/);
  });
});
