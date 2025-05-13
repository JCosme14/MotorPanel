import React, { useEffect, useRef } from 'react';
import { useDashboard } from '@/lib/dashboardContext';

interface SpeedometerProps {
  maxSpeed?: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ maxSpeed = 200 }) => {
  const { motorcycleData } = useDashboard();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw speedometer on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions - reduzido para dar mais espaço
    const size = 220;
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
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#2563EB'; // blue-600
    ctx.stroke();
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(17, 24, 39, 0.7)'; // gray-900 with opacity
    ctx.fill();
    
    // Draw speed arc
    const speedRatio = motorcycleData.speed / maxSpeed;
    const startAngle = Math.PI * 0.75; // Start at 135 degrees
    const endAngle = startAngle + (Math.PI * 1.5 * Math.min(speedRatio, 1)); // Max 270 degrees arc
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 8, startAngle, endAngle);
    ctx.lineCap = 'round';
    ctx.lineWidth = 10;
    
    // Create gradient for speed arc
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#2563EB'); // blue-600
    gradient.addColorStop(0.7, '#2563EB'); // blue-600
    gradient.addColorStop(1, '#F59E0B'); // amber-500
    
    ctx.strokeStyle = gradient;
    ctx.stroke();
    
    // Draw tick marks at 40, 80, 120, 160, 200
    for (let i = 0; i <= maxSpeed; i += 40) {
      const angle = startAngle + (i / maxSpeed) * Math.PI * 1.5;
      
      const innerRadius = radius - 18;
      const outerRadius = radius - 4;
      
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
  }, [motorcycleData.speed, maxSpeed]);
  
  // Get gear class for styling
  const getGearClass = () => {
    const gear = motorcycleData.gear;
    if (gear >= 5) return "bg-amber-500"; // High gear
    if (gear >= 3) return "bg-green-500"; // Medium gear
    return "bg-blue-500"; // Low gear
  };
  
  return (
    <div className="speedometer relative flex justify-center items-center">
      <canvas 
        ref={canvasRef} 
        className="w-[220px] h-[220px]"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="speed-unit font-medium text-lg text-gray-300 mb-0">
          km/h
        </div>
        <div className="speed-value font-mono font-bold text-[70px] leading-tight text-white">
          {Math.round(motorcycleData.speed)}
        </div>
      </div>
      
      {/* Indicator Panels */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 flex justify-between items-center">
        {/* RPM indicator */}
        <div className="text-center bg-gray-900/80 rounded-md px-3 py-1">
          <div className="font-mono text-xs text-gray-400">RPM</div>
          <div className="font-mono font-bold text-blue-400 text-lg">{Math.round(motorcycleData.rpm/100)/10}k</div>
        </div>
        
        {/* Gear indicator */}
        <div className={`${getGearClass()} text-white rounded-md px-3 py-1 text-center`}>
          <div className="font-mono text-xs">MARCHA</div>
          <div className="font-mono font-bold text-lg">{motorcycleData.gear}</div>
        </div>
      </div>
      
      {/* Indicator lights - posição ajustada para mais acima */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {/* Left turn signal */}
        <div className={motorcycleData.leftIndicator ? "text-amber-400 animate-pulse" : "text-gray-700"}>
          <span className="material-icons">arrow_back</span>
        </div>
        
        {/* High beam */}
        <div className={motorcycleData.highBeamOn ? "text-blue-400" : "text-gray-700"}>
          <span className="material-icons">highlight</span>
        </div>
        
        {/* Right turn signal */}
        <div className={motorcycleData.rightIndicator ? "text-amber-400 animate-pulse" : "text-gray-700"}>
          <span className="material-icons">arrow_forward</span>
        </div>
      </div>
    </div>
  );
};

export default Speedometer;
