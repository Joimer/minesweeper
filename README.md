# Minesweeper REPL

This is a Minesweeper game implemented for REPL using Node and TypeScript.

In Minesweeper, you have a board where N bombs are hidden in M fields, where M > N, and you have to find those using hints from uncovered fields.

The board starts fully covered, but the first uncovering will never result in a blow. This is a key rule but sometimes ignored by implementations.

The player may flag fields that they consider have bombs, in order to keep track of possibilities and avoid accidentally exploding.

## Building and running

You are going to need npm installed on the system to get dependencies and run the program.
While being on the root folder, run `npm install`. After that, you can play by just running `npm start`.

## Considerations during development

There was a hard time limit of three hours for this development.

As such, the first consideration is: Minesweeper implementation is a non trivial problem.

A randomly generated board is easy to do, however, this leads to boards that are unwinnable without guessing, which is undesirable. The solution to this is to implement a game solver that will be passed on step 2 of board generation and will attempt to fix an unfixable board, but this possesses a challenge by itself due to the time constraint. Minesweeper is a NP-complete game, and some board combinations may take too much time to solve to process in board generation.

So I started with a naive implementation to build upon.

While the generation of the board itself and the placing of the mines could be done in the same run and save an iteration on all board fields, I decided to go with a separate run for populating the board, thus allowing a developer to implement any arbitrary population strategy, as I aim to make the code open ended to extension.

The game mechanics themselves should be as separate as possible from the interface, in this case a simple REPL, since you should be able to get the engine itself and port it elsewhere where you can have another kind of UI, ie. a canvas in HTML5 in a browser.

For filling all fields with no mines, I went instantly with a recursive flood fill, after the fact I thought that for larger boards it should be a queue version of it.

For swapping the initial mine I went with a similar algorithm to find the closest non mine field and place it there. In an improved version of the game this would be checked to see if the game is still solvable, that can be achieved by grouping fields as clusters and finding intersections where the probability of having a bomb on revealed surroundings is still 50%.
