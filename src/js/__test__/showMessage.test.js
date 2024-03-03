import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameState from '../GameState';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';

import Team from '../Team';
import PositionedCharacter from '../PositionedCharacter';

jest.mock('../GamePlay');
describe('GameController', () => {
  let gameController;
  let gamePlay;

  beforeEach(() => {
    gamePlay = new GamePlay();
    const stateService = {};
    gameController = new GameController(gamePlay, stateService);
    // мокирую методы, которые не использую при проверки отобраджения инфо
    gameController.init = jest.fn();
    gameController.generationTeams = jest.fn();
    const bowman = new Bowman(1);
    const swordsman = new Swordsman(1);

    const team = [new Team(bowman)];
    const positions = [];

    const positionBowman = new PositionedCharacter(bowman, 3);
    const positionSwordsman = new PositionedCharacter(swordsman, 50);
    positions.push(positionBowman, positionSwordsman);

    gameController.gameState = new GameState(team, [], 1, positions, 'theme');

    gameController.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInfoCharacter', () => {
    test('должен отобразить корректное сообщение для персонажа', () => {
      gameController.getInfoCharacter(3);

      expect(gamePlay.showMessage).toHaveBeenCalledWith(
        '\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50',
        3,
      );
    });

    test('не должен отображать сообщение для пустой ячейки', () => {
      gameController.getInfoCharacter(5);

      expect(gamePlay.showMessage).not.toHaveBeenCalled();
    });

    test('должен отобразить корректное сообщение для персонажа при наведении курсора', () => {
      gameController.getInfoCharacter(3);

      expect(gamePlay.showMessage).toHaveBeenCalledWith(
        '\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50',
        3,
      );
    });

    test('при смещении курсора от персонажа должен вызвать метод удаления отображения инфо', () => {
      // Дважды вызываем метод getInfoCharacter (в данном случае onCellClick)
      gameController.onCellEnter(3);
      gameController.onCellLeave(3);
      // Проверяем, что вызывается метод removeMessage()
      expect(gamePlay.removeMessage).toHaveBeenCalled();
    });
  });
});
