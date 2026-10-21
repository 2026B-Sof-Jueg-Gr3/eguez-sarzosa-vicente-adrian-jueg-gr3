import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.text(512, 250, 'Carrito', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
            stroke: '#1b4332', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 360, 'Vista desde arriba\nLa cámara sigue al carrito', {
            fontFamily: 'Arial', fontSize: 28, color: '#f8f9fa',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 500, 'Clic, Enter o toca la pantalla para salir', {
            fontFamily: 'Arial', fontSize: 22, color: '#ffe066',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });

        this.input.keyboard.once('keydown-ENTER', () => {

            this.scene.start('Game');

        });
    }
}
