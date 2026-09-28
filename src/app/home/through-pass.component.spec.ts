import { planThroughPass } from './through-pass.component';

describe('planThroughPass', () => {
  it('should run up the gap between side-by-side blocks, between the two defenders', () => {
    // Desktop: text on the left, card on the right, free strip at the bottom
    const layout = planThroughPass(
      { left: 80, top: 104, width: 616, height: 701 },
      { left: 790, top: 125, width: 524, height: 660 },
      1440,
      887
    )!;

    expect(layout.passer).toEqual({ x: 92, y: 846 });
    expect(layout.receiver).toEqual({ x: 743, y: 143 });
    expect(layout.path).toBe('M114 846C743 846 743 846 743 686L743 167');
    // Defenders on either side of the ball's line, halfway up the gap
    const [left, right] = layout.defenders;
    expect(left.y).toBe(right.y);
    expect(left.x).toBeLessThan(743);
    expect(right.x).toBeGreaterThan(743);
    expect(left.x).toBeGreaterThan(696);
    expect(right.x).toBeLessThan(790);
  });

  it('should start inside the gap if there is no free strip below the blocks', () => {
    const layout = planThroughPass(
      { left: 24, top: 100, width: 464, height: 600 },
      { left: 534, top: 100, width: 468, height: 600 },
      1024,
      710
    )!;

    expect(layout.path).toBe('M511 666L511 142');
  });

  it('should run across the gap between stacked blocks', () => {
    // Mobile: text above the card
    const layout = planThroughPass(
      { left: 24, top: 48, width: 342, height: 591 },
      { left: 22, top: 687, width: 346, height: 514 },
      390,
      1243
    )!;

    expect(layout.passer).toEqual({ x: 36, y: 663 });
    expect(layout.receiver).toEqual({ x: 354, y: 663 });
    expect(layout.path).toBe('M58 663L330 663');
    expect(layout.defenders[0].x).toBe(layout.defenders[1].x);
    expect(layout.defenders[0].y).toBeLessThan(663);
    expect(layout.defenders[1].y).toBeGreaterThan(663);
  });

  it('should not plan a pass without a usable gap', () => {
    expect(planThroughPass(
      { left: 24, top: 48, width: 342, height: 600 },
      { left: 22, top: 660, width: 346, height: 514 },
      390,
      1243
    )).toBeNull();
  });
});
