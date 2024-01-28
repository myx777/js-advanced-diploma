import Team from "./Team";
import PositionedCharacter from "./PositionedCharacter";
export default class GameState {
  constructor(currentPlayer, characters, position) {
    this.currentPlayer = currentPlayer || 'player';
    this.characters = characters;
    this.position = this.position;

    this.userTeam = [];
    this.computerTeam = [];
    console.log(this.userTeam)
    console.log(this.computerTeam)
  }
  // addFirstTeam() {
  //   characters.
    
  // }
  getCharacterByPosition(position) {
    return this.userTeam.characters[position] || this.computerTeam.characters[position];
  }
  static from(object) {
    // Создаем новый экземпляр GameState и инициализируем его данными из объекта

  }
}
