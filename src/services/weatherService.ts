import { WeatherData, LocationInfo, HourlySlot, DailyForecast } from '../types/weather';
import { getWeatherVisual } from '../utils/weatherCodes';
import { fallbackSpbWeather, ALL_KNOWN_LOCATIONS } from '../utils/mockData';
import { getCityImage } from './cityImageService';

const MONTH_NAMES_RU = [
  'янв', 'фев', 'мар', 'апр', 'май', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
];

const DAY_NAMES_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const FULL_DAY_NAMES_RU = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
];

export async function fetchWeatherData(location: LocationInfo): Promise<WeatherData> {
  // If location doesn't have an image, check if it matches a known city or district
  let resolvedLocation = { ...location };
  if (!resolvedLocation.imageUrl) {
    const known = ALL_KNOWN_LOCATIONS.find(
      (loc) =>
        (Math.abs(loc.latitude - location.latitude) < 0.15 &&
          Math.abs(loc.longitude - location.longitude) < 0.15) ||
        loc.name.toLowerCase() === location.name.toLowerCase() ||
        (loc.district && location.district && loc.district.toLowerCase().includes(location.district.toLowerCase())) ||
        (location.name && loc.name.toLowerCase().includes(location.name.toLowerCase()))
    );
    if (known && known.imageUrl) {
      resolvedLocation = {
        ...resolvedLocation,
        imageUrl: known.imageUrl,
        landmark: known.landmark,
      };
    } else {
      // Dynamically fetch authentic city photo for any city in the world
      try {
        const cityImg = await getCityImage(resolvedLocation.name, resolvedLocation.country);
        if (cityImg.imageUrl) {
          resolvedLocation.imageUrl = cityImg.imageUrl;
          resolvedLocation.landmark = cityImg.landmark;
        }
      } catch (err) {
        console.debug('Dynamic city image resolution skipped', err);
      }
    }
  }

  const { latitude, longitude, timezone = 'Europe/Moscow' } = resolvedLocation;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,surface_pressure,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=${encodeURIComponent(timezone)}&forecast_days=7`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }
    const data = await res.json();

    // Parse current
    const currentCode = data.current?.weather_code ?? 0;
    const isDay = Boolean(data.current?.is_day ?? 1);
    const visual = getWeatherVisual(currentCode, isDay);
    const surfacePressureHpa = data.current?.surface_pressure ?? data.current?.pressure_msl ?? 1013.25;
    const pressureMmHg = Math.round(surfacePressureHpa * 0.750062);

    // Parse hourly (next 24 hours starting from current hour)
    const hourlyTimes: string[] = data.hourly?.time || [];
    const nowIso = new Date().toISOString();
    // find index closest to now
    let startIndex = 0;
    const currentHourStr = nowIso.slice(0, 13);
    const matchedIdx = hourlyTimes.findIndex(t => t.startsWith(currentHourStr));
    if (matchedIdx !== -1) {
      startIndex = matchedIdx;
    }

    const next24Times = hourlyTimes.slice(startIndex, startIndex + 24);
    const hourly: HourlySlot[] = next24Times.map((t, relIdx) => {
      const idx = startIndex + relIdx;
      const code = data.hourly.weather_code[idx] ?? 0;
      const hourIsDay = Boolean(data.hourly.is_day[idx] ?? 1);
      const hVisual = getWeatherVisual(code, hourIsDay);
      const hourPart = t.split('T')[1] || t;
      const hourFormatted = hourPart.slice(0, 5);

      return {
        time: t,
        hourFormatted: relIdx === 0 ? 'Сейчас' : hourFormatted,
        temperature: Math.round(data.hourly.temperature_2m[idx] ?? 0),
        apparentTemperature: Math.round(data.hourly.apparent_temperature[idx] ?? 0),
        weatherCode: code,
        weatherText: hVisual.label,
        precipitationProbability: Math.round(data.hourly.precipitation_probability[idx] ?? 0),
        precipitation: Number((data.hourly.precipitation[idx] ?? 0).toFixed(1)),
        windSpeed: Number((data.hourly.wind_speed_10m[idx] ?? 0).toFixed(1)),
        humidity: Math.round(data.hourly.relative_humidity_2m[idx] ?? 0),
        isDay: hourIsDay,
      };
    });

    // Parse daily 7 days
    const dailyDates: string[] = data.daily?.time || [];
    const daily: DailyForecast[] = dailyDates.slice(0, 7).map((dStr, idx) => {
      const dateObj = new Date(dStr + 'T12:00:00');
      const dayOfWeek = dateObj.getDay();
      const dayOfMonth = dateObj.getDate();
      const monthIdx = dateObj.getMonth();

      let dayName = DAY_NAMES_RU[dayOfWeek];
      let fullDayName = FULL_DAY_NAMES_RU[dayOfWeek];
      if (idx === 0) {
        dayName = 'Сегодня';
        fullDayName = `Сегодня (${DAY_NAMES_RU[dayOfWeek]})`;
      } else if (idx === 1) {
        dayName = 'Завтра';
        fullDayName = `Завтра (${DAY_NAMES_RU[dayOfWeek]})`;
      }

      const dateFormatted = `${dayOfMonth} ${MONTH_NAMES_RU[monthIdx]}`;
      const code = data.daily.weather_code[idx] ?? 0;
      const dVisual = getWeatherVisual(code, true);

      // Sunrise & sunset times formatted e.g. "07:15"
      const sunriseRaw = data.daily.sunrise[idx] || '';
      const sunsetRaw = data.daily.sunset[idx] || '';
      const sunriseTime = sunriseRaw.includes('T') ? sunriseRaw.split('T')[1].slice(0, 5) : '07:00';
      const sunsetTime = sunsetRaw.includes('T') ? sunsetRaw.split('T')[1].slice(0, 5) : '19:00';

      // Attach 24h slots for this specific day
      const dayPrefix = dStr;
      const dayHourlySlots: HourlySlot[] = [];
      hourlyTimes.forEach((t, hIdx) => {
        if (t.startsWith(dayPrefix)) {
          const hCode = data.hourly.weather_code[hIdx] ?? 0;
          const hIsDay = Boolean(data.hourly.is_day[hIdx] ?? 1);
          dayHourlySlots.push({
            time: t,
            hourFormatted: t.split('T')[1].slice(0, 5),
            temperature: Math.round(data.hourly.temperature_2m[hIdx] ?? 0),
            apparentTemperature: Math.round(data.hourly.apparent_temperature[hIdx] ?? 0),
            weatherCode: hCode,
            weatherText: getWeatherVisual(hCode, hIsDay).label,
            precipitationProbability: Math.round(data.hourly.precipitation_probability[hIdx] ?? 0),
            precipitation: Number((data.hourly.precipitation[hIdx] ?? 0).toFixed(1)),
            windSpeed: Number((data.hourly.wind_speed_10m[hIdx] ?? 0).toFixed(1)),
            humidity: Math.round(data.hourly.relative_humidity_2m[hIdx] ?? 0),
            isDay: hIsDay,
          });
        }
      });

      return {
        date: dStr,
        dayName,
        fullDayName,
        dateFormatted,
        weatherCode: code,
        weatherText: dVisual.label,
        tempMax: Math.round(data.daily.temperature_2m_max[idx] ?? 0),
        tempMin: Math.round(data.daily.temperature_2m_min[idx] ?? 0),
        apparentTempMax: Math.round(data.daily.apparent_temperature_max[idx] ?? 0),
        apparentTempMin: Math.round(data.daily.apparent_temperature_min[idx] ?? 0),
        precipitationProbability: Math.round(data.daily.precipitation_probability_max[idx] ?? 0),
        precipitationSum: Number((data.daily.precipitation_sum[idx] ?? 0).toFixed(1)),
        windSpeedMax: Number((data.daily.wind_speed_10m_max[idx] ?? 0).toFixed(1)),
        windDirection: Math.round(data.daily.wind_direction_10m_dominant[idx] ?? 0),
        uvIndexMax: Math.round(data.daily.uv_index_max[idx] ?? 0),
        sunrise: sunriseTime,
        sunset: sunsetTime,
        hourlySlots: dayHourlySlots,
      };
    });

    const now = new Date();
    const updatedTimeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    return {
      location: resolvedLocation,
      current: {
        time: data.current?.time || nowIso,
        temperature: Math.round(data.current?.temperature_2m ?? 0),
        apparentTemperature: Math.round(data.current?.apparent_temperature ?? 0),
        relativeHumidity: Math.round(data.current?.relative_humidity_2m ?? 0),
        weatherCode: currentCode,
        weatherText: visual.label,
        windSpeed: Number((data.current?.wind_speed_10m ?? 0).toFixed(1)),
        windDirection: Math.round(data.current?.wind_direction_10m ?? 0),
        windGusts: Number((data.current?.wind_gusts_10m ?? 0).toFixed(1)),
        surfacePressure: surfacePressureHpa,
        pressureMmHg,
        uvIndex: Number((data.current?.uv_index ?? 0).toFixed(1)),
        precipitation: Number((data.current?.precipitation ?? 0).toFixed(1)),
        isDay,
        cloudCover: Math.round(data.current?.cloud_cover ?? 0),
      },
      hourly,
      daily,
      updatedAt: `Обновлено в ${updatedTimeStr}`,
    };
  } catch (err) {
    console.warn('Weather API failed, returning fallback SPb data:', err);
    return {
      ...fallbackSpbWeather,
      location: resolvedLocation,
      updatedAt: 'Офлайн (архив)',
    };
  }
}

export async function searchCities(query: string): Promise<LocationInfo[]> {
  if (!query || query.trim().length < 2) return [];
  const cleanQ = query.trim().toLowerCase();

  // Find local matches with high-fidelity images (e.g. Саранск, Дворцовая, etc.)
  const localMatches = ALL_KNOWN_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(cleanQ) ||
      (loc.district && loc.district.toLowerCase().includes(cleanQ)) ||
      (loc.landmark && loc.landmark.toLowerCase().includes(cleanQ))
  );

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=5&language=ru&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return localMatches;
    const data = await res.json();
    if (!data.results) return localMatches;

    const remoteResults: LocationInfo[] = await Promise.all(
      data.results.map(async (item: { name: string; admin1?: string; country?: string; latitude: number; longitude: number; timezone?: string }) => {
        // Check if it matches known locations like Moscow, Kazan, Sochi, Saransk
        const known = ALL_KNOWN_LOCATIONS.find(
          (k) =>
            (Math.abs(k.latitude - item.latitude) < 0.15 &&
              Math.abs(k.longitude - item.longitude) < 0.15) ||
            k.name.toLowerCase() === item.name.toLowerCase()
        );

        let imgUrl = known?.imageUrl;
        let landmark = known?.landmark;

        if (!imgUrl) {
          try {
            const fetched = await getCityImage(item.name, item.country);
            imgUrl = fetched.imageUrl;
            landmark = fetched.landmark;
          } catch {
            // fallback
          }
        }

        return {
          name: item.name,
          district: known?.district || item.admin1 || item.country || '',
          country: item.country || '',
          latitude: item.latitude,
          longitude: item.longitude,
          timezone: item.timezone || 'Europe/Moscow',
          imageUrl: imgUrl,
          landmark: landmark || `${item.name}${item.country ? `, ${item.country}` : ''}`,
        };
      })
    );

    // Merge without duplicates
    const combined = [...localMatches];
    for (const r of remoteResults) {
      if (!combined.some(c => Math.abs(c.latitude - r.latitude) < 0.05 && Math.abs(c.longitude - r.longitude) < 0.05)) {
        combined.push(r);
      }
    }
    return combined;
  } catch (e) {
    console.error('City search failed, returning local matches', e);
    return localMatches;
  }
}
