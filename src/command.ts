import { Game, GameStatus } from "./game";
import { blue, redBg } from "./util";

export type Command = ((game: Game) => string) | ((game: Game, parameters: string[]) => string);

class WrongParameters extends Error {
    constructor() {
        super("Wrong parameters for this command!");
    }
}

export function newGame(game: Game, parts: string[]): string {
    if (parts.length !== 3) {
        throw new WrongParameters();
    }
    const width = parseInt(parts[0]);
    const height = parseInt(parts[1]);
    const mines = parseInt(parts[2]);

    if (mines < 1) {
        throw new Error("You need at least one mine to play the game!");
    }
    if (mines > width * height - 2) {
        throw new Error("You cannot place more mines than total fields less two.");
    }
    if (width < 2 || height < 2) {
        throw new Error("Minimum field is 2x2 for a chance to actually play.");
    }

    game.reset(width, height, mines);

    return printGame(game, false);
}

export function flag(game: Game, parts: string[]): string {
    if (parts.length !== 2) {
        throw new WrongParameters();
    }
    const x = parseInt(parts[0]) - 1;
    const y = parseInt(parts[1]) - 1;
    try {
        game.flag(x, y);

        return printGame(game, false);
    } catch (e) {
        return e.message;
    }
}

export function uncover(game: Game, parts: string[]): string {
    if (parts.length !== 2) {
        throw new WrongParameters();
    }
    const x = parseInt(parts[0]) - 1;
    const y = parseInt(parts[1]) - 1;
    try {
        game.uncover(x, y);

        return printGame(game, game.status == GameStatus.FINISHED);
    } catch (e) {
        return e.message;
    }
}

export function forfeit(game: Game): string {
    game.lose();

    return 'You forfeited the game. Start a new one with `newgame x y mines`.\n';
}

export function printGame(game: Game, reveal: boolean): string {
    let out = '';
    const doReveal = game.status === GameStatus.FINISHED || reveal;
    for (let i = 0; i < game.board.height(); i++) {
        for (let j = 0; j < game.board.width(); j++) {
            let coord = game.board.getCoordinate(j, i);
            out += '[';
            if (!doReveal && !coord.revealed) {
                out += (coord.flagged ? blue('F') : ' ') + '] ';
                continue;
            }
            if (coord.bomb && doReveal) {
                out += redBg('B') + '] ';
                continue;
            }
            out += coord.neighbourBombs + '] ';
        }
        out += '\n';
    }

    return out;
}

export function help(game: Game): string {
    game;
    return 'To create a game, type `newgame [width] [height] [mines]`, `open [x] [y]` to discover a field on coordinates x,y and `flag [x] [y]` to flag and unflag the field on x,y.';
}
