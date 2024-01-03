import Team from './Team';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const minLevel = 1;

  while (true) { // для бесконечного вызова генератора
    // рандомный уровень
    const level = Math.floor(Math.random() * (maxLevel - minLevel + 1) + minLevel);

    // рандомный класс
    const randomIndex = Math.floor(Math.random() * allowedTypes.length);
    const CharacterClass = allowedTypes[randomIndex];

    const character = new CharacterClass(level); // Создаем экземпляр класса с уровнем

    yield character;
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  const playerGenerator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i <= characterCount; i += 1) {
    team.push(playerGenerator.next().value);
  }

  return new Team(team);
}
