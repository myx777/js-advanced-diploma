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
import Team from "./Team";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.level = null;
    this.characterCount = null;
    // this.firstTeam = [];
    // this.secondTeam = [];
    // this.gameState = null;

    // this.position = [];


    // this.gameStateFirstTeam = null;
    // this.gameStateSecondTeam = null;

    //возможные клетки атаки
    this.areaAttackCharacter = [];

    //массив возможный действий персонажа
    this.currentIndexCharacter = [];

    //команды игрока и компьютера
    this.firstCharTeam = null;
    this.secondCharTeam = null;
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
    //формирование команд
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

      let positionFirst = [];
      let positionSecond = [];

    //расстановка персонажей
    this.firstTeam.characters.forEach((character) => {
      if (character) {
        const index = this.gamePlay.positionTeamFirst();
        const positionedCharacter = new PositionedCharacter(character, index);
        positionFirst.push(positionedCharacter);
      }
    });

    this.secondTeam.characters.forEach((character) => {
      if (character) {
        const index = this.gamePlay.positionTeamSecond();
        const positionedCharacter = new PositionedCharacter(character, index);
        positionSecond.push(positionedCharacter);
      }
    });

    this.firstCharTeam = new GameState(
      positionFirst,
    );
    this.secondCharTeam = new GameState(
      positionSecond,
    );

    //отрисовка
    this.gamePlay.redrawPositions([...positionFirst, ...positionSecond]);
    // this.gamePlay.redrawPositions(positionSecond);
    console.info(this.firstCharTeam);
  }

  // отображение инфо при клике
  getInfoCharacter(index) {
    let levelCharacter;
    let healthCharacter;
    let attackCharacter;
    let defenceCharacter;

    console.info(this.firstCharTeam);
    console.info(this.secondCharTeam);

    this.firstCharTeam.characters.forEach((character) => {
      if (character !== undefined) {
      levelCharacter = character.character.level;
      healthCharacter = character.character.health;
      attackCharacter = character.character.attack;
      defenceCharacter = character.character.defence;
    }

      const message = `\u{1F396}${levelCharacter} \u{2694}${attackCharacter} \u{1F6E1}${defenceCharacter} \u{2764}${healthCharacter}`;
      this.gamePlay.showMessage(message, index);
    });
  }

  // выделение кликнутого персонажа команды
  getMarkCharacter(index) {

    if(this.firstCharTeam.characters.find(char => char.position === index)){
      console.info(true);
      
      this.gamePlay.selectCell(index);
    }
    // if (!selectCharacter) {
    //   return;
    // }

    // const userCharacter = this.gameState.isCharacterInUserTeam(selectCharacter);

    // const markCharacter = this.firstCharTeam.filter()

    // this.position.forEach((character) => {
    //   this.gamePlay.deselectCell(character.position);
    //   this.areaAttackCharacter.forEach((cell) => {
    //     this.gamePlay.deselectCell(cell);
    //   });
    //   this.areaAttackCharacter.length = 0;
    // });
    // if (userCharacter) {
    //   this.gamePlay.selectCell(index);

    //   const selectedCharacter =
    //     this.gameState.selectedCharacter(selectCharacter); //! нужен ли

    //   this.areaForAttack(selectedCharacter, index);
    // } else {
    //   GamePlay.showError("Это не твоя команда!");
    // }
  }

  //действия при клике
  onCellClick(index) {
    this.getInfoCharacter(index);
    this.getMarkCharacter(index);
  }

  //действия  при наведении
  onCellEnter(index) {
    // this.getInfoCharacter(index);
    // this.markedActionChar(index);
  }

  onCellLeave(index) {
    // this.gamePlay.removeMessage(index);
  }

  // Функция для расчета доступных клеток для персонажа на доске 8x8
  calculateAvailableCells(rowIndex, columnIndex, boardSize, distance) {
    const availableCells = [];

    // Добавляем доступные клетки по вертикали
    for (let dy = -distance; dy <= distance; dy++) {
      const newRow = rowIndex + dy; // Вычисляем индекс строки для новой клетки
      // Проверяем, что новая клетка находится в пределах игрового поля
      if (newRow >= 0 && newRow < boardSize) {
        availableCells.push(newRow * boardSize + columnIndex); // Добавляем индекс новой клетки в массив доступных клеток
      }
    }

    // Добавляем доступные клетки по горизонтали
    for (let dx = -distance; dx <= distance; dx++) {
      // Проверяем, что клетка находится на горизонтали и расстояние не превышает 4 клетки
      if (Math.abs(dx) <= distance) {
        const newColumn = columnIndex + dx; // Вычисляем индекс столбца для новой клетки
        // Проверяем, что новая клетка находится в пределах игрового поля
        if (newColumn >= 0 && newColumn < boardSize) {
          availableCells.push(rowIndex * boardSize + newColumn); // Добавляем индекс новой клетки в массив доступных клеток
        }
      }
    }

    // Добавляем доступные клетки по диагонали
    for (let dx = -distance; dx <= distance; dx++) {
      for (let dy = -distance; dy <= distance; dy++) {
        // Проверяем, что клетка находится на диагонали и расстояние не превышает 4 клетки
        if (Math.abs(dx) === Math.abs(dy) && Math.abs(dx) <= distance) {
          const newRow = rowIndex + dy; // Вычисляем индекс строки для новой клетки
          const newColumn = columnIndex + dx; // Вычисляем индекс столбца для новой клетки
          // Проверяем, что новая клетка находится в пределах игрового поля
          if (
            newRow >= 0 &&
            newRow < boardSize &&
            newColumn >= 0 &&
            newColumn < boardSize
          ) {
            availableCells.push(newRow * boardSize + newColumn); // Добавляем индекс новой клетки в массив доступных клеток
          }
        }
      }
    }

    return availableCells;
  }

  //поле возможных действий
  areaForAttack(character, index) {
    const boardSize = this.gamePlay.boardSize;

    if (this.currentIndexCharacter !== null) {
      this.currentIndexCharacter.forEach((pos) =>
        this.gamePlay.deselectCell(pos)
      );
      this.currentIndexCharacter.length = 0;
    }

    //строка
    const rowIndex = Math.trunc(index / boardSize);

    //столбец
    const columnIndex = index % boardSize;

    let coefficient;

    if (
      character.character.type === "swordsman" ||
      character.character.type === "undead"
    ) {
      coefficient = 1;
    } else if (
      character.character.type === "bowman" ||
      character.character.type === "vampire"
    ) {
      coefficient = 2;
    } else if (
      character.character.type === "magician" ||
      character.character.type === "daemon"
    ) {
      coefficient = 4;
    }

    const positionCoordinates = this.calculateAvailableCells(
      rowIndex,
      columnIndex,
      boardSize,
      coefficient
    );

    positionCoordinates.forEach((pos) => {
      this.currentIndexCharacter.push(pos);
      this.gamePlay.selectCell(pos, "green");
    });
  }

  //маркируем возможные действия перса
  markedActionChar(index) {
    //получаю позиции команд
    const positionFirstTeam = this.gameState.getPositionTeam(this.firstTeam);
    const positionSecondTeam = this.gameState.getPositionTeam(this.secondTeam);

    if (positionFirstTeam.includes(index) || this.currentIndexCharacter.includes(index)) {
      this.gamePlay.setCursor("pointer");
    } else if (
      this.currentIndexCharacter.includes(index) &&
      positionSecondTeam.includes(index)
    ) {
      this.gamePlay.setCursor("crosshair");
      this.gamePlay.selectCell(index, "red");
    } else {
      this.gamePlay.setCursor("not-allowed");
    }
  }

}
