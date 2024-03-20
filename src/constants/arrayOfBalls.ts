import { getRandomColor } from './getRandomColor';
const BALL_RADIUS = 20;

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  friction: number;
  selected: boolean;
  mass: number;
}

export const arrayOfBalls: Ball[] = [
  {
    x: 800 / 2 + BALL_RADIUS,
    y: 60 + BALL_RADIUS,
    dx: 0,
    dy: 0,
    radius: BALL_RADIUS,
    color: getRandomColor(),
    friction: 0.99,
    selected: false,
    mass: Math.PI * 20 * 20,
  },
  {
    x: 800 / 2 - BALL_RADIUS,
    y: 60 + BALL_RADIUS,
    dx: 0,
    dy: 0,
    radius: BALL_RADIUS,
    color: getRandomColor(),
    friction: 0.99,
    selected: false,
    mass: Math.PI * 20 * 20,
  },
  {
    x: 800 / 2,
    y: 60 + BALL_RADIUS,
    dx: 0,
    dy: 0,
    radius: BALL_RADIUS,
    color: getRandomColor(),
    friction: 0.99,
    selected: false,
    mass: Math.PI * 20 * 20,
  },
  {
    x: 800 / 2 - BALL_RADIUS,
    y: 90 + BALL_RADIUS,
    dx: 0,
    dy: 0,
    radius: BALL_RADIUS,
    color: getRandomColor(),
    friction: 0.99,
    selected: false,
    mass: Math.PI * 20 * 20,
  },
  {
    x: 800 / 2 + BALL_RADIUS,
    y: 90 + BALL_RADIUS,
    dx: 0,
    dy: 0,
    radius: BALL_RADIUS,
    color: getRandomColor(),
    friction: 0.99,
    selected: false,
    mass: Math.PI * 20 * 20,
  },
  {
    x: 800 / 2,
    y: 120 + BALL_RADIUS,
    dx: 0,
    dy: 0,
    radius: BALL_RADIUS,
    color: getRandomColor(),
    friction: 0.99,
    selected: false,
    mass: Math.PI * 20 * 20,
  },

  {
    x: 800 / 2,
    y: 400,
    dx: 0,
    dy: 0,
    radius: BALL_RADIUS,
    color: getRandomColor(),
    friction: 0.99,
    selected: false,
    mass: Math.PI * 20 * 20,
  },
];
