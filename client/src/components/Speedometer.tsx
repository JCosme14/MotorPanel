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
    const size = 240;
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
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#0066CC';
    ctx.stroke();
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
    
    // Draw speed arc
    const speedRatio = displaySpeed / maxSpeed;
    const startAngle = Math.PI * 0.75; // Start at 135 degrees
    const endAngle = startAngle + (Math.PI * 1.5 * Math.min(speedRatio, 1)); // Max 270 degrees arc
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, startAngle, endAngle);
    ctx.lineCap = 'round';
    ctx.lineWidth = 12;
    
    // Create gradient for speed arc
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#0066CC');
    gradient.addColorStop(0.7, '#0066CC');
    gradient.addColorStop(1, '#FF9500');
    
    ctx.strokeStyle = gradient;
    ctx.stroke();
    
    // Draw tick marks
    for (let i = 0; i <= maxSpeed; i += 40) {
      const angle = startAngle + (i / maxSpeed) * Math.PI * 1.5;
      
      const innerRadius = radius - 20;
      const outerRadius = radius - 5;
      
      const startX = centerX + innerRadius * Math.cos(angle);
      const startY = centerY + innerRadius * Math.sin(angle);
      const endX = centerX + outerRadius * Math.cos(angle);
      const endY = centerY + outerRadius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
      
      // Draw numbers for major ticks
      if (i > 0) {
        const textRadius = radius - 35;
        const textX = centerX + textRadius * Math.cos(angle);
        const textY = centerY + textRadius * Math.sin(angle);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Roboto Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i.toString(), textX, textY);
      }
    }
  }, [displaySpeed, maxSpeed]);
  
  return (
    <div className="speedometer mb-2 relative">
      <canvas 
        ref={canvasRef} 
        className="w-[240px] h-[240px]"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="speed-unit font-medium text-xl text-gray-600 dark:text-gray-300 mb-1">
          {speedUnit}
        </div>
        <div className="speed-value font-mono font-bold text-[60px] leading-tight text-primary">
          {Math.round(displaySpeed)}
        </div>
      </div>
      
      {/* RPM indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center bg-black/30 rounded-full px-3 py-1">
        <div className="font-mono text-xs">RPM</div>
        <div className="font-mono font-bold text-secondary">{Math.round(motorcycleData.rpm/100)/10}k</div>
      </div>
      
      {/* Gear indicator */}
      <div className="absolute top-3 right-3 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
        <span className="font-bold">{motorcycleData.gear}</span>
      </div>
    </div>
  );
};

export default Speedometer;
