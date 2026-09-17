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
import { getWeatherCodeInfo } from '../utils/weatherCodes';

interface WeatherIconProps extends Omit<LucideProps, 'ref'> {
  code: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, className = 'w-6 h-6', ...props }) => {
  const info = getWeatherCodeInfo(code);

  switch (info.iconName) {
    case 'sun':
      return <Sun className={`text-amber-500 ${className}`} {...props} />;
    case 'cloud-sun':
      return <CloudSun className={`text-amber-500/90 ${className}`} {...props} />;
    case 'cloud':
      return <Cloud className={`text-slate-500 ${className}`} {...props} />;
    case 'cloud-fog':
      return <CloudFog className={`text-slate-400 ${className}`} {...props} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`text-sky-500 ${className}`} {...props} />;
    case 'cloud-rain':
      return <CloudRain className={`text-blue-600 ${className}`} {...props} />;
    case 'cloud-snow':
      return <CloudSnow className={`text-indigo-400 ${className}`} {...props} />;
    case 'cloud-lightning':
      return <CloudLightning className={`text-purple-600 ${className}`} {...props} />;
    case 'snowflake':
      return <Snowflake className={`text-cyan-500 ${className}`} {...props} />;
    default:
      return <CloudSun className={`text-slate-500 ${className}`} {...props} />;
  }
};
