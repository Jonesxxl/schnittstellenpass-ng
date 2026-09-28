import { PassLayout, ballPentagons, createPassScene, planThroughPass, rotate } from './through-pass.scene';

describe('planThroughPass', () => {
  it('should play the ball up the gap between side-by-side blocks', () => {
    // Desktop: text on the left, card on the right, free strip at the bottom
    const layout = planThroughPass(
      { left: 80, top: 104, width: 616, height: 701 },
      { left: 790, top: 125, width: 524, height: 660 },
      1440,
      887
    )!;

    // Players sized so that defenders, ball and receiver fit into the 94px gap
    expect(layout.scale).toBeCloseTo(0.792, 3);
    expect(layout.spread).toBeCloseTo(17.85, 2);
    expect(layout.start.x).toBeCloseTo(739.8, 1);
    expect(layout.start.y).toBe(833);
    // Room to carry the ball on after the reception
    expect(layout.end.x).toBeCloseTo(745.4, 1);
    expect(layout.end.y).toBeCloseTo(199.5, 1);
  });

  it('should kick off inside the gap if there is no free strip below the blocks', () => {
    const layout = planThroughPass(
      { left: 24, top: 100, width: 464, height: 600 },
      { left: 534, top: 100, width: 468, height: 600 },
      1024,
      710
    )!;

    expect(layout.scale).toBe(0.6);
    expect(layout.start.y).toBeCloseTo(690.4, 1);
  });

  it('should play the ball across the gap between stacked blocks', () => {
    // Mobile: text above the card with a 112px gap
    const layout = planThroughPass(
      { left: 24, top: 48, width: 342, height: 591 },
      { left: 22, top: 751, width: 346, height: 514 },
      390,
      1307
    )!;

    expect(layout.scale).toBeCloseTo(0.951, 3);
    expect(layout.start.x).toBeCloseTo(77.2, 1);
    expect(layout.end.x).toBeCloseTo(280.4, 1);
    expect(layout.start.y).toBe(695);
    expect(layout.end.y).toBe(695);
  });

  it('should not plan a pass without a usable gap', () => {
    expect(planThroughPass(
      { left: 24, top: 48, width: 342, height: 600 },
      { left: 22, top: 696, width: 346, height: 514 },
      390,
      1243
    )).toBeNull();
  });
});

describe('createPassScene', () => {
  const layout: PassLayout = { start: { x: 740, y: 830 }, end: { x: 740, y: 160 }, scale: 1, spread: 24 };
  const scene = createPassScene(layout);
  const times = Array.from({ length: Math.floor(scene.duration * 60) }, (_, index) => index / 60);

  it('should keep the ball still until the kick, then roll it to the receiver', () => {
    expect(scene.frame(0).ball).toEqual(jasmine.objectContaining({ x: 740, y: 830, distance: 0 }));
    expect(scene.frame(scene.kickTime).ball.y).toBe(830);
    expect(scene.frame(scene.receptionTime).ball.y).toBeCloseTo(160, 5);
  });

  it('should slow the ball down while it rolls', () => {
    const at = (time: number) => scene.frame(time).ball.distance;
    const early = at(scene.kickTime + 0.1) - at(scene.kickTime);
    const late = at(scene.receptionTime) - at(scene.receptionTime - 0.1);

    expect(early).toBeGreaterThan(late * 3);
  });

  it('should bring the passer to the ball for the kick', () => {
    const { players: [passer], ball } = scene.frame(scene.kickTime);

    expect(Math.hypot(passer.x - ball.x, passer.y - ball.y)).toBeLessThan(15);
    expect(passer.kick).toBeGreaterThan(0.95);
  });

  it('should let the ball overtake the receiver on the outside, then let him run onto it', () => {
    let overtaken = false;
    let previous = scene.frame(scene.kickTime).players[1];
    for (const time of times.filter(t => t > scene.kickTime && t <= scene.receptionTime)) {
      const { players: [, receiver], ball } = scene.frame(time);
      // The pass goes upwards: behind the ball means further down
      const behind = receiver.y - ball.y;
      if (!overtaken && behind >= 8.9) {
        overtaken = true;
        // Far enough to the side not to touch: half a player plus the ball
        expect(Math.abs(receiver.x - ball.x)).toBeGreaterThan(12.4 + 6.8);
      }
      if (overtaken) {
        expect(behind).toBeGreaterThan(8.9);
      }
      // No jumps: at most a sprint of 600px/s
      expect(Math.hypot(receiver.x - previous.x, receiver.y - previous.y)).toBeLessThan(600 / 60);
      previous = receiver;
    }
    expect(overtaken).toBeTrue();
  });

  it('should let the receiver meet the ball and keep it at his feet', () => {
    for (const time of [scene.receptionTime, scene.receptionTime + 0.4, scene.duration - 0.1]) {
      const { players: [, receiver], ball } = scene.frame(time);
      expect(Math.hypot(receiver.x - ball.x, receiver.y - ball.y)).toBeCloseTo(9, 5);
    }
  });

  it('should let the defenders chase only once the ball is past them', () => {
    const lineY = scene.frame(0).players[2].y;
    for (const time of times) {
      const { players: [, , left, right], ball } = scene.frame(time);
      if (ball.y > lineY) {
        // Still shuffling on their line, not yet running after the ball
        expect(Math.abs(left.y - lineY)).toBeLessThan(0.5);
        expect(Math.abs(right.y - lineY)).toBeLessThan(0.5);
      }
    }
    expect(scene.frame(scene.duration - 0.6).players[2].y).toBeLessThan(lineY - 50);
  });

  it('should let the ball pass between the defenders without touching them', () => {
    // Half a player is 12.5 units wide, the ball has a radius of 6.8
    const { players: [, , left, right] } = scene.frame(scene.kickTime);

    expect(740 - left.x - 12.5 - 6.8).toBeGreaterThan(0);
    expect(right.x - 740 - 12.5 - 6.8).toBeGreaterThan(0);
  });

  it('should never let two players run into each other', () => {
    for (const time of times) {
      const { players } = scene.frame(time);
      for (const [index, player] of players.entries()) {
        for (const other of players.slice(index + 1)) {
          // Shoulders are 25 units wide, bodies 14 deep
          expect(Math.hypot(player.x - other.x, player.y - other.y)).toBeGreaterThan(14);
        }
      }
    }
  });

  it('should fade in and out so the loop can restart', () => {
    expect(scene.frame(0).opacity).toBe(0);
    expect(scene.frame(scene.receptionTime).opacity).toBe(1);
    expect(scene.frame(scene.duration).opacity).toBe(0);
  });
});

describe('ballPentagons', () => {
  it('should describe 12 regular pentagons on the unit sphere', () => {
    const pentagons = ballPentagons();

    expect(pentagons.length).toBe(12);
    for (const [centre, ...corners] of pentagons) {
      expect(corners.length).toBe(5);
      for (const [index, corner] of corners.entries()) {
        const next = corners[(index + 1) % 5];
        expect(Math.hypot(...corner)).toBeCloseTo(1, 9);
        // Neighbouring corners in order around the centre, all at the same distance from it
        expect(Math.hypot(corner[0] - next[0], corner[1] - next[1], corner[2] - next[2])).toBeCloseTo(0.4035, 3);
        expect(Math.hypot(corner[0] - centre[0], corner[1] - centre[1], corner[2] - centre[2])).toBeCloseTo(0.3486, 3);
      }
    }
  });

  it('should roll the top of the ball in the direction of travel', () => {
    // Ball moving to the right: the point facing the viewer (z = -1) moves right
    const [x, , z] = rotate([0, 0, -1], [0, -1, 0], 0.1);

    expect(x).toBeGreaterThan(0.09);
    expect(z).toBeLessThan(0);
  });
});
