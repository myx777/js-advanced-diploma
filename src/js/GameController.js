import GamePlay from './GamePlay';
import themes from './themes'; // темы

// персонажи
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead ';
import Vampire from './characters/Vampire';
// генератор  команд
import { generateTeam } from './generators';
// стартовая позиция команды
import PositionedCharacter from './PositionedCharacter';
// состояние игры
import GameState from './GameState';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    // this.gameState = new GameState();
    this.level = null;
    this.characterCount = null;
    this.firstTeam = null;
    this.secondTeam = null;

    this.position = [];
  }

  // начало игры, отрисовка поля и команд + формирование
  init() {
    // поле
    this.theme = themes.prairie;
    this.gamePlay.drawUi(this.theme);

    // команды и отрисовка
    this.generationTeams();

    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  // формирование, расстановка и отрисовка персонажей в команде
  generationTeams() {
    this.level = 1;

    this.characterCount = Math.max(2, Math.trunc(Math.random() * 10));

    const allowedTypesFirstTeam = [Bowman, Swordsman, Magician];
    const allowedTypesSecondTeam = [Vampire, Undead, Daemon];

    this.firstTeam = generateTeam(allowedTypesFirstTeam, this.level, this.characterCount);
    this.secondTeam = generateTeam(allowedTypesSecondTeam, this.level, this.characterCount);
    // console.log(this.firstTeam, this.secondTeam);

    this.firstTeam.characters.forEach((character) => {
      if (character) {
        const index = this.gamePlay.positionTeamFirst();
        const positionedCharacter = new PositionedCharacter(character, index);
        this.position.push(positionedCharacter);
      }
    });
    this.secondTeam.characters.forEach((character) => {
      if (character) {
        const index = this.gamePlay.positionTeamSecond();
        const positionedCharacter = new PositionedCharacter(character, index);
        this.position.push(positionedCharacter);
      }
    });

    this.gamePlay.redrawPositions(this.position);
    this.gameState = new GameState(this.firstTeam);
    this.gameState = new GameState(this.secondTeam);
    console.log(this.game)
  }

  // отображение инфо при клике
  getInfoCharacter(index) {
    let levelCharacter;
    let healthCharacter;
    let attackCharacter;
    let defenceCharacter;
    // console.log(index)
    // console.log(this.position)
    this.position.forEach((character) => {
      if (character.position === index) {
        if (character.character) {
          levelCharacter = character.character.level;
          healthCharacter = character.character.health;
          attackCharacter = character.character.attack;
          defenceCharacter = character.character.defence;

          const message = `\u{1F396}${levelCharacter} \u{2694}${attackCharacter} \u{1F6E1}${defenceCharacter} \u{2764}${healthCharacter}`;
          this.gamePlay.showMessage(message, index);
         
        }
      }
    });
  }
  //выделение перса
  getMarkCharacter(index) {
    const character = this.position.find(char => char.position === index && char.character);
    const findIndex = this.position.map(char => char.position !== index && char.character)
    const characterType = character.character.type;
  
    // console.log(character.getPosition)
     /**PositionedCharacter {character: Swordsman, position: 17}
    character: Swordsman {level: 1, attack: 40, defence: 10, health: 50, type: 'swordsman'}
    position: 17
    */
    // console.log(this.position.character.position)
    // console.log(findIndex )
    // console.log(character.character)
    // console.log(character.character.type )
  
    if (character && (characterType === 'bowman' || characterType === 'swordsman' || characterType === 'magician')) {
      this.gamePlay.selectCell(index);
    } else {
      GamePlay.showError('Это не твоя команда!');
    }
  }
  

  onCellClick(index) {
    this.getInfoCharacter(index);
    this.getMarkCharacter(index);

  }

  onCellEnter(index) {
    this.getInfoCharacter(index);
  }

  onCellLeave(index) {
    this.gamePlay.removeMessage(index);
  }
}
