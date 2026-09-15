import { describe, expect, it } from 'vitest';
import * as Fantasia from '../../index';

describe('component exports', () => {
  it('should expose marquee, steps and upload components', () => {
    expect(Fantasia.FMarquee).toBeDefined();
    expect(Fantasia.FSteps).toBeDefined();
    expect(Fantasia.FUpload).toBeDefined();
  });
});
