import React, { useEffect, useRef } from 'react';
import { useDashboard } from '@/lib/dashboardContext';

interface SpeedometerProps {
  maxSpeed?: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ maxSpeed = 200 }) => {
  const { motorcycleData, userSettings } = useDashboard();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Convert km/h to mph if needed
  const displaySpeed = userSettings.speedUnit === 'mph' 
    ? Math.round(motorcycleData.speed * 0.621371) 
    : motorcycleData.speed;
  
  const speedUnit = userSettings.speedUnit === 'mph' ? 'mph' : 'km/h';
  
  // Draw speedometer on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const size = 320;
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Constants
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#0066CC';
    ctx.stroke();
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
    
    // Draw speed arc
    const speedRatio = displaySpeed / maxSpeed;
    const startAngle = Math.PI * 0.75; // Start at 135 degrees
    const endAngle = startAngle + (Math.PI * 1.5 * Math.min(speedRatio, 1)); // Max 270 degrees arc
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 12, startAngle, endAngle);
    ctx.lineCap = 'round';
    ctx.lineWidth = 16;
    
    // Create gradient for speed arc
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#0066CC');
    gradient.addColorStop(0.7, '#0066CC');
    gradient.addColorStop(1, '#FF9500');
    
    ctx.strokeStyle = gradient;
    ctx.stroke();
    
    // Draw tick marks
    for (let i = 0; i <= maxSpeed; i += 20) {
      const angle = startAngle + (i / maxSpeed) * Math.PI * 1.5;
      
      const innerRadius = i % 40 === 0 ? radius - 25 : radius - 20;
      const outerRadius = radius - 5;
      
      const startX = centerX + innerRadius * Math.cos(angle);
      const startY = centerY + innerRadius * Math.sin(angle);
      const endX = centerX + outerRadius * Math.cos(angle);
      const endY = centerY + outerRadius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = i % 40 === 0 ? 3 : 1.5;
      ctx.strokeStyle = i % 40 === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.6)';
      ctx.stroke();
      
      // Draw numbers for major ticks
      if (i % 40 === 0 && i > 0) {
        const textRadius = radius - 45;
        const textX = centerX + textRadius * Math.cos(angle);
        const textY = centerY + textRadius * Math.sin(angle);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Roboto Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i.toString(), textX, textY);
      }
    }
  }, [displaySpeed, maxSpeed]);
  
  return (
    <div className="speedometer mb-6 relative">
      <canvas 
        ref={canvasRef} 
        className="w-[320px] h-[320px]"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="speed-value font-mono font-bold text-[80px] leading-tight text-primary">
          {Math.round(displaySpeed)}
        </div>
        <div className="speed-unit font-medium text-2xl text-gray-600 dark:text-gray-300">
          {speedUnit}
        </div>
      </div>
    </div>
  );
};

export default Speedometer;
