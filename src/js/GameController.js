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


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
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

    this.characterCount = Math.trunc(Math.random() * 10);
    if (this.characterCount === 0) {
      this.characterCount = 2;
    }

    const allowedTypesFirstTeam = [Bowman, Swordsman, Magician];
    const allowedTypesSecondTeam = [Vampire, Undead, Daemon];

    this.firstTeam = generateTeam(allowedTypesFirstTeam, this.level, this.characterCount);
    this.secondTeam = generateTeam(allowedTypesSecondTeam, this.level, this.characterCount);
    

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
  }

   //отображение инфо при слике
  getInfoCharacter (index) {
    let levelCharacter;
    let healthCharacter;
    let attackCharacter;
    let defenceCharacter;
    
    this.position.forEach(character => {
      if(character.position === index) {
        if(character.character) {
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

  onCellClick(index) {
    this.getInfoCharacter(index);
    
  }

  onCellEnter(index) {
    this.getInfoCharacter(index);
  }

  onCellLeave(index) {
    this.gamePlay.removeMessage(index);
  }
}

