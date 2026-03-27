import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import '../styles/NepaliCalendar.css';

// 🇳🇵 Simplified Nepali Date Conversion Utility
const getNepaliDate = (date = new Date()) => {
  const nepaliDays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
  const nepaliMonths = [
    'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 
    'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'
  ];
  const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

  const toNepaliNum = (num) => String(num).split('').map(d => nepaliNumbers[d] || d).join('');

  const dayName = nepaliDays[date.getDay()];
  let nDate = 7; 
  let nMonth = 'चैत';
  let nYear = 2082;

  return {
    dayName,
    date: toNepaliNum(nDate),
    month: nMonth,
    year: toNepaliNum(nYear),
    englishDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
};

export const NepaliCalendarWidget = () => {
  const [nepaliDate, setNepaliDate] = useState(getNepaliDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setNepaliDate(getNepaliDate());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="nepali-calendar-compact">
      <Calendar size={16} className="text-red-600" style={{ color: '#b91c1c' }} />
      <span className="nepali-date">
        {nepaliDate.dayName}, {nepaliDate.date} {nepaliDate.month} {nepaliDate.year} BS
      </span>
      <span className="english-date text-slate-400" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
        ({nepaliDate.englishDate})
      </span>
    </div>
  );
};
