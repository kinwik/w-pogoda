export interface WeatherVisual {
  label: string;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudLightning' | 'CloudSnow' | 'Snowflake';
  theme: 'clear' | 'partlyCloudy' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog';
  bgGradient: string;
}

export function getWeatherVisual(code: number, isDay: boolean = true): WeatherVisual {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Ясно' : 'Ясная ночь',
        iconName: 'Sun',
        theme: 'clear',
        bgGradient: isDay 
          ? 'from-sky-900/60 via-slate-900/80 to-slate-950'
          : 'from-indigo-950/80 via-slate-950 to-slate-950',
      };
    case 1:
      return {
        label: isDay ? 'Преимущественно ясно' : 'Малооблачно',
        iconName: 'CloudSun',
        theme: 'clear',
        bgGradient: isDay
          ? 'from-blue-900/50 via-slate-900/80 to-slate-950'
          : 'from-slate-900/70 via-slate-950 to-slate-950',
      };
    case 2:
      return {
        label: 'Переменная облачность',
        iconName: 'CloudSun',
        theme: 'partlyCloudy',
        bgGradient: 'from-slate-800/60 via-slate-900/80 to-slate-950',
      };
    case 3:
      return {
        label: 'Пасмурно (балтийское небо)',
        iconName: 'Cloud',
        theme: 'cloudy',
        bgGradient: 'from-slate-800/70 via-slate-900/85 to-slate-950',
      };
    case 45:
    case 48:
      return {
        label: 'Туман над Невой',
        iconName: 'CloudFog',
        theme: 'fog',
        bgGradient: 'from-teal-950/50 via-slate-900/80 to-slate-950',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Моросящий дождь',
        iconName: 'CloudDrizzle',
        theme: 'rain',
        bgGradient: 'from-cyan-950/50 via-slate-900/85 to-slate-950',
      };
    case 56:
    case 57:
      return {
        label: 'Ледяная морось',
        iconName: 'CloudDrizzle',
        theme: 'rain',
        bgGradient: 'from-cyan-950/60 via-slate-900/85 to-slate-950',
      };
    case 61:
      return {
        label: 'Небольшой дождь',
        iconName: 'CloudRain',
        theme: 'rain',
        bgGradient: 'from-blue-950/60 via-slate-900/85 to-slate-950',
      };
    case 63:
      return {
        label: 'Дождь',
        iconName: 'CloudRain',
        theme: 'rain',
        bgGradient: 'from-blue-950/70 via-slate-900/85 to-slate-950',
      };
    case 65:
      return {
        label: 'Сильный петербургский дождь',
        iconName: 'CloudRain',
        theme: 'rain',
        bgGradient: 'from-slate-900/90 via-blue-950/80 to-slate-950',
      };
    case 66:
    case 67:
      return {
        label: 'Ледяной дождь',
        iconName: 'CloudRain',
        theme: 'rain',
        bgGradient: 'from-slate-900/90 via-indigo-950/70 to-slate-950',
      };
    case 71:
      return {
        label: 'Небольшой снег',
        iconName: 'Snowflake',
        theme: 'snow',
        bgGradient: 'from-slate-800/50 via-slate-900/80 to-slate-950',
      };
    case 73:
      return {
        label: 'Снегопад',
        iconName: 'CloudSnow',
        theme: 'snow',
        bgGradient: 'from-slate-800/60 via-slate-900/85 to-slate-950',
      };
    case 75:
      return {
        label: 'Сильный снегопад',
        iconName: 'CloudSnow',
        theme: 'snow',
        bgGradient: 'from-slate-800/70 via-slate-900/90 to-slate-950',
      };
    case 77:
      return {
        label: 'Снежная крупа',
        iconName: 'Snowflake',
        theme: 'snow',
        bgGradient: 'from-slate-800/60 via-slate-900/85 to-slate-950',
      };
    case 80:
    case 81:
      return {
        label: 'Кратковременный ливень',
        iconName: 'CloudRain',
        theme: 'rain',
        bgGradient: 'from-cyan-950/60 via-slate-900/85 to-slate-950',
      };
    case 82:
      return {
        label: 'Шквальный ливень',
        iconName: 'CloudRain',
        theme: 'rain',
        bgGradient: 'from-slate-950 via-blue-950/70 to-slate-950',
      };
    case 85:
    case 86:
      return {
        label: 'Снежный заряд',
        iconName: 'CloudSnow',
        theme: 'snow',
        bgGradient: 'from-slate-900/80 via-indigo-950/60 to-slate-950',
      };
    case 95:
      return {
        label: 'Гроза над Финским заливом',
        iconName: 'CloudLightning',
        theme: 'thunder',
        bgGradient: 'from-indigo-950/80 via-purple-950/40 to-slate-950',
      };
    case 96:
    case 99:
      return {
        label: 'Гроза с градом',
        iconName: 'CloudLightning',
        theme: 'thunder',
        bgGradient: 'from-slate-950 via-indigo-950/70 to-slate-950',
      };
    default:
      return {
        label: 'Переменная погода',
        iconName: 'Cloud',
        theme: 'cloudy',
        bgGradient: 'from-slate-800/50 via-slate-900/80 to-slate-950',
      };
  }
}

export function getWindDirectionName(degrees: number): string {
  const directions = ['Северный', 'Северо-восточный', 'Восточный', 'Юго-восточный', 'Южный', 'Юго-западный', 'Западный', 'Северо-западный'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function getWindDirectionShort(degrees: number): string {
  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function getWindBeaufortDescription(speedMs: number): string {
  if (speedMs < 0.3) return 'Штиль';
  if (speedMs <= 1.5) return 'Тихий ветерок';
  if (speedMs <= 3.3) return 'Лёгкий бриз';
  if (speedMs <= 5.4) return 'Слабый ветер';
  if (speedMs <= 7.9) return 'Умеренный балтийский ветер';
  if (speedMs <= 10.7) return 'Свежий морской ветер';
  if (speedMs <= 13.8) return 'Крепкий ветер с залива';
  if (speedMs <= 17.1) return 'Очень крепкий ветер';
  if (speedMs <= 20.7) return 'Штормовой порывистый ветер';
  return 'Сильный шторм';
}

export function getPressureStatus(mmHg: number): { text: string; note: string } {
  // 760 mmHg is normal atmospheric pressure at sea level in SPb
  if (mmHg > 766) {
    return { text: 'Повышенное', note: 'Антициклон, ясная или морозная погода' };
  } else if (mmHg < 754) {
    return { text: 'Пониженное', note: 'Циклон с Атлантики, вероятность осадков' };
  }
  return { text: 'В норме', note: 'Комфортное атмосферное давление' };
}

export function getUvIndexDescription(uv: number): { label: string; color: string; advice: string } {
  if (uv <= 2) {
    return { label: 'Низкий', color: 'text-emerald-400', advice: 'Защита от солнца не требуется' };
  } else if (uv <= 5) {
    return { label: 'Умеренный', color: 'text-amber-400', advice: 'Рекомендуется легкая защита в полдень' };
  } else if (uv <= 7) {
    return { label: 'Высокий', color: 'text-orange-400', advice: 'Используйте SPF и солнцезащитные очки' };
  }
  return { label: 'Очень высокий', color: 'text-rose-400', advice: 'Избегайте прямого солнца в дневные часы' };
}

export function getUmbrellaAdvice(weatherCode: number, precipProb: number, windSpeed: number): {
  needUmbrella: 'yes' | 'maybe' | 'no';
  title: string;
  badge: string;
  advice: string;
} {
  const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  const isRainingNow = rainCodes.includes(weatherCode);

  if (isRainingNow || precipProb >= 60) {
    if (windSpeed >= 11) {
      return {
        needUmbrella: 'yes',
        title: 'Лучше дождевик или мембрана!',
        badge: 'Зонт может вывернуть ветром',
        advice: 'При ветре с Финского залива классический зонт вывернет. Рекомендуем штормовку с капюшоном.',
      };
    }
    return {
      needUmbrella: 'yes',
      title: 'Обязательно возьмите зонт!',
      badge: 'Высокая вероятность дождя',
      advice: 'Осадки над городом. Не забудьте зонт перед выходом из дома или офиса.',
    };
  }

  if (precipProb >= 30) {
    return {
      needUmbrella: 'maybe',
      title: 'Зонт в рюкзаке не помешает',
      badge: 'Переменчивая питерская погода',
      advice: 'В Петербурге небо меняется за 15 минут. Компактный зонт точно придаст уверенности.',
    };
  }

  return {
    needUmbrella: 'no',
    title: 'Зонт сегодня можно оставить дома',
    badge: 'Сухо и спокойно',
    advice: 'Осадков не ожидается. Наслаждайтесь прогулкой по набережным и проспектам.',
  };
}

export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f > 0 ? '+' : ''}${f}°`;
  }
  const rounded = Math.round(celsius);
  return `${rounded > 0 ? '+' : ''}${rounded}°`;
}

export function formatWind(ms: number, unit: 'ms' | 'kmh'): string {
  if (unit === 'kmh') {
    const kmh = Math.round(ms * 3.6);
    return `${kmh} км/ч`;
  }
  return `${ms.toFixed(1)} м/с`;
}

export function formatPressure(hPa: number, unit: 'mmHg' | 'hPa'): string {
  if (unit === 'mmHg') {
    const mmHg = Math.round(hPa * 0.750062);
    return `${mmHg} мм`;
  }
  return `${Math.round(hPa)} гПа`;
}
