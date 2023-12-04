import { Body, Bodies, Engine, Render, Runner, World, Events } from "matter-js";
// matter-js : ��������
import { FRUITS } from "./fruits";

const engine = Engine.create();
const render = Render.create({
    engine,
    element: document.body, // ������ ���� �׸���
    options: {
        wireframes: false,
        background: "#F7F4C8",
        width: 620,
        height: 850,
    }
});

const world = engine.world;

// ���ʺ�
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true, // ���������� ���� ���� �������� ���� ������, ����
    render: { fillStyle: "#E6B143" }
});

// �����ʺ�
const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true, 
    render: { fillStyle: "#E6B143" }
});

// �Ʒ��ʺ�
const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: { fillStyle: "#E6B143" }
});

// GameOver ��
const topLine = Bodies.rectangle(310, 150, 620, 2, {
    name : "topLine",
    isStatic: true,
    isSensor: true, // �ε������ʰ� ������ ��
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
    const index = Math.floor(Math.random() * 5); // 0~5������ ���ϵ��� �������� �����Բ�
    const fruit = FRUITS[index];

    const body = Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping:true, // ������ ���������ʰ� �غ����
        render: {
            sprite: { texture: `${fruit.name}.png` }
        },
        restitution:0.5, // ���Ͽ� ź���ֱ�
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
                if (currentBody.position.x - currentFruit.radius > 30) // �� ������ ������ �ȿ����̵���
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

            setTimeout(() => { // ���� �ð� �Ŀ� �ȿ� �ִ� �ڵ� �۵�
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
            } // �����ϰ��
            
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

            // ���� ���� ���� : ȣ�� 2�� �����
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

        // ���� ���� ���� : topLine�� ������ ���� ��
        if (
            !disableAction &&
            (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine"))
            alert("Game Over");

    });
})

addFruit();