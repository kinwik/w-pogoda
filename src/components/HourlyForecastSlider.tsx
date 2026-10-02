import React, { useState, useRef } from 'react';
import { HourlySlot, UserUnits } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemp, formatWind } from '../utils/weatherCodes';
import { Clock, ChevronLeft, ChevronRight, TrendingUp, Droplets, Wind } from 'lucide-react';

interface HourlyForecastSliderProps {
  hourly: HourlySlot[];
  dayTitle?: string;
  units: UserUnits;
}

type GraphMetric = 'temp' | 'precip' | 'wind';

export const HourlyForecastSlider: React.FC<HourlyForecastSliderProps> = ({
  hourly,
  dayTitle = 'Ближайшие 24 часа',
  units,
}) => {
  const [activeMetric, setActiveMetric] = useState<GraphMetric>('temp');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  if (!hourly || hourly.length === 0) return null;

  // Compute SVG Curve Coordinates
  const svgWidth = 800;
  const svgHeight = 120;
  const paddingX = 30;
  const paddingTop = 25;
  const paddingBottom = 25;
  const innerHeight = svgHeight - paddingTop - paddingBottom;
  const innerWidth = svgWidth - paddingX * 2;

  // Values based on activeMetric
  let values: number[] = [];
  if (activeMetric === 'temp') {
    values = hourly.map((h) => h.temperature);
  } else if (activeMetric === 'precip') {
    values = hourly.map((h) => h.precipitationProbability);
  } else {
    values = hourly.map((h) => h.windSpeed);
  }

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal === minVal ? 1 : maxVal - minVal;

  const points = values.map((val, i) => {
    const x = paddingX + (i / (values.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((val - minVal) / valRange) * innerHeight;
    return { x, y, val, slot: hourly[i] };
  });

  // Smooth SVG Path generator
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midX = (p0.x + p1.x) / 2;
      pathD += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <div id="hourly-forecast" className="space-y-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md">
      {/* Header with metric tabs and scroll controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold tracking-tight text-white">
            Почасовой ход
          </h2>
          <span className="text-xs text-slate-400 font-mono ml-1">
            · {dayTitle}
          </span>
        </div>

        {/* Metric Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800/80 rounded-lg">
          <button
            onClick={() => setActiveMetric('temp')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeMetric === 'temp'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Температура</span>
          </button>
          <button
            onClick={() => setActiveMetric('precip')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeMetric === 'precip'
                ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Осадки %</span>
          </button>
          <button
            onClick={() => setActiveMetric('wind')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeMetric === 'wind'
                ? 'bg-teal-500/20 text-teal-200 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Ветер</span>
          </button>
        </div>
      </div>

      {/* Interactive SVG Chart for 24 hours */}
      <div className="relative w-full h-32 sm:h-36 bg-slate-950/50 rounded-xl border border-slate-800/60 pt-2 px-2 overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={activeMetric === 'temp' ? '#06b6d4' : activeMetric === 'precip' ? '#3b82f6' : '#14b8a6'}
                stopOpacity="0.35"
              />
              <stop
                offset="100%"
                stopColor={activeMetric === 'temp' ? '#06b6d4' : activeMetric === 'precip' ? '#3b82f6' : '#14b8a6'}
                stopOpacity="0.0"
              />
            </linearGradient>
          </defs>

          {/* Fill Area under curve */}
          <path d={areaD} fill="url(#curveGradient)" />

          {/* Main Stroke line */}
          <path
            d={pathD}
            fill="none"
            stroke={activeMetric === 'temp' ? '#22d3ee' : activeMetric === 'precip' ? '#60a5fa' : '#2dd4bf'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* High & Low Value Indicators or hover points */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            const isLocalExtreme = idx === 0 || p.val === maxVal || p.val === minVal;

            return (
              <g key={idx}>
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={0}
                    x2={p.x}
                    y2={svgHeight}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                )}
                {(isHovered || isLocalExtreme) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3.5}
                    className={
                      activeMetric === 'temp'
                        ? 'fill-cyan-300 stroke-slate-900 stroke-2'
                        : activeMetric === 'precip'
                        ? 'fill-blue-400 stroke-slate-900 stroke-2'
                        : 'fill-teal-300 stroke-slate-900 stroke-2'
                    }
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Inspector Tooltip Overlay */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute top-2 pointer-events-none transform -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-1 rounded shadow-lg text-[11px] font-mono text-cyan-300 z-10 whitespace-nowrap"
            style={{
              left: `${(hoveredIdx / (points.length - 1)) * 96 + 2}%`,
            }}
          >
            {hourly[hoveredIdx].hourFormatted}:{' '}
            {activeMetric === 'temp'
              ? formatTemp(hourly[hoveredIdx].temperature, units.temp)
              : activeMetric === 'precip'
              ? `${hourly[hoveredIdx].precipitationProbability}% осадков`
              : formatWind(hourly[hoveredIdx].windSpeed, units.wind)}
          </div>
        )}
      </div>

      {/* Hourly Card Carousel with Scroll Buttons */}
      <div className="relative group">
        <button
          onClick={scrollLeft}
          title="Прокрутить назад"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth"
        >
          {hourly.map((slot, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={slot.time + i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex flex-col items-center justify-between p-3 rounded-xl border min-w-[78px] transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-slate-800/90 border-cyan-500/50 shadow-md scale-105'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60'
                }`}
              >
                <span className="text-xs font-mono text-slate-400">
                  {slot.hourFormatted}
                </span>

                <div className="my-2">
                  <WeatherIcon code={slot.weatherCode} isDay={slot.isDay} className="w-6 h-6" />
                </div>

                <span className="text-sm font-semibold font-mono text-slate-100 tabular-nums">
                  {formatTemp(slot.temperature, units.temp)}
                </span>

                <div className="flex items-center gap-1 mt-1 text-[11px] font-mono text-slate-400">
                  <Droplets className={`w-3 h-3 ${slot.precipitationProbability > 30 ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className={slot.precipitationProbability > 30 ? 'text-cyan-300' : ''}>
                    {slot.precipitationProbability}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={scrollRight}
          title="Прокрутить вперёд"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
