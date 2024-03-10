import { useEffect, useRef } from 'react';
import { GlowParticle, Color } from './glowParticle.ts';

const COLORS: Color[] = [
  { r: 45, g: 74, b: 277 }, //blue,
  { r: 250, g: 255, b: 89 }, //yellow
  { r: 255, g: 104, b: 248 }, //purple
  { r: 44, g: 209, b: 252 }, //skyblue
  { r: 54, g: 233, b: 84 }, //green
];

function GradientBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let stageWidth = window.innerWidth;
  let stageHeight = window.innerHeight;
  let totalParticles = 15;
  let particles: GlowParticle[] = [];
  let maxRadius = 900;
  let minRadius = 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    const resize = () => {
      stageWidth = window.innerWidth;
      stageHeight = window.innerHeight;

      canvas.width = stageWidth * pixelRatio;
      canvas.height = stageHeight * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);

      ctx.globalCompositeOperation = 'saturation';

      createParticles();
    };

    const createParticles = () => {
      let currColor = 0;
      particles = [];

      for (let i = 0; i < totalParticles; i++) {
        const item = new GlowParticle(
          Math.random() * stageWidth,
          Math.random() * stageHeight,
          Math.random() * (maxRadius - minRadius) + minRadius,
          COLORS[currColor]
        );

        if (++currColor >= COLORS.length) {
          currColor = 0;
        }

        particles[i] = item;
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);

      if (!ctx) return;

      ctx.clearRect(0, 0, stageWidth, stageHeight);

      for (let i = 0; i < totalParticles; i++) {
        const item = particles[i];
        if (item) {
          item.animate(ctx, stageWidth, stageHeight);
        }
      }
    };

    window.addEventListener('resize', resize, false);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default GradientBg;
