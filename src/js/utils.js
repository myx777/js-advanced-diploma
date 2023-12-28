/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // номер строки, в которой находится клетка
  const row = Math.floor(index / boardSize); 
  // номер столобца, в которой находится клетка
  const column = index % boardSize;

  if(row === 0 && column === 0) {
    return 'top-left';
  }

  if(row === 0 && column === boardSize - 1) {
    return 'top-right';
  }

  if(row === 0) {
    return 'top';
  }

  if(row === boardSize - 1 && column === 0) {
    return 'bottom-left';
  }
  if(row === boardSize - 1 && column === boardSize - 1) {
    return 'bottom-right';
  }

  if(row === boardSize - 1) {
    return 'bottom';
  }

  if(column === 0) {
    return 'left';
  }
  if(column === boardSize - 1) {
    return 'right';
  }
  return 'center'
}


export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
