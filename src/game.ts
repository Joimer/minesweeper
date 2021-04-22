import { Board } from "./board";
import { PopulationStrategy } from "./population-strategy";
import { green, red } from "./util";

export enum GameStatus {
    READY,
    STARTED,
    FINISHED
}

class GameNotStarted extends Error {
    constructor() {
        super('Game actions cannot be performed when the game is not running!');
    }
}

export class Game {
    board!: Board;
    status: GameStatus;
    strategy: PopulationStrategy;
    won: number = 0;
    lost: number = 0;
    revealedFields: number = 0;
    mines: number = 0;

    constructor(strategy: PopulationStrategy) {
        this.strategy = strategy;
        this.status = GameStatus.READY;
    }

    generateBoard(width: number, height: number, mines: number) {
        this.board = new Board(width, height);
        this.strategy(this.board, mines);
        this.status = GameStatus.STARTED;
        this.mines = mines;
        this.revealedFields = 0;
    }

    // Flags or unflags a field as potentially containing a bomb.
    flag(x: number, y: number): void {
        if (this.status !== GameStatus.STARTED) {
            throw new GameNotStarted();
        }
        // When attempting to flag an already revealed field we just silently return, nothing to do here after all.
        // Let the client facing API decide what to do in such a case.
        if (this.board.getCoordinate(x, y).revealed) {
            return;
        }
        this.board.getCoordinate(x, y).flagged = !this.board.getCoordinate(x, y).flagged;
    }

    uncover(x: number, y: number): void {
        if (this.status !== GameStatus.STARTED) {
            throw new GameNotStarted();
        }
        // If the field is flagged we just silently return and no actions are performed.
        const field = this.board.getCoordinate(x, y);
        if (field.flagged) {
            console.log('flagged');
            return;
        }
        if (field.bomb) {
            // Avoid losing at first uncover
            if (this.revealedFields > 0) {
                this.lose();
                return;
            }
            field.bomb = false;
            this.swapBomb(x, y);
        }
        // Part of a cluster of no neighbour bombs. Reveal until there are neighbours.
        if (field.neighbourBombs === 0) {
            this.revealTilesFrom(x, y);
        } else {
            field.revealed = true;
            this.revealedFields++;
        }
        if (this.revealedFields === this.board.width() * this.board.height() - this.mines) {
            this.win();
        }
    }

    private swapBomb(x: number, y: number): void {
        this.board.swapBomb(x, y);
    }

    private revealTilesFrom(x: number, y: number): void {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                try {
                    const f = this.board.getCoordinate(i, j);
                    if (!f.revealed) {
                        f.revealed = true;
                        this.revealedFields++;
                        if (f.neighbourBombs === 0) {
                            this.revealTilesFrom(i, j);
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
        }
    }

    finish() {
        this.status = GameStatus.FINISHED;
    }

    win() {
        this.finish();
        this.won++;
        console.log(green('You won this game!'));
    }

    lose() {
        this.finish();
        this.lost++;
        console.log(red('You lost...'));
    }

    reset(width: number, height: number, mines: number) {
        this.status = GameStatus.READY;
        this.generateBoard(width, height, mines);
    }
}
