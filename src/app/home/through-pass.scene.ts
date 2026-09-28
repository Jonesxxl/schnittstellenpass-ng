/**
 * Geometry and choreography of the hero's through pass ("Schnittstellenpass"),
 * seen from above: a passer runs up and plays the ball through the gap between
 * two defenders, the receiver times his run and takes the ball in his stride,
 * the defenders only turn once the ball is past them. Framework free, so the
 * choreography can be tested without a browser.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PassLayout {
  // Where the ball is kicked and where the receiver takes it
  start: Point;
  end: Point;
  // Size of players and ball; 1 means 25px shoulders
  scale: number;
  // Distance of each defender from the line of the pass
  spread: number;
}

// Distance in player units the receiver carries the ball after taking it
const CARRY = 60;

/**
 * Size and defender spacing for a lane of the given width: the ball must pass
 * between the defenders and the receiver outside of one of them, all within
 * the lane. Across the lane that takes 56.8 player units plus some margin.
 */
function fitLane(width: number): Pick<PassLayout, 'scale' | 'spread'> {
  const scale = clamp((width / 2 - 2) / 56.8, 0.6, 1.1);
  return { scale, spread: 20 * scale + 2 };
}

export interface PlayerPose {
  x: number;
  y: number;
  // Facing direction in radians (screen coordinates)
  angle: number;
  // Leg swing from -1 to 1 while running
  stride: number;
  // Kicking leg from -0.5 (wind-up) to 1 (strike)
  kick: number;
}

export interface Frame {
  opacity: number;
  // distance: how far the ball has rolled, for its spin
  ball: Point & { distance: number };
  // Passer, receiver, left defender, right defender
  players: [PlayerPose, PlayerPose, PlayerPose, PlayerPose];
}

export interface PassScene {
  duration: number;
  kickTime: number;
  receptionTime: number;
  // Direction of the pass
  direction: Point;
  ballRadius: number;
  frame(time: number): Frame;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const clamp01 = (value: number) => clamp(value, 0, 1);
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const sineInOut = (progress: number) => (1 - Math.cos(Math.PI * clamp01(progress))) / 2;
const easeIn = (progress: number) => clamp01(progress) ** 2;
const easeOut = (progress: number) => 1 - (1 - clamp01(progress)) ** 2;

/**
 * Plans the pass through the gap between two blocks of the hero: up the gap
 * when they sit side by side, across it when they are stacked. Coordinates are
 * relative to the area of the given size; null if there is no usable gap.
 */
export function planThroughPass(first: Box, second: Box, width: number, height: number): PassLayout | null {
  const firstRight = first.left + first.width;
  const firstBottom = first.top + first.height;
  const secondBottom = second.top + second.height;

  const gapWidth = second.left - firstRight;
  if (gapWidth >= 32) {
    const x = (firstRight + second.left) / 2;
    const { scale, spread } = fitLane(gapWidth);
    const top = Math.max(first.top, second.top);
    const bottom = Math.min(firstBottom, secondBottom);
    const stripTop = Math.max(firstBottom, secondBottom);
    // Kick in the free strip below both blocks, else at the bottom of the gap
    const startY = height - stripTop >= 40 ? stripTop + Math.min(28, (height - stripTop) / 2) : bottom - 16 * scale;
    return {
      start: { x: x - 4 * scale, y: startY },
      // Leave room to carry the ball on after the reception
      end: { x: x + 3 * scale, y: top + (34 + CARRY) * scale },
      scale,
      spread
    };
  }

  const gapHeight = second.top - firstBottom;
  if (gapHeight >= 60) {
    const y = (firstBottom + second.top) / 2;
    const { scale, spread } = fitLane(gapHeight);
    return {
      start: { x: first.left + 56 * scale, y },
      end: { x: Math.min(width - 24, firstRight) - (30 + CARRY) * scale, y },
      scale,
      spread
    };
  }

  return null;
}

// Local coordinates: along the pass and across it (negative towards the first block)
type Local = [along: number, across: number];

export function createPassScene(layout: PassLayout): PassScene {
  const { start, end, scale, spread } = layout;
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  const direction = { x: (end.x - start.x) / length, y: (end.y - start.y) / length };
  const toScreen = ([along, across]: Local): Point => ({
    x: start.x + direction.x * along - direction.y * across,
    y: start.y + direction.y * along + direction.x * across
  });

  // Timing in seconds
  const kickTime = 1.3;
  const passTime = clamp(length / 520, 0.8, 1.4);
  const receptionTime = kickTime + passTime;
  const runStart = kickTime - 0.15;
  const duration = receptionTime + 1.1 + 1.2 + 0.5;

  // The ball slows down by rolling friction and reaches the receiver after passTime
  const friction = 1.7;
  const kickSpeed = (length * friction) / (1 - Math.exp(-friction * passTime));
  const rolled = (time: number) => (kickSpeed / friction) * (1 - Math.exp(-friction * (time - kickTime)));
  const line = length * 0.5;
  const passesLine = kickTime - Math.log(1 - (line * friction) / kickSpeed) / friction;
  const reactTime = passesLine + 0.15;
  const footGap = 9 * scale;
  const carry = CARRY * scale;

  // The defensive line shuffles until the ball is played
  const shuffle = (time: number) => 1.6 * scale * Math.sin(2 * Math.PI * 0.9 * time);

  const passer = (time: number): Local => {
    if (time <= kickTime) {
      const progress = sineInOut((time - 0.3) / (kickTime - 0.3));
      return [lerp(-52 * scale, -10 * scale, progress), lerp(-20 * scale, -5 * scale, progress)];
    }
    const progress = easeOut((time - kickTime) / 0.7);
    return [lerp(-10 * scale, 4 * scale, progress), lerp(-5 * scale, -4 * scale, progress)];
  };

  // The receiver starts onside, outside the defender on the side of the first
  // block. He sets off slowly, so the much faster ball overtakes him on the
  // outside, then sprints behind the defence onto it
  const outside = -(spread + 25 * scale);
  const receiverFrom: Local = [line - 30 * scale, outside + shuffle(runStart) / 2];
  const receiverBend: Local = [line + 0.4 * (length - line), outside];
  const receiverTo: Local = [length - footGap, 0];
  const receiverRun = (time: number): Local => {
    const p = clamp01((time - runStart) / (receptionTime - runStart)) ** 1.6;
    return [
      (1 - p) ** 2 * receiverFrom[0] + 2 * (1 - p) * p * receiverBend[0] + p ** 2 * receiverTo[0],
      (1 - p) ** 2 * receiverFrom[1] + 2 * (1 - p) * p * receiverBend[1] + p ** 2 * receiverTo[1]
    ];
  };
  // Once the ball is past him he runs onto it and never overtakes it again
  let overtaken = kickTime;
  while (overtaken < receptionTime && rolled(overtaken) - footGap < receiverRun(overtaken)[0]) {
    overtaken += 1 / 480;
  }
  const approach = (time: number): Local => {
    const [along, across] = receiverRun(time);
    return [time >= overtaken ? Math.min(along, rolled(time) - footGap) : along, across];
  };
  // He takes the ball in his stride and slows down with it at his feet
  const arrivalSpeed = (approach(receptionTime)[0] - approach(receptionTime - 1 / 240)[0]) * 240;
  const slowDown = Math.max(arrivalSpeed, 1) / carry;
  const carried = (time: number) => carry * (1 - Math.exp(-slowDown * (time - receptionTime)));

  const ballAlong = (time: number) => {
    if (time <= kickTime) {
      return 0;
    }
    return time < receptionTime ? rolled(time) : length + carried(time);
  };
  const receiver = (time: number): Local => {
    if (time <= runStart) {
      return [receiverFrom[0], outside + shuffle(time) / 2];
    }
    return time <= receptionTime ? approach(time) : [receiverTo[0] + carried(time), 0];
  };

  // The defender on the receiver's side chases him, the other one covers
  const defender = (side: -1 | 1) => (time: number): Local => {
    if (time <= reactTime) {
      return [line, side * spread + shuffle(time)];
    }
    const progress = easeIn((time - reactTime) / (receptionTime + 0.9 - reactTime));
    const chase = side < 0 ? 0.45 : 0.3;
    return [lerp(line, line + chase * (length - line), progress), lerp(side * spread + shuffle(reactTime), side * spread * 0.6, progress)];
  };

  // Wind-up, strike (the foot meets the ball at the kick) and back
  const kickCurve = (time: number) => {
    const offset = time - kickTime;
    if (offset < -0.16 || offset > 0.3) {
      return 0;
    }
    if (offset < -0.06) {
      return -0.5 * easeOut((offset + 0.16) / 0.1);
    }
    if (offset < 0) {
      return lerp(-0.5, 1, (offset + 0.06) / 0.06);
    }
    return 1 - sineInOut(offset / 0.3);
  };

  // Distance run by each player, sampled in advance for the stride of the legs
  const movers = [passer, receiver, defender(-1), defender(1)];
  const step = 1 / 120;
  const samples = Math.ceil(duration / step) + 1;
  const run = movers.map(position => {
    const distances = new Float64Array(samples);
    let previous = toScreen(position(0));
    for (let index = 1; index < samples; index++) {
      const current = toScreen(position(index * step));
      distances[index] = distances[index - 1] + Math.hypot(current.x - previous.x, current.y - previous.y);
      previous = current;
    }
    return distances;
  });
  const distanceRun = (mover: number, time: number) => {
    const exact = clamp(time, 0, duration) / step;
    const index = Math.min(Math.floor(exact), samples - 2);
    return lerp(run[mover][index], run[mover][index + 1], exact - index);
  };

  const pose = (mover: number, time: number, ball: Point): PlayerPose => {
    const position = toScreen(movers[mover](time));
    const before = toScreen(movers[mover](time - 1 / 120));
    const after = toScreen(movers[mover](time + 1 / 120));
    const velocity = { x: (after.x - before.x) * 60, y: (after.y - before.y) * 60 };
    const speed = Math.hypot(velocity.x, velocity.y);
    // Standing players watch the ball, running players face where they run
    const look = Math.atan2(ball.y - position.y, ball.x - position.x);
    const heading = Math.atan2(velocity.y, velocity.x);
    const turn = Math.atan2(Math.sin(heading - look), Math.cos(heading - look));
    return {
      ...position,
      angle: look + turn * clamp01(speed / (60 * scale)),
      stride: clamp01(speed / (150 * scale)) * Math.sin((2 * Math.PI * distanceRun(mover, time)) / (26 * scale)),
      kick: mover === 0 ? kickCurve(time) : 0
    };
  };

  return {
    duration,
    kickTime,
    receptionTime,
    direction,
    ballRadius: 6.8 * scale,
    frame(time: number): Frame {
      const along = ballAlong(time);
      const ball = toScreen([along, 0]);
      return {
        opacity: Math.min(clamp01(time / 0.35), 1 - clamp01((time - (duration - 0.5)) / 0.5)),
        ball: { ...ball, distance: along },
        players: [pose(0, time, ball), pose(1, time, ball), pose(2, time, ball), pose(3, time, ball)]
      };
    }
  };
}

type Vector3 = [number, number, number];

const normalize = ([x, y, z]: Vector3): Vector3 => {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
};

/**
 * The 12 black pentagons of a classic football (truncated icosahedron), each
 * as its centre followed by its five corners on the unit sphere. Slightly
 * turned so the ball does not start with a pentagon dead centre.
 */
export function ballPentagons(): Vector3[][] {
  const phi = (1 + Math.sqrt(5)) / 2;
  const vertices: Vector3[] = [
    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
    [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
  ];
  const tilt = (vector: Vector3) => rotate(rotate(vector, [1, 0, 0], 0.5), [0, 1, 0], 0.3);
  return vertices.map(vertex => {
    const centre = normalize(vertex);
    // Corners lie a third of the way along each edge of the icosahedron
    const corners = vertices
      .filter(other => Math.abs((other[0] - vertex[0]) ** 2 + (other[1] - vertex[1]) ** 2 + (other[2] - vertex[2]) ** 2 - 4) < 1e-9)
      .map(other => normalize([
        vertex[0] + (other[0] - vertex[0]) / 3,
        vertex[1] + (other[1] - vertex[1]) / 3,
        vertex[2] + (other[2] - vertex[2]) / 3
      ]));
    // Order the corners around the centre
    const reference = corners[0];
    const cross = (a: Vector3, b: Vector3): Vector3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const dot = (a: Vector3, b: Vector3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const angle = (corner: Vector3) => Math.atan2(dot(cross(reference, corner), centre), dot(reference, corner) - dot(reference, centre) * dot(corner, centre));
    return [centre, ...corners.sort((a, b) => angle(a) - angle(b))].map(tilt);
  });
}

/**
 * Rotates a vector around a unit axis (Rodrigues' formula)
 */
export function rotate([x, y, z]: Vector3, [ax, ay, az]: Vector3, angle: number): Vector3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dot = (ax * x + ay * y + az * z) * (1 - cos);
  return [
    x * cos + (ay * z - az * y) * sin + ax * dot,
    y * cos + (az * x - ax * z) * sin + ay * dot,
    z * cos + (ax * y - ay * x) * sin + az * dot
  ];
}
