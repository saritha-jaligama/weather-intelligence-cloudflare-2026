import { CurrentWeatherData, DailyForecastDay, WeatherRecommendation } from '../types';
import { getWeatherCodeInfo } from './weatherCodes';

export function generatePlanningRecommendations(
  current: CurrentWeatherData,
  todayForecast?: DailyForecastDay
): WeatherRecommendation {
  const codeInfo = getWeatherCodeInfo(current.weatherCode);
  const temp = current.temperature;
  const apparentTemp = current.apparentTemperature;
  const precip = current.precipitation;
  const wind = current.windSpeed;
  const precipProb = todayForecast ? todayForecast.precipitationProbability : (precip > 0 ? 90 : 10);
  const uv = todayForecast?.uvIndexMax ?? 3;

  // 1. Outdoor Activity Suitability
  let outdoorStatus: 'favorable' | 'moderate' | 'unfavorable' = 'favorable';
  let outdoorTitle = 'Favorable for Outdoor Activities';
  let outdoorDescription = 'Comfortable weather across the region. Excellent conditions for outdoor meetings, client walkouts, walking commutes, or team recreation.';

  const isSevereWeather = [95, 96, 99, 65, 67, 75, 82, 86].includes(current.weatherCode);
  const isWet = precip > 1.0 || precipProb >= 60 || codeInfo.isPrecipitation;
  const isHighWind = wind >= 40;
  const isExtremeHeat = temp >= 35 || apparentTemp >= 38;
  const isExtremeCold = temp <= 0 || apparentTemp <= -2;

  if (isSevereWeather || isExtremeHeat || isExtremeCold || (isWet && isHighWind)) {
    outdoorStatus = 'unfavorable';
    outdoorTitle = 'Unfavorable for Outdoor Activities';
    if (isSevereWeather) {
      outdoorDescription = `Active severe weather (${codeInfo.label}). Ground events and outdoor activities should be rescheduled indoors.`;
    } else if (isExtremeHeat) {
      outdoorDescription = `High heat threshold (Feels like ${Math.round(apparentTemp)}°C). Limit continuous outdoor exertion during peak afternoon hours.`;
    } else if (isExtremeCold) {
      outdoorDescription = `Freezing environment (${Math.round(temp)}°C). Minimize extended outdoor exposure and watch for slippery pavements.`;
    } else {
      outdoorDescription = `Combination of rain and gusty winds (${Math.round(wind)} km/h). Keep meetings and team engagements strictly indoors.`;
    }
  } else if (isWet || isHighWind || temp >= 30 || temp <= 8 || precipProb >= 35) {
    outdoorStatus = 'moderate';
    outdoorTitle = 'Moderate Caution for Outdoor Plans';
    if (isWet) {
      outdoorDescription = `Chance of precipitation (${precipProb}%). Prepare covered alternatives for outdoor sessions or site visits.`;
    } else if (isHighWind) {
      outdoorDescription = `Elevated winds (${Math.round(wind)} km/h). Secure lightweight equipment and allow extra commute margin.`;
    } else if (temp >= 30) {
      outdoorDescription = `Warm temperatures (${Math.round(temp)}°C). Ensure adequate hydration and shaded arrangements.`;
    } else {
      outdoorDescription = `Chilly climate (${Math.round(temp)}°C). Outdoor gatherings are manageable with appropriate warm layers.`;
    }
  }

  // 2. Rain & Umbrella Guidance
  let umbrellaNeeded = false;
  let umbrellaTitle = 'No Umbrella Needed';
  let umbrellaDescription = 'Dry atmospheric conditions projected. Negligible rain risk for commuting and outdoor engagements.';

  if (precip > 0.5 || precipProb >= 60 || codeInfo.isPrecipitation) {
    umbrellaNeeded = true;
    umbrellaTitle = 'Umbrella Required';
    umbrellaDescription = `Active or highly probable rainfall (${precipProb}% chance, ${precip > 0 ? `${precip}mm detected` : 'precipitation expected'}). Carry an umbrella or water-resistant coat.`;
  } else if (precipProb >= 30 || precip > 0) {
    umbrellaNeeded = true;
    umbrellaTitle = 'Keep a Compact Umbrella Handy';
    umbrellaDescription = `Moderate chance of scattered showers (${precipProb}%). Carrying a travel umbrella is prudent for afternoon transit.`;
  }

  // 3. Clothing Guidance
  let clothingTitle = 'Smart Business Casual';
  let clothingDescription = 'Comfortable balanced outfit suitable for standard indoor climate control and pleasant outdoor walks.';
  const clothingItems: string[] = [];

  if (temp < 5) {
    clothingTitle = 'Heavy Winter Attire';
    clothingDescription = 'Sub-freezing or chilly air. Insulated layering is essential for safe and comfortable travel.';
    clothingItems.push('Heavy overcoat or down jacket', 'Thermal undershirt', 'Wool scarf and leather gloves', 'Insulated footwear');
  } else if (temp >= 5 && temp < 15) {
    clothingTitle = 'Layered Outerwear';
    clothingDescription = 'Cool ambient air. Versatile layered clothing will transition cleanly between outdoors and heated offices.';
    clothingItems.push('Tailored wool coat or trench', 'Fine-knit sweater or cardigan', 'Collared shirt or blouse', 'Closed-toe leather shoes');
  } else if (temp >= 15 && temp < 24) {
    clothingTitle = 'Light Business Layers';
    clothingDescription = 'Temperate and comfortable weather. Standard business casual or light suiting is ideal.';
    clothingItems.push('Smart blazer or knit jacket', 'Breathable cotton button-down', 'Chinos or tailored slacks', 'Comfortable walking shoes');
  } else if (temp >= 24 && temp < 30) {
    clothingTitle = 'Breathable Summer Attire';
    clothingDescription = 'Warm climate. Prioritize airy, breathable fabrics to stay crisp through client meetings.';
    clothingItems.push('Lightweight linen or moisture-wicking cotton', 'Short sleeves or unlined blazer', 'Sunglasses with UV protection', 'Breathable footwear');
  } else {
    clothingTitle = 'Ultra-Lightweight & Sun-Safe';
    clothingDescription = 'High heat conditions. Stay comfortable in light-colored, moisture-wicking clothing and prioritize cooling.';
    clothingItems.push('Loose-fitting, ultra-light natural fabrics', 'UV-blocking sunglasses', 'Sun protection / SPF', 'Breathable loafers or sneakers');
  }

  if (umbrellaNeeded && !clothingItems.some((item) => item.includes('water-resistant') || item.includes('trench'))) {
    clothingItems.push('Water-resistant outer shell');
  }

  // 4. Environmental / Wind / Heat / Cold / UV Notice
  let environmentalNotice: WeatherRecommendation['environmentalNotice'] = undefined;

  if (isSevereWeather) {
    environmentalNotice = {
      type: 'storm',
      severity: 'high',
      title: 'Thunderstorm & Lightning Watch',
      description: 'Active storm systems in vicinity. Exercise caution around elevated structures and open spaces.',
    };
  } else if (temp >= 35 || apparentTemp >= 38) {
    environmentalNotice = {
      type: 'heat',
      severity: 'high',
      title: 'High Heat Index Warning',
      description: `Apparent temperature reaching ${Math.round(apparentTemp)}°C. Stay hydrated and schedule strenuous transit before midday.`,
    };
  } else if (temp <= 0) {
    environmentalNotice = {
      type: 'cold',
      severity: 'medium',
      title: 'Sub-Zero Freeze Alert',
      description: `Ambient temperature at ${Math.round(temp)}°C. Watch for black ice on road overpasses, sidewalks, and parking garages.`,
    };
  } else if (wind >= 38) {
    environmentalNotice = {
      type: 'wind',
      severity: 'medium',
      title: 'Breezy to Strong Wind Advisory',
      description: `Wind gusts up to ${Math.round(wind)} km/h. High-profile vehicles and outdoor banner signage may be affected.`,
    };
  } else if (uv >= 7) {
    environmentalNotice = {
      type: 'uv',
      severity: 'medium',
      title: 'High UV Index (UV ' + Math.round(uv) + ')',
      description: 'Strong midday sun radiation. Apply broad-spectrum sunscreen and wear UV400 sunglasses outdoors.',
    };
  }

  // 5. Business & Commute Advisory
  let businessAdvisory = 'Normal transit and business operating schedules. No significant weather-related flight delays or commute disruptions expected.';
  if (isSevereWeather) {
    businessAdvisory = 'Heightened transit risk: expect road bottlenecks, reduced airport ground movements, and possible local transit delays.';
  } else if (isWet) {
    businessAdvisory = 'Wet road conditions: allow an extra 10–15 minutes for airport transfers, rideshares, and surface traffic.';
  } else if (isHighWind) {
    businessAdvisory = 'Elevated wind conditions: monitor regional flight schedules and secure temporary outdoor marketing installations.';
  } else if (isExtremeHeat) {
    businessAdvisory = 'High thermal load: ensure meeting venues have active climate control and provide bottled water for visitors.';
  }

  return {
    outdoorStatus,
    outdoorTitle,
    outdoorDescription,
    umbrellaNeeded,
    umbrellaTitle,
    umbrellaDescription,
    clothingTitle,
    clothingItems,
    clothingDescription,
    environmentalNotice,
    businessAdvisory,
  };
}
