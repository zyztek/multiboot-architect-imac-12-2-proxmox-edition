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
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アカサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレヱゲゼデベペオコソトノホモヨロヲゴゾドボポ";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const newColumns = Math.floor(width / fontSize);
      if (newColumns > drops.length) {
        for (let i = drops.length; i < newColumns; i++) drops[i] = 1;
      }
    };
    const draw = () => {
      // Trail effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        // Alternate between Cyan and Magenta for Singularity theme
        const isMagenta = i % 15 === 0;
        ctx.fillStyle = isMagenta ? '#ff00ff' : '#00ffff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = isMagenta ? '#ff00ff' : '#00ffff';
        ctx.font = `${fontSize}px JetBrains Mono`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        // Variable speed by updating drop position
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