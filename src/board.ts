export type Field = {
    revealed: boolean,
    flagged: boolean,
    bomb: boolean,
    neighbourBombs: number
}

class CoordinateDoesNotExist extends Error {
    constructor() {
        super("The coordinate is not valid in this game's board!");
    }
}

export class Board {
    board: Field[][];

    constructor(width: number, height: number) {
        // It makes no sense for a board to exist with a size less of 1x1, since there must be at least one field for a board to be.
        // Also, either width or height should be bigger than 1 so there are at least 2 fields.
        // Therefore, the optimal minimum should be a 2x2 grid so the game is actually playable.
        width = Math.max(width, 2);
        height = Math.max(height, 2);
        this.board = [];
        for (let i = 0; i < height; i++) {
            this.board[i] = [];
            for (let j = 0; j < width; j++) {
                this.board[i][j] = {
                    revealed: false,
                    flagged: false,
                    bomb: false,
                    neighbourBombs: 0
                };
            }
        }
    }

    getCoordinate(x: number, y: number): Field {
        if (x < 0 || y < 0 || x > this.board[0].length - 1 || y > this.board.length - 1) {
            throw new CoordinateDoesNotExist();
        }
        return this.board[y][x];
    }

    width(): number {
        return this.board[0].length;
    }

    height(): number {
        return this.board.length;
    }

    totalFields(): number {
        return this.width() * this.height();
    }

    placeBomb(x: number, y: number): void {
        let field = this.getCoordinate(x, y);
        field.bomb = true;
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                try {
                    let neighbour = this.getCoordinate(i, j);
                    neighbour.neighbourBombs++;
                } catch (e) {
                    continue;
                }
            }
        }
    }

    swapBomb(x: number, y: number): void {
        const newPos = this.findClosestNonBomb(x, y);
        this.placeBomb(newPos[0], newPos[1]);
        // Update count from neighbours.
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                try {
                    let neighbour = this.getCoordinate(i, j);
                    neighbour.neighbourBombs--;
                } catch (e) {
                    continue;
                }
            }
        }
    }

    private findClosestNonBomb(x: number, y: number): number[] {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                try {
                    const f = this.getCoordinate(i, j);
                    if (f.bomb) {
                        this.findClosestNonBomb(i, j);
                    }
                    return [i, j];
                } catch (e) {
                    continue;
                }
            }
        }

        return [-1, -1];
    }
}
