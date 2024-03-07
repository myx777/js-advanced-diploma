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
    this.level = 1;

    // начальное количество персонажей
    this.characterCount = null;

    // возможные клетки атаки
    this.areaAttackCharacter = [];

    // массив возможный действий персонажа
    this.currentIndexCharacter = [];

    // команды игрока и компьютера
    this.firstCharTeam = null;
    this.secondCharTeam = null;

    // выбранный персонаж
    this.selectedCharacter = [];

    // выбранная позиция персонажа
    this.selectedPositionChar = null;

    // количество персов во 2 команде
    this.countSecondTeam = 0;

    // количество персов в 1 команде
    this.countFirstTeam = 0;
  }

  // начало игры, отрисовка поля и команд + формирование
  init() {
    // поле
    this.theme = themes.prairie;
    this.gamePlay.drawUi(this.theme);

    // команды и отрисовка
    this.generationTeams();
    if (this.firstCharTeam.active && !this.secondCharTeam.active) {
      this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
      this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
      this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    }
  }

  // формирование, расстановка и отрисовка персонажей в команде
  generationTeams() {
    if (this.level === 1) {
      this.characterCount = Math.trunc(Math.random() * 10);
      if (this.characterCount === 0) {
        this.characterCount = 2;
      }
      // формирование команд
      const allowedTypesFirstTeam = [Bowman, Swordsman, Magician];
      const allowedTypesSecondTeam = [Vampire, Undead, Daemon];

      if(this.countFirstTeam === 0) {
        this.firstTeam = generateTeam(
          allowedTypesFirstTeam,
          this.level,
          this.characterCount
        );
      }

      if(this.countSecondTeam === 0) {
        this.secondTeam = generateTeam(
          allowedTypesSecondTeam,
          this.level,
          this.characterCount
        );
      }
    }

    const positionFirst = [];
    const positionSecond = [];

    // расстановка персонажей
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

    this.countFirstTeam = this.countCharacter(this.firstCharTeam);
    this.countSecondTeam = this.countCharacter(this.secondCharTeam);

    // первый ход за игроком при первоначальной отрисовке
    this.firstCharTeam.active = true;

    // отрисовка
    this.gamePlay.redrawPositions([...positionFirst, ...positionSecond]);

    console.info(this.firstCharTeam);
    console.info(this.secondCharTeam);
  }

  // отображение инфо при клике или наведении
  getInfoCharacter(index) {
    // снимаю выделение и убираю сообщение
    if (this.selectedPositionChar !== null) {
      this.gamePlay.removeMessage(this.selectedPositionChar);
    }

    const chars = [
      ...this.firstCharTeam.characters,
      ...this.secondCharTeam.characters,
    ];

    chars.forEach((character) => {
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
      }
    }

    const selectCharFirstTeam = this.firstCharTeam.characters.filter(
      (char) => char.position === index
    );

    const selectCharSecondTeam = this.secondCharTeam.characters.find(
      (char) => char.position === index
    );

    if (selectCharFirstTeam.length > 0) {
      this.selectedCharacter = selectCharFirstTeam;
      this.gamePlay.deselectCell(index);
      this.selectedPositionChar = null;
      this.gamePlay.selectCell(index);
      this.selectedPositionChar = index;
      this.areaForAttack(index);
      this.getInfoCharacter(index);
    } else if (
      selectCharSecondTeam !== undefined &&
      this.currentIndexCharacter.length === 0
    ) {
      GamePlay.showError("Это не твоя команда!");
    }
  }

  // действия при клике
  onCellClick(index) {
    if (
      this.firstCharTeam.active === true &&
      this.secondCharTeam.active === false
    ) {
      this.getMarkCharacter(index);
      this.markedActionChar(index);
      this.attackCharacter(this.selectedCharacter, index);
      this.moveCharacter(index);
    }
  }

  // действия  при наведении
  onCellEnter(index) {
    this.getInfoCharacter(index);
    this.markedActionChar(index);
  }

  onCellLeave(index) {
    this.gamePlay.removeMessage(index);
  }

  // Проверка принадлежности персонажа к команде
  get isCharacterInTeam() {
    return (character, team) =>
      team.characters.some((char) => char.position === character.position);
  }

  // количество персов в команде
  get countCharacter() {
    return (team) => team.characters.length;
  }

  // позиции команд
  get positionTeam() {
    return (team) => team.characters.map((char) => char.position);
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

  // поле возможных действий
  areaForAttack(index) {
    const { boardSize } = this.gamePlay;

    // строка
    const rowIndex = Math.trunc(index / boardSize);

    // столбец
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
    const characterInSecondTeam = this.isCharacterInTeam(
      this.selectedCharacter[0],
      this.secondCharTeam
    );

    positionCoordinates.forEach((pos) => {
      if (!this.currentIndexCharacter.includes(pos)) {
        this.currentIndexCharacter.push(pos);
      }

      if (pos !== index && !characterInSecondTeam) {
        this.gamePlay.selectCell(pos, "green");
      }
    });
  }

  // маркируем курсор при возможных действий перса
  markedActionChar(index) {
    this.secondCharTeam.characters.forEach((character) => {
      this.gamePlay.deselectCell(character.position);
    });

    const positionFirstTeam = this.firstCharTeam.characters.find(
      (character) => character.position === index
    );
    const positionSecondTeam = this.secondCharTeam.characters.find(
      (character) => character.position === index
    );

    const positionSecondTeamBoolean = this.currentIndexCharacter.some(
      (pos) => positionSecondTeam && pos === positionSecondTeam.position
    );
    if (
      positionFirstTeam !== undefined ||
      (this.currentIndexCharacter.includes(index) && !positionSecondTeamBoolean)
    ) {
      this.gamePlay.setCursor("pointer");
    } else if (positionSecondTeamBoolean) {
      this.gamePlay.setCursor("crosshair");
      this.gamePlay.selectCell(index, "red");
    } else {
      this.gamePlay.setCursor("not-allowed");
    }
  }

  // ход чара
  moveCharacter(index) {
    const positionFirstTeam = this.positionTeam(this.firstCharTeam);
    const positionSecondTeam = this.positionTeam(this.secondCharTeam);

    if (
      this.currentIndexCharacter.includes(index) &&
      this.selectedPositionChar !== index &&
      !positionFirstTeam.includes(index) &&
      !positionSecondTeam.includes(index)
    ) {
      // изменение положения персонажа
      this.selectedCharacter[0].position = index;
      // обновляю ситуацию на поле
      this.updateCharRedraw();

      // меняю флаги
      this.firstCharTeam.active = !this.firstCharTeam.active;
      this.secondCharTeam.active = !this.secondCharTeam.active;
      // сбрасываю массив с возможныи полями атаки
      this.currentIndexCharacter.length = 0;
      this.selectedCharacter.length = 0;
    }
    this.computerLogic();
  }

  // атака чара
  async attackCharacter(selectedChar, index) {
    if (
      !Array.isArray(selectedChar) ||
      !selectedChar.length ||
      selectedChar[0].position === index
    ) {
      return;
    }

    const attacker = selectedChar[0].character;
    let target;

    if (this.firstCharTeam.active) {
      target = this.secondCharTeam.characters.find(
        (character) => character.position === index
      );
    } else {
      target = this.firstCharTeam.characters.find(
        (character) => character.position === index
      );
    }

    if (
      target !== undefined &&
      attacker.health > 0 &&
      this.currentIndexCharacter.includes(index)
    ) {
      const hit = Math.max(
        attacker.attack - target.character.defence,
        attacker.attack * 0.1
      );

      target.character.health = target.character.health - hit;

      if (target.character.health < 1) {
        this.deadCharacter(target);
      }

      try {
        // Вызов анимации урона
        await this.gamePlay.showDamage(index, hit);

        // Обновление состояния игры после завершения анимации
        this.updateCharRedraw();

        this.currentIndexCharacter.length = 0;
        this.selectedCharacter.length = 0;

        this.firstCharTeam.active = !this.firstCharTeam.active;
        this.secondCharTeam.active = !this.secondCharTeam.active;

        // Вызов логики компьютера после завершения анимации
        this.computerLogic();
      } catch (error) {
        console.error(error);
      }
    }
  }

  // обновление и прерисовка персов с новыми положениями
  updateCharRedraw() {
    const positionFirst = this.firstCharTeam.characters.map(
      (character) => character
    );
    const positionSecond = this.secondCharTeam.characters.map(
      (character) => character
    );
    this.gamePlay.redrawPositions([...positionFirst, ...positionSecond]);
  }

  // логика компьютера
  computerLogic() {
    // проверка очередности хода
    if (this.firstCharTeam.active && !this.secondCharTeam.active) {
      return;
    }
    if (this.countSecondTeam === 0) {
      console.info("0 перс");

      this.levelUp(this.firstCharTeam);
    } else if (this.countFirstTeam === 0) {
      console.info("0 перс");
      this.levelUp(this.secondCharTeam);
    }

    this.selectedCharacter.length = 0;

    // выбор случайного перса
    const select = Math.trunc(Math.random() * this.countSecondTeam);
    const indexComp = this.secondCharTeam.characters[select].position;
    this.selectedCharacter.push(this.secondCharTeam.characters[select]);

    this.areaForAttack(indexComp);

    // позиция противника
    let indexCompAttack;

    this.firstCharTeam.characters.forEach((char) => {
      if (this.currentIndexCharacter.includes(char.position)) {
        indexCompAttack = char.position;
      }
    });

    // атака или движение
    if (indexCompAttack !== undefined) {
      this.attackCharacter(this.selectedCharacter, indexCompAttack);
    } else {
      // Генерация случайного индекса
      const randomIndex = Math.floor(
        Math.random() * this.currentIndexCharacter.length
      );

      // Получение случайного элемента из массива
      const randomElement = this.currentIndexCharacter[randomIndex];
      this.moveCharacter(randomElement);
    }
  }

  // при смерти персонажа в команде фильтрую его из массива
  deadCharacter(character) {
    if (this.firstCharTeam.active && !this.secondCharTeam.active) {
      this.secondCharTeam.characters = this.secondCharTeam.characters.filter(
        (char) => char.position !== character.position
      );

      this.countSecondTeam = this.countCharacter(this.secondCharTeam);
      console.info(this.secondCharTeam);
      console.info(this.countSecondTeam);
    } else {
      this.firstCharTeam.characters = this.firstCharTeam.characters.filter(
        (char) => char.position !== character.position
      );

      this.countFirstTeam = this.countCharacter(this.firstCharTeam);
      console.info(this.firstCharTeam);
      console.info(this.countFirstTeam);
    }
  }

  // повышение уровня при смерти всех персов в одной из комманд
  levelUp(team) {
    team.characters.forEach((char) => {
      console.info("повышение уровня" + char);
      
      // Увеличение уровня персонажа
      char.character.level += 1;


      // Повышение показателей атаки и защиты
      const lifePercentage = char.character.health / 100;
      char.character.attack = Math.max(
        char.character.attack,
        Math.round((char.character.attack * (80 + lifePercentage * 100)) / 100)
      );
      char.character.defence = Math.max(
        char.character.defence,
        Math.round((char.character.defence * (80 + lifePercentage * 100)) / 100)
      );


      // Повышение здоровья персонажа
      char.character.health = Math.min(char.character.health + 80, 100);
    });
    
    this.level += 1;
    this.init();
  }
}
