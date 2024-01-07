import Character from '../Character';
import Bowman from '../characters/Bowman';

describe('testing class Character', () => {
  test('if create object of class Character, must throw error', () => {
    const createCharacter = () => new Character(1, 'generic');
    expect(createCharacter).toThrow('Do not use new Character');
  });

  test('creating a character as a class Character heir', () => {
    const bowmanInstance = new Bowman(1);
    expect(bowmanInstance).toEqual({
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      type: 'bowman',
    });
  });

  test('creating an instance of Character directly should throw an error', () => {
    const createCharacterDirectly = () => new Character(1, 'bowman');
    expect(createCharacterDirectly).toThrow('Do not use new Character');
  });
});
