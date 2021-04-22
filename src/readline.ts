import * as readline from 'readline';
import { Command, printGame } from './command';
import { Game, GameStatus } from './game';

export class ReadlineRepl {
    rl: readline.Interface;
    commands: Map<string, Function>;
    game: Game;

    constructor(game: Game) {
        this.game = game;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.commands = new Map<string, Command>();
    }

    question() {
        this.rl.question('> ', this.parseCommand.bind(this));
    }

    registerCommand(name: string, command: Command): void {
        this.commands.set(name, command);
    }

    parseCommand(entry: string): void {
        if (typeof entry !== undefined) {
            const parts = entry.split(' ');
            const command = '' + parts.shift();
            if (this.commands.has(command)) {
                this.execute(command, parts);
            }
        }
        this.question();
    }

    execute(command: string, parts: string[]): void {
        if (this.commands.has(command)) {
            try {
                console.log(this.commands.get(command)!(this.game, parts));
            } catch (e) {
                console.log(e.message);
                if (this.game.status !== GameStatus.READY) {
                    console.log(printGame(this.game, false));
                }
            }
        }
    }

    close() {
        this.rl.close();
    }
}
