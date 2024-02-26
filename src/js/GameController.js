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

    //возможные клетки атаки
    this.areaAttackCharacter = [];

    //массив возможный действий персонажа
    this.currentIndexCharacter = [];

    //команды игрока и компьютера
    this.firstCharTeam = null;
    this.secondCharTeam = null;

    //выбранный персонаж
    this.selectedCharacter = [];

    //выбранная позиция персонажа
    this.selectedPositionChar = null;

    /**
     * отдельная переменная длявыранного перса для хода или атаки
     */
    this.activeChar = [];
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

    this.firstCharTeam = new GameState(positionFirst);
    this.secondCharTeam = new GameState(positionSecond);

    // первый ход за игроком при первоначальной отрисовке
    this.firstCharTeam.active = true;

    //отрисовка
    this.gamePlay.redrawPositions([...positionFirst, ...positionSecond]);
  }

  // отображение инфо при клике или наведении
  getInfoCharacter(index) {
    //снимаю выделение и убираю сообщение
    if (this.selectedPositionChar !== null) {
      this.gamePlay.removeMessage(this.selectedPositionChar);
    }

    this.firstCharTeam.characters.forEach((character) => {
      if (character !== undefined && character.position === index) {
        const levelCharacter = character.character.level;
        const healthCharacter = character.character.health;
        const attackCharacter = character.character.attack;
        const defenceCharacter = character.character.defence;

        const message = `\u{1F396}${levelCharacter} \u{2694}${attackCharacter} \u{1F6E1}${defenceCharacter} \u{2764}${healthCharacter}`;
        this.gamePlay.showMessage(message, index);
      }
    });
  }

  // выделение кликнутого персонажа команды
  getMarkCharacter(index) {
    // снимаю выделение
    if (this.selectedPositionChar !== null) {
      this.gamePlay.deselectCell(this.selectedPositionChar);
      if (this.currentIndexCharacter.length > 0) {
        this.currentIndexCharacter.forEach((pos) =>
          this.gamePlay.deselectCell(pos)
        );
        // this.currentIndexCharacter.length = 0;
      }
    }

    const selectChar = this.firstCharTeam.characters.filter(
      (char) => char.position === index
    );

    console.info(selectChar);

    if (selectChar.length > 0) {
      this.selectedCharacter = selectChar;
    } else {
      return;
    }

    if (this.selectedCharacter.length > 0) {
      this.gamePlay.deselectCell(index);
      this.selectedPositionChar = null;
      this.gamePlay.selectCell(index);
      this.selectedPositionChar = index;
      this.areaForAttack(index);
      this.getInfoCharacter(index);
    } else if (
      this.secondCharTeam.characters.find((char) => char.position === index) !==
      undefined
    ) {
      GamePlay.showError("Это не твоя команда!");
    }
  }

  //действия при клике
  onCellClick(index) {
    this.getMarkCharacter(index);
    this.moveCharacter(index);
  }

  //действия  при наведении
  onCellEnter(index) {
    this.getInfoCharacter(index);
    this.markedActionChar(index);
  }

  onCellLeave(index) {
    this.gamePlay.removeMessage(index);
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
  areaForAttack(index) {
    const boardSize = this.gamePlay.boardSize;

    //строка
    const rowIndex = Math.trunc(index / boardSize);

    //столбец
    const columnIndex = index % boardSize;

    let coefficient;
    const characterType =
      this.selectedCharacter.length > 0
        ? this.selectedCharacter[0].character.type
        : [];

    if (characterType === "swordsman" || characterType === "undead") {
      coefficient = 1;
    } else if (characterType === "bowman" || characterType === "vampire") {
      coefficient = 2;
    } else if (characterType === "magician" || characterType === "daemon") {
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
      if (pos !== index) {
        this.gamePlay.selectCell(pos, "green");
      }
    });
  }

  //маркируем возможные действия перса
  markedActionChar(index) {
    const positionFirstTeam = this.firstCharTeam.characters.find(
      (character) => character.position === index
    );
    const positionSecondTeam = this.secondCharTeam.characters.find(
      (character) => character.position === index
    );

    if (
      positionFirstTeam !== undefined ||
      this.currentIndexCharacter.includes(index)
    ) {
      this.gamePlay.setCursor("pointer");
    } else if (
      positionSecondTeam !== undefined &&
      this.currentIndexCharacter.includes(index)
    ) {
      this.gamePlay.setCursor("crosshair");
      this.gamePlay.selectCell(index, "red");
    } else {
      this.gamePlay.setCursor("not-allowed");
    }
  }

  // ход игрока
  moveCharacterUser (index) {
    if (
      this.firstCharTeam.active &&
      this.currentIndexCharacter.includes(index) &&
      this.selectedPositionChar !== index
    ) {
      
      //изменение положения персонажа
      this.selectedCharacter[0].position = index;

      //обновление положений команд
      const positionFirst = this.firstCharTeam.characters.map(character => character);
      const positionSecond = this.secondCharTeam.characters.map(character => character);
      //отрисовка
      this.gamePlay.redrawPositions([...positionFirst, ...positionSecond]);

      this.firstCharTeam.active = false;
      this.secondCharTeam.active = true;
    }
  }
}
