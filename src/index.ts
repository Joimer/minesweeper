import { newGame, uncover, flag, help, forfeit } from "./command";
import { Game } from "./game";
import { populateRandomly } from "./population-strategy";
import { ReadlineRepl } from "./readline";
import { cyanBg } from "./util";

// Global game instance.
const game: Game = new Game(populateRandomly);

// Introduction to player
console.log(cyanBg('Welcome to REPL Minesweeper!'));
console.log('To create a game, type `newgame x y z`, where x is width, y is height, and z is number of mines.');
console.log('To play, use the following commands:');
console.log('`open x y` to discover a field on coordinates x,y and `flag x y` to flag and unflag the field on x,y.');

const repl = new ReadlineRepl(game);
repl.registerCommand('newgame', newGame);
repl.registerCommand('open', uncover);
repl.registerCommand('flag', flag);
repl.registerCommand('forfeit', forfeit);
repl.registerCommand('help', help);
repl.question();
