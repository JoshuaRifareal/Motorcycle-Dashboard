import React, { useMemo } from 'react';
import { Fuel } from 'lucide-react';
import './SpeedometerCanvas.css';

const SPEED_GRADIENT = [
  { offset: '0%', color: '#7c4dff' },
  { offset: '20%', color: '#b388ff' },
  { offset: '40%', color: '#ffd740' },
  { offset: '60%', color: '#ff9100' },
  { offset: '80%', color: '#ff1744' },
  { offset: '100%', color: '#d50000' }
];

const FUEL_GRADIENT = [
  { offset: '0%', color: '#ff1744' },
  { offset: '30%', color: '#ff9100' },
  { offset: '60%', color: '#76ff03' },
  { offset: '100%', color: '#00e676' }
];

function SpeedometerCanvas({ speed, fuel, odometer, isRunning }) {
  // Wider viewBox with more horizontal space
  const viewBoxWidth = 1400;  // Increased from 1200
  const viewBoxHeight = 700;  // Same height
  
  const paddingX = 20;  // Minimal horizontal padding
  const paddingY = 60;
  
  const cx = viewBoxWidth / 2;
  const cy = viewBoxHeight * 0.78;
  
  // Radius based on width with minimal padding
  const maxRadiusX = (viewBoxWidth / 2) - paddingX;
  const maxRadiusY = (viewBoxHeight * 0.45) - paddingY;
  
  const radius = Math.min(maxRadiusX, maxRadiusY * 2.0); // More width-focused
  
  const lineWidth = 38;
  const fuelRadius = radius * 0.58;
  const fuelLineWidth = 20;

  // Wider arc - 180 degrees (half circle)
  const startAngle = 180;
  const endAngle = 360;
  const totalAngle = endAngle - startAngle;

  // Fuel offset - 15px gap
  const fuelOffset = 15;
  const fuelStartAngle = startAngle + (fuelOffset / 180) * (totalAngle / 2);
  const fuelEndAngle = endAngle - (fuelOffset / 180) * (totalAngle / 2);
  const fuelTotalAngle = fuelEndAngle - fuelStartAngle;

  const getPointOnCircle = (angleDeg, r) => {
    const rad = angleDeg * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  const getArcPath = (angleStart, angleEnd, r) => {
    const start = getPointOnCircle(angleStart, r);
    const end = getPointOnCircle(angleEnd, r);
    const diff = angleEnd - angleStart;
    const largeArc = diff > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  // Generate tick marks
  const ticks = useMemo(() => {
    const numMajorTicks = 10;
    const numMinorTicks = 5;
    const total = numMajorTicks * numMinorTicks;
    const result = [];

    for (let i = 0; i <= total; i++) {
      const frac = i / total;
      const angle = startAngle + frac * totalAngle;
      const isMajor = i % numMinorTicks === 0;
      const isHalf = i % (numMinorTicks / 2) === 0 && !isMajor;
      
      const innerR = radius - lineWidth * 0.6 - 10;
      const tickLength = isMajor ? 24 : (isHalf ? 16 : 11);
      const r1 = innerR - tickLength;
      const r2 = innerR;
      
      const p1 = getPointOnCircle(angle, r1);
      const p2 = getPointOnCircle(angle, r2);
      
      result.push({
        id: i,
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        isMajor,
        isHalf,
        value: Math.round((i / total) * 100)
      });
    }
    return result;
  }, []);

  const majorTicks = ticks.filter(t => t.isMajor);

  const speedPct = Math.min(speed / 100, 1);
  const currentAngle = startAngle + speedPct * totalAngle;

  const fuelPct = Math.min(fuel / 100, 1);
  const fuelCurrentAngle = fuelStartAngle + fuelPct * fuelTotalAngle;

  let fuelColor = '#76ff03';
  if (fuel < 30) fuelColor = '#ff1744';
  else if (fuel < 60) fuelColor = '#ff9100';

  const baselineY = cy + radius * 0.12;

  return (
    <div className="speedometer-svg-wrapper">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="speedometer-svg"
      >
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {SPEED_GRADIENT.map((stop, i) => (
              <stop key={i} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>

          <linearGradient id="fuelGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            {FUEL_GRADIENT.map((stop, i) => (
              <stop key={i} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="speedGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="20" result="blur1"/>
            <feGaussianBlur stdDeviation="40" result="blur2"/>
            <feMerge>
              <feMergeNode in="blur2"/>
              <feMergeNode in="blur1"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Speed track */}
        <path
          d={getArcPath(startAngle, endAngle, radius)}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={lineWidth + 6}
          fill="none"
          strokeLinecap="round"
        />

        {/* Speed bar */}
        <path
          d={getArcPath(startAngle, currentAngle, radius)}
          stroke="url(#speedGradient)"
          strokeWidth={lineWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            filter: isRunning ? 'url(#glow)' : 'none',
            transition: 'all 0.1s ease'
          }}
        />

        {/* Tick marks */}
        {ticks.map((tick) => (
          <line
            key={tick.id}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.isMajor ? 'rgba(180,180,255,0.5)' : 
                    tick.isHalf ? 'rgba(180,180,255,0.25)' : 
                    'rgba(180,180,255,0.12)'}
            strokeWidth={tick.isMajor ? 3 : (tick.isHalf ? 2 : 1.5)}
            strokeLinecap="round"
          />
        ))}

        {/* Major tick labels */}
        {majorTicks.map((tick) => {
          const labelR = radius - lineWidth * 0.6 - 52;
          const labelPoint = getPointOnCircle(
            startAngle + (tick.id / (ticks.length - 1)) * totalAngle,
            labelR
          );
          return (
            <text
              key={`label-${tick.id}`}
              x={labelPoint.x}
              y={labelPoint.y}
              fill="rgba(180,180,255,0.5)"
              fontSize="28"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="-apple-system, Segoe UI, sans-serif"
            >
              {tick.value}
            </text>
          );
        })}

        {/* Odometer */}
        <text
          x={cx}
          y={cy - 100}
          fill="rgba(150,150,200,0.4)"
          fontSize="24"
          fontWeight="500"
          textAnchor="middle"
          dominantBaseline="bottom"
          fontFamily="-apple-system, Segoe UI, sans-serif"
          letterSpacing="2"
        >
          ODO {Math.round(odometer).toLocaleString()} km
        </text>

        {/* Speed number */}
        <text
          x={cx}
          y={baselineY - 5}
          fill="#ffffff"
          fontSize="130"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="bottom"
          fontFamily="-apple-system, Segoe UI, sans-serif"
          style={{ 
            filter: isRunning ? 'url(#speedGlow)' : 'none',
            transition: 'all 0.1s ease'
          }}
        >
          {Math.round(speed)}
        </text>

        {/* KPH label */}
        <text
          x={cx}
          y={baselineY + 55}
          fill="rgba(150,150,255,0.5)"
          fontSize="32"
          fontWeight="600"
          textAnchor="middle"
          dominantBaseline="top"
          fontFamily="-apple-system, Segoe UI, sans-serif"
        >
          KPH
        </text>

        {/* Fuel track */}
        <path
          d={getArcPath(fuelStartAngle, fuelEndAngle, fuelRadius)}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={fuelLineWidth + 3}
          fill="none"
          strokeLinecap="round"
        />

        {/* Fuel bar */}
        <path
          d={getArcPath(fuelStartAngle, fuelCurrentAngle, fuelRadius)}
          stroke="url(#fuelGradient)"
          strokeWidth={fuelLineWidth}
          fill="none"
          strokeLinecap="round"
          style={{ 
            filter: 'url(#glow)',
            transition: 'all 0.1s ease'
          }}
        />

        {/* Fuel label */}
        <g transform={`translate(${cx - 60}, ${cy - fuelRadius + fuelLineWidth + 30})`}>
          <Fuel 
            size={24} 
            color="#ffffff" 
            strokeWidth={2}
            style={{ filter: `drop-shadow(0 0 15px ${fuelColor}44)` }}
          />
          <text
            x={34}
            y={1}
            fill={fuelColor}
            fontSize="22"
            fontWeight="600"
            dominantBaseline="central"
            fontFamily="-apple-system, Segoe UI, sans-serif"
            style={{ filter: `drop-shadow(0 0 20px ${fuelColor}44)` }}
          >
            {Math.round(fuel)}%
          </text>
        </g>

        {/* Outer glow ring */}
        <path
          d={getArcPath(startAngle, endAngle, radius + 6)}
          stroke="rgba(150,120,255,0.03)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default SpeedometerCanvas;