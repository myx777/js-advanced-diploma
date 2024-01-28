import GameController from '../GameController';
import GamePlay from '../GamePlay';

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInfoCharacter', () => {
    test('должен отобразить корректное сообщение для персонажа', () => {
      const positionedCharacter = {
        position: 3,
        character: {
          level: 1, health: 100, attack: 20, defence: 10,
        },
      };
      gameController.position = [positionedCharacter];

      // Вызываем метод init() перед onCellClick
      gameController.init();

      // Вызываем метод getInfoCharacter (в данном случае onCellClick)
      gameController.onCellClick(3);
      console.log(gamePlay.showMessage);
      // Проверяем, что showMessage вызывается с корректными параметрами
      expect(gamePlay.showMessage).toHaveBeenCalledWith('\u{1F396}1 \u{2694}20 \u{1F6E1}10 \u{2764}100', 3);
    });

    test('не должен отображать сообщение для пустой ячейки', () => {
      gameController.position = [];

      // Вызываем метод getInfoCharacter для пустой ячейки
      gameController.onCellClick(5);

      // Проверяем, что showMessage не вызывается
      expect(gamePlay.showMessage).not.toHaveBeenCalled();
    });

    test('должен отобразить корректное сообщение для персонажа при наведении курсора', () => {
      const positionedCharacter = {
        position: 3,
        character: {
          level: 1, health: 100, attack: 20, defence: 10,
        },
      };
      gameController.position = [positionedCharacter];

      // Вызываем метод init() перед onCellClick
      gameController.init();

      // Вызываем метод getInfoCharacter (в данном случае onCellClick)
      gameController.onCellEnter(3);

      // Проверяем, что showMessage вызывается с корректными параметрами
      expect(gamePlay.showMessage).toHaveBeenCalledWith('\u{1F396}1 \u{2694}20 \u{1F6E1}10 \u{2764}100', 3);
    });

    test('при смещении курсора от персонажа должен вызвать метод удаления отображения инфо', () => {
      const positionedCharacter = {
        position: 3,
        character: {
          level: 1, health: 100, attack: 20, defence: 10,
        },
      };
      gameController.position = [positionedCharacter];

      // Вызываем метод init() перед onCellClick
      gameController.init();

      // Дважды вызываем метод getInfoCharacter (в данном случае onCellClick)
      gameController.onCellEnter(3);
      gameController.onCellLeave(3);
      // Проверяем, что вызывается метод removeMessage()
      expect(gamePlay.removeMessage).toHaveBeenCalled();
    });

    // ТАК КАК МЕТОД gamePlay.showMessage МОКИРОВАН, НЕ ВЫЗЫВАЕТСЯ gamePlay.removeMessage, ВЫЗОВ КОТОРОГО НАХОДИТСЯ В showMessage
    // test('при двойном клике должен вызвать метод удаления отображения инфо', () => {
    //   const positionedCharacter = { position: 3, character: { level: 1, health: 100, attack: 20, defence: 10 } };
    //   gameController.position = [positionedCharacter];

    //   // Вызываем метод init() перед onCellClick
    //   gameController.init();

    //   // Дважды вызываем метод getInfoCharacter (в данном случае onCellClick)
    //   gameController.onCellClick(3);
    //   gameController.onCellClick(3);
    //   // Проверяем, что вызывается метод removeMessage()
    //   expect(gamePlay.removeMessage).toHaveBeenCalled();
    // });
  });
});
