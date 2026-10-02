import React from 'react';
import { CurrentWeather } from '../types/weather';
import { Umbrella, Wind, Sparkles, Shirt, Compass } from 'lucide-react';

interface PetersburgAtmosphereCardProps {
  current: CurrentWeather;
  precipProb: number;
}

export const PetersburgAtmosphereCard: React.FC<PetersburgAtmosphereCardProps> = ({
  current,
  precipProb,
}) => {
  // Determine outfit recommendations based on temp, wind and moisture
  const temp = current.temperature;
  const isHighWind = current.windSpeed >= 7 || current.windGusts >= 11;
  const isRainy = precipProb >= 40 || [51, 53, 55, 61, 63, 65, 80, 81].includes(current.weatherCode);

  let clothingAdvice: { top: string; accessories: string; shoes: string } = {
    top: 'Многослойный образ: лонгслив и легкая ветровка',
    accessories: 'Солнцезащитные очки для прогулок',
    shoes: 'Удобные кеды или кроссовки',
  };

  if (temp < 0) {
    clothingAdvice = {
      top: 'Зимний пуховик с ветрозащитной планкой или парка',
      accessories: 'Теплая шапка, шерстяной шарф и перчатки',
      shoes: 'Утепленные непромокаемые ботинки с противоскользящей подошвой',
    };
  } else if (temp < 8) {
    clothingAdvice = {
      top: 'Плотное пальто или теплая куртка с высоким воротником',
      accessories: 'Фирменный питерский шарф и перчатки от сырого ветра',
      shoes: 'Непромокаемая кожаная обувь для гранитных набережных',
    };
  } else if (temp < 16) {
    clothingAdvice = {
      top: 'Тренч, бомбер или штормовка с капюшоном',
      accessories: 'Легкий палантин или шарф на случай ветра у Невы',
      shoes: 'Ботинки или защищенные кроссовки',
    };
  } else {
    clothingAdvice = {
      top: 'Футболка / рубашка с хлопковой кофтой на вечер',
      accessories: 'Панама или кепка, солнцезащитные очки',
      shoes: 'Легкая летняя обувь для долгих пеших маршрутов',
    };
  }

  return (
    <div id="piter-guide" className="rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-cyan-950/20 border border-slate-800/80 p-6 backdrop-blur-md space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Питерский барометр & Атмосфера</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Практические советы для переменчивого балтийского климата
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <span>СПб · 59.9386° N</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Зонт или штормовка? */}
        <div className="bg-slate-950/50 border border-slate-800/70 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-2">
            <Umbrella className="w-4 h-4 text-cyan-400" />
            <span>Зонт vs Набережные Невы</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {isHighWind && isRainy
              ? 'На мостах (Дворцовом, Троицком, Литейном) сильные порывы ветра часто ломают спицы зонтов. Лучший выбор — штормовка с глубоким капюшоном.'
              : isRainy
              ? 'Классический складной зонт спасет от затяжного балтийского дождя. Держите его под рукой.'
              : 'Сегодня вероятность осадков невысока, но в Петербурге погода может измениться за полчаса.'}
          </p>

          <div className="text-[11px] font-mono text-slate-400 border-t border-slate-900 pt-2">
            Порывы ветра: <span className="text-slate-200">{current.windGusts} м/с</span>
          </div>
        </div>

        {/* Card 2: Гардероб дня */}
        <div className="bg-slate-950/50 border border-slate-800/70 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-2">
            <Shirt className="w-4 h-4 text-cyan-400" />
            <span>Что надеть сегодня</span>
          </div>

          <ul className="text-xs text-slate-300 space-y-1.5 mb-3">
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 shrink-0">·</span>
              <span>{clothingAdvice.top}</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 shrink-0">·</span>
              <span>{clothingAdvice.accessories}</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 shrink-0">·</span>
              <span>{clothingAdvice.shoes}</span>
            </li>
          </ul>

          <div className="text-[11px] font-mono text-slate-400 border-t border-slate-900 pt-2">
            С учетом влажности {current.relativeHumidity}%
          </div>
        </div>

        {/* Card 3: Городской метео-факт */}
        <div className="bg-slate-950/50 border border-slate-800/70 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Северный характер</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            В Санкт-Петербурге насчитывается около 60 солнечных дней в году. Но именно рассеянный серебристый свет и туманные набережные создают неповторимый колорит города.
          </p>

          <div className="text-[11px] font-mono text-cyan-300 border-t border-slate-900 pt-2">
            «От сырого ветра бережет шарф, а от скуки — Эрмитаж»
          </div>
        </div>
      </div>
    </div>
  );
};
