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
    this.player = 'player'; // Предполагаю, что "player" всегда начинает первым ходить

    
    
  }
// Получить персонажа по его позиции
getCharacterByPosition(positionIndex) {
  return this.position.find(pos => pos.position === positionIndex)?.character;
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
selectedCharacter(character) {// ! нужен ли
 return this.currentCharacter = {
    character,
    selectedCharacter: true,
  }
}

  info(){
    console.info(this.firstTeam);
    console.info(this.secondTeam);
    
  }

  getAllCharactersAndPositions() {

    // return team === this.Team ? this.position.filter
    // this.position
    // return this.position
    this.position.forEach((pos) => {
      console.info(pos.character);
      
    });
  }
  static from(object) {
    // TODO: create object
    return null;
  }
}
