/**
 * состояние игры
 */
export default class GameState {
  constructor(firstTeam, secondTeam, level, position, theme) {
    this.level = level;
    this.characterCount = firstTeam.length + secondTeam.length;
    this.theme = theme;
    this.firstTeam = firstTeam;
    this.secondTeam = secondTeam;
    this.position = position;
    this.currentCharacter = null;
    this.isPlayerTurn = true;
    this.player = "player"; // Предполагаю, что "player" всегда начинает первым ходить
  }
  // Получить персонажа по его позиции
  getCharacterByPosition(positionIndex) {
    return this.position.find((pos) => pos.position === positionIndex)
      ?.character;
  }

  // Проверить, находится ли персонаж в команде игрока
  isCharacterInUserTeam(character) {
    return this.firstTeam.characters.includes(character);
  }

  // Проверить, находится ли персонаж в команде компьютера
  isCharacterInComputerTeam(character) {
    return this.secondTeam.includes(character);
  }

  //флаг выбранного персонажа
  selectedCharacter(character) {
    // ! нужен ли
    return (this.currentCharacter = {
      character,
      selectedCharacter: true,
    });
  }

  //получить позиции персонажей по командам
  getPositionTeam(team) {
    let positionis = [];

    this.position.forEach((element) => {
      if (team.characters.includes(element.character)) {
        positionis.push(element.position);
      }
    });

    return positionis;
  }

  static from(object) {
    // Создаем новый экземпляр GameState и инициализируем его данными из объекта

  }
}
