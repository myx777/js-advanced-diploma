/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  constructor(characters) {
    this.characters = characters;
    // console.log(this.characters);
  }
  // Метод для добавления персонажа в команду
  addCharacter(character) {
    this.characters.push(character);
  }

  // Метод для удаления персонажа из команды
  removeCharacter(character) {
    const index = this.characters.indexOf(character);
    if (index !== -1) {
      this.characters.splice(index, 1);
    }
  }
}
