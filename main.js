import { Body, Bodies, Engine, Render, Runner, World, Events } from "matter-js";
// matter-js : 물리엔진
import { FRUITS } from "./fruits";

const engine = Engine.create();
const render = Render.create({
    engine,
    element: document.body, // 게임을 어디다 그릴지
    options: {
        wireframes: false,
        background: "#F7F4C8",
        width: 620,
        height: 850,
    }
});

const world = engine.world;

// 왼쪽벽
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true, // 물리엔진에 의해 벽이 떨어지는 것을 막아줌, 고정
    render: { fillStyle: "#E6B143" }
});

// 오른쪽벽
const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true, 
    render: { fillStyle: "#E6B143" }
});

// 아래쪽벽
const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: { fillStyle: "#E6B143" }
});

// GameOver 선
const topLine = Bodies.rectangle(310, 150, 620, 2, {
    name : "topLine",
    isStatic: true,
    isSensor: true, // 부딪히지않고 감지만 함
    render: { fillStyle: "#E6B143" }
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;
let num_watermelon = 0;
function addFruit() {
    const index = Math.floor(Math.random() * 5); // 0~5사이의 과일들이 랜덤으로 나오게끔
    const fruit = FRUITS[index];

    const body = Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping:true, // 과일이 떨어지지않고 준비상태
        render: {
            sprite: { texture: `${fruit.name}.png` }
        },
        restitution:0.5, // 과일에 탄성주기
    });

    currentBody = body;
    currentFruit = fruit;

    World.add(world, body);
}

window.onkeydown = (event) => {
    if (disableAction) {
        return;
    }
    switch (event.code) {
        case "KeyA":
            if (interval)
                return;

            interval = setInterval(() => {
                if (currentBody.position.x - currentFruit.radius > 30) // 벽 밖으로 과일이 안움직이도록
                    Body.setPosition(currentBody, {
                        x: currentBody.position.x - 1.5,
                        y: currentBody.position.y,
                    });
            },5);
            break;
        case "KeyD":
            if (interval)
                return;

            interval = setInterval(() => {
                if (currentBody.position.x - currentFruit.radius < 590)
                    Body.setPosition(currentBody, {
                        x: currentBody.position.x + 1.5,
                        y: currentBody.position.y,
                    });
            }, 5);
            break;
        case "KeyS":
            currentBody.isSleeping = false;
            disableAction = true;

            setTimeout(() => { // 일정 시간 후에 안에 있는 코드 작동
                addFruit();
                disableAction = false;
            }, 1000);
            break;
    }
}

window.onkeyup = (event) => {
    switch (event.code) {
        case "KeyA":
        case "KeyD":
            clearInterval(interval);
            interval = null;
    }
}

Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
        if (collision.bodyA.index === collision.bodyB.index) {
            const index = collision.bodyA.index;

            if (index === FRUITS.length - 1) {
                return;
            } // 수박일경우
            
            World.remove(world, [collision.bodyA, collision.bodyB])

            const newFruit = FRUITS[index + 1];

            const newBody = Bodies.circle(
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius, {
                    render: { sprite: { texture: `${newFruit.name}.png` } },
                    index: index + 1,
            }
            );
            World.add(world, newBody);

            // 게임 성공 조건 : 호박 2개 만들기
            if (index+1 == 10) {
                num_watermelon++;

                setTimeout(() => {
                    if (num_watermelon == 2) {
                        alert("Success~! congratulation~!");
                        location.reload();
                    }
                }, 500);
                
            }

        }

        // 게임 실패 조건 : topLine에 과일이 닿을 시
        if (
            !disableAction &&
            (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine"))
            alert("Game Over");

    });
})

addFruit();