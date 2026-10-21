import { Math as PhaserMath, Scene } from 'phaser';

const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 4600;
const ROAD_HALF = 120;
const SPEED = 320;

const ROAD = [
    { x: 800, y: 180 },
    { x: 800, y: 760 },
    { x: 460, y: 1280 },
    { x: 460, y: 1760 },
    { x: 1140, y: 2280 },
    { x: 1140, y: 2760 },
    { x: 800, y: 3280 },
    { x: 620, y: 3780 },
    { x: 800, y: 4300 }
];

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.finished = false;
        this.startedAt = this.time.now;
        this.pad = { up: false, down: false, left: false, right: false };

        this.cameras.main.setBackgroundColor(0x1b4332);
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        this.drawGround();
        this.drawRoad();
        this.drawTrees();
        this.drawStartAndFinish();

        this.carrito = this.physics.add.sprite(ROAD[0].x, ROAD[0].y, 'carrito');
        this.carrito.setCollideWorldBounds(true);
        this.carrito.setDepth(5);

        const finish = this.add.rectangle(ROAD[ROAD.length - 1].x, ROAD[ROAD.length - 1].y, 340, 56, 0xffffff, 0);
        this.physics.add.existing(finish, true);
        this.physics.add.overlap(this.carrito, finish, () => this.reachFinish(), null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });

        // https://docs.phaser.io/phaser/concepts/cameras
        const camera = this.cameras.main;
        camera.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        camera.startFollow(this.carrito, true, 0.1, 0.1);

        this.createHud();
    }

    drawGround ()
    {
        this.add.rectangle(
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2,
            WORLD_WIDTH,
            WORLD_HEIGHT,
            0x2d6a4f
        );
    }

    drawRoad ()
    {
        const asphalt = this.add.graphics();
        asphalt.lineStyle(ROAD_HALF * 2, 0x343a40, 1);
        asphalt.beginPath();
        asphalt.moveTo(ROAD[0].x, ROAD[0].y);

        for (let index = 1; index < ROAD.length; index++)
        {
            asphalt.lineTo(ROAD[index].x, ROAD[index].y);
        }

        asphalt.strokePath();

        const marks = this.add.graphics();
        marks.lineStyle(8, 0xffe066, 1);

        for (let index = 0; index < ROAD.length - 1; index++)
        {
            const from = ROAD[index];
            const to = ROAD[index + 1];
            const length = PhaserMath.Distance.Between(from.x, from.y, to.x, to.y);
            const steps = Math.floor(length / 48);

            for (let step = 0; step < steps; step += 2)
            {
                const start = step / steps;
                const end = Math.min((step + 1) / steps, 1);
                marks.beginPath();
                marks.moveTo(
                    PhaserMath.Linear(from.x, to.x, start),
                    PhaserMath.Linear(from.y, to.y, start)
                );
                marks.lineTo(
                    PhaserMath.Linear(from.x, to.x, end),
                    PhaserMath.Linear(from.y, to.y, end)
                );
                marks.strokePath();
            }
        }
    }

    drawTrees ()
    {
        let seed = 2026;
        const random = () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };

        for (let count = 0; count < 70; count++)
        {
            const x = 80 + random() * (WORLD_WIDTH - 160);
            const y = 80 + random() * (WORLD_HEIGHT - 160);

            if (this.distanceToRoad(x, y) < 200)
            {
                continue;
            }

            this.add.image(x, y, 'arbol').setDepth(2);
        }
    }

    drawStartAndFinish ()
    {
        const start = ROAD[0];
        const finish = ROAD[ROAD.length - 1];

        const banner = (x, y, label, color) => {
            this.add.rectangle(x, y, 280, 36, color).setDepth(3);
            this.add.text(x, y, label, {
                fontFamily: 'Arial Black', fontSize: 18, color: '#111111'
            }).setOrigin(0.5).setDepth(4);
        };

        banner(start.x, start.y - 70, 'SALIDA', 0x95d5b2);
        banner(finish.x, finish.y, 'META', 0xffffff);
    }

    createHud ()
    {
        const style = {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        };

        this.add.text(24, 20, 'Vista desde arriba', style)
            .setScrollFactor(0)
            .setDepth(10);

        this.add.text(24, 50, 'Flechas o WASD. La cámara sigue al carrito.', style)
            .setScrollFactor(0)
            .setDepth(10);

        this.timeLabel = this.add.text(24, 84, '0.0 s', style)
            .setScrollFactor(0)
            .setDepth(10);

        this.addPad(860, 620, '↑', 'up');
        this.addPad(860, 710, '↓', 'down');
        this.addPad(770, 710, '←', 'left');
        this.addPad(950, 710, '→', 'right');
    }

    addPad (x, y, label, direction)
    {
        let held = false;
        const button = this.add.circle(x, y, 36, 0x081c15, 0.72)
            .setScrollFactor(0)
            .setDepth(10)
            .setInteractive();

        this.add.text(x, y, label, {
            fontFamily: 'Arial',
            fontSize: 26,
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(11);

        const press = () => {
            held = true;
            this.pad[direction] = true;
        };

        const release = () => {
            if (!held)
            {
                return;
            }

            held = false;
            this.pad[direction] = false;
        };

        button.on('pointerdown', press);
        button.on('pointerup', release);
        button.on('pointerout', release);
    }

    distanceToRoad (x, y)
    {
        let best = Number.POSITIVE_INFINITY;

        for (let index = 0; index < ROAD.length - 1; index++)
        {
            const from = ROAD[index];
            const to = ROAD[index + 1];
            const distance = this.distanceToSegment(x, y, from.x, from.y, to.x, to.y);
            best = Math.min(best, distance);
        }

        return best;
    }

    distanceToSegment (px, py, ax, ay, bx, by)
    {
        const abx = bx - ax;
        const aby = by - ay;
        const lengthSq = abx * abx + aby * aby;
        const t = lengthSq === 0
            ? 0
            : PhaserMath.Clamp(((px - ax) * abx + (py - ay) * aby) / lengthSq, 0, 1);

        return PhaserMath.Distance.Between(px, py, ax + abx * t, ay + aby * t);
    }

    reachFinish ()
    {
        if (this.finished)
        {
            return;
        }

        this.finished = true;
        this.carrito.setVelocity(0, 0);

        this.time.delayedCall(350, () => {
            this.scene.start('GameOver', { ms: this.time.now - this.startedAt });
        });
    }

    update ()
    {
        if (this.finished)
        {
            return;
        }

        const seconds = ((this.time.now - this.startedAt) / 1000).toFixed(1);
        this.timeLabel.setText(`${seconds} s`);

        let x = 0;
        let y = 0;

        if (this.cursors.left.isDown || this.keys.left.isDown || this.pad.left)
        {
            x -= 1;
        }

        if (this.cursors.right.isDown || this.keys.right.isDown || this.pad.right)
        {
            x += 1;
        }

        if (this.cursors.up.isDown || this.keys.up.isDown || this.pad.up)
        {
            y -= 1;
        }

        if (this.cursors.down.isDown || this.keys.down.isDown || this.pad.down)
        {
            y += 1;
        }

        if (x === 0 && y === 0)
        {
            this.carrito.setVelocity(0, 0);
            return;
        }

        const length = Math.hypot(x, y);
        const velocityX = (x / length) * this.currentSpeed();
        const velocityY = (y / length) * this.currentSpeed();

        this.carrito.setVelocity(velocityX, velocityY);
        this.carrito.rotation = Math.atan2(velocityY, velocityX) + Math.PI / 2;
    }

    currentSpeed ()
    {
        const onRoad = this.distanceToRoad(this.carrito.x, this.carrito.y) <= ROAD_HALF;

        return onRoad ? SPEED : SPEED * 0.45;
    }
}
