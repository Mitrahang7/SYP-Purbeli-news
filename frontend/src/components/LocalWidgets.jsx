import React, { useState, useEffect } from 'react';
import { Cloud, DollarSign } from 'lucide-react';
import '../styles/LocalWidgets.css';

export const LocalWidgets = () => {
  const [weather, setWeather] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherRes = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=26.45&longitude=87.27&current_weather=true&hourly=relativehumidity_2m'
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData.current_weather);

        const ratesRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const ratesData = await ratesRes.json();
        setRates(ratesData.rates);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching widget data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="local-widgets-compact skeleton">
       Loading widgets...
    </div>
  );

  return (
    <div className="local-widgets-compact">
      <div className="compact-widget-item">
        <Cloud size={16} color="#3b82f6" />
        <span className="compact-widget-value">{weather ? Math.round(weather.temperature) : '--'}°C</span>
        <span className="compact-widget-label">Biratnagar</span>
      </div>
      <div className="compact-widget-divider" />
      <div className="compact-widget-item">
        <DollarSign size={16} color="#10b981" />
        <span className="compact-widget-value">रू {rates?.NPR ? rates.NPR.toFixed(2) : '--'}</span>
        <span className="compact-widget-label">USD Today</span>
      </div>
    </div>
  );
};
