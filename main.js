import { Bodies, Engine, Render, Runner, World } from "matter-js";
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
    isStatic: true,
    render: { fillStyle: "#E6B143" }
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);