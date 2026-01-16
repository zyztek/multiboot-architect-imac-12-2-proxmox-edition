import React, { useEffect, useRef } from 'react';
export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アカサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレヱゲゼデベペオコ���トノホモヨロヲゴゾドボポ";
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = new Array(columns).fill(1);
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const newColumns = Math.floor(width / fontSize);
      if (newColumns !== columns) {
        const newDrops = new Array(newColumns).fill(1);
        for (let i = 0; i < Math.min(columns, newColumns); i++) {
          newDrops[i] = drops[i];
        }
        drops = newDrops;
        columns = newColumns;
      }
    };
    const draw = () => {
      if (!ctx) return;
      // Trail effect with higher opacity for cleaner background
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px JetBrains Mono`;
      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const isMagenta = i % 15 === 0;
        ctx.fillStyle = isMagenta ? '#ff00ff' : '#00ffff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = isMagenta ? '#ff00ff' : '#00ffff';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        // Variable speed
        drops[i] += Math.random() > 0.5 ? 1 : 0.5;
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    window.addEventListener('resize', resize);
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{ filter: 'contrast(1.2) brightness(0.8)' }}
    />
  );
};