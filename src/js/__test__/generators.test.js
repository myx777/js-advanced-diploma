import { characterGenerator, generateTeam } from '../generators';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Character from '../Character';

test('does the characterGenerator generate infinitely new characters from the list (taking into account the allowedTypes argument)', () => {
  const allowedTypes = [Bowman, Swordsman, Magician];
  const maxLevel = 5;
  const generator = characterGenerator(allowedTypes, maxLevel);
  const iterator = generator[Symbol.iterator]();
  const numberRepeat = Math.trunc(Math.random() * 100);
  const team = [];
  for (let i = 0; i < numberRepeat; i += 1) {
    const character = iterator.next().value;

    expect(character).toBeInstanceOf(Character); // Проверяем, что созданный персонаж является экземпляром базового класса Character
    expect(allowedTypes).toContain(character.constructor); // Проверяем, что класс персонажа находится в списке разрешенных типов
    expect(character.level).toBeGreaterThanOrEqual(1); // Проверяем, что уровень персонажа больше или равен 1
    expect(character.level).toBeLessThanOrEqual(maxLevel); // Проверяем, что уровень персонажа меньше или равен максимальному уровню
    team.push(character);
  }

  expect(team.length).toEqual(numberRepeat);// Проверяем создает ли заданное число персонажей
});

test('Are the characters created in the required number and range of levels when calling generateTeam', () => {
  const allowedTypes = [Bowman, Swordsman, Magician];
  const maxLevel = 5;
  const characterCount = Math.trunc(Math.random() * 10);
  const generator = generateTeam(allowedTypes, maxLevel, characterCount);

  expect(generator.characters.length).toEqual(characterCount);
  generator.characters.forEach((character) => {
    expect(character).toBeInstanceOf(Character);
    expect(allowedTypes).toContain(character.constructor);
    expect(character.level).toBeGreaterThanOrEqual(1);
    expect(character.level).toBeLessThanOrEqual(maxLevel);
  });
});
