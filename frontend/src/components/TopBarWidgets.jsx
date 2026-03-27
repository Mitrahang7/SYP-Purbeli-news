import React, { useState, useEffect } from 'react';
import { Calendar, Cloud, DollarSign } from 'lucide-react';
import '../styles/TopBarWidgets.css';

// 🇳🇵 Simplified Nepali Date
const getNepaliDate = (date = new Date()) => {
  const nepaliDays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
  const nepaliMonths = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
  const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

  const toNepaliNum = (num) => String(num).split('').map(d => nepaliNumbers[d] || d).join('');
  
  return {
    dayName: nepaliDays[date.getDay()],
    date: toNepaliNum(7), // Hardcoded for demo
    month: 'चैत',
    year: toNepaliNum(2082),
    englishDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
};

export const TopBarWidgets = () => {
  const [nepaliDate, setNepaliDate] = useState(getNepaliDate());
  const [weather, setWeather] = useState(null);
  const [rates, setRates] = useState(null);

  useEffect(() => {
    // Ticking calendar
    const timer = setInterval(() => setNepaliDate(getNepaliDate()), 60000);

    // Weather & Rates Fetch
    const fetchData = async () => {
      try {
        const [weatherRes, ratesRes] = await Promise.all([
          fetch('https://api.open-meteo.com/v1/forecast?latitude=26.45&longitude=87.27&current_weather=true'),
          fetch('https://api.exchangerate-api.com/v4/latest/USD')
        ]);
        const weatherData = await weatherRes.json();
        const ratesData = await ratesRes.json();
        
        setWeather(weatherData.current_weather);
        setRates(ratesData.rates);
      } catch (error) {
        console.error('Error fetching top bar data:', error);
      }
    };
    
    fetchData();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="top-bar-widgets-container">
      <div className="top-bar-inner">
        {/* Date Section */}
        <div className="top-bar-item group-date">
          <Calendar size={14} className="bar-icon text-red" />
          <span className="bar-text primary">
            {nepaliDate.dayName}, {nepaliDate.date} {nepaliDate.month} {nepaliDate.year} BS
          </span>
          <span className="bar-text secondary">({nepaliDate.englishDate})</span>
        </div>

        <div className="top-bar-divider" />

        {/* Weather Section */}
        <div className="top-bar-item group-weather">
          <Cloud size={14} className="bar-icon text-blue" />
          <span className="bar-text primary">{weather ? Math.round(weather.temperature) : '--'}°C</span>
          <span className="bar-text secondary">Biratnagar</span>
        </div>

        <div className="top-bar-divider" />

        {/* Market Rates Section */}
        <div className="top-bar-item group-market">
          <div className="market-entry">
            <DollarSign size={14} className="bar-icon text-green" />
            <span className="bar-text primary">रू {rates?.NPR ? rates.NPR.toFixed(2) : '--'}</span>
          </div>
          <span className="bar-text separator">•</span>
          <div className="market-entry">
            <span className="bar-text primary">Gold:</span>
            <span className="bar-text secondary">रू 1,52,300</span>
          </div>
        </div>
      </div>
    </div>
  );
};
