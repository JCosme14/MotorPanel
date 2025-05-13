import React, { useEffect, useRef } from 'react';
import { useDashboard } from '@/lib/dashboardContext';

interface SpeedometerProps {
  maxSpeed?: number;
  type: 'speed' | 'rpm';
}

const Speedometer: React.FC<SpeedometerProps> = ({ maxSpeed = 200, type }) => {
  const { motorcycleData } = useDashboard();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Determinar o valor e configurações com base no tipo de velocímetro
  const getValue = () => {
    if (type === 'rpm') {
      return Math.round(motorcycleData.rpm / 100) / 10;
    } else {
      return Math.round(motorcycleData.speed);
    }
  };
  
  const getUnit = () => {
    if (type === 'rpm') {
      return 'x1000r/min';
    } else {
      return 'km/h';
    }
  };
  
  const getMaxValue = () => {
    if (type === 'rpm') {
      return 10; // 10000 RPM max
    } else {
      return maxSpeed;
    }
  };
  
  const getValue100Percent = () => {
    if (type === 'rpm') {
      return motorcycleData.rpm / 10000;
    } else {
      return motorcycleData.speed / maxSpeed;
    }
  };
  
  const getValueDisplay = () => {
    if (type === 'rpm') {
      return getValue() + 'k';
    } else {
      return getValue().toString();
    }
  };
  
  const getTickInterval = () => {
    if (type === 'rpm') {
      return 2; // de 2 em 2k
    } else {
      return 40; // de 40 em 40 km/h
    }
  };
  
  const getColor = () => {
    if (type === 'rpm') {
      return {
        primary: '#EF4444', // red-500
        secondary: '#F59E0B', // amber-500
        tertiary: '#EF4444'  // red-500
      };
    } else {
      return {
        primary: '#2563EB', // blue-600
        secondary: '#2563EB', // blue-600
        tertiary: '#F59E0B'  // amber-500
      };
    }
  };
  
  // Draw speedometer on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const size = 160;
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Constants
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 8;
    const colors = getColor();
    const maxVal = getMaxValue();
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = type === 'rpm' ? colors.primary : colors.primary;
    ctx.stroke();
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(17, 24, 39, 0.7)'; // gray-900 with opacity
    ctx.fill();
    
    // Draw speed/rpm arc
    const valueRatio = getValue100Percent();
    const startAngle = Math.PI * 0.75; // Start at 135 degrees
    const endAngle = startAngle + (Math.PI * 1.5 * Math.min(valueRatio, 1)); // Max 270 degrees arc
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 6, startAngle, endAngle);
    ctx.lineCap = 'round';
    ctx.lineWidth = 8;
    
    // Create gradient for speed arc
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.7, colors.secondary);
    gradient.addColorStop(1, colors.tertiary);
    
    ctx.strokeStyle = gradient;
    ctx.stroke();
    
    // Draw tick marks
    const interval = getTickInterval();
    for (let i = 0; i <= maxVal; i += interval) {
      const angle = startAngle + (i / maxVal) * Math.PI * 1.5;
      
      const innerRadius = radius - 15;
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
        const textRadius = radius - 28;
        const textX = centerX + textRadius * Math.cos(angle);
        const textY = centerY + textRadius * Math.sin(angle);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Roboto Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i.toString(), textX, textY);
      }
    }
  }, [motorcycleData, type]);
  
  return (
    <div className="speedometer relative flex justify-center items-center">
      <canvas 
        ref={canvasRef} 
        className="w-[160px] h-[160px]"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="speed-unit font-medium text-sm text-gray-300 mb-0">
          {getUnit()}
        </div>
        <div className={`speed-value font-mono font-bold text-[40px] leading-tight ${type === 'rpm' ? 'text-red-400' : 'text-blue-400'}`}>
          {getValueDisplay()}
        </div>
      </div>
    </div>
  );
};

export default Speedometer;
