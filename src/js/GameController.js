import themes from './themes'; //темы
// персонажи
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead ';
import Vampire from './characters/Vampire';
// генератор  команд
import { generateTeam } from './generators';
//стартовая позиция команды
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.firstTeam = [];
    this.secondTeam = [];
    this.level = null;
  }

  //начало игры, отрисовка поля и команд + формирование
  init() {
    // поле
    this.theme = themes.prairie;
    this.gamePlay.drawUi(this.theme);
    
    // команды и отрисовка
    this.level = 1;

    const characterCount = Math.trunc(Math.random() * 10);


    const allowedTypesFirstTeam = [Bowman, Swordsman, Magician];
    const allowedTypesSecondTeam = [Vampire, Undead, Daemon];

      this.firstTeam = generateTeam(allowedTypesFirstTeam, this.level, characterCount);
      this.secondTeam = generateTeam(allowedTypesSecondTeam, this.level, characterCount);

    const position = [];

  this.firstTeam.forEach(character => {
    if(character) {
      const index = this.gamePlay.positionTeamFirst();
      const positionedCharacter = new PositionedCharacter(character, index);
      position.push(positionedCharacter);
    }
  });
  this.secondTeam.forEach(character => {
    if(character) {
      const index = this.gamePlay.positionTeamSecond();
      const positionedCharacter = new PositionedCharacter(character, +index);
      position.push(positionedCharacter);
    }
  });
  // Рисуем позиции команд
  this.gamePlay.redrawPositions(position);
  
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
