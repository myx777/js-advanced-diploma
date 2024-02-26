export default class GameState {
    constructor(characters) {
        this.characters = characters;
        this.active = false;
    }

    static from(object) {
        const characters = object.character.map(({ character, position }) => {
            return {
                level: character.level,
                attack: character.attack,
                defence: character.defence,
                health: character.health,
                type: character.type,
                position: position,
            };
        });
        return new GameState(characters);
    }
}
