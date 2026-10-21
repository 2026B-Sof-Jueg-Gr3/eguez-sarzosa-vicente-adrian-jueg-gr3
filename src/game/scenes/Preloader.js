import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(512, 384, 'background');

        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress) => {

            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
    }

    create ()
    {
        this.createCarritoTexture();
        this.createTreeTexture();

        this.scene.start('MainMenu');
    }

    createCarritoTexture ()
    {
        if (this.textures.exists('carrito'))
        {
            return;
        }

        const graphic = this.make.graphics({ add: false });

        graphic.fillStyle(0x111111, 0.28);
        graphic.fillRoundedRect(12, 12, 40, 78, 12);

        graphic.fillStyle(0xc1121f, 1);
        graphic.fillRoundedRect(8, 4, 48, 84, 14);

        graphic.fillStyle(0x8ecae6, 1);
        graphic.fillRoundedRect(16, 18, 32, 22, 6);

        graphic.fillStyle(0xf8f9fa, 1);
        graphic.fillCircle(20, 12, 4);
        graphic.fillCircle(44, 12, 4);

        graphic.fillStyle(0x212529, 1);
        graphic.fillRoundedRect(0, 16, 10, 20, 3);
        graphic.fillRoundedRect(54, 16, 10, 20, 3);
        graphic.fillRoundedRect(0, 58, 10, 20, 3);
        graphic.fillRoundedRect(54, 58, 10, 20, 3);

        graphic.generateTexture('carrito', 64, 96);
        graphic.destroy();
    }

    createTreeTexture ()
    {
        if (this.textures.exists('arbol'))
        {
            return;
        }

        const graphic = this.make.graphics({ add: false });

        graphic.fillStyle(0x6f4e37, 1);
        graphic.fillRect(20, 30, 8, 16);
        graphic.fillStyle(0x2d6a4f, 1);
        graphic.fillCircle(24, 18, 16);
        graphic.fillStyle(0x40916c, 1);
        graphic.fillCircle(16, 22, 10);
        graphic.fillCircle(32, 22, 10);

        graphic.generateTexture('arbol', 48, 48);
        graphic.destroy();
    }
}
