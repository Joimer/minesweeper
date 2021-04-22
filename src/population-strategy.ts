import { Board } from "./board";
import { random } from "./util";

// Populates a board with mines with arbitrary rules.
export type PopulationStrategy = (board: Board, mines: number) => void;

export function populateRandomly(board: Board, mines: number): void {
    // To make sure the loop completes.
    // The command takes care of this, but this should also work in a vacuum.
    mines = Math.min(mines, board.width() * board.height() - 1);
    while (mines > 0) {
        const randX = random(0, board.width() - 1);
        const randY = random(0, board.height() - 1);
        let field = board.getCoordinate(randX, randY);
        if (field.bomb) {
            continue;
        }
        board.placeBomb(randX, randY);
        mines--;
    }
}
