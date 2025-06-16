"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useDashboard } from "@/lib/dashboardContext"

interface SpeedometerProps {
  maxSpeed?: number
  type: "speed" | "rpm"
  size?: number
}

const Speedometer: React.FC<SpeedometerProps> = ({ maxSpeed = 200, type, size }) => {
  const { motorcycleData } = useDashboard()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [animatedSpeed, setAnimatedSpeed] = useState(0)
  const [animatedRpm, setAnimatedRpm] = useState(0)

  // TABLET RESPONSIVE SIZE - This is the key fix
  const getResponsiveSize = () => {
    if (size) return size

    // Default sizes based on screen size
    if (typeof window !== "undefined") {
      const width = window.innerWidth
      if (width >= 768 && width <= 1024) {
        // Tablet size - much smaller
        return 180
      } else if (width < 768) {
        // Mobile size
        return 220
      }
    }
    // Desktop size
    return 260
  }

  const responsiveSize = getResponsiveSize()

  const getScaledValues = () => {
    const baseSize = responsiveSize
    return {
      lineWidth: baseSize * 0.07,
      tickLength: baseSize * 0.05,
      tickWidth: baseSize * 0.008,
      labelRadiusOffset: baseSize * 0.11,
      labelFontSize: baseSize * 0.046,
      centerValueFontSize: baseSize * 0.22, // For the main number display
      centerUnitFontSize: baseSize * 0.06,  // For the unit text
      centerTextOffset: baseSize * (-0.03),     // Vertical offset for center text
    }
  }

  // Determinar o valor e configurações com base no tipo de velocímetro
  const getValue = () => {
    if (type === "rpm") {
      return Math.round(animatedRpm / 100) / 10
    } else {
      return Math.round(animatedSpeed)
    }
  }

  const getUnit = () => {
    if (type === "rpm") {
      return "x1000r/min"
    } else {
      return "km/h"
    }
  }

  const getMaxValue = () => {
    if (type === "rpm") {
      return 10 // 10000 RPM max
    } else {
      return maxSpeed
    }
  }

  const getValue100Percent = () => {
    if (type === "rpm") {
      return animatedRpm / 10000
    } else {
      return animatedSpeed / maxSpeed
    }
  }

  const getValueDisplay = () => {
    if (type === "rpm") {
      return getValue()
    } else {
      return getValue().toString()
    }
  }

  const getTickInterval = () => {
    if (type === "rpm") {
      return 2 // de 2 em 2k
    } else {
      return 40 // de 40 em 40 km/h
    }
  }

  const getColor = () => {
    if (type === "rpm") {
      return {
        primary: "#EF4444", // red-500
        secondary: "#F59E0B", // amber-500
        tertiary: "#EF4444", // red-500
      }
    } else {
      return {
        primary: "#2563EB", // blue-600
        secondary: "#2563EB", // blue-600
        tertiary: "#F59E0B", // amber-500
      }
    }
  }

useEffect(() => {
  const targetSpeed = motorcycleData.speed
  const targetRpm = motorcycleData.rpm

  const animateValues = () => {
    setAnimatedSpeed((current) => {
      const diff = targetSpeed - current
      if (Math.abs(diff) < 0.1) return targetSpeed
      return current + diff * 0.1 // Smooth interpolation
    })

    setAnimatedRpm((current) => {
      const diff = targetRpm - current
      if (Math.abs(diff) < 10) return targetRpm
      return current + diff * 0.1 // Smooth interpolation
    })
  }

  const intervalId = setInterval(animateValues, 16) // ~60fps

  return () => clearInterval(intervalId)
}, [motorcycleData.speed, motorcycleData.rpm]) 

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = responsiveSize
    canvas.height = responsiveSize

    const centerX = responsiveSize / 2
    const centerY = responsiveSize / 2
    const radius = responsiveSize / 2 - 10
    const scaled = getScaledValues()

    const colors = getColor()
    const maxVal = getMaxValue()
    const valueRatio = getValue100Percent()

    const startAngle = Math.PI * 0.7
    const endAngle = Math.PI * 2.3
    const sweepAngle = (endAngle - startAngle) * Math.min(valueRatio, 1)

    ctx.clearRect(0, 0, responsiveSize, responsiveSize)

    // Background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.lineWidth = scaled.lineWidth
    ctx.strokeStyle = "rgba(30, 41, 59, 0.8)"
    ctx.lineCap = "butt"
    ctx.stroke()

    // Foreground arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sweepAngle)
    ctx.lineWidth = scaled.lineWidth
    ctx.lineCap = "round"
    const gradient = ctx.createLinearGradient(0, 0, responsiveSize, 0)
    gradient.addColorStop(0, colors.primary)
    gradient.addColorStop(0.7, colors.secondary)
    gradient.addColorStop(1, colors.tertiary)
    ctx.strokeStyle = gradient
    ctx.stroke()

    // Ticks and labels
    const interval = getTickInterval()
    for (let i = 0; i <= maxVal; i += interval) {
      const angle = startAngle + (i / maxVal) * (endAngle - startAngle)
      const innerRadius = radius - scaled.tickLength
      const outerRadius = radius + scaled.tickLength * 0.2

      const startX = centerX + innerRadius * Math.cos(angle)
      const startY = centerY + innerRadius * Math.sin(angle)
      const endX = centerX + outerRadius * Math.cos(angle)
      const endY = centerY + outerRadius * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.lineWidth = scaled.tickWidth
      ctx.strokeStyle = "#FFFFFF"
      ctx.stroke()

      // Labels
      if (i > 0 && i < maxVal && responsiveSize > 120) {
        const labelRadius = radius - scaled.labelRadiusOffset
        const labelX = centerX + labelRadius * Math.cos(angle)
        const labelY = centerY + labelRadius * Math.sin(angle)

        ctx.fillStyle = "#FFFFFF"
        ctx.font = `bold ${scaled.labelFontSize}px Roboto Mono, monospace`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(i.toString(), labelX, labelY)
      }
    }
  }, [animatedSpeed, animatedRpm, type, responsiveSize])

  return (
    <div className="speedometer relative flex justify-center items-center h-full w-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-full max-h-full"
        style={{
          width: `${responsiveSize}px`,
          height: `${responsiveSize}px`,
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        style={{
          marginTop: `${getScaledValues().centerTextOffset}px`, // Adjust vertical position
        }}
      >
        <div 
          className="speed-unit font-medium text-gray-300 mb-0"
          style={{
            fontSize: `${getScaledValues().centerUnitFontSize}px`,
            lineHeight: 1,
          }}
        >
          {getUnit()}
        </div>
        <div
          className={`speed-value font-mono font-bold leading-tight ${
            type === "rpm" ? "text-red-400" : "text-blue-400"
          }`}
          style={{
            fontSize: `${getScaledValues().centerValueFontSize}px`,
            lineHeight: 1, 
          }}
        >
          {getValueDisplay()}
        </div>
      </div>
    </div>
  )
}

export default Speedometer