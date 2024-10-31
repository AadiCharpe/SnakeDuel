import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

kaboom({
    width: 600,
    height: 600
});

scene("title", ()=>{
    add([
        rect(width(), height()),
        color(212, 7, 78)
    ])
    add([
        text("Snake Duel"),
        anchor("center"),
        pos(width() / 2, height() / 4),
        scale(1.75)
    ])
    add([
        text("Player 1: WASD\nPlayer 2: Arrow Keys"),
        anchor("center"),
        pos(width() / 2, height() / 2)
    ])
    add([
        text("Go for the apple and don't collide!"),
        anchor("center"),
        pos(width() / 2, height() / 1.25),
        scale(0.75)
    ])
    add([
        text("Press Space to Start"),
        anchor("center"),
        pos(width() / 2, height() / 1.125)
    ])
    onKeyPress("space", ()=>{go("game")});
});

scene("game", () => {
    const background = add([
        rect(width(), height()),
        color(27, 232, 78)
    ]);

    let snake1 = [[80, 320]];
    let snake1Dir = 0;
    let snake1Head, snake1Body = [];

    let snake2 = [[480, 320]];
    let snake2Dir = 0;
    let snake2Head, snake2Body = [];

    let running = true;

    const apple = add([
        rect(39, 39),
        anchor("center"),
        pos(Math.round((Math.random() * 600) / 40) * 40 - 20, Math.round((Math.random() * 600) / 40) * 40 - 20),
        color(255, 0, 0),
        area(),
        "apple"
    ]);

    onKeyPress("w", () => { snake1Dir = 1; });
    onKeyPress("a", () => { snake1Dir = 2; });
    onKeyPress("s", () => { snake1Dir = 3; });
    onKeyPress("d", () => { snake1Dir = 4; });

    onKeyPress("up", () => { snake2Dir = 1; });
    onKeyPress("left", () => { snake2Dir = 2; });
    onKeyPress("down", () => { snake2Dir = 3; });
    onKeyPress("right", () => { snake2Dir = 4; });

    onKeyPress("space", () => {
        if(running == false)
            go("game");
    });

    onCollide("snake1head", "snake2body", () => {
        win(2);
    });

    onCollide("snake2head", "snake1body", () => {
        win(1);
    });

    onCollide("snake1head", "apple", () => {
        apple.pos.x = Math.round((Math.random() * 600) / 40) * 40 - 20;
        apple.pos.y = Math.round((Math.random() * 600) / 40) * 40 - 20;
        // Add a new body part based on the current head position
        let newPart = [...snake1[snake1.length - 1]];
        if (snake1Dir == 1) newPart[1] += 40; // up
        if (snake1Dir == 2) newPart[0] -= 40; // left
        if (snake1Dir == 3) newPart[1] -= 40; // down
        if (snake1Dir == 4) newPart[0] += 40; // right
        snake1.push(newPart);
    });

    onCollide("snake2head", "apple", () => {
        apple.pos.x = Math.round((Math.random() * 600) / 40) * 40 - 20;
        apple.pos.y = Math.round((Math.random() * 600) / 40) * 40 - 20;
        // Add a new body part based on the current head position
        let newPart = [...snake2[snake2.length - 1]];
        if (snake2Dir == 1) newPart[1] += 40; // up
        if (snake2Dir == 2) newPart[0] -= 40; // left
        if (snake2Dir == 3) newPart[1] -= 40; // down
        if (snake2Dir == 4) newPart[0] += 40; // right
        snake2.push(newPart);
    });

    loop(0.25, () => {
        if(running == true) {
            if (snake1.length > 1) {
                for (let i = snake1.length - 1; i > 0; i--) {
                    snake1[i] = [...snake1[i - 1]];
                }
            }

            if (snake2.length > 1) {
                for (let i = snake2.length - 1; i > 0; i--) {
                    snake2[i] = [...snake2[i - 1]];
                }
            }

            if (snake1Dir == 1) snake1[0][1] -= 40; // up
            if (snake1Dir == 2) snake1[0][0] -= 40; // left
            if (snake1Dir == 3) snake1[0][1] += 40; // down
            if (snake1Dir == 4) snake1[0][0] += 40; // right

            if (snake2Dir == 1) snake2[0][1] -= 40; // up
            if (snake2Dir == 2) snake2[0][0] -= 40; // left
            if (snake2Dir == 3) snake2[0][1] += 40; // down
            if (snake2Dir == 4) snake2[0][0] += 40; // right

            // Draw the head
            if (!snake1Head) {
                snake1Head = add([
                    rect(40, 40),
                    pos(snake1[0][0], snake1[0][1]),
                    color(235, 130, 7),
                    area(),
                    "snake1head"
                ]);
            } else {
                snake1Head.pos.x = snake1[0][0];
                snake1Head.pos.y = snake1[0][1];
            }

            if (!snake2Head) {
                snake2Head = add([
                    rect(40, 40),
                    pos(snake2[0][0], snake2[0][1]),
                    color(7, 130, 235),
                    area(),
                    "snake2head"
                ]);
            } else {
                snake2Head.pos.x = snake2[0][0];
                snake2Head.pos.y = snake2[0][1];
            }

            // Draw the body
            // Clear existing body segments first
            destroyAll("snake1body");
            snake1Body = []; // Reset the body array

            destroyAll("snake2body");
            snake2Body = [];

            for (let i = 1; i < snake1.length; i++) {
                const bodyPart = add([
                    rect(40, 40),
                    pos(snake1[i][0], snake1[i][1]),
                    color(235, 130, 7),
                    area(),
                    "snake1body"
                ]);
                snake1Body.push(bodyPart);
            }

            for (let i = 1; i < snake2.length; i++) {
                const bodyPart = add([
                    rect(40, 40),
                    pos(snake2[i][0], snake2[i][1]),
                    color(7, 130, 235),
                    area(),
                    "snake2body"
                ]);
                snake2Body.push(bodyPart);
            }

            if(snake1Head.pos.x < 0 || snake1Head.pos.x >= 600 || snake1Head.pos.y < 0 || snake1Head.pos.y > 600) {
                win(2);
            }

            if(snake2Head.pos.x < 0 || snake2Head.pos.x >= 600 || snake2Head.pos.y < 0 || snake2Head.pos.y > 600) {
                win(1);
            }
        }
    });

    function win(player) {
        add([
            text(player == 1 ? "Snake 1 Wins" : "Snake 2 Wins"),
            anchor("center"),
            pos(300, 200),
            color(player == 1 ? 235 : 7, 130, player == 1 ? 7 : 235),
            scale(1.75)
        ])
        add([
            text("Press Space to Restart"),
            anchor("center"),
            pos(300, 300)
        ])
        running = false;
    }
});

go("title");