import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  LucideProps,
} from 'lucide-react';
import { getWeatherVisual } from '../utils/weatherCodes';

interface WeatherIconProps extends LucideProps {
  code: number;
  isDay?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay = true, className = 'w-6 h-6', ...props }) => {
  const visual = getWeatherVisual(code, isDay);

  switch (visual.iconName) {
    case 'Sun':
      return <Sun className={`text-amber-400 ${className}`} {...props} />;
    case 'CloudSun':
      return <CloudSun className={`text-amber-300/90 ${className}`} {...props} />;
    case 'Cloud':
      return <Cloud className={`text-slate-300 ${className}`} {...props} />;
    case 'CloudFog':
      return <CloudFog className={`text-slate-400 ${className}`} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`text-cyan-400 ${className}`} {...props} />;
    case 'CloudRain':
      return <CloudRain className={`text-blue-400 ${className}`} {...props} />;
    case 'CloudSnow':
      return <CloudSnow className={`text-cyan-200 ${className}`} {...props} />;
    case 'Snowflake':
      return <Snowflake className={`text-indigo-200 ${className}`} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={`text-purple-400 ${className}`} {...props} />;
    default:
      return <Cloud className={`text-slate-400 ${className}`} {...props} />;
  }
};
