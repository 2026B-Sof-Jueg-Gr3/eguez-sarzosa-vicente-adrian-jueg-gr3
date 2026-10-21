import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init (data)
    {
        this.elapsedMs = data.ms ?? 0;
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x1b4332);

        const seconds = (this.elapsedMs / 1000).toFixed(1);

        this.add.text(512, 280, 'Meta', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 400, `Llegaste en ${seconds} s`, {
            fontFamily: 'Arial', fontSize: 32, color: '#ffe066',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 500, 'Clic para volver a salir', {
            fontFamily: 'Arial', fontSize: 22, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
