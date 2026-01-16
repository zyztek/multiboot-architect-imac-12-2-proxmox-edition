import React, { useEffect, useRef } from 'react';
export const MouseTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<{ x: number; y: number; age: number }[]>([]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const handleMouseMove = (e: MouseEvent) => {
      points.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (points.current.length > 20) points.current.shift();
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (points.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points.current[0].x, points.current[0].y);
        for (let i = 1; i < points.current.length; i++) {
          const p = points.current[i];
          const opacity = 1 - (i / points.current.length);
          ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.5})`;
          ctx.lineWidth = (1 - opacity) * 4;
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
        }
      }
      points.current.forEach(p => p.age++);
      points.current = points.current.filter(p => p.age < 30);
      animationFrameId = requestAnimationFrame(animate);
    };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};