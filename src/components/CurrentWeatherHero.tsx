import React, { useState } from 'react';
import { WeatherData, UserUnits } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  formatTemp,
  formatWind,
  formatPressure,
  getUmbrellaAdvice,
  getWindDirectionShort,
} from '../utils/weatherCodes';
import { Umbrella, Wind, Droplets, Gauge, MapPin, Maximize2, X, Image as ImageIcon } from 'lucide-react';

interface CurrentWeatherHeroProps {
  data: WeatherData;
  units: UserUnits;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({ data, units }) => {
  const { current, daily, location } = data;
  const todayForecast = daily[0];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset imgError whenever location changes
  React.useEffect(() => {
    setImgError(false);
  }, [location.name, location.imageUrl]);

  const umbrella = getUmbrellaAdvice(
    current.weatherCode,
    todayForecast?.precipitationProbability ?? 30,
    current.windSpeed
  );

  const windDirShort = getWindDirectionShort(current.windDirection);

  const hasPhoto = Boolean(location.imageUrl && !imgError);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/70 to-slate-950/90 border border-slate-800/80 backdrop-blur-md transition-all">
        {/* District subtle background atmospheric layer if image is present */}
        {location.imageUrl && !imgError && (
          <div className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-700">
            <img
              src={location.imageUrl}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/95" />
          </div>
        )}

        {/* Ambient atmospheric glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column (7 cols): Weather figures & location */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tracking-wide">
                  <span>{location.country || 'Россия'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{data.updatedAt}</span>
                  {location.district && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-cyan-400/90">{location.district}</span>
                    </>
                  )}
                </div>

                <div className="flex items-baseline gap-3 mt-1">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                    {location.name}
                  </h1>
                </div>

                {location.landmark && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{location.landmark}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-baseline gap-6 sm:gap-8">
                <div className="flex items-start">
                  <span className="text-6xl sm:text-7xl lg:text-8xl font-bold font-mono tracking-tighter text-white tabular-nums">
                    {formatTemp(current.temperature, units.temp).replace('°', '')}
                  </span>
                  <span className="text-3xl sm:text-4xl font-light text-cyan-400 mt-2 ml-1">°{units.temp}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <WeatherIcon code={current.weatherCode} isDay={current.isDay} className="w-7 h-7 sm:w-8 sm:h-8" />
                    <span className="text-lg sm:text-xl font-medium text-slate-200">
                      {current.weatherText}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Ощущается как {formatTemp(current.apparentTemperature, units.temp)}</span>
                    {todayForecast && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Макс: {formatTemp(todayForecast.tempMax, units.temp)}</span>
                        <span aria-hidden="true">·</span>
                        <span>Мин: {formatTemp(todayForecast.tempMin, units.temp)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs max-w-xl">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ветер</span>
                  </div>
                  <div className="font-mono font-semibold text-slate-200 tabular-nums">
                    {formatWind(current.windSpeed, units.wind)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {windDirShort} ({current.windDirection}°)
                  </div>
                </div>

                <div className="space-y-0.5 border-x border-slate-800/60 px-2">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Давление</span>
                  </div>
                  <div className="font-mono font-semibold text-slate-200 tabular-nums">
                    {formatPressure(current.surfacePressure, units.pressure)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {current.pressureMmHg > 763 ? 'Выше нормы' : current.pressureMmHg < 756 ? 'Ниже нормы' : 'Норма (760)'}
                  </div>
                </div>

                <div className="space-y-0.5 pl-1">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Влажность</span>
                  </div>
                  <div className="font-mono font-semibold text-slate-200 tabular-nums">
                    {current.relativeHumidity}%
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {current.relativeHumidity > 80 ? 'Сырость' : 'Умеренная'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): City Photograph Card & Umbrella Advice */}
            <div className="lg:col-span-5 space-y-4">
              {/* City Photo Showcase Card (Always present for all cities) */}
              <div
                onClick={() => {
                  if (hasPhoto) setIsModalOpen(true);
                }}
                className={`group relative h-48 sm:h-52 rounded-xl overflow-hidden border border-slate-700/80 shadow-lg bg-slate-900 transition-all hover:border-cyan-500/60 hover:shadow-cyan-950/30 ${
                  hasPhoto ? 'cursor-pointer' : ''
                }`}
              >
                {hasPhoto ? (
                  <img
                    src={location.imageUrl}
                    alt={location.landmark || location.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  /* Elegant architectural styled fallback container */
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-2">
                      <ImageIcon className="w-6 h-6 text-cyan-400 opacity-80" />
                    </div>
                    <span className="text-sm font-semibold text-slate-100">{location.name}</span>
                    <span className="text-xs text-slate-400 mt-1 max-w-xs line-clamp-2">
                      {location.landmark || (location.district ? `${location.district}, ${location.country || 'Россия'}` : location.country || 'Россия')}
                    </span>
                  </div>
                )}

                {/* Contrast Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20 group-hover:via-slate-950/20 transition-colors pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[11px] text-slate-200">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span className="font-medium">{location.district || location.name}</span>
                </div>

                {/* Expand icon on hover if image is available */}
                {hasPhoto && (
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Bottom Caption */}
                <div className="absolute bottom-2.5 left-3 right-3 text-left pointer-events-none">
                  <p className="text-xs font-semibold text-white drop-shadow-sm truncate">
                    {location.landmark || location.name}
                  </p>
                  <p className="text-[11px] text-cyan-300/90 flex items-center gap-1 mt-0.5">
                    <span>{hasPhoto ? 'Нажмите для увеличения панорамы' : location.country || 'Город'}</span>
                  </p>
                </div>
              </div>

              {/* Umbrella Advice Card (Петербургский барометр) */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 transition-all hover:border-slate-700/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-cyan-400">
                    <Umbrella className="w-4 h-4" />
                    <span>Индекс зонта в Петербурге</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {todayForecast?.precipitationProbability ?? 0}% осадков
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-100">
                  {umbrella.title}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {umbrella.advice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-view Lightbox Modal for the District */}
      {isModalOpen && location.imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-700/90 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Modal Image */}
            <div className="relative aspect-video w-full bg-slate-950">
              <img
                src={location.imageUrl}
                alt={location.landmark || location.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border-t border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {location.landmark || location.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {location.name} {location.district ? `· ${location.district}` : ''} · Санкт-Петербург
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400 block">Сейчас в районе</span>
                  <span className="text-lg font-mono font-bold text-cyan-300">
                    {formatTemp(current.temperature, units.temp)} · {current.weatherText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

