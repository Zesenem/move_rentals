import { useState, useEffect } from 'react';

const weeklyHours = [
  { day: "Monday", hours: "08:00 – 18:30" },
  { day: "Tuesday", hours: "08:00 – 18:30" },
  { day: "Wednesday", hours: "08:00 – 18:30" },
  { day: "Thursday", hours: "08:00 – 18:30" },
  { day: "Friday", hours: "08:00 – 18:30" },
  { day: "Saturday", hours: "08:00 – 18:30" },
  { day: "Sunday", hours: "08:00 – 18:30" },
];

function OpeningHours() {
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Lisbon" }));
    const dayName = now.toLocaleString("en-US", { weekday: 'long' });
    setCurrentDay(dayName);
  }, []);

  return (
    <div className="space-y-2">
      {weeklyHours.map(({ day, hours }) => (
        <div 
          key={day} 
          className={`
            flex items-center justify-between gap-x-6 text-sm
            ${currentDay === day ? "font-bold text-cloud" : "text-space"}
          `}
        >
          <span>{day}</span>
          <span>{hours}</span>
        </div>
      ))}
    </div>
  );
}

export default OpeningHours;