import themes from "./themes"; // темы
// персонажи
import Bowman from "./characters/Bowman";
import Daemon from "./characters/Daemon";
import Magician from "./characters/Magician";
import Swordsman from "./characters/Swordsman";
import Undead from "./characters/Undead ";
import Vampire from "./characters/Vampire";
// генератор  команд
import { generateTeam } from "./generators";
// стартовая позиция команды
import PositionedCharacter from "./PositionedCharacter";
import GameState from "./GameState";
import GamePlay from "./GamePlay";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.level = null;
    this.characterCount = null;
    this.firstTeam = [];
    this.secondTeam = [];
    this.gameState = null;

    this.position = [];

    this.gameStateFirstTeam = null;
    this.gameStateSecondTeam = null;
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

    this.firstTeam = generateTeam(
      allowedTypesFirstTeam,
      this.level,
      this.characterCount
    );
    this.secondTeam = generateTeam(
      allowedTypesSecondTeam,
      this.level,
      this.characterCount
    );

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

    this.gameState = new GameState(
      this.firstTeam,
      this.secondTeam,
      this.level,
      this.position,
      this.theme
    );

    console.log(this.gameState);
  }

  // отображение инфо при слике
  getInfoCharacter(index) {
    let levelCharacter;
    let healthCharacter;
    let attackCharacter;
    let defenceCharacter;
    const selectCharacter = this.gameState.getCharacterByPosition(index);

    if (selectCharacter !== undefined) {
      levelCharacter = selectCharacter.level;
      healthCharacter = selectCharacter.health;
      attackCharacter = selectCharacter.attack;
      defenceCharacter = selectCharacter.defence;

      const message = `\u{1F396}${levelCharacter} \u{2694}${attackCharacter} \u{1F6E1}${defenceCharacter} \u{2764}${healthCharacter}`;
      this.gamePlay.showMessage(message, index);
    }
  }
  // выделение кликнутого персонажа команды
  getMarkCharacter(index) {
    const selectCharacter = this.gameState.getCharacterByPosition(index);

    const userCharacter = this.gameState.isCharacterInUserTeam(selectCharacter);
    this.position.forEach((characters) => {
      this.gamePlay.deselectCell(characters.position);
    });
    if (userCharacter) {
      this.gamePlay.selectCell(index);
    } else {
      GamePlay.showError("Это не твоя команда!");
    }
  }

  //действия при клике
  onCellClick(index) {
    this.getInfoCharacter(index);
    this.getMarkCharacter(index);
  }

  //действия  при наведении
  onCellEnter(index) {
    this.getInfoCharacter(index);
  }

  onCellLeave(index) {
    this.gamePlay.removeMessage(index);
  }
}
