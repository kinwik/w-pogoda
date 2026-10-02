import React from 'react';
import { WeatherData, UserUnits } from '../types/weather';
import {
  formatWind,
  formatPressure,
  getWindDirectionName,
  getWindBeaufortDescription,
  getPressureStatus,
  getUvIndexDescription,
} from '../utils/weatherCodes';
import {
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  Sun,
  Droplets,
  Eye,
  ShieldAlert,
  Compass,
} from 'lucide-react';

interface WeatherMetricsGridProps {
  data: WeatherData;
  units: UserUnits;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ data, units }) => {
  const { current, daily } = data;
  const today = daily[0];

  const windName = getWindDirectionName(current.windDirection);
  const beaufortDesc = getWindBeaufortDescription(current.windSpeed);
  const pressureStatus = getPressureStatus(current.pressureMmHg);
  const uvInfo = getUvIndexDescription(current.uvIndex);

  // Solar Arc Math
  const sunriseStr = today?.sunrise || '07:15';
  const sunsetStr = today?.sunset || '18:45';

  const parseTimeToMinutes = (str: string) => {
    const [h, m] = str.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const sunriseMin = parseTimeToMinutes(sunriseStr);
  const sunsetMin = parseTimeToMinutes(sunsetStr);
  const totalDaylightMin = Math.max(1, sunsetMin - sunriseMin);
  const daylightHours = Math.floor(totalDaylightMin / 60);
  const daylightRemMinutes = totalDaylightMin % 60;

  // Sun position along the arc: 0 (sunrise) to 1 (sunset)
  let sunProgress = 0;
  let isSunUp = false;
  if (nowMinutes >= sunriseMin && nowMinutes <= sunsetMin) {
    sunProgress = (nowMinutes - sunriseMin) / totalDaylightMin;
    isSunUp = true;
  } else if (nowMinutes > sunsetMin) {
    sunProgress = 1;
    isSunUp = false;
  } else {
    sunProgress = 0;
    isSunUp = false;
  }

  // Calculate sun icon position along SVG semi-circle arc (rx=80, ry=50)
  const angle = Math.PI * (1 - sunProgress);
  const arcX = 100 + 80 * Math.cos(angle);
  const arcY = 70 - 50 * Math.sin(angle);

  // Dew point approximation: T - ((100 - RH) / 5)
  const dewPoint = Math.round(current.temperature - (100 - current.relativeHumidity) / 5);

  return (
    <div id="weather-metrics" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <span>Параметры атмосферы</span>
        </h2>
        <span className="text-xs text-slate-400 font-mono">
          Метеостанция СПб
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Ветер и порывы с розой ветров */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>Ветер и порывы</span>
            </span>
            <span className="font-mono text-cyan-400/90">{beaufortDesc}</span>
          </div>

          <div className="flex items-center justify-between gap-4 my-2">
            <div>
              <div className="text-3xl font-bold font-mono text-white tabular-nums">
                {formatWind(current.windSpeed, units.wind)}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                Порывы до <span className="text-slate-200">{formatWind(current.windGusts, units.wind)}</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Направление: <span className="text-cyan-300">{windName}</span> ({current.windDirection}°)
              </div>
            </div>

            {/* Compass Rose Graphic */}
            <div className="relative w-20 h-20 rounded-full border border-slate-700/80 bg-slate-950/70 flex items-center justify-center shrink-0">
              <span className="absolute top-1 text-[9px] font-mono text-slate-400">С</span>
              <span className="absolute bottom-1 text-[9px] font-mono text-slate-400">Ю</span>
              <span className="absolute left-1.5 text-[9px] font-mono text-slate-400">З</span>
              <span className="absolute right-1.5 text-[9px] font-mono text-slate-400">В</span>

              {/* Rotating Arrow Indicator */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-700"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              >
                <div className="w-0.5 h-12 bg-gradient-to-t from-transparent via-cyan-400 to-cyan-300 rounded-full relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-x-4 border-x-transparent border-b-6 border-b-cyan-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            Влияние Финского залива усиливает влажность ветрового потока.
          </div>
        </div>

        {/* 2. Атмосферное давление (Барометр) */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>Барометр (давление)</span>
            </span>
            <span className="font-mono text-cyan-400/90">{pressureStatus.text}</span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                {current.pressureMmHg}
              </span>
              <span className="text-sm font-mono text-slate-400">мм рт. ст.</span>
              <span className="text-xs text-slate-500 font-mono ml-auto">
                ({Math.round(current.surfacePressure)} гПа)
              </span>
            </div>

            {/* Visual Barometer scale (730 to 780 mmHg) */}
            <div className="mt-3 space-y-1">
              <div className="relative h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 opacity-60" />
                {/* Pointer marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-sm transition-all"
                  style={{
                    left: `${Math.max(
                      5,
                      Math.min(95, ((current.pressureMmHg - 730) / (780 - 730)) * 100)
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
                <span>730 низкое</span>
                <span className="text-slate-200">760 норма</span>
                <span>780 высокое</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            {pressureStatus.note}.
          </div>
        </div>

        {/* 3. Восход и закат (Солнечный цикл) */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Световой день</span>
            </span>
            <span className="font-mono text-slate-400">
              {daylightHours} ч {daylightRemMinutes} мин
            </span>
          </div>

          {/* Solar Arc Graphic */}
          <div className="relative w-full h-20 my-1 flex items-center justify-center">
            <svg viewBox="0 0 200 80" className="w-48 h-full overflow-visible">
              {/* Horizon line */}
              <line x1="10" y1="70" x2="190" y2="70" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              {/* Sun Arc */}
              <path
                d="M 20 70 A 80 50 0 0 1 180 70"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {/* Illuminated Path */}
              {isSunUp && (
                <path
                  d={`M 20 70 A 80 50 0 0 1 ${arcX} ${arcY}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
              )}
              {/* Sun Position */}
              <circle
                cx={arcX}
                cy={arcY}
                r="6"
                className={isSunUp ? 'fill-amber-400 stroke-amber-200 stroke-2 filter drop-shadow(0 0 4px #f59e0b)' : 'fill-slate-600'}
              />
            </svg>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Sunrise className="w-4 h-4 text-amber-300" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Восход</span>
                <span className="font-mono font-medium text-slate-200">{sunriseStr}</span>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              {isSunUp ? 'Солнце над горизонтом' : 'Сумерки / ночь'}
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Sunset className="w-4 h-4 text-orange-400" />
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Закат</span>
                <span className="font-mono font-medium text-slate-200">{sunsetStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Влажность и точка росы */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Влажность воздуха</span>
            </span>
            <span className="font-mono text-cyan-400">
              Точка росы: {dewPoint}°C
            </span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-bold font-mono text-white tabular-nums">
              {current.relativeHumidity}%
            </div>

            <div className="mt-3 relative h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                style={{ width: `${current.relativeHumidity}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            {current.relativeHumidity > 80
              ? 'Высокая сырость, характерная для Балтийского побережья.'
              : 'Комфортный уровень влажности.'}
          </div>
        </div>

        {/* 5. УФ-Индекс */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>УФ-Индекс</span>
            </span>
            <span className={`font-mono font-medium ${uvInfo.color}`}>
              {uvInfo.label}
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                {current.uvIndex}
              </span>
              <span className="text-xs font-mono text-slate-400">из 11+</span>
            </div>

            <div className="mt-3 relative h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"
                style={{ width: `${Math.min(100, (current.uvIndex / 10) * 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            {uvInfo.advice}.
          </div>
        </div>

        {/* 6. Видимость */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Видимость</span>
            </span>
            <span className="font-mono text-cyan-400">
              {current.cloudCover}% облачности
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                {current.weatherCode === 45 || current.weatherCode === 48 ? '2.4' : '10+'}
              </span>
              <span className="text-sm font-mono text-slate-400">км</span>
            </div>

            <p className="text-xs text-slate-300 mt-2">
              {current.weatherCode === 45 || current.weatherCode === 48
                ? 'Плотный туман над реками и каналами'
                : 'Чистый обзор мостов и акватории Невы'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            Условия для навигации по Неве и Финскому заливу благоприятные.
          </div>
        </div>
      </div>
    </div>
  );
};
