import { calcTileType } from '../utils';

// data-driven tests
describe('calcTileType()', () => {
  test.each([
    [0, 8, 'top-left'],
    [7, 8, 'top-right'],
    [90, 10, 'bottom-left'],
    [99, 10, 'bottom-right'],
    [5, 10, 'top'],
    [10, 10, 'left'],
    [51, 8, 'center'],
  ])('position (%d) on board size (%d) should be %s', (index, boardSize, expected) => {
    expect(calcTileType(index, boardSize)).toEqual(expected);
  });
});
