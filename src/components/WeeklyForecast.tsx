import React from 'react';
import { DailyForecast, UserUnits } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemp, formatWind, getWindDirectionShort } from '../utils/weatherCodes';
import { Droplets, Wind, Calendar, ChevronRight } from 'lucide-react';

interface WeeklyForecastProps {
  daily: DailyForecast[];
  selectedDayDate: string;
  onSelectDay: (date: string) => void;
  units: UserUnits;
  currentTemp?: number;
}

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({
  daily,
  selectedDayDate,
  onSelectDay,
  units,
  currentTemp,
}) => {
  // Calculate global min and max temperature across all 7 days to scale the temperature bars proportionally
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <div id="week-forecast" className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold tracking-tight text-white">
            Прогноз на 7 дней
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Нажмите на день для подробностей
        </div>
      </div>

      {/* 7-Day Card List */}
      <div className="grid grid-cols-1 gap-2.5">
        {daily.map((day, idx) => {
          const isSelected = day.date === selectedDayDate;
          const isToday = idx === 0;

          // Bar math: offset percentage and width percentage
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - globalMin) / tempRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((day.tempMax - globalMin) / tempRange) * 100));
          const widthPercent = Math.max(6, rightPercent - leftPercent);

          // Current temp indicator position on today's bar
          let currentTempPercent: number | null = null;
          if (isToday && currentTemp !== undefined) {
            currentTempPercent = Math.max(
              0,
              Math.min(100, ((currentTemp - globalMin) / tempRange) * 100)
            );
          }

          const windDir = getWindDirectionShort(day.windDirection);

          return (
            <button
              key={day.date}
              onClick={() => onSelectDay(day.date)}
              className={`w-full text-left transition-all rounded-xl p-3.5 sm:p-4 border ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                {/* Day name, date and weather icon */}
                <div className="flex items-center gap-3 sm:w-56 shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-center shrink-0">
                    <WeatherIcon code={day.weatherCode} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-sm font-semibold ${isSelected ? 'text-cyan-300' : 'text-slate-100'}`}>
                        {day.dayName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {day.dateFormatted}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-[180px]">
                      {day.weatherText}
                    </div>
                  </div>
                </div>

                {/* Rain probability */}
                <div className="flex items-center gap-1.5 sm:w-24 shrink-0 text-xs">
                  <Droplets className={`w-3.5 h-3.5 ${day.precipitationProbability > 40 ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className={`font-mono tabular-nums ${day.precipitationProbability > 40 ? 'text-cyan-300 font-medium' : 'text-slate-400'}`}>
                    {day.precipitationProbability}%
                  </span>
                  {day.precipitationSum > 0 && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({day.precipitationSum} мм)
                    </span>
                  )}
                </div>

                {/* Temperature Range Bar (Spectrum) */}
                <div className="flex-1 flex items-center gap-3 w-full">
                  <span className="text-xs font-mono text-slate-400 w-8 text-right tabular-nums">
                    {formatTemp(day.tempMin, units.temp)}
                  </span>

                  {/* Gradient Range Bar */}
                  <div className="relative flex-1 h-2 rounded-full bg-slate-950/80 border border-slate-800/80 overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-600 via-sky-500 to-amber-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                    {/* Current temperature marker on "Today" */}
                    {isToday && currentTempPercent !== null && currentTemp !== undefined && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-slate-950 shadow-sm transition-all"
                        style={{ left: `calc(${currentTempPercent}% - 5px)` }}
                        title={`Текущая: ${formatTemp(currentTemp, units.temp)}`}
                      />
                    )}
                  </div>

                  <span className="text-xs font-mono font-semibold text-slate-200 w-8 text-left tabular-nums">
                    {formatTemp(day.tempMax, units.temp)}
                  </span>
                </div>

                {/* Wind and detail indicator */}
                <div className="hidden md:flex items-center gap-3 sm:w-32 justify-end shrink-0 text-xs text-slate-400">
                  <div className="flex items-center gap-1 font-mono">
                    <Wind className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatWind(day.windSpeedMax, units.wind)}</span>
                    <span className="text-[11px] text-slate-400">{windDir}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-cyan-400' : 'text-slate-400'}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
