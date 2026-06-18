import { useQuery } from "@tanstack/react-query";
import { locationDB } from "../../pages/Dashboard/constants/locations";

const getWeatherCondition = (code) => {
  if (code === 0) return "Clear Sky";
  if (code >= 1 && code <= 3) return "Partly Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rainy";
  return "Sunny";
};

const fetchWeather = async (location) => {
  const locInfo = locationDB[location] || locationDB["Cairo, Greater Cairo"];
  if (!locInfo) throw new Error("Location not found");
  
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${locInfo.lat}&longitude=${locInfo.lng}&current_weather=true&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
  );
  
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  
  const result = await response.json();
  const currentHour = new Date().getHours();
  const humidity = result.hourly?.relative_humidity_2m[currentHour] || 50;
  const tempMax = Math.round(result.daily?.temperature_2m_max[0]) || Math.round(result.current_weather.temperature) + 4;
  const tempMin = Math.round(result.daily?.temperature_2m_min[0]) || Math.round(result.current_weather.temperature) - 5;

  return {
    temp: Math.round(result.current_weather.temperature),
    tempMax: tempMax,
    tempMin: tempMin,
    humidity: humidity,
    windspeed: result.current_weather.windspeed,
    condition: getWeatherCondition(result.current_weather.weathercode),
    bestCrop: locInfo.bestCrop,
    region: locInfo.region,
  };
};

export const useWeather = (location) => {
  return useQuery({
    queryKey: ['weather', location],
    queryFn: () => fetchWeather(location),
    refetchInterval: 30000, // Background polling every 30s as requested
    staleTime: 10000,
    retry: 2,
  });
};
