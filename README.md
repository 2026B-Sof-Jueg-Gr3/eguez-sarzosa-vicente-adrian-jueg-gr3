# Carrito

Juego en vista cenital: un carrito sale desde arriba y la cámara lo sigue hasta la meta.

Hecho con la [plantilla oficial Phaser + Vite](https://github.com/phaserjs/template-vite) (Phaser 4.0.0). La cámara usa [`startFollow`](https://docs.phaser.io/phaser/concepts/cameras) y `setBounds`.

## Controles

- Flechas o WASD
- Botones en pantalla, en móvil

Fuera del asfalto el carrito va más lento. Llega a la meta al final del camino.

## Desarrollo

```bash
npm install
npm run dev
```

El servidor queda en http://localhost:8080.

```bash
npm run build
```

La build de producción queda en `dist/`. El sitio público se publica con GitHub Pages desde ese artefacto.

## Licencia

MIT. El código de la plantilla es de Phaser Studio.
